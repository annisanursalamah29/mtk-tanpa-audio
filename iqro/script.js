document.addEventListener('DOMContentLoaded', () => {
    const teleprompterTextDiv = document.getElementById('teleprompterText');
    const teleprompterDisplayDiv = document.querySelector('.teleprompter-display');
    const loadText1Btn = document.getElementById('loadText1');
    const loadText2Btn = document.getElementById('loadText2');
    const loadText3Btn = document.getElementById('loadText3');
    const loadText4Btn = document.getElementById('loadText4');
    const loadText5Btn = document.getElementById('loadText5');
    const loadText6Btn = document.getElementById('loadText6');
    const scrollSpeedInput = document.getElementById('scrollSpeed');
    const currentSpeedSpan = document.getElementById('currentSpeed');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const teleprompterControlsDiv = document.querySelector('.teleprompter-controls');
    
    let currentText = '';
    let scrollInterval;
    let scrollSpeed = 0;
    let isScrolling = false;
    let currentTransformY = 0;
    
    const TARGET_DURATION_MS = 3 * 60 * 1000; // 3 menit dalam milidetik
    const INTERVAL_MS = 200; // Interval pembaruan posisi gulir (0.2 detik)
    
    const sampleTexts = {
        // Iqro 1
        text1: `Teks untuk Iqro 1. Ini adalah contoh teks pertama.`,
        
        // Iqro 2
        text2: `Teks untuk Iqro 2. Contoh teks kedua ini sedikit lebih panjang.`,
        
        text3: `Teks untuk Iqro 3. Ini adalah contoh teks ketiga yang mungkin lebih detail.`,
        
        text4: `Teks untuk Iqro 4. Contoh teks keempat ini dibuat untuk memberikan variasi.`,
        
        text5: `Teks untuk Iqro 5. Ini adalah contoh teks kelima yang panjangnya sedang.`,
        
        text6: `Teks untuk Iqro 6. Contoh teks keenam ini adalah yang terakhir dalam daftar ini.`
    };
    
    // Fungsi untuk menghitung dan mengatur kecepatan gulir berdasarkan durasi target
    function calculateAndSetScrollSpeed() {
        const fullTextHeight = teleprompterTextDiv.scrollHeight;
        const displayHeight = teleprompterDisplayDiv.clientHeight;
        
        const totalDistanceToTravel = fullTextHeight + displayHeight;
        
        if (totalDistanceToTravel <= 0) {
            scrollSpeed = 1;
        } else {
            const totalSteps = TARGET_DURATION_MS / INTERVAL_MS;
            scrollSpeed = Math.max(1, Math.round(totalDistanceToTravel / totalSteps));
        }
        
        scrollSpeedInput.value = scrollSpeed;
        currentSpeedSpan.textContent = scrollSpeed;
    }
    
    // Fungsi untuk menampilkan kontrol teleprompter
    function showTeleprompterControls() {
        teleprompterControlsDiv.classList.add('visible');
    }
    
    // Fungsi untuk memuat teks
    function loadText(text) {
        currentText = text;
        teleprompterTextDiv.innerHTML = text;
        
        resetTeleprompter();
        showTeleprompterControls();
        
        setTimeout(() => {
            calculateAndSetScrollSpeed();
            currentTransformY = teleprompterDisplayDiv.clientHeight;
            teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
            teleprompterTextDiv.style.opacity = '0';
        }, 100);
    }
    
    // Fungsi untuk memulai gulir
    function startScroll() {
        if (!isScrolling && currentText) {
            isScrolling = true;
            playPauseBtn.textContent = 'Jeda';
            
            teleprompterTextDiv.style.opacity = '1';
            
            currentTransformY = teleprompterDisplayDiv.clientHeight;
            teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
            
            scrollInterval = setInterval(() => {
                currentTransformY -= scrollSpeed;
                teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
                
                const fullTextHeight = teleprompterTextDiv.scrollHeight;
                if (currentTransformY <= -fullTextHeight) {
                    clearInterval(scrollInterval);
                    isScrolling = false;
                    playPauseBtn.textContent = 'Mulai';
                    currentTransformY = -fullTextHeight;
                    teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
                    teleprompterTextDiv.style.opacity = '0';
                }
            }, INTERVAL_MS);
        }
    }
    
    // Fungsi untuk menjeda gulir
    function pauseScroll() {
        if (isScrolling) {
            clearInterval(scrollInterval);
            isScrolling = false;
            playPauseBtn.textContent = 'Lanjutkan';
        }
    }
    
    // Fungsi untuk mereset teleprompter
    function resetTeleprompter() {
        pauseScroll();
        currentTransformY = teleprompterDisplayDiv.clientHeight;
        teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
        teleprompterTextDiv.style.opacity = '0';
        playPauseBtn.textContent = 'Mulai';
    }
    
    // Event listener untuk tombol "Iqro 1"
    loadText1Btn.addEventListener('click', () => {
        loadText(sampleTexts.text1);
    });
    
    // Event listener untuk tombol "Iqro 2"
    loadText2Btn.addEventListener('click', () => {
        loadText(sampleTexts.text2);
    });
    
    // Event listener untuk tombol "Iqro 3"
    loadText3Btn.addEventListener('click', () => {
        loadText(sampleTexts.text3);
    });
    
    // Event listener untuk tombol "Iqro 4"
    loadText4Btn.addEventListener('click', () => {
        loadText(sampleTexts.text4);
    });
    
    // Event listener untuk tombol "Iqro 5"
    loadText5Btn.addEventListener('click', () => {
        loadText(sampleTexts.text5);
    });
    
    // Event listener untuk tombol "Iqro 6"
    loadText6Btn.addEventListener('click', () => {
        loadText(sampleTexts.text6);
    });
    
    // Event listener untuk slider kecepatan gulir
    scrollSpeedInput.addEventListener('input', (event) => {
        scrollSpeed = parseInt(event.target.value);
        currentSpeedSpan.textContent = scrollSpeed;
        if (isScrolling) {
            pauseScroll();
            startScroll();
        }
    });
    
    // Event listener untuk tombol play/pause
    playPauseBtn.addEventListener('click', () => {
        if (isScrolling) {
            pauseScroll();
        } else {
            startScroll();
        }
    });
    
    // Event listener untuk tombol reset
    resetBtn.addEventListener('click', resetTeleprompter);
    
    // Muat teks default saat aplikasi pertama kali dimuat
    loadText(sampleTexts.text1);
    teleprompterControlsDiv.classList.remove('visible');
});