document.addEventListener('DOMContentLoaded', () => {
    const teleprompterTextDiv = document.getElementById('teleprompterText');
    const teleprompterDisplayDiv = document.querySelector('.teleprompter-display');
    const loadText1Btn = document.getElementById('loadText1');
    const loadText2Btn = document.getElementById('loadText2');
    const loadText3Btn = document.getElementById('loadText3');
    const scrollSpeedInput = document.getElementById('scrollSpeed');
    const currentSpeedSpan = document.getElementById('currentSpeed');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const teleprompterControlsDiv = document.querySelector('.teleprompter-controls');
    
    let currentText = '';
    let animationFrameId; // Menggunakan requestAnimationFrame
    let currentScrollSpeed = 0; // Kecepatan gulir saat ini dalam piksel per milidetik
    let isScrolling = false;
    let currentTransformY = 0;
    let lastTimestamp = 0;
    
    const INITIAL_SPEED_PX_PER_SEC = 10; // Kecepatan awal dalam piksel per detik
    const MAX_SPEED_PX_PER_SEC = 50; // Kecepatan maksimum dalam piksel per detik (sesuaikan jika perlu)
    const MIN_SPEED_PX_PER_SEC = 10; // Kecepatan minimum dalam piksel per detik (sesuaikan jika perlu)
    const FRAME_RATE = 60; // Target frame rate (misalnya 60 FPS)
    const MS_PER_FRAME = 1000 / FRAME_RATE; // Milidetik per frame
    
    const sampleTexts = {
        // Bacalah 1: Kata-kata dua suku kata, masing-masing suku kata dua huruf
        text1: `Buka buku baru.
kuda mati pagi.
Saya mau kopi.
Roda itu maju.
adi itu suka.
tiga kali lima.
Tamu baru tiba.
Baca puisi lama.
Guru beri materi.
Rusa lari pagi.
Kaki kena batu.
Mata saya luka.
ibu bawa gula.
kamu suka bola.
Pagi ada matahari.
Kota lama sepi.
Jari kaki kaku.
Rasa suka pada kamu.
Masa kini maju.
Tamu kami tiba.
Tuna biru muda.
saka suka saya.
Kaca ada lima.
Kado dari mama.
Rawa penuh buaya.
Semoga daftar ini membantu! Ada tema atau jenis kalimat lain yang ingin Anda coba buat?

`,
        
        // Bacalah 2: Kata-kata dua suku kata, suku kata pertama dua huruf, suku kata kedua tiga huruf
        text2: `Makan Daun Empat Dengar Lihat Duduk Tutup Tidur Mandi Kasab Berdiri Pulang Pergi Tulis Garis Enam Tujuh Delapan Sembilan Sepuluh Kakak Adik Minum Tulis Sakit Kunit Layar Cepat Putus Beras Tangan Kulis Merah Hitam Putih Kecil Besar Dekat Jauh Timur Barat Selatan Panas Dingin Lurus Belok Ramai Sepi Cerah Malam Siang Pagi Sore Lampu Pintu Jendela Atap Rumah Kamar Dapur Mandi Lapar Haus Nanti Coba Biasa Aroma Suara Cerita Bahagia Sedih Terang Gelap Kembang Daunnya Akarnya Tanaman Gunung Sungai Danau Lautnya Perahu Kapal Burung Ikan Buahnya Jangka Cukup Segera Tergilas Secepat Membaca Bergerak Kemarau Musimnya Datang Bersama Melaju Berlari Berjalan Tertawa Menangis Bersenang Berkumpul`,
        
        text3: `Kisah Nabi Muhammad SAW.

Beliau lahir di Mekah, tahun Gajah. Sejak kecil, beliau telah dikenal jujur.
Beliau adalah nabi terakhir, pembawa risalah Islam.
Di Gua Hira, beliau menerima wahyu pertama dari Allah SWT melalui Malaikat Jibril.
Setelah itu, beliau berdakwah. Mulanya secara sembunyi-sembunyi, lalu terang-terangan.
Banyak rintangan dihadapi, namun beliau tetap sabar.
Beliau hijrah ke Madinah, membangun masyarakat Islami.
Nabi Muhammad SAW adalah teladan utama bagi umat manusia.
Ajaran beliau tentang tauhid, akhlak mulia, dan persatuan.
Beliau wafat di Madinah, meninggalkan warisan besar bagi peradaban dunia.
Shalawat dan salam semoga tercurah kepadanya.`
    };
    
    // Fungsi untuk mengatur kecepatan gulir berdasarkan input slider
    function setScrollSpeedFromInput() {
        // Mendapatkan nilai dari slider, ini adalah kecepatan dalam piksel per detik
        const speedPxPerSec = parseInt(scrollSpeedInput.value);
        currentScrollSpeed = speedPxPerSec / 1000; // Konversi ke piksel per milidetik
        currentSpeedSpan.textContent = speedPxPerSec; // Menampilkan kecepatan di span
    }
    
    // Fungsi untuk menampilkan kontrol teleprompter
    function showTeleprompterControls() {
        teleprompterControlsDiv.classList.add('visible');
    }
    
    // Fungsi untuk memuat teks
    function loadText(text) {
        currentText = text;
        teleprompterTextDiv.innerHTML = text;
        
        resetTeleprompter(); // Selalu reset saat memuat teks baru
        showTeleprompterControls();
        
        // Menggunakan setTimeout untuk memastikan DOM sudah dirender sebelum menghitung tinggi
        setTimeout(() => {
            // Atur posisi awal teks di bawah display saat teks baru dimuat
            currentTransformY = teleprompterDisplayDiv.clientHeight;
            teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
            teleprompterTextDiv.style.opacity = '0';
        }, 100);
    }
    
    // Fungsi loop animasi untuk gulir halus
    function animateScroll(timestamp) {
        if (!isScrolling) {
            lastTimestamp = 0; // Reset lastTimestamp saat tidak menggulir
            return;
        }
        
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }
        
        const elapsed = timestamp - lastTimestamp;
        
        // Hanya memperbarui jika sudah melewati MS_PER_FRAME atau jika ini frame pertama
        if (elapsed >= MS_PER_FRAME) {
            const pixelsToMove = currentScrollSpeed * elapsed; // Berapa piksel yang harus digeser
            currentTransformY -= pixelsToMove;
            teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
            
            lastTimestamp = timestamp; // Update lastTimestamp
            
            const fullTextHeight = teleprompterTextDiv.scrollHeight;
            // Jika teks sudah melewati seluruh display
            if (currentTransformY <= -fullTextHeight) {
                isScrolling = false;
                playPauseBtn.textContent = 'Mulai';
                currentTransformY = -fullTextHeight; // Pastikan posisi akhirnya pas
                teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
                teleprompterTextDiv.style.opacity = '0'; // Sembunyikan teks saat selesai
                cancelAnimationFrame(animationFrameId); // Hentikan animasi
                return; // Hentikan rekursi
            }
        }
        animationFrameId = requestAnimationFrame(animateScroll);
    }
    
    // Fungsi untuk memulai gulir
    function startScroll() {
        if (!isScrolling && currentText) {
            isScrolling = true;
            playPauseBtn.textContent = 'Jeda';
            teleprompterTextDiv.style.opacity = '1';
            
            lastTimestamp = 0; // Reset timestamp untuk memastikan perhitungan elapsed yang benar
            animationFrameId = requestAnimationFrame(animateScroll);
        }
    }
    
    // Fungsi untuk menjeda gulir
    function pauseScroll() {
        if (isScrolling) {
            isScrolling = false;
            playPauseBtn.textContent = 'Lanjutkan';
            cancelAnimationFrame(animationFrameId); // Hentikan animasi
        }
    }
    
    // Fungsi untuk mereset teleprompter
    function resetTeleprompter() {
        pauseScroll();
        currentTransformY = teleprompterDisplayDiv.clientHeight; // Atur posisi awal ke bawah display
        teleprompterTextDiv.style.transform = `translateY(${currentTransformY}px)`;
        teleprompterTextDiv.style.opacity = '0';
        playPauseBtn.textContent = 'Mulai';
    }
    
    // Inisialisasi slider kecepatan
    scrollSpeedInput.min = MIN_SPEED_PX_PER_SEC;
    scrollSpeedInput.max = MAX_SPEED_PX_PER_SEC;
    scrollSpeedInput.value = INITIAL_SPEED_PX_PER_SEC;
    
    // Event listener untuk tombol "Bacalah 1"
    loadText1Btn.addEventListener('click', () => {
        loadText(sampleTexts.text1);
    });
    
    // Event listener untuk tombol "Bacalah 2"
    loadText2Btn.addEventListener('click', () => {
        loadText(sampleTexts.text2);
    });
    
    // Event listener untuk tombol "Bacalah 3"
    loadText3Btn.addEventListener('click', () => {
        loadText(sampleTexts.text3);
    });
    
    // Event listener untuk slider kecepatan gulir
    scrollSpeedInput.addEventListener('input', () => {
        setScrollSpeedFromInput(); // Panggil fungsi untuk mengatur kecepatan
        
        // Jika sedang menggulir, jeda dan mulai lagi dengan kecepatan baru
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
    setScrollSpeedFromInput(); // Atur kecepatan awal dari slider
    teleprompterControlsDiv.classList.remove('visible'); // Sembunyikan kontrol di awal
});