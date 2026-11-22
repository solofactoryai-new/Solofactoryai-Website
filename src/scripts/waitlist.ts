/* The early-access form: validation in the page, then a POST to the founder's Google Form, or
   a JSON POST to a configured endpoint (src/config/waitlist.ts). With neither it never pretends:
   it says sign-up is not connected yet and that nothing was sent. It announces analytics events
   ("sf:track": form_start, form_submit_success, form_error) without collecting any answers. */

type Fields = {
  name: string;
  email: string;
  stage: string;
  building: string;
  consent: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const track = (event: string) =>
  window.dispatchEvent(new CustomEvent("sf:track", { detail: { event } }));

export function validate(fields: Fields): Partial<Record<keyof Fields, string>> {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (fields.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!fields.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(fields.email.trim())) errors.email = "Please enter a valid email address, like name@company.com.";
  if (!fields.stage) errors.stage = "Please choose where you are with your business.";
  if (fields.building.trim().length < 3) errors.building = "Please tell us, in a few words, what you are trying to build.";
  if (!fields.consent) errors.consent = "Please agree, so we can email you about early access.";
  return errors;
}

export function initWaitlist(form: HTMLFormElement): void {
  form.noValidate = true; // Our own messages replace the browser's.
  const endpoint = (form.dataset.endpoint ?? "").trim();
  const status = form.querySelector<HTMLElement>("[data-status]");
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  const label = form.querySelector<HTMLElement>("[data-submit-label]");
  const idleLabel = label?.textContent ?? "";
  let started = false;

  const read = (): Fields => {
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "");
    return {
      name: text("name"),
      email: text("email"),
      stage: text("stage"),
      building: text("building"),
      consent: text("consent"),
    };
  };

  const show = (tone: "success" | "error" | "info", message: string) => {
    if (!status) return;
    status.dataset.tone = tone;
    status.textContent = message;
  };

  const setErrors = (errors: Partial<Record<keyof Fields, string>>) => {
    form.querySelectorAll<HTMLElement>("[data-error-for]").forEach((slot) => {
      const name = slot.dataset.errorFor as keyof Fields;
      const message = errors[name] ?? "";
      slot.textContent = message;
      form.querySelectorAll<HTMLElement>(`[name="${name}"]`).forEach((control) =>
        control.setAttribute("aria-invalid", message ? "true" : "false"),
      );
    });
  };

  // The first change counts as starting the form; a field's error clears once corrected.
  const onChange = (event: Event) => {
    if (!started) {
      started = true;
      track("form_start");
    }
    const target = event.target as HTMLInputElement;
    if (target.getAttribute("aria-invalid") !== "true") return;
    const errors = validate(read());
    if (!errors[target.name as keyof Fields]) {
      form.querySelectorAll(`[name="${target.name}"]`).forEach((c) => c.setAttribute("aria-invalid", "false"));
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${target.name}"]`);
      if (slot) slot.textContent = "";
    }
  };
  form.addEventListener("input", onChange);
  form.addEventListener("change", onChange);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.textContent = "";
    const fields = read();
    const errors = validate(fields);
    setErrors(errors);
    const firstInvalid = (Object.keys(errors) as (keyof Fields)[])[0];
    if (firstInvalid) {
      track("form_error");
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // A filled hidden field means a bot: stop quietly, send nothing.
    const trap = form.elements.namedItem("wl_hp_check") as HTMLInputElement | null;
    if (trap?.value) return;

    if (!endpoint) {
      show(
        "info",
        "Thank you. Early-access sign-up is not connected on this page yet, so nothing was sent. Please come back soon.",
      );
      return;
    }

    const entry = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      stage: fields.stage,
      building: fields.building.trim(),
      consent: fields.consent ? "Yes" : "",
      source: "solofactory.ai",
    };

    if (submit) submit.disabled = true;
    if (label) label.textContent = "Sending…";
    try {
      if (form.dataset.mode === "google-form") {
        // Google Forms does not allow cross-origin reads, so its answer cannot be inspected:
        // a network failure still lands in catch. See src/config/waitlist.ts for what the
        // Google Form must accept.
        const ids = JSON.parse(form.dataset.entries ?? "{}") as Record<keyof typeof entry, string>;
        const body = new URLSearchParams();
        (Object.keys(entry) as (keyof typeof entry)[]).forEach((key) => {
          if (ids[key]) body.append(ids[key], entry[key]);
        });
        await fetch(endpoint, { method: "POST", mode: "no-cors", body });
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(entry),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      }
      form.reset();
      setErrors({});
      track("form_submit_success");
      show("success", `Thank you, ${entry.name}. You're on the SoloFactory AI early-access list. We'll email you as places open.`);
    } catch {
      track("form_error");
      show("error", "We couldn't send that just now. Please check your connection and try again.");
    } finally {
      if (submit) submit.disabled = false;
      if (label) label.textContent = idleLabel;
    }
  });
}
