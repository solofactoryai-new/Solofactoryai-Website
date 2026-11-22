#!/usr/bin/env bash
# Builds the site and publishes it to the AWS website stack (infra/website.yaml): uploads dist/
# to the stack's bucket and clears CloudFront's cache. Needs the AWS CLI profile "solofactory"
# (README, "Deploying"). Usage: bash scripts/publish-aws.sh
set -euo pipefail

PROFILE="${AWS_PROFILE_NAME:-solofactory}"
REGION=ap-south-1
STACK=solofactory-website
AWS=(aws --profile "$PROFILE" --region "$REGION")

cd "$(dirname "$0")/.."

out() {
  "${AWS[@]}" cloudformation describe-stacks --stack-name "$STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
BUCKET=$(out BucketName)
DIST=$(out DistributionId)

npm run build

# Hashed files in _astro/ never change, so browsers may keep them a year. Everything else is
# checked again on every visit, so a new version shows at once.
"${AWS[@]}" s3 sync dist/_astro "s3://$BUCKET/_astro" --only-show-errors \
  --cache-control "public, max-age=31536000, immutable"
"${AWS[@]}" s3 sync dist "s3://$BUCKET" --delete --only-show-errors --exclude "_astro/*" \
  --cache-control "no-cache"
# Some systems do not know these types; set them so browsers get the right ones.
"${AWS[@]}" s3 cp dist/_astro "s3://$BUCKET/_astro" --recursive --only-show-errors \
  --exclude "*" --include "*.woff2" --content-type font/woff2 \
  --cache-control "public, max-age=31536000, immutable"
"${AWS[@]}" s3 cp dist "s3://$BUCKET" --recursive --only-show-errors \
  --exclude "*" --include "*.webp" --exclude "_astro/*" --content-type image/webp --cache-control "no-cache"

# With CloudFront, clear its cache. API Gateway (the stand-in) keeps no cache.
if [ -n "$DIST" ] && [ "$DIST" != "None" ]; then
  "${AWS[@]}" cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" \
    --query Invalidation.Id --output text >/dev/null
fi

echo "Published to s3://$BUCKET"
