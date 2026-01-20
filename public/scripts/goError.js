export function goError(message, code = "E_GEN") {
  window.location.href =
    "/error?msg=" +
    encodeURIComponent(message) +
    "&code=" +
    encodeURIComponent(code);
}
