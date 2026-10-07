<script>
    const ROTATION_TIME = 20000; 
    const REFRESH_RATE = 30000;  

    const regions = [
        "nw",
        "nwc",
        "minot",
        "nec",
        "ne",
        "grand-forks",
        "fargo",
        "se",
        "sec",
        "sc",
        "bisman",
        "swc",
        "sw",
        "mt-dickinson"
    ];
    
    let rotationTimer = null;
    let progressTimer = null;
    let currentIdx = 0;
    let startTime = 0;

    document.getElementById("refreshBtn").addEventListener("click", refreshAll);
    document.getElementById("autoRotateBtn").addEventListener("click", toggleAutoRotate);

    // =========================================================
    // START AUTO-ROTATE BY DEFAULT
    // =========================================================

    window.onload = () => {

        const urlParams = new URLSearchParams(window.location.search);

        // Restore the current region if it exists in the URL
        const savedIdx = urlParams.get('idx');

        if (savedIdx !== null) {
            const parsedIdx = parseInt(savedIdx);

            if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < regions.length) {
                currentIdx = parsedIdx;
            }
        }

        // Only remain OFF if the URL specifically says autorotate=false
        if (urlParams.get('autorotate') !== 'false') {
            startRotation();
        }
    };


    // =========================================================
    // REFRESH ALL CAMERAS
    // =========================================================

    function refreshAll() {

        document.querySelectorAll(".refreshable").forEach(img => {

            img.src = img.src.split("?")[0] + "?t=" + new Date().getTime();

            const lbl = img.closest('.camera-card').querySelector('.label');

            lbl.classList.add('refreshing');

            setTimeout(() => {
                lbl.classList.remove('refreshing');
            }, 800);

        });
    }


    // =========================================================
    // FILTER REGION
    // =========================================================

    function filterRegion(region) {

        document.querySelectorAll(".camera-card").forEach(card => {

            card.style.display =
                (region === "all" || card.dataset.region === region)
                ? "block"
                : "none";

        });

        if (region !== 'all') {
            refreshAll();
        }
    }


    // =========================================================
    // UPDATE ROTATION PROGRESS
    // =========================================================

    function updateProgressBar() {

        const now = Date.now();
        const elapsed = now - startTime;

        const percent = Math.min(
            (elapsed / ROTATION_TIME) * 100,
            100
        );

        document.getElementById("timerBar").style.width =
            percent + "%";


        // Move to next region
        if (percent >= 100) {

            currentIdx =
                (currentIdx + 1) % regions.length;


            // Update URL with current region
            const newUrl =
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                `?autorotate=true&idx=${currentIdx}`;


            window.history.replaceState(
                { path: newUrl },
                '',
                newUrl
            );


            filterRegion(regions[currentIdx]);

            startTime = Date.now();
        }
    }


    // =========================================================
    // AUTO-ROTATE ON / OFF
    // =========================================================

    function toggleAutoRotate() {

        // -----------------------------------------------------
        // TURN OFF
        // -----------------------------------------------------

        if (rotationTimer) {

            rotationTimer = null;

            if (progressTimer) {
                clearInterval(progressTimer);
                progressTimer = null;
            }


            // Hide progress bar
            document.getElementById("timerContainer").style.display =
                "none";


            // Update button
            const btn =
                document.getElementById("autoRotateBtn");

            btn.dataset.status = "off";
            btn.innerText = "Auto-Rotate: OFF";


            // Tell the dashboard to stay OFF after reload
            const cleanUrl =
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?autorotate=false";


            window.history.replaceState(
                { path: cleanUrl },
                '',
                cleanUrl
            );

            return;
        }


        // -----------------------------------------------------
        // TURN ON
        // -----------------------------------------------------

        const newUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            `?autorotate=true&idx=${currentIdx}`;


        window.history.replaceState(
            { path: newUrl },
            '',
            newUrl
        );


        startRotation();
    }


    // =========================================================
    // START ROTATION
    // =========================================================

    function startRotation() {

        const btn =
            document.getElementById("autoRotateBtn");

        const barContainer =
            document.getElementById("timerContainer");


        btn.dataset.status = "on";
        btn.innerText = "Auto-Rotate: ON";


        barContainer.style.display = "block";


        startTime = Date.now();

        rotationTimer = true;


        filterRegion(regions[currentIdx]);


        if (progressTimer) {
            clearInterval(progressTimer);
        }


        progressTimer =
            setInterval(updateProgressBar, 100);
    }


    // =========================================================
    // IMAGE MODAL
    // =========================================================

    function openModal(img) {

        document.getElementById("imageModal").style.display =
            "block";

        document.getElementById("modalImg").src =
            img.src;
    }


    function closeModal() {

        document.getElementById("imageModal").style.display =
            "none";
    }


    window.onclick = (e) => {

        if (e.target.className === 'modal') {
            closeModal();
        }

    };


    // =========================================================
    // AUTOMATIC CAMERA IMAGE REFRESH
    // =========================================================

    setInterval(refreshAll, REFRESH_RATE);

</script>
