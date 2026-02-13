const refreshInterval = 3600000; // 1 hour

setInterval(() => {
  document.querySelectorAll(".refreshable").forEach(img => {
    const base = img.src.split("?")[0];
    img.src = base + "?t=" + new Date().getTime();
  });
}, refreshInterval);

function filterRegion(region) {
  const cards = document.querySelectorAll(".camera-card");

  cards.forEach(card => {
    if (region === "all" || card.dataset.region === region) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
