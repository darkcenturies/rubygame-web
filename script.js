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