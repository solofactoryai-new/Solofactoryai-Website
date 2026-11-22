#!/usr/bin/env bash
# Builds the site and uploads it to AWS (README, "Deploying"). Needs the AWS CLI profile
# "solofactory" signed in.
#
#   bash scripts/publish-aws.sh            the live site: the bucket of the stack
#                                          solofactory-website (infra/website.yaml)
#   bash scripts/publish-aws.sh preview    the test link: the public bucket
#                                          solofactory-ai-website-test, hidden from search engines
#
# Each page is built as a folder (dist/platform/index.html). The AWS front ends do not look for
# index.html inside a folder, so each page is also stored under its bare path ("platform").
set -euo pipefail

MODE="${1:-live}"
PROFILE="${AWS_PROFILE_NAME:-solofactory}"
REGION=ap-south-1
STACK=solofactory-website
AWS=(aws --profile "$PROFILE" --region "$REGION")

cd "$(dirname "$0")/.."

case "$MODE" in
  live)
    out() {
      "${AWS[@]}" cloudformation describe-stacks --stack-name "$STACK" \
        --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
    }
    BUCKET=$(out BucketName)
    DIST=$(out DistributionId)
    npm run build
    ;;
  preview)
    BUCKET=solofactory-ai-website-test
    DIST=""
    # The test link has no page at "/", so links home go to /index.html (src/config/site.ts).
    PUBLIC_HOME_PATH=index.html npm run build
    printf 'User-agent: *\nDisallow: /\n' > dist/robots.txt
    ;;
  *)
    echo "Usage: bash scripts/publish-aws.sh [preview]" >&2
    exit 1
    ;;
esac

# The pages built as folders, e.g. "platform" for dist/platform/index.html.
PAGES=()
while IFS= read -r f; do
  d="${f#dist/}"
  PAGES+=("${d%/index.html}")
done < <(find dist -mindepth 2 -name index.html -not -path "dist/_astro/*" | sort)
KEEP=()
for p in "${PAGES[@]}"; do KEEP+=(--exclude "$p"); done

# Hashed files in _astro/ never change, so browsers may keep them a year. Everything else is
# checked again on every visit, so a new version shows at once.
"${AWS[@]}" s3 sync dist/_astro "s3://$BUCKET/_astro" --only-show-errors \
  --cache-control "public, max-age=31536000, immutable"
"${AWS[@]}" s3 sync dist "s3://$BUCKET" --delete --only-show-errors --exclude "_astro/*" \
  "${KEEP[@]}" --cache-control "no-cache"
# Some systems do not know these types; set them so browsers get the right ones.
"${AWS[@]}" s3 cp dist/_astro "s3://$BUCKET/_astro" --recursive --only-show-errors \
  --exclude "*" --include "*.woff2" --content-type font/woff2 \
  --cache-control "public, max-age=31536000, immutable"
"${AWS[@]}" s3 cp dist "s3://$BUCKET" --recursive --only-show-errors \
  --exclude "*" --include "*.webp" --exclude "_astro/*" --content-type image/webp --cache-control "no-cache"
"${AWS[@]}" s3 cp dist/sitemap.xml "s3://$BUCKET/sitemap.xml" --only-show-errors \
  --content-type application/xml --cache-control "no-cache"

# Each page under its bare path too.
for p in "${PAGES[@]}"; do
  "${AWS[@]}" s3 cp "dist/$p/index.html" "s3://$BUCKET/$p" --only-show-errors \
    --content-type "text/html" --cache-control "no-cache"
done

# With CloudFront, clear its cache. API Gateway (the stand-in) keeps no cache.
if [ -n "$DIST" ] && [ "$DIST" != "None" ]; then
  "${AWS[@]}" cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" \
    --query Invalidation.Id --output text >/dev/null
fi

echo "Published ($MODE) to s3://$BUCKET: ${#PAGES[@]} pages besides the homepage."
