const refreshInterval = 15000; // refresh every 15 seconds

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
function refreshAll() {
    const images = document.querySelectorAll("#cameraGrid img");

    images.forEach(img => {
        const baseUrl = img.src.split("?")[0]; // remove old timestamp
        img.src = baseUrl + "?t=" + new Date().getTime(); // force reload
    });
}
const regions = ["nw", "nwc", "minot", "nec", "ne", "grand-forks", "fargo", "se", "sec', "sc", "bisman", "swc", "sw", "mt-dickinson"]; // customize
let rotationInterval = null;
let currentRegionIndex = 0;
// 🔁 Refresh All Cameras
refreshBtn.addEventListener("click", refreshAll);

function refreshAll() {
    const images = document.querySelectorAll(".camera-card img");
    const timestamp = new Date().getTime();

    images.forEach(img => {
        const baseUrl = img.src.split("?")[0];
        img.src = baseUrl + "?t=" + timestamp;
    });
