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
let rotationOn = false;

function toggleRotation() {
    rotationOn = !rotationOn;
    const btn = document.getElementById("rotateBtn");

    if (rotationOn) {
        btn.textContent = "Stop Rotation";
        startRotation();
    } else {
        btn.textContent = "Auto Rotate";
        clearInterval(rotationInterval);
    }
}

function startRotation() {
    showRegion(regions[currentRegionIndex]);

    rotationInterval = setInterval(() => {
        currentRegionIndex = (currentRegionIndex + 1) % regions.length;
        showRegion(regions[currentRegionIndex]);
    }, 15000); // rotate every 15 seconds
}
function showRegion(region) {
    const cards = document.querySelectorAll(".camera-card");

    cards.forEach(card => {
        if (region === "all" || card.dataset.region === region) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
if (rotationOn) toggleRotation();
}, 30000); // 30 seconds
