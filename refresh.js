<script>
    const ROTATION_TIME = 20000; 
    const regions = ["map", "nw", "nwc", "minot", "nec", "ne", "grand-forks", "fargo", "se", "sec", "sc", "bisman", "swc", "sw", "mt-dickinson"];
    
    let rotationTimer = true; // Tracks if we should be rotating
    let progressTimer = null;
    let currentIdx = 0;
    let startTime = Date.now();

    window.onload = () => {
        const params = new URLSearchParams(window.location.search);
        const savedIdx = params.get('idx');
        const autoStatus = params.get('autorotate');

        if (savedIdx) currentIdx = parseInt(savedIdx) % regions.length;
        
        // If URL says rotate is off, stop it. Otherwise, default to ON.
        if (autoStatus === 'false') {
            stopRotation();
        } else {
            startRotation();
        }
        
        setInterval(refreshAll, 30000); // Background image refresh
    };

    function filterRegion(region) {
        const grid = document.getElementById("cameraGrid");
        const map = document.getElementById("mapContainer");
        
        if (region === 'map') {
            grid.style.display = "none";
            map.style.display = "block";
        } else {
            map.style.display = "none";
            grid.style.display = "grid";
            document.querySelectorAll(".camera-card").forEach(card => {
                card.style.display = (region === "all" || card.dataset.region === region) ? "block" : "none";
            });
            refreshAll();
        }
    }

    function manualFilter(region) {
        if (region === 'all') stopRotation(); 
        currentIdx = regions.indexOf(region);
        if (currentIdx === -1) currentIdx = 0;
        startTime = Date.now();
        filterRegion(region);
    }

    function toggleAutoRotate() {
        if (rotationTimer) stopRotation();
        else startRotation();
    }

    function startRotation() {
        rotationTimer = true;
        document.getElementById("autoRotateBtn").innerText = "Auto-Rotate: ON";
        document.getElementById("autoRotateBtn").style.background = "#28a745";
        document.getElementById("timerContainer").style.display = "block";
        startTime = Date.now();
        if (!progressTimer) progressTimer = setInterval(updateProgressBar, 100);
        updateURL(true);
    }

    function stopRotation() {
        rotationTimer = false;
        clearInterval(progressTimer);
        progressTimer = null;
        document.getElementById("autoRotateBtn").innerText = "Auto-Rotate: OFF";
        document.getElementById("autoRotateBtn").style.background = "#333";
        document.getElementById("timerContainer").style.display = "none";
        updateURL(false);
    }

    function updateProgressBar() {
        if (!rotationTimer) return;
        const elapsed = Date.now() - startTime;
        const percent = Math.min((elapsed / ROTATION_TIME) * 100, 100);
        document.getElementById("timerBar").style.width = percent + "%";
        
        if (percent >= 100) {
            currentIdx = (currentIdx + 1) % regions.length;
            filterRegion(regions[currentIdx]);
            updateURL(true);
            startTime = Date.now(); 
        }
    }

    function updateURL(isRotating) {
        const newUrl = window.location.protocol + "//" + window.location.pathname + `?idx=${currentIdx}&autorotate=${isRotating}`;
        window.history.replaceState({path:newUrl}, '', newUrl);
    }

    function refreshAll() {
        document.querySelectorAll(".refreshable").forEach(img => {
            img.src = img.src.split("?")[0] + "?t=" + new Date().getTime();
        });
    }

    function openModal(img) { document.getElementById("imageModal").style.display = "block"; document.getElementById("modalImg").src = img.src; }
    function closeModal() { document.getElementById("imageModal").style.display = "none"; }
</script>
