document.getElementById("year").textContent = new Date().getFullYear();

const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener("click", async () => {
  const text = copyBtn.dataset.copy;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.getElementById("server-address");
    const range = document.createRange();
    range.selectNodeContents(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
  copyBtn.classList.add("copied");
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.classList.remove("copied");
    copyBtn.textContent = "Copy IP";
  }, 2000);
});
// Live server status via the public mcstatus.io API (works with a
// whitelist - it blocks joining, not the status ping).
(async () => {
  const el = document.getElementById("server-status");
  if (!el) return;
  const text = el.querySelector(".status__text");
  const players = document.getElementById("status-players");
  el.hidden = false;
  try {
    const res = await fetch("https://api.mcstatus.io/v2/status/java/play.rubygame.net:22950");
    if (!res.ok) throw new Error(res.status);
    const s = await res.json();
    if (s.online) {
      el.classList.add("status--online");
      const n = s.players?.online ?? 0;
      const m = s.players?.max ?? 0;
      text.textContent = `Online — ${n}/${m} playing`;
      (s.players?.list || []).slice(0, 12).forEach((p) => {
        const img = document.createElement("img");
        // Player privacy: heads are shown, names are NOT. No title (hover
        // tooltip) and a generic alt -- alt leaks the name to screen readers
        // and whenever the image fails to load. Prefer the UUID in the URL so
        // the name does not appear in network requests either.
        img.src = `https://mc-heads.net/avatar/${encodeURIComponent(p.uuid || p.name_clean)}/22`;
        img.alt = "Player";
        img.loading = "lazy";
        players.appendChild(img);
      });
    } else {
      el.classList.add("status--offline");
      text.textContent = "Offline";
    }
  } catch {
    el.hidden = true; // API unreachable: hide rather than mislead
  }
})();
