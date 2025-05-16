const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const feedbackEl = document.getElementById('feedback');

let score = 0;
let timer;
let timeLeft = 60;
let currentQuestion = {};
let gameActive = false;

const conversions = [
  { unit1: 'kg', unit2: 'gram', factor: 1000, questionTemplate: (num) => `${num} kg berapa gram?`, explanation: (num, ans) => `${num} kg = ${num} x 1000 gram = ${ans} gram` },
  { unit1: 'gram', unit2: 'kg', factor: 0.001, questionTemplate: (num) => `${num} gram berapa kg?`, explanation: (num, ans) => `${num} gram = ${num} / 1000 kg = ${ans} kg` },
  { unit1: 'kw', unit2: 'ton', factor: 0.1, questionTemplate: (num) => `${num} kuintal berapa ton?`, explanation: (num, ans) => `${num} kuintal = ${num} / 10 ton = ${ans} ton` },
  { unit1: 'ton', unit2: 'kw', factor: 10, questionTemplate: (num) => `${num} ton berapa kuintal?`, explanation: (num, ans) => `${num} ton = ${num} x 10 kuintal = ${ans} kuintal` },
  { unit1: 'pon', unit2: 'kg', factor: 0.453592, questionTemplate: (num) => `${num} pon berapa kg?`, explanation: (num, ans) => `${num} pon = ${num} x 0.453592 kg = ${ans} kg` },
  { unit1: 'kg', unit2: 'pon', factor: 2.20462, questionTemplate: (num) => `${num} kg berapa pon?`, explanation: (num, ans) => `${num} kg = ${num} x 2.20462 pon = ${ans} pon` },
  { unit1: 'miligram', unit2: 'gram', factor: 0.001, questionTemplate: (num) => `${num} miligram berapa gram?`, explanation: (num, ans) => `${num} miligram = ${num} / 1000 gram = ${ans} gram` },
  { unit1: 'gram', unit2: 'miligram', factor: 1000, questionTemplate: (num) => `${num} gram berapa miligram?`, explanation: (num, ans) => `${num} gram = ${num} x 1000 miligram = ${ans} miligram` },
  { unit1: 'hektogram', unit2: 'kg', factor: 0.1, questionTemplate: (num) => `${num} hektogram berapa kg?`, explanation: (num, ans) => `${num} hektogram = ${num} / 10 kg = ${ans} kg` },
  { unit1: 'kg', unit2: 'hektogram', factor: 10, questionTemplate: (num) => `${num} kg berapa hektogram?`, explanation: (num, ans) => `${num} kg = ${num} x 10 hektogram = ${ans} hektogram` },
];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const conversionType = conversions[Math.floor(Math.random() * conversions.length)];
  const num = getRandomNumber(1, 100); // Angka untuk dikonversi
  
  let actualAnswer = num * conversionType.factor;
  // Pembulatan untuk jawaban, terutama untuk desimal
  if (conversionType.factor < 1 && conversionType.factor > 0) {
    actualAnswer = parseFloat(actualAnswer.toFixed(3)); // Pembulatan 3 angka desimal
  } else {
    actualAnswer = Math.round(actualAnswer);
  }
  
  currentQuestion = {
    num: num, // Tambahkan angka awal ke currentQuestion untuk penjelasan
    conversionType: conversionType, // Simpan objek konversi untuk penjelasan
    question: conversionType.questionTemplate(num),
    correctAnswer: actualAnswer,
    unit2: conversionType.unit2
  };
  
  questionEl.textContent = currentQuestion.question;
  generateOptions(actualAnswer, conversionType.unit2);
}

function getExplanation(num, conversionType, correctAnswer) {
  if (conversionType && conversionType.explanation) {
    return conversionType.explanation(num, correctAnswer);
  }
  return `Penjelasan tidak tersedia untuk konversi ini. Jawaban yang benar adalah ${correctAnswer} ${currentQuestion.unit2}.`;
}

function generateOptions(correctAnswer, unit) {
  optionsContainer.innerHTML = '';
  const options = [];
  options.push(correctAnswer); // Tambahkan jawaban benar
  
  // Tambahkan 3 jawaban salah
  while (options.length < 4) {
    let wrongAnswer;
    let variation = getRandomNumber(-50, 50); // Variasi untuk jawaban salah
    if (correctAnswer < 10) { // Untuk angka kecil, variasi lebih kecil
      variation = getRandomNumber(-5, 5);
    }
    wrongAnswer = parseFloat((correctAnswer + variation).toFixed(3)); // Pembulatan
    
    if (wrongAnswer <= 0) wrongAnswer = getRandomNumber(1, 10); // Hindari jawaban negatif/nol
    
    if (!options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  // Acak urutan pilihan
  options.sort(() => Math.random() - 0.5);
  
  options.forEach(option => {
    const button = document.createElement('button');
    button.classList.add('option-button');
    button.textContent = `${option} ${unit}`;
    button.addEventListener('click', () => checkAnswer(option));
    optionsContainer.appendChild(button);
  });
}

async function checkAnswer(selectedAnswer) {
  if (!gameActive) return; // Jangan proses jawaban jika game tidak aktif
  
  clearInterval(timer); // Hentikan timer
  disableOptions(); // Nonaktifkan tombol pilihan
  
  if (selectedAnswer === currentQuestion.correctAnswer) {
    score++;
    feedbackEl.textContent = "Benar!";
    feedbackEl.classList.remove('incorrect');
    feedbackEl.classList.add('correct');
    setTimeout(() => {
      if (gameActive) { // Lanjut ke pertanyaan berikutnya jika game masih aktif
        nextQuestion();
      }
    }, 1000); // Tunggu 1 detik sebelum pertanyaan berikutnya
  } else {
    const explanation = getExplanation(currentQuestion.num, currentQuestion.conversionType, currentQuestion.correctAnswer);
    feedbackEl.textContent = `Salah! Jawaban yang benar adalah ${currentQuestion.correctAnswer} ${currentQuestion.unit2}.`;
    feedbackEl.classList.remove('correct');
    feedbackEl.classList.add('incorrect');
    
    await Swal.fire({
      icon: 'error',
      title: 'Jawaban Salah!',
      html: `<p>Jawaban yang benar adalah: <strong>${currentQuestion.correctAnswer} ${currentQuestion.unit2}</strong></p><p><strong>Penjelasan:</strong> ${explanation}</p>`,
      confirmButtonText: 'Lanjut'
    });
    
    if (gameActive) {
      nextQuestion();
    }
  }
  scoreEl.textContent = score;
}

function startGame() {
  score = 0;
  scoreEl.textContent = score;
  startButton.disabled = true;
  feedbackEl.textContent = '';
  gameActive = true;
  nextQuestion();
}

function nextQuestion() {
  if (!gameActive) return; // Jangan lanjut jika game tidak aktif
  
  timeLeft = 60;
  timerEl.textContent = timeLeft;
  feedbackEl.textContent = '';
  generateQuestion();
  startTimer();
  enableOptions(); // Aktifkan kembali tombol pilihan
}

async function startTimer() {
  clearInterval(timer); // Pastikan timer sebelumnya dihentikan
  timer = setInterval(async () => { // Tambahkan async di sini
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      const explanation = getExplanation(currentQuestion.num, currentQuestion.conversionType, currentQuestion.correctAnswer);
      feedbackEl.textContent = `Waktu habis! Jawaban yang benar adalah ${currentQuestion.correctAnswer} ${currentQuestion.unit2}.`;
      feedbackEl.classList.remove('correct');
      feedbackEl.classList.add('incorrect');
      disableOptions();
      
      await Swal.fire({
        icon: 'warning',
        title: 'Waktu Habis!',
        html: `<p>Jawaban yang benar adalah: <strong>${currentQuestion.correctAnswer} ${currentQuestion.unit2}</strong></p><p><strong>Penjelasan:</strong> ${explanation}</p>`,
        confirmButtonText: 'Lanjut'
      });
      
      if (gameActive) {
        nextQuestion();
      }
    }
  }, 1000);
}

function disableOptions() {
  const buttons = optionsContainer.querySelectorAll('.option-button');
  buttons.forEach(button => {
    button.disabled = true;
  });
}

function enableOptions() {
  const buttons = optionsContainer.querySelectorAll('.option-button');
  buttons.forEach(button => {
    button.disabled = false;
  });
}

// Event Listener
startButton.addEventListener('click', startGame);

// Inisialisasi tampilan awal
questionEl.textContent = "Klik 'Mulai Game' untuk memulai!";
disableOptions(); // Pastikan pilihan tidak aktif sebelum game dimulai