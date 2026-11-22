/* Where the early-access form sends sign-ups (README, "The early-access form").

   googleForm: the founder's Google Form "SoloFactory AI early access"
   (https://forms.gle/1R982dbffSKiDik79). The page posts each sign-up to the form's
   formResponse address, and the answers appear in the form's Responses tab. These IDs are public:
   anyone can read them from the form's own page.

   Google drops a sign-up it does not accept, without telling anyone, so the Google Form must
   accept everything this page sends:
   - no question may be required that this page does not send;
   - "Business stage" must be Short answer, or offer exactly the four stages below;
   - change the stages here and in the Google Form together.

   The form fields changed on 2026-11-22 (the rebuild brief): name, email, stage, what you are
   building, consent. The founder renamed the old questions rather than adding new ones, so
   "Business stage" (Short answer, required) is the old Business type question and "What are
   you trying to build?" (Paragraph) is the old Website question: same IDs. There is no Consent
   question yet (the founder will add it later); the tick box stays on the page, and an empty ID
   is simply not sent.

   Leave formId empty to fall back to PUBLIC_WAITLIST_ENDPOINT (a JSON endpoint), or, with
   neither, to the honest "not connected yet" message. */
export const googleForm = {
  formId: "1FAIpQLSeb4Ei6gJAJ4u1izWimBCPLVlZzBPTLJJhw3s--vlpKE6vPGw",
  entries: {
    name: "entry.955318456",
    email: "entry.178023779",
    stage: "entry.388512311",
    building: "entry.497021125",
    consent: "",
    source: "",
  },
};

export const stages = ["Idea", "Exploring", "Building", "Already operating"];
