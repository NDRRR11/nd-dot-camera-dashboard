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

    // --- AUTO-START ON LOAD UNLESS DISABLED BY USER ---
    window.onload = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const savedIdx = urlParams.get('idx');
        if (savedIdx) currentIdx = parseInt(savedIdx);

        // Check if user manually turned auto-rotate off in a previous session
        const isAutoRotateDisabled = localStorage.getItem("autoRotateDisabled") === "true";

        if (!isAutoRotateDisabled) {
            startRotation();
        } else {
            updateButtonUI(false);
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
            
            // UPDATE THE URL to preserve current index across reloads if needed
            const newUrl = window.location.protocol + "//" + window.location.pathname + 
                           `?autorotate=true&idx=${currentIdx}`;
            window.history.replaceState({path:newUrl}, '', newUrl);

            filterRegion(regions[currentIdx]);
            startTime = Date.now(); 
        }
    }

    function toggleAutoRotate() {
        if (rotationTimer) {
            // STOP: Store preference so it stays off
            localStorage.setItem("autoRotateDisabled", "true");
            stopRotation();
        } else {
            // START: Clear off preference so it auto-starts in future visits
            localStorage.removeItem("autoRotateDisabled");
            startRotation();
        }
    }

    function startRotation() {
        updateButtonUI(true);
        startTime = Date.now();
        rotationTimer = true;
        filterRegion(regions[currentIdx]);
        
        if (progressTimer) clearInterval(progressTimer);
        progressTimer = setInterval(updateProgressBar, 100);
    }

    function stopRotation() {
        if (progressTimer) clearInterval(progressTimer);
        rotationTimer = null;
        
        // Clean URL parameters
        const cleanUrl = window.location.protocol + "//" + window.location.pathname;
        window.history.replaceState({path:cleanUrl}, '', cleanUrl);

        updateButtonUI(false);
    }

    function updateButtonUI(isOn) {
        const btn = document.getElementById("autoRotateBtn");
        const barContainer = document.getElementById("timerContainer");
        
        if (isOn) {
            btn.dataset.status = "on";
            btn.innerText = "Auto-Rotate: ON";
            if (barContainer) barContainer.style.display = "block";
        } else {
            btn.dataset.status = "off";
            btn.innerText = "Auto-Rotate: OFF";
            if (barContainer) barContainer.style.display = "none";
            document.getElementById("timerBar").style.width = "0%";
        }
    }

    function openModal(img) {
        document.getElementById("imageModal").style.display = "block";
        document.getElementById("modalImg").src = img.src;
    }
    function closeModal() { document.getElementById("imageModal").style.display = "none"; }
    window.onclick = (e) => { if (e.target.className === 'modal') closeModal(); };

    setInterval(refreshAll, REFRESH_RATE);
</script>
