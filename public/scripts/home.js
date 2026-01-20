const btn = document.getElementById("btnInsertar");

if (btn) {
  btn.addEventListener("click", async () => {
    const res = await fetch("/api/insertar", { method: "POST" });
    alert(res.ok ? "✅ Insertado" : "❌ Error");
  });
}
