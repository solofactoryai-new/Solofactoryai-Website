/* Where the early-access form sends sign-ups (README, "The early-access form").

   googleForm: the founder's Google Form. The page posts each sign-up to the form's
   formResponse address, and the answers appear in the form's Responses tab (and its linked
   Sheet). These IDs are public: anyone can read them from the form's own page. Every question in
   the Google Form must accept everything this page sends, or Google drops the sign-up without
   telling anyone. So: only Name, Email and Business type may be required; Website must stay
   optional; Business type's choices must match the list in FinalCta.astro letter for letter.
   Change both together.

   The form "SoloFactory AI early access" (https://forms.gle/1R982dbffSKiDik79) was made by the
   founder on 2026-11-22. It has no Source question, so source is not sent.

   Leave formId empty to fall back to PUBLIC_WAITLIST_ENDPOINT (a JSON endpoint), or, with
   neither, to the honest "not connected yet" message. */
export const googleForm = {
  formId: "1FAIpQLSeb4Ei6gJAJ4u1izWimBCPLVlZzBPTLJJhw3s--vlpKE6vPGw",
  entries: {
    name: "entry.955318456",
    email: "entry.178023779",
    businessType: "entry.388512311",
    website: "entry.497021125",
    source: "",
  },
};
