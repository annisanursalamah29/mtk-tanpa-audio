document.addEventListener('DOMContentLoaded', () => {
  const questionElement = document.getElementById('question');
  const optionsContainer = document.getElementById('options');
  const scoreElement = document.getElementById('score');
  const timerElement = document.getElementById('timer');
  const startButton = document.getElementById('start-button');
  const nextQuestionButton = document.getElementById('next-question-button'); // Dapatkan elemen tombol Lanjut
  
  let score = 0;
  let timerInterval;
  let timeLeft = 60;
  let currentQuestion = {};
  let gameActive = false;
  
  const units = [
    { name: 'mm', value: 0.001 },
    { name: 'cm', value: 0.01 },
    { name: 'dm', value: 0.1 },
    { name: 'm', value: 1 },
    { name: 'dam', value: 10 },
    { name: 'hm', value: 100 },
    { name: 'km', value: 1000 }
  ];
  
  const MAX_VALUE = 1000;
  const MIN_VALUE = 1;
  
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateQuestion() {
    const fromUnitIndex = getRandomNumber(0, units.length - 1);
    let toUnitIndex = getRandomNumber(0, units.length - 1);
    
    if (units.length > 1) {
      while (toUnitIndex === fromUnitIndex) {
        toUnitIndex = getRandomNumber(0, units.length - 1);
      }
    }
    
    const fromUnit = units[fromUnitIndex];
    const toUnit = units[toUnitIndex];
    const value = getRandomNumber(MIN_VALUE, MAX_VALUE);
    
    const actualValueInMeters = value * fromUnit.value;
    const correctAnswer = actualValueInMeters / toUnit.value;
    
    currentQuestion = {
      question: `${value} ${fromUnit.name} berapa ${toUnit.name}?`,
      correctAnswer: parseFloat(correctAnswer.toFixed(6)),
      value: value,
      fromUnit: fromUnit.name,
      toUnit: toUnit.name,
      conversionFactor: (fromUnit.value / toUnit.value).toFixed(10)
    };
    
    const options = generateOptions(currentQuestion.correctAnswer);
    renderQuestion(currentQuestion.question, options);
  }
  
  function generateOptions(correctAnswer) {
    const options = [correctAnswer];
    while (options.length < 4) {
      let wrongAnswer;
      const deviation = getRandomNumber(-200, 200) / 100;
      if (Math.abs(correctAnswer) < 0.1 && correctAnswer !== 0) {
        wrongAnswer = parseFloat((correctAnswer + getRandomNumber(-5, 5) * 0.01).toFixed(6));
      } else if (Math.abs(correctAnswer) > 10000) {
        wrongAnswer = parseFloat((correctAnswer + getRandomNumber(-1000, 1000)).toFixed(0));
      }
      else {
        wrongAnswer = parseFloat((correctAnswer * (1 + deviation)).toFixed(6));
      }
      
      if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && (correctAnswer !== 0 || wrongAnswer !== 0)) {
        options.push(wrongAnswer);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }
  
  function renderQuestion(questionText, options) {
    questionElement.textContent = questionText;
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
      const button = document.createElement('button');
      button.classList.add('option-button');
      button.textContent = formatNumber(option);
      button.dataset.value = option;
      button.addEventListener('click', handleAnswer);
      optionsContainer.appendChild(button);
    });
  }
  
  function formatNumber(num) {
    // Menggunakan toLocaleString untuk format angka yang lebih baik
    // Memastikan jumlah digit setelah koma sesuai kebutuhan dan tidak ada trailing zeros
    return parseFloat(num.toFixed(6)).toLocaleString('id-ID', {
      maximumFractionDigits: 6 // Maksimal 6 digit setelah koma
    });
  }
  
  function getExplanation(selectedValue = null) {
    const fromUnit = currentQuestion.fromUnit;
    const toUnit = currentQuestion.toUnit;
    const value = currentQuestion.value;
    const correctAnswer = currentQuestion.correctAnswer;
    
    // Cari nilai unit dari array units
    const fromUnitValue = units.find(u => u.name === fromUnit).value;
    const toUnitValue = units.find(u => u.name === toUnit).value;
    
    // Hitung faktor konversi
    // Perhatikan penggunaan toFixed(10) pada currentQuestion.conversionFactor
    // Mungkin lebih baik menggunakan nilai aslinya dari perhitungan fromUnitValue / toUnitValue
    const factor = fromUnitValue / toUnitValue;
    
    let explanation = `
            <p>Untuk mengonversi ${value} ${fromUnit} ke ${toUnit}:</p>
            <p>Kita tahu bahwa 1 ${fromUnit} = ${formatNumber(factor)} ${toUnit}.</p>
            <p>Maka, ${value} ${fromUnit} = ${value} &times; ${formatNumber(factor)} ${toUnit}</p>
            <p>= <span class="explanation-answer">${formatNumber(correctAnswer)} ${toUnit}</span></p>
        `;
    
    if (selectedValue !== null) {
      explanation += `<p>Anda memilih: <span class="explanation-wrong">${formatNumber(selectedValue)} ${toUnit}</span></p>`;
    }
    explanation += `<p>Jawaban yang benar adalah: <span class="explanation-correct">${formatNumber(correctAnswer)} ${toUnit}</span></p>`;
    
    return explanation;
  }
  
  async function handleAnswer(event) {
    if (!gameActive) return; // Pastikan game sedang aktif
    
    clearInterval(timerInterval); // Hentikan timer
    gameActive = false; // Nonaktifkan game sementara
    
    const selectedButton = event.target; // Tombol yang diklik
    const selectedAnswer = parseFloat(selectedButton.dataset.value); // Ambil nilai dari data-value
    const allOptionButtons = optionsContainer.querySelectorAll('.option-button');
    
    // Nonaktifkan semua tombol opsi dan beri gaya visual
    allOptionButtons.forEach(button => {
      button.disabled = true; // Nonaktifkan tombol
      if (parseFloat(button.dataset.value) === currentQuestion.correctAnswer) {
        button.classList.add('correct'); // Tandai jawaban yang benar (hijau)
      } else if (button === selectedButton) {
        button.classList.add('incorrect'); // Tandai jawaban yang salah (merah)
      }
    });
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      // Jika jawaban benar
      score++; // Tambah skor
      scoreElement.textContent = score; // Perbarui tampilan skor
      
      // Sembunyikan area opsi dan tampilkan tombol "Lanjut"
      optionsContainer.style.display = 'none';
      nextQuestionButton.style.display = 'block';
      
      // Tidak ada SweetAlert di sini untuk jawaban benar,
      // pemain harus mengklik tombol "Lanjut" secara manual.
    } else {
      // Jika jawaban salah
      await Swal.fire({
        icon: 'error',
        title: 'SALAH!',
        html: getExplanation(selectedAnswer), // Tampilkan penjelasan
        showCancelButton: false, // Hanya tampilkan tombol "Confirm"
        confirmButtonText: 'Lanjut', // Ubah teks tombol "Confirm" menjadi "Lanjut"
        customClass: { // Gunakan kelas kustom untuk gaya SweetAlert
          container: 'swal2-container-custom',
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          htmlContainer: 'swal2-html-container-custom'
        }
      });
      // Setelah alert ditutup, lanjutkan game secara otomatis
      startGame();
    }
  }
  
  async function handleTimeUp() {
    if (!gameActive) return; // Pastikan game sedang aktif
    
    gameActive = false; // Nonaktifkan game sementara
    clearInterval(timerInterval); // Hentikan timer
    
    const allOptionButtons = optionsContainer.querySelectorAll('.option-button');
    allOptionButtons.forEach(button => {
      button.disabled = true; // Nonaktifkan semua tombol
      if (parseFloat(button.dataset.value) === currentQuestion.correctAnswer) {
        button.classList.add('correct'); // Tandai jawaban yang benar jika waktu habis
      }
    });
    
    await Swal.fire({
      icon: 'warning',
      title: 'WAKTU HABIS!',
      html: getExplanation(), // Tampilkan penjelasan (tanpa pilihan pengguna)
      showCancelButton: false, // Hanya tampilkan tombol "Confirm"
      confirmButtonText: 'Lanjut', // Ubah teks tombol "Confirm" menjadi "Lanjut"
      customClass: { // Gunakan kelas kustom untuk gaya SweetAlert
        container: 'swal2-container-custom',
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-html-container-custom'
      }
    });
    
    // Setelah alert ditutup, lanjutkan game secara otomatis
    startGame();
  }
  
  function startTimer() {
    timeLeft = 60; // Reset waktu
    timerElement.textContent = timeLeft; // Perbarui tampilan waktu
    timerInterval = setInterval(() => {
      timeLeft--; // Kurangi waktu
      timerElement.textContent = timeLeft; // Perbarui tampilan waktu
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // Hentikan timer
        handleTimeUp(); // Panggil fungsi waktu habis
      }
    }, 1000); // Setiap 1 detik
  }
  
  function startGame() {
    scoreElement.textContent = score; // Perbarui tampilan skor
    
    // Tampilkan area game dan sembunyikan tombol mulai pada game pertama
    if (startButton.style.display !== 'none') { // Hanya sembunyikan startButton jika terlihat
      startButton.style.display = 'none';
      document.getElementById('question-area').style.display = 'block';
      document.getElementById('score-area').style.display = 'block';
      document.getElementById('timer-area').style.display = 'block';
    }
    
    gameActive = true; // Aktifkan game
    clearInterval(timerInterval); // Hentikan timer sebelumnya (jika ada)
    generateQuestion(); // Hasilkan pertanyaan baru
    startTimer(); // Mulai timer
    
    // Pastikan area opsi terlihat dan tombol "Lanjut" tersembunyi saat pertanyaan baru muncul
    optionsContainer.style.display = 'flex'; // Gunakan 'flex' agar tombol opsi tetap dalam kolom
    nextQuestionButton.style.display = 'none';
    
    // Reset gaya visual dan aktifkan kembali semua tombol opsi
    const allOptionButtons = optionsContainer.querySelectorAll('.option-button');
    allOptionButtons.forEach(button => {
      button.disabled = false; // Aktifkan tombol
      button.classList.remove('correct', 'incorrect'); // Hapus kelas gaya
    });
  }
  
  // Event listener untuk tombol "Mulai Game"
  startButton.addEventListener('click', () => {
    score = 0; // Reset skor saat game dimulai ulang
    startGame();
  });
  
  // Event listener untuk tombol "Lanjut" (yang muncul setelah jawaban benar)
  nextQuestionButton.addEventListener('click', () => {
    startGame(); // Lanjutkan ke pertanyaan berikutnya
  });
});