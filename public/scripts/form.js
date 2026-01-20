const form = document.getElementById("regForm");
const formMsg = document.getElementById("formMsg");
const btnReset = document.getElementById("btnReset");

function setFieldError(input, message) {
  const field = input.closest(".field");
  const err = field?.querySelector(".err");
  if (err) err.textContent = message || "";
  input.classList.toggle("bad", Boolean(message));
}

function validateInput(input) {
  // HTML5 validation (required, pattern, minlength...)
  if (input.validity.valueMissing) return "Este campo es obligatorio.";
  if (input.validity.tooShort) return `Mínimo ${input.minLength} caracteres.`;
  if (input.validity.patternMismatch) return "Formato inválido.";
  return "";
}

function validatePasswords() {
  const p1 = document.getElementById("password");
  const p2 = document.getElementById("password2");
  if (!(p1 instanceof HTMLInputElement) || !(p2 instanceof HTMLInputElement)) return true;

  if (p2.value !== p1.value) {
    setFieldError(p2, "Las contraseñas no coinciden.");
    return false;
  }
  setFieldError(p2, "");
  return true;
}

function showMsg(text, type) {
  if (!formMsg) return;
  formMsg.textContent = text || "";
  formMsg.classList.remove("ok", "err");
  if (type) formMsg.classList.add(type);
}

if (form) {
  // Validación en vivo
  form.addEventListener("input", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;

    let msg = validateInput(target);
    setFieldError(target, msg);

    if (target.id === "password" || target.id === "password2") validatePasswords();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showMsg("");

    const inputs = [...form.querySelectorAll("input")];
    let ok = true;

    for (const input of inputs) {
      const msg = validateInput(input);
      setFieldError(input, msg);
      if (msg) ok = false;
    }

    if (!validatePasswords()) ok = false;

    if (!ok) {
      showMsg("❌ Revisa los campos marcados.", "err");
      return;
    }

    // Sin BD: solo confirmación visual
    showMsg("✅ Formulario válido. (Demo sin base de datos)", "ok");
  });
}

if (btnReset) {
  btnReset.addEventListener("click", () => {
    form?.reset();
    showMsg("");
    for (const input of form?.querySelectorAll("input") || []) {
      input.classList.remove("bad");
      const field = input.closest(".field");
      const err = field?.querySelector(".err");
      if (err) err.textContent = "";
    }
  });
}
