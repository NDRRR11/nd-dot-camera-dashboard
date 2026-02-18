const refreshInterval = 30000; // 30 seconds
const rotationSpeed = 6000;    // 6 seconds per region
const regions = ["nw", "nwc", "minot", "nec", "ne", "grand-forks", "fargo", "se", "sec", "sc", "bisman", "swc", "sw", "mt-dickinson"];

let rotationTimer = null;
let currentIdx = 0;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("refreshBtn").addEventListener("click", refreshAll);
    document.getElementById("autoRotateBtn").addEventListener("click", toggleAutoRotate);
    
    // Background refresh
    setInterval(refreshAll, refreshInterval);
});

function hideSpinner(img) {
    const spinner = img.previousElementSibling;
    if (spinner) spinner.style.display = 'none';
}

function showSpinner(img) {
    const spinner = img.previousElementSibling;
    if (spinner) spinner.style.display = 'block';
}

function filterRegion(region) {
    const cards = document.querySelectorAll(".camera-card");
    cards.forEach(card => {
        card.style.display = (region === "all" || card.dataset.region === region) ? "block" : "none";
    });
}

function refreshAll() {
    const images = document.querySelectorAll(".refreshable");
    images.forEach(img => {
        showSpinner(img);
        const baseUrl = img.src.split("?")[0];
        img.src = `${baseUrl}?t=${new Date().getTime()}`;
    });
}

function toggleAutoRotate() {
    const btn = document.getElementById("autoRotateBtn");
    if (rotationTimer) {
        clearInterval(rotationTimer);
        rotationTimer = null;
        btn.dataset.status = "off";
        btn.innerText = "Auto-Rotate: OFF";
        filterRegion("all");
    } else {
        btn.dataset.status = "on";
        btn.innerText = "Auto-Rotate: ON";
        rotationTimer = setInterval(() => {
            filterRegion(regions[currentIdx]);
            currentIdx = (currentIdx + 1) % regions.length;
        }, rotationSpeed);
    }
}

function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const caption = document.getElementById("modalCaption");
    modal.style.display = "block";
    modalImg.src = img.src;
    caption.textContent = img.alt;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

window.onclick = (e) => { if (e.target.className === 'modal') closeModal(); };
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
