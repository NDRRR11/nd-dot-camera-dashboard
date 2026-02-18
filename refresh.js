<script>
    const refreshInterval = 30000; // Refreshes images every 30 seconds
    const rotationSpeed = 20000;   // NOW SET TO 20 SECONDS per region
    const regions = ["nw", "nwc", "minot", "nec", "ne", "grand-forks", "fargo", "se", "sec", "sc", "bisman", "swc", "sw", "mt-dickinson"];
    let rotationTimer = null;
    let currentIdx = 0;

    document.getElementById("refreshBtn").addEventListener("click", refreshAll);
    document.getElementById("autoRotateBtn").addEventListener("click", toggleAutoRotate);

    function refreshAll() {
        document.querySelectorAll(".refreshable").forEach(img => {
            img.src = img.src.split("?")[0] + "?t=" + new Date().getTime();
            const lbl = img.closest('.camera-card').querySelector('.label');
            lbl.classList.add('refreshing');
            setTimeout(() => lbl.classList.remove('refreshing'), 600);
        });
    }

    function filterRegion(region) {
        document.querySelectorAll(".camera-card").forEach(card => {
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
            
            // Starts the rotation immediately and then every 20 seconds
            rotationTimer = setInterval(() => {
                filterRegion(regions[currentIdx]);
                currentIdx = (currentIdx + 1) % regions.length;
            }, rotationSpeed);
        }
    }

// Lightbox/Modal Logic
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

window.onclick = (e) => { if (e.target.id === 'imageModal') closeModal(); };
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
