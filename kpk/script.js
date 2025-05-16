document.addEventListener('DOMContentLoaded', () => {
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const timerEl = document.getElementById('timer');
  const scoreEl = document.getElementById('score');
  const startButton = document.getElementById('start-button');
  const gameArea = document.getElementById('game-area');
  
  let score = 0;
  let timer;
  let timeLeft = 60;
  let correctAnswer;
  let gameRunning = false;
  let currentNum1, currentNum2, currentQuestionType; // Simpan angka dan tipe soal saat ini
  
  // Fungsi untuk mencari FPB (menggunakan Euclidean algorithm)
  function gcd(a, b) {
    let steps = [];
    let originalA = a;
    let originalB = b;
    
    // Kasus khusus jika salah satu angka adalah 0
    if (a === 0) return { value: b, steps: [`FPB(${originalA}, ${originalB}) = ${b}`] };
    if (b === 0) return { value: a, steps: [`FPB(${originalA}, ${originalB}) = ${a}`] };
    
    steps.push(`Mencari FPB(${originalA}, ${originalB}) menggunakan Algoritma Euclidean:`);
    while (b !== 0) {
      let remainder = a % b;
      steps.push(`${a} = ${Math.floor(a / b)} × ${b} + ${remainder}`);
      let temp = b;
      b = remainder;
      a = temp;
    }
    steps.push(`FPB(${originalA}, ${originalB}) adalah angka terakhir yang tidak nol: ${a}`);
    return { value: a, steps: steps };
  }
  
  // Fungsi untuk mencari KPK
  function lcm(a, b) {
    let commonDivisorResult = gcd(a, b);
    let commonDivisor = commonDivisorResult.value;
    let result = (a * b) / commonDivisor;
    
    let steps = [
      `Untuk mencari KPK(${a}, ${b}), pertama kita cari FPB-nya.`,
      ...commonDivisorResult.steps, // Sertakan langkah-langkah FPB
      `<br>`, // Pemisah visual
      `Rumus KPK: KPK(a, b) = (a × b) / FPB(a, b)`,
      `KPK(${a}, ${b}) = (${a} × ${b}) / ${commonDivisor}`,
      `KPK(${a}, ${b}) = ${a * b} / ${commonDivisor}`,
      `KPK(${a}, ${b}) = ${result}`
    ];
    return { value: result, steps: steps };
  }
  
  // Fungsi untuk menghasilkan angka acak antara min dan max (inklusif)
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Fungsi untuk menghasilkan soal baru
  function generateQuestion() {
    currentNum1 = getRandomNumber(2, 25); // Angka bisa disesuaikan untuk kesulitan
    currentNum2 = getRandomNumber(2, 25); // Angka bisa disesuaikan untuk kesulitan
    currentQuestionType = Math.random() < 0.5 ? 'KPK' : 'FPB'; // Randomly choose KPK or FPB
    
    let questionText;
    if (currentQuestionType === 'KPK') {
      questionText = `Berapakah KPK dari ${currentNum1} dan ${currentNum2}?`;
      correctAnswer = lcm(currentNum1, currentNum2).value;
    } else {
      questionText = `Berapakah FPB dari ${currentNum1} dan ${currentNum2}?`;
      correctAnswer = gcd(currentNum1, currentNum2).value;
    }
    
    questionEl.textContent = questionText;
    generateOptions(correctAnswer);
  }
  
  // Fungsi untuk menghasilkan pilihan jawaban
  function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);
    
    while (options.size < 4) {
      let wrongAnswer;
      // Pastikan jawaban salah tidak terlalu dekat dengan jawaban benar dan tidak duplikat
      do {
        // Rentang untuk jawaban salah disesuaikan agar tidak terlalu jauh atau terlalu dekat
        wrongAnswer = getRandomNumber(Math.max(1, correctAnswer - 15), correctAnswer + 15);
        // Pastikan jawaban salah tidak 0 atau negatif
        if (wrongAnswer <= 0) wrongAnswer = getRandomNumber(1, 30); // Sesuaikan rentang jika perlu
      } while (options.has(wrongAnswer) || wrongAnswer === correctAnswer);
      options.add(wrongAnswer);
    }
    
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
    
    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach((button, index) => {
      button.textContent = shuffledOptions[index];
      button.dataset.value = shuffledOptions[index];
      button.onclick = handleAnswer; // Atur event listener untuk setiap tombol
    });
  }
  
  // Fungsi untuk mendapatkan cara pengerjaan
  function getSolutionSteps(num1, num2, type) {
    let result;
    if (type === 'KPK') {
      result = lcm(num1, num2);
    } else {
      result = gcd(num1, num2);
    }
    
    let htmlContent = '<h3>Cara Pengerjaan:</h3>';
    htmlContent += '<ol style="text-align: left; margin-left: 1em; padding-left: 0;">'; // Styling untuk list
    result.steps.forEach(step => {
      htmlContent += `<li>${step}</li>`;
    });
    htmlContent += '</ol>';
    htmlContent += `<p>Jadi, ${type} dari **${num1}** dan **${num2}** adalah **${result.value}**.</p>`;
    return htmlContent;
  }
  
  // Fungsi untuk menangani jawaban pemain
  function handleAnswer(event) {
    if (!gameRunning) return;
    
    clearInterval(timer); // Hentikan timer saat jawaban diberikan
    const selectedAnswer = parseInt(event.target.dataset.value);
    
    if (selectedAnswer === correctAnswer) {
      score += 10;
      scoreEl.textContent = `Skor: ${score}`;
      Swal.fire({
        icon: 'success',
        title: 'Benar!',
        text: 'Jawaban Anda tepat.',
        showConfirmButton: false,
        timer: 1500 // Auto-close after 1.5 seconds
      }).then(() => {
        if (gameRunning) startNewRound(); // Pastikan game masih berjalan sebelum memulai ronde baru
      });
    } else {
      const solutionHtml = getSolutionSteps(currentNum1, currentNum2, currentQuestionType);
      Swal.fire({
        icon: 'error',
        title: 'Salah!',
        html: `
                    <p>Jawaban Anda salah.</p>
                    ${solutionHtml}
                `,
        confirmButtonText: 'Lanjutkan' // Allow user to close manually after reading solution
      }).then(() => {
        resetGame(); // Reset game jika salah
      });
    }
  }
  
  // Fungsi untuk memulai timer
  function startTimer() {
    timeLeft = 60;
    timerEl.textContent = `Waktu: ${timeLeft}`;
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `Waktu: ${timeLeft}`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        const solutionHtml = getSolutionSteps(currentNum1, currentNum2, currentQuestionType);
        Swal.fire({
          icon: 'warning',
          title: 'Waktu Habis!',
          html: `
                        <p>Waktu Anda habis.</p>
                        ${solutionHtml}
                    `,
          confirmButtonText: 'Lanjutkan' // Allow user to close manually after reading solution
        }).then(() => {
          resetGame(); // Reset game jika waktu habis
        });
      }
    }, 1000);
  }
  
  // Fungsi untuk memulai ronde baru
  function startNewRound() {
    generateQuestion();
    startTimer();
  }
  
  // Fungsi untuk memulai game
  function startGame() {
    score = 0;
    scoreEl.textContent = `Skor: ${score}`;
    gameRunning = true;
    startButton.style.display = 'none'; // Sembunyikan tombol start
    gameArea.style.display = 'block'; // Tampilkan area game (animasi CSS akan menangani fade/slide)
    startNewRound();
  }
  
  // Fungsi untuk mereset game
  function resetGame() {
    clearInterval(timer);
    gameRunning = false;
    startButton.style.display = 'block'; // Tampilkan tombol start
    gameArea.style.display = 'none'; // Sembunyikan area game
    timeLeft = 60;
    timerEl.textContent = `Waktu: ${timeLeft}`;
  }
  
  // Event listener untuk tombol "Mulai Game"
  startButton.addEventListener('click', startGame);
});