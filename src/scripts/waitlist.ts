/* The early-access form: validation in the page, then a JSON POST to the configured endpoint.
   With no endpoint configured it never pretends: it says sign-up is not connected yet and that
   nothing was sent. */

type Fields = {
  name: string;
  email: string;
  businessType: string;
  website: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseWebsite(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function validate(fields: Fields): Partial<Record<keyof Fields, string>> {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (fields.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!fields.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(fields.email.trim())) errors.email = "Please enter a valid email address, like name@company.com.";
  if (!fields.businessType) errors.businessType = "Please choose the type of business closest to yours.";
  const website = normaliseWebsite(fields.website);
  if (website) {
    try {
      const url = new URL(website);
      if (!url.hostname.includes(".")) throw new Error("no dot");
    } catch {
      errors.website = "Please enter a valid web address, like yourbusiness.com, or leave it empty.";
    }
  }
  return errors;
}

export function initWaitlist(form: HTMLFormElement): void {
  form.noValidate = true; // Our own messages replace the browser's.
  const endpoint = (form.dataset.endpoint ?? "").trim();
  const status = form.querySelector<HTMLElement>("[data-status]");
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  const label = form.querySelector<HTMLElement>("[data-submit-label]");
  const idleLabel = label?.textContent ?? "";

  const value = (name: string) =>
    (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";

  const show = (tone: "success" | "error" | "info", message: string) => {
    if (!status) return;
    status.dataset.tone = tone;
    status.textContent = message;
  };

  const setErrors = (errors: Partial<Record<keyof Fields, string>>) => {
    form.querySelectorAll<HTMLElement>("[data-error-for]").forEach((slot) => {
      const name = slot.dataset.errorFor as keyof Fields;
      const control = form.elements.namedItem(name) as HTMLElement | null;
      const message = errors[name] ?? "";
      slot.textContent = message;
      control?.setAttribute("aria-invalid", message ? "true" : "false");
    });
  };

  // Clear a field's error as soon as it is corrected.
  form.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.getAttribute("aria-invalid") !== "true") return;
    const errors = validate({
      name: value("name"),
      email: value("email"),
      businessType: value("businessType"),
      website: value("website"),
    });
    if (!errors[target.name as keyof Fields]) {
      target.setAttribute("aria-invalid", "false");
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${target.name}"]`);
      if (slot) slot.textContent = "";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.textContent = "";
    const fields: Fields = {
      name: value("name"),
      email: value("email"),
      businessType: value("businessType"),
      website: value("website"),
    };
    const errors = validate(fields);
    setErrors(errors);
    const firstInvalid = (Object.keys(errors) as (keyof Fields)[])[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    // A filled hidden field means a bot: stop quietly, send nothing.
    if (value("company")) return;

    if (!endpoint) {
      show(
        "info",
        "Thank you. Early-access sign-up is not connected on this page yet, so nothing was sent. Please come back soon.",
      );
      return;
    }

    if (submit) submit.disabled = true;
    if (label) label.textContent = "Sending…";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          businessType: fields.businessType,
          website: normaliseWebsite(fields.website),
          source: "solofactory.ai",
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setErrors({});
      show("success", `Thank you, ${fields.name.trim()}. You're on the SoloFactory AI early-access list.`);
    } catch {
      show("error", "We couldn't send that just now. Please check your connection and try again.");
    } finally {
      if (submit) submit.disabled = false;
      if (label) label.textContent = idleLabel;
    }
  });
}
