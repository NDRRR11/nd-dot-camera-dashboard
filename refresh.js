const refreshInterval = 3600000; // 1 hour

setInterval(() => {
  document.querySelectorAll(".refreshable").forEach(img => {
    const base = img.src.split("?")[0];
    img.src = base + "?t=" + new Date().getTime();
  });
}, refreshInterval);
