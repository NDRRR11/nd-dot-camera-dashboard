const refreshInterval = 30000; 
const rotationSpeed = 6000;    
const regions = ["nw", "nwc", "minot", "nec", "ne", "grand-forks", "fargo", "se", "sec", "sc", "bisman", "swc", "sw", "mt-dickinson"];

let rotationTimer = null;
let currentIdx = 0;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Hook up buttons
    document.getElementById("refreshBtn").addEventListener("click", refreshAll);
    document.getElementById("autoRotateBtn").addEventListener("click", toggleAutoRotate);
    
    // 2. Automatically attach Load/Error listeners to all images
    document.querySelectorAll(".refreshable").forEach(img => {
        img.addEventListener('load', () => hideSpinner(img));
        img.addEventListener('error', () => {
            console.warn("Camera failed to load:", img.src);
            hideSpinner(img); // Hide spinner even if image fails
        });
    });

    // Initial background refresh
    setInterval(refreshAll, refreshInterval);
});

// Helper to find the spinner in the same card
function getSpinner(img) {
    return img.closest('.image-wrapper').querySelector('.spinner');
}

function hideSpinner(img) {
    const spinner = getSpinner(img);
    if (spinner) {
        spinner.style.opacity = '0';
        setTimeout(() => { spinner.style.display = 'none'; }, 300); // Smooth fade out
    }
}

function showSpinner(img) {
    const spinner = getSpinner(img);
    if (spinner) {
        spinner.style.display = 'block';
        spinner.style.opacity = '1';
    }
    
    // SAFETY TIMEOUT: If it hasn't loaded in 5 seconds, kill the spinner
    setTimeout(() => hideSpinner(img), 5000);
}

function refreshAll() {
    const images = document.querySelectorAll(".refreshable");
    images.forEach(img => {
        showSpinner(img);
        const baseUrl = img.src.split("?")[0];
        img.src = `${baseUrl}?t=${new Date().getTime()}`;
    });
}

// ... (Rest of your filterRegion, toggleAutoRotate, and Modal functions) ...

function filterRegion(region) {
    const cards = document.querySelectorAll(".camera-card");
    cards.forEach(card => {
        card.style.display = (region === "all" || card.dataset.region === region) ? "block" : "none";
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
