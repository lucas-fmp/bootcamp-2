const btn = document.getElementById("ping");
const statusEl = document.getElementById("status");

btn.addEventListener("click", async () => {
  try {
    const res = await chrome.runtime.sendMessage({ type: "PING" });
    statusEl.textContent = `Background está vivo: ${res.time}`;
  } catch (err) {
    statusEl.textContent = "Erro ao contactar o background.";
    console.error(err);
  }
});
