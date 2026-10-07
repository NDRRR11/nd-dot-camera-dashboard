<script>
    const ROTATION_TIME = 20000; 
    const REFRESH_RATE = 30000;  
    const regions = ["nw", "nwc", "minot", "nec", "ne", "grand-forks", "fargo", "se", "sec", "sc", "bisman", "swc", "sw", "mt-dickinson"];
    
    let rotationTimer = null;
    let progressTimer = null;
    let currentIdx = 0;
    let startTime = 0;

    document.getElementById("refreshBtn").addEventListener("click", refreshAll);
    document.getElementById("autoRotateBtn").addEventListener("click", toggleAutoRotate);

    // --- NEW: CHECK URL FOR "autorotate=true" ON LOAD ---
    window.onload = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('autorotate') === 'true') {
            // Restore current index if it's in the URL, otherwise start at 0
            const savedIdx = urlParams.get('idx');
            if (savedIdx) currentIdx = parseInt(savedIdx);
            startRotation();
        }
    };

    function refreshAll() {
        document.querySelectorAll(".refreshable").forEach(img => {
            img.src = img.src.split("?")[0] + "?t=" + new Date().getTime();
            const lbl = img.closest('.camera-card').querySelector('.label');
            lbl.classList.add('refreshing');
            setTimeout(() => lbl.classList.remove('refreshing'), 800);
        });
    }

    function filterRegion(region) {
        document.querySelectorAll(".camera-card").forEach(card => {
            card.style.display = (region === "all" || card.dataset.region === region) ? "block" : "none";
        });
        if(region !== 'all') refreshAll();
    }

    function updateProgressBar() {
        const now = Date.now();
        const elapsed = now - startTime;
        const percent = Math.min((elapsed / ROTATION_TIME) * 100, 100);
        document.getElementById("timerBar").style.width = percent + "%";
        
        if (percent >= 100) {
            currentIdx = (currentIdx + 1) % regions.length;
            
            // UPDATE THE URL so the rotation extension sees the new index
            const newUrl = window.location.protocol + "//" + window.location.pathname + 
                           `?autorotate=true&idx=${currentIdx}`;
            window.history.replaceState({path:newUrl}, '', newUrl);

            filterRegion(regions[currentIdx]);
            startTime = Date.now(); 
        }
    }

    function toggleAutoRotate() {
        if (rotationTimer) {
            // STOP: Clean the URL
            const cleanUrl = window.location.protocol + "//" + window.location.pathname;
            window.history.replaceState({path:cleanUrl}, '', cleanUrl);
            location.reload(); // Force reload to kill all timers cleanly
        } else {
            // START: Add flag to URL
            const newUrl = window.location.protocol + "//" + window.location.pathname + `?autorotate=true&idx=0`;
            window.history.replaceState({path:newUrl}, '', newUrl);
            startRotation();
        }
    }

    function startRotation() {
        const btn = document.getElementById("autoRotateBtn");
        const barContainer = document.getElementById("timerContainer");
        
        btn.dataset.status = "on";
        btn.innerText = "Auto-Rotate: ON";
        barContainer.style.display = "block";
        startTime = Date.now();
        rotationTimer = true;
        filterRegion(regions[currentIdx]);
        
        if (progressTimer) clearInterval(progressTimer);
        progressTimer = setInterval(updateProgressBar, 100);
    }

    function openModal(img) {
        document.getElementById("imageModal").style.display = "block";
        document.getElementById("modalImg").src = img.src;
    }
    function closeModal() { document.getElementById("imageModal").style.display = "none"; }
    window.onclick = (e) => { if (e.target.className === 'modal') closeModal(); };

    setInterval(refreshAll, REFRESH_RATE);
</script>
