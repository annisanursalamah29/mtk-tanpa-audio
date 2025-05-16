document.addEventListener('DOMContentLoaded', () => {
  const questionText = document.getElementById('question-text');
  const timeDisplay = document.getElementById('time');
  const scoreDisplay = document.getElementById('score');
  const optionsContainer = document.getElementById('options-container');
  const startButton = document.getElementById('start-button');
  
  let score = 0;
  let timeLeft = 60;
  let timer;
  let currentQuestion = {};
  let questionsAttempted = []; // Menyimpan log pengerjaan soal
  
  const units = ['cm', 'm', 'km'];
  const scaleTypes = ['pembesaran', 'pengecilan'];
  
  // Fungsi untuk menghasilkan pertanyaan dan pilihan jawaban
  function generateQuestion() {
    const type = scaleTypes[Math.floor(Math.random() * scaleTypes.length)];
    const unit1 = units[Math.floor(Math.random() * units.length)];
    const unit2 = units[Math.floor(Math.random() * units.length)];
    
    let actualSize, modelSize, scaleNumerator, scaleDenominator;
    let questionSentence;
    let correctAnswer;
    let calculationProcess; // Tambahkan variabel untuk proses perhitungan
    
    // Menentukan nilai awal agar masuk akal
    if (type === 'pembesaran') { // Skala n:1 (n > 1)
      scaleNumerator = Math.floor(Math.random() * 9) + 2; // 2-10
      scaleDenominator = 1;
      actualSize = Math.floor(Math.random() * 10) + 1; // 1-10
      modelSize = actualSize * scaleNumerator;
      
      questionSentence = `Sebuah objek nyata memiliki panjang ${actualSize} ${unit1}. Jika objek ini dibuat model dengan skala ${scaleNumerator}:${scaleDenominator}, berapa panjang model tersebut dalam ${unit2}?`;
      correctAnswer = convertUnits(modelSize, unit1, unit2);
      calculationProcess = `${actualSize} ${unit1} × ${scaleNumerator} (dari skala ${scaleNumerator}:${scaleDenominator}) = ${modelSize} ${unit1}`;
      
    } else { // type === 'pengecilan' (Skala 1:n, n > 1)
      scaleNumerator = 1;
      scaleDenominator = (Math.floor(Math.random() * 9) + 2) * 100; // 200, 300, ..., 1000, 2000, ...
      if (scaleDenominator > 1000) scaleDenominator = Math.floor(Math.random() * 9) * 1000 + 1000; // untuk skala yang lebih besar
      
      actualSize = (Math.floor(Math.random() * 9) + 1) * 100; // 100, 200, ..., 1000, 2000, ...
      modelSize = actualSize / scaleDenominator;
      
      questionSentence = `Jarak sebenarnya antara dua kota adalah ${actualSize} ${unit1}. Jika digambar pada peta dengan skala ${scaleNumerator}:${scaleDenominator}, berapa jaraknya di peta dalam ${unit2}?`;
      correctAnswer = convertUnits(modelSize, unit1, unit2);
      calculationProcess = `${actualSize} ${unit1} ÷ ${scaleDenominator} (dari skala ${scaleNumerator}:${scaleDenominator}) = ${modelSize} ${unit1}`;
    }
    
    // Pastikan jawaban tidak terlalu aneh (misal: 0.000001)
    if (correctAnswer < 0.001) {
      return generateQuestion(); // Regenerate if too small
    }
    
    // Generate pilihan jawaban
    const options = new Set();
    options.add(parseFloat(correctAnswer.toFixed(3))); // Tambahkan jawaban benar
    
    while (options.size < 4) {
      let fakeAnswer;
      const deviation = correctAnswer * (Math.random() * 0.4 + 0.1); // deviasi 10-50%
      if (Math.random() > 0.5) {
        fakeAnswer = correctAnswer + deviation;
      } else {
        fakeAnswer = correctAnswer - deviation;
      }
      if (fakeAnswer <= 0.001) { // Hindari jawaban negatif atau sangat kecil
        fakeAnswer = correctAnswer + deviation;
      }
      options.add(parseFloat(fakeAnswer.toFixed(3)));
    }
    
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
    
    currentQuestion = {
      question: questionSentence,
      correctAnswer: parseFloat(correctAnswer.toFixed(3)),
      options: shuffledOptions,
      rawActualSize: actualSize,
      rawModelSize: modelSize,
      rawScale: `${scaleNumerator}:${scaleDenominator}`,
      rawUnit1: unit1,
      rawUnit2: unit2,
      calculationProcess: calculationProcess // Simpan proses perhitungan
    };
    displayQuestion();
  }
  
  // Fungsi untuk konversi unit
  function convertUnits(value, fromUnit, toUnit) {
    let valueInMeters;
    
    // Konversi ke meter dulu
    switch (fromUnit) {
      case 'cm':
        valueInMeters = value / 100;
        break;
      case 'm':
        valueInMeters = value;
        break;
      case 'km':
        valueInMeters = value * 1000;
        break;
      default:
        valueInMeters = value; // Should not happen
    }
    
    // Konversi dari meter ke unit tujuan
    switch (toUnit) {
      case 'cm':
        return valueInMeters * 100;
      case 'm':
        return valueInMeters;
      case 'km':
        return valueInMeters / 1000;
      default:
        return valueInMeters; // Should not happen
    }
  }
  
  // Fungsi untuk menampilkan pertanyaan
  function displayQuestion() {
    questionText.innerHTML = currentQuestion.question;
    optionsContainer.innerHTML = ''; // Kosongkan pilihan sebelumnya
    
    currentQuestion.options.forEach(option => {
      const button = document.createElement('button');
      button.classList.add('option-button');
      button.textContent = `${option} ${currentQuestion.rawUnit2}`;
      button.onclick = () => checkAnswer(option);
      optionsContainer.appendChild(button);
    });
    enableOptions();
  }
  
  // Fungsi untuk memeriksa jawaban
  function checkAnswer(selectedOption) {
    clearInterval(timer); // Hentikan timer saat jawaban dipilih
    disableOptions(); // Nonaktifkan tombol setelah menjawab
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const problemDetails = `
            Soal: ${currentQuestion.question}<br>
            Skala: ${currentQuestion.rawScale}<br>
            Ukuran Awal: ${currentQuestion.rawActualSize} ${currentQuestion.rawUnit1}<br>
            Proses: ${currentQuestion.calculationProcess}<br>
            Jawaban Benar (setelah konversi unit): ${currentQuestion.correctAnswer} ${currentQuestion.rawUnit2}
        `;
    
    questionsAttempted.push({
      question: currentQuestion.question,
      selected: `${selectedOption} ${currentQuestion.rawUnit2}`,
      correct: `${currentQuestion.correctAnswer} ${currentQuestion.rawUnit2}`,
      isCorrect: isCorrect,
      timeRemaining: timeLeft,
      calculationProcess: currentQuestion.calculationProcess // Simpan proses perhitungan
    });
    
    if (isCorrect) {
      score++;
      scoreDisplay.textContent = score;
      Swal.fire({
        icon: 'success',
        title: 'Benar!',
        text: 'Kerja bagus!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        nextQuestion();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Salah!',
        html: `Jawabanmu salah.<br>${problemDetails}`,
        confirmButtonText: 'Lanjut'
      }).then(() => {
        nextQuestion();
      });
    }
  }
  
  // Fungsi untuk memulai timer
  function startTimer() {
    timeLeft = 60;
    timeDisplay.textContent = timeLeft;
    timer = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        disableOptions();
        
        const problemDetails = `
                    Soal: ${currentQuestion.question}<br>
                    Skala: ${currentQuestion.rawScale}<br>
                    Ukuran Awal: ${currentQuestion.rawActualSize} ${currentQuestion.rawUnit1}<br>
                    Proses: ${currentQuestion.calculationProcess}<br>
                    Jawaban Benar (setelah konversi unit): ${currentQuestion.correctAnswer} ${currentQuestion.rawUnit2}
                `;
        
        questionsAttempted.push({
          question: currentQuestion.question,
          selected: 'Waktu Habis',
          correct: `${currentQuestion.correctAnswer} ${currentQuestion.rawUnit2}`,
          isCorrect: false,
          timeRemaining: 0,
          calculationProcess: currentQuestion.calculationProcess // Simpan proses perhitungan
        });
        
        Swal.fire({
          icon: 'warning',
          title: 'Waktu Habis!',
          html: `Waktu Anda habis. ${problemDetails}`,
          confirmButtonText: 'Lanjut'
        }).then(() => {
          nextQuestion();
        });
      }
    }, 1000);
  }
  
  // Fungsi untuk memuat pertanyaan berikutnya
  function nextQuestion() {
    startTimer();
    generateQuestion();
  }
  
  // Fungsi untuk menonaktifkan tombol pilihan
  function disableOptions() {
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(button => {
      button.disabled = true;
    });
  }
  
  // Fungsi untuk mengaktifkan tombol pilihan
  function enableOptions() {
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(button => {
      button.disabled = false;
    });
  }
  
  // Fungsi untuk menampilkan riwayat pengerjaan soal di SweetAlert
  function showScoreSummary() {
    let summaryHtml = '<h3>Ringkasan Pengerjaan Soal:</h3>';
    questionsAttempted.forEach((q, index) => {
      summaryHtml += `
                    <p><strong>Soal ${index + 1}:</strong> ${q.question}<br>
                    Jawabanmu: ${q.selected} (${q.isCorrect ? '<span style="color: green;">Benar</span>' : '<span style="color: red;">Salah</span>'})<br>
                    Jawaban Benar: ${q.correct}<br>
                    Proses: ${q.calculationProcess}<br>
                    Waktu Tersisa: ${q.timeRemaining} detik</p>
                    <hr>
                `;
    });
    
    Swal.fire({
      title: `Game Selesai! Skor Akhir: ${score}`,
      html: summaryHtml,
      icon: 'info',
      confirmButtonText: 'Main Lagi'
    }).then((result) => {
      if (result.isConfirmed) {
        resetGame();
      }
    });
  }
  
  // Fungsi untuk mereset game
  function resetGame() {
    score = 0;
    scoreDisplay.textContent = score;
    timeLeft = 60;
    timeDisplay.textContent = timeLeft;
    questionsAttempted = [];
    clearInterval(timer);
    startButton.style.display = 'block';
    questionText.textContent = 'Klik "Mulai Game" untuk bermain!';
    optionsContainer.innerHTML = '';
    disableOptions();
  }
  
  // Event listener untuk tombol mulai
  startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    score = 0; // Reset skor saat memulai game baru
    questionsAttempted = []; // Kosongkan riwayat saat memulai game baru
    nextQuestion(); // Memulai pertanyaan pertama dan timer
  });
  
  // Inisialisasi tampilan awal
  resetGame();
});