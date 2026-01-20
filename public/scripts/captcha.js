const a = Math.floor(Math.random() * 9) + 1;
const b = Math.floor(Math.random() * 9) + 1;
const resultado = a + b;

document.getElementById("captchaText").textContent =
  `¿Cuánto es ${a} + ${b}?`;

document.getElementById("btnVerificar").addEventListener("click", () => {
  const input = Number(document.getElementById("captchaInput").value);
  const error = document.getElementById("errorMsg");

  if (input === resultado) {
    window.location.href = "/home";
  } else {
    error.style.display = "block";
  }
});
