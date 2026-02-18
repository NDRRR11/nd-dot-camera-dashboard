<script>
    const ROTATION_TIME = 20000; 
    const regions = ["map", "nw", "nwc", "minot", "nec", "ne", "grand-forks", "fargo", "se", "sec", "sc", "bisman", "swc", "sw", "mt-dickinson"];
    
    let isRotating = true; 
    let progressInterval = null;
    let currentIdx = 0;
    let startTime = Date.now();

    window.onload = () => {
        // Read URL to see where we left off
        const params = new URLSearchParams(window.location.search);
        const savedIdx = params.get('idx');
        const savedRotate = params.get('autorotate');

        if (savedIdx !== null) currentIdx = parseInt(savedIdx) % regions.length;
        
        // Start rotation by default unless URL says false
        if (savedRotate === 'false') {
            stopRotation();
        } else {
            startRotation();
        }
        
        // Always keep images fresh in the background
        setInterval(refreshAll, 30000);
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
        currentIdx = (region === 'all') ? 0 : regions.indexOf(region);
        if (currentIdx === -1) currentIdx = 0;
        
        startTime = Date.now();
        filterRegion(region);
    }

    function toggleAutoRotate() {
        if (isRotating) stopRotation();
        else startRotation();
    }

    function startRotation() {
        isRotating = true;
        document.getElementById("autoRotateBtn").innerText = "Auto-Rotate: ON";
        document.getElementById("autoRotateBtn").style.background = "#28a745";
        document.getElementById("timerContainer").style.display = "block";
        
        startTime = Date.now();
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(updateProgressBar, 100);
        updateURL();
        filterRegion(regions[currentIdx]);
    }

    function stopRotation() {
        isRotating = false;
        clearInterval(progressInterval);
        progressInterval = null;
        document.getElementById("autoRotateBtn").innerText = "Auto-Rotate: OFF";
        document.getElementById("autoRotateBtn").style.background = "#333";
        document.getElementById("timerContainer").style.display = "none";
        updateURL();
    }

    function updateProgressBar() {
        if (!isRotating) return;
        const elapsed = Date.now() - startTime;
        const percent = Math.min((elapsed / ROTATION_TIME) * 100, 100);
        document.getElementById("timerBar").style.width = percent + "%";
        
        if (percent >= 100) {
            currentIdx = (currentIdx + 1) % regions.length;
            filterRegion(regions[currentIdx]);
            updateURL();
            startTime = Date.now(); 
        }
    }

    function updateURL() {
        const newUrl = window.location.protocol + "//" + window.location.pathname + `?idx=${currentIdx}&autorotate=${isRotating}`;
        window.history.replaceState({path:newUrl}, '', newUrl);
    }

    function refreshAll() {
        document.querySelectorAll(".refreshable").forEach(img => {
            img.src = img.src.split("?")[0] + "?t=" + new Date().getTime();
        });
        console.log("Cameras Refreshed");
    }

    function openModal(img) { 
        document.getElementById("imageModal").style.display = "block"; 
        document.getElementById("modalImg").src = img.src; 
    }
    function closeModal() { document.getElementById("imageModal").style.display = "none"; }
    window.onclick = (e) => { if (e.target.className === 'modal') closeModal(); };
</script>
