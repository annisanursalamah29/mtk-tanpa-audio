const conversionRates = {
  yearToMonth: { baseUnit: "tahun", targetUnit: "bulan", rate: 12, minAmount: 1, maxAmount: 10 },
  yearToWeek: { baseUnit: "tahun", targetUnit: "minggu", rate: 52, minAmount: 1, maxAmount: 10 }, // sekitar 52 minggu
  yearToDay: { baseUnit: "tahun", targetUnit: "hari", rate: 365, minAmount: 1, maxAmount: 10 }, // non-kabisat
  monthToWeek: { baseUnit: "bulan", targetUnit: "minggu", rate: 4, minAmount: 2, maxAmount: 10 }, // sekitar 4 minggu
  monthToDay: { baseUnit: "bulan", targetUnit: "hari", rate: 30, minAmount: 2, maxAmount: 10 }, // rata-rata 30 hari
  weekToDay: { baseUnit: "minggu", targetUnit: "hari", rate: 7, minAmount: 2, maxAmount: 15 },
  dayToHour: { baseUnit: "hari", targetUnit: "jam", rate: 24, minAmount: 2, maxAmount: 15 },
  hourToMinute: { baseUnit: "jam", targetUnit: "menit", rate: 60, minAmount: 2, maxAmount: 10 },
  minuteToSecond: { baseUnit: "menit", targetUnit: "detik", rate: 60, minAmount: 2, maxAmount: 10 },
  hourToSecond: { baseUnit: "jam", targetUnit: "detik", rate: 3600, minAmount: 1, maxAmount: 13 }
};

let currentQuestionType = '';
let score = 0;
let countdownInterval;
const COUNTDOWN_TIME = 60; // Detik
let timeLeft = COUNTDOWN_TIME;
let selectedChoice = null;
let gameStarted = false;

// Variabel untuk menyimpan detail pertanyaan yang sedang aktif
let currentQuestionAmount = 0; // Jumlah acak yang digunakan dalam pertanyaan (misal: 3 tahun)
let currentCorrectAnswer = 0; // Jawaban yang benar (misal: 36 bulan)
let currentTargetUnit = ''; // Unit target (misal: "bulan")

const menuDiv = document.getElementById('menu');
const gameDiv = document.getElementById('game');
const resultDiv = document.getElementById('result');
const questionElement = document.getElementById('question');
const choicesDiv = document.getElementById('choices');
const countdownElement = document.getElementById('countdown');
const scoreElement = document.getElementById('score');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const correctAnswerDisplay = document.getElementById('correctAnswerDisplay');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateRandomQuestion(type) {
  const conversionData = conversionRates[type];
  if (!conversionData) {
    console.error("Jenis pertanyaan tidak ditemukan:", type);
    return null;
  }
  
  const amount = Math.floor(Math.random() * (conversionData.maxAmount - conversionData.minAmount + 1)) + conversionData.minAmount;
  
  const questionText = `Berapa ${conversionData.targetUnit} dalam ${amount} ${conversionData.baseUnit}?`;
  const correctAnswer = amount * conversionData.rate;
  
  return {
    question: questionText,
    answer: correctAnswer,
    unit: conversionData.targetUnit,
    amount: amount // Simpan jumlah yang dipakai dalam pertanyaan
  };
}


function generateChoices(correctAnswer, unit) {
  const choices = new Set();
  choices.add(correctAnswer);
  
  while (choices.size < 4) {
    let randomChoice;
    const deviation = Math.floor(Math.random() * 15) + 1; // Deviasi 1 hingga 10
    if (Math.random() < 0.5) {
      randomChoice = correctAnswer + deviation * (Math.random() < 0.5 ? 1 : -1);
    } else {
      randomChoice = correctAnswer + Math.floor(Math.random() * (correctAnswer * 0.2)) * (Math.random() < 0.5 ? 1 : -1);
    }
    
    if (randomChoice <= 0 || choices.has(Math.max(1, Math.round(randomChoice)))) {
      randomChoice = correctAnswer + Math.floor(Math.random() * 5) + 1; // Tambahkan angka positif kecil
    }
    choices.add(Math.max(1, Math.round(randomChoice))); // Pastikan tidak kurang dari 1
  }
  
  return shuffleArray(Array.from(choices).map(choice => `${choice} ${unit}`));
}

function displayQuestion() {
  clearInterval(countdownInterval);
  timeLeft = COUNTDOWN_TIME;
  countdownElement.textContent = `Waktu: ${timeLeft} detik`;
  
  const generatedQData = generateRandomQuestion(currentQuestionType);
  if (!generatedQData) {
    resetGame();
    return;
  }
  
  // Simpan detail pertanyaan yang aktif secara global
  currentQuestionAmount = generatedQData.amount;
  currentCorrectAnswer = generatedQData.answer;
  currentTargetUnit = generatedQData.unit;
  
  questionElement.textContent = generatedQData.question;
  choicesDiv.innerHTML = '';
  selectedChoice = null;
  
  const generatedChoices = generateChoices(currentCorrectAnswer, currentTargetUnit);
  
  generatedChoices.forEach(choiceText => {
    const button = document.createElement('button');
    button.classList.add('choice-btn');
    button.textContent = choiceText;
    button.onclick = () => selectChoice(button, choiceText, currentCorrectAnswer, currentTargetUnit);
    choicesDiv.appendChild(button);
  });
  
  startCountdown();
}

function selectChoice(button, choiceText, correctAnswer, unit) {
  if (selectedChoice) {
    const prevSelectedButton = document.querySelector('.choice-btn.selected');
    if (prevSelectedButton) {
      prevSelectedButton.classList.remove('selected');
    }
  }
  selectedChoice = button;
  selectedChoice.classList.add('selected');
  checkAnswer(choiceText, correctAnswer, unit);
}

// Fungsi helper untuk menandai jawaban yang benar
function highlightCorrectAnswerButton(correctAnswerValue) {
  const allChoiceButtons = choicesDiv.querySelectorAll('.choice-btn');
  allChoiceButtons.forEach(btn => {
    const btnValue = parseInt(btn.textContent.split(' ')[0]);
    if (btnValue === correctAnswerValue) {
      btn.classList.add('correct');
    } else {
      btn.classList.remove('incorrect'); // Pastikan tombol lain tidak memiliki kelas incorrect
    }
  });
}

// Fungsi untuk menghasilkan teks proses pengerjaan
function getConversionExplanation(amount, questionType, correctAnswer, targetUnit) {
  const conversionData = conversionRates[questionType];
  if (!conversionData) return "Tidak dapat menampilkan proses konversi.";
  
  const { baseUnit, rate } = conversionData;
  
  let explanation = `Untuk menghitung ${targetUnit} dari ${amount} ${baseUnit}, Anda perlu mengalikan jumlah ${baseUnit} (${amount}) dengan rasio konversi (${rate}, karena 1 ${baseUnit} = ${rate} ${targetUnit}).<br>`;
  explanation += `Jadi, ${amount} x ${rate} = ${correctAnswer} ${targetUnit}.`;
  return explanation;
}


function checkAnswer(selectedAnswerText, correctAnswerValue, unit) {
  clearInterval(countdownInterval);
  const allChoiceButtons = choicesDiv.querySelectorAll('.choice-btn');
  allChoiceButtons.forEach(btn => btn.onclick = null);
  
  const selectedAnswerNumber = parseInt(selectedAnswerText.split(' ')[0]);
  
  if (selectedAnswerNumber === correctAnswerValue) {
    selectedChoice.classList.remove('selected');
    selectedChoice.classList.add('correct');
    score++;
    scoreElement.textContent = `Skor: ${score}`;
    
    Swal.fire({
      title: 'Benar!',
      text: 'Jawaban Anda tepat.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    }).then(() => {
      highlightCorrectAnswerButton(correctAnswerValue);
    });
    
  } else {
    selectedChoice.classList.remove('selected');
    selectedChoice.classList.add('incorrect');
    
    // Dapatkan teks proses pengerjaan
    const explanationText = getConversionExplanation(currentQuestionAmount, currentQuestionType, correctAnswerValue, unit);
    
    Swal.fire({
      title: 'Salah!',
      html: `Jawaban yang benar adalah: <strong>${correctAnswerValue} ${unit}</strong>.<br><br>${explanationText}`, // Gunakan 'html' untuk mendukung tag HTML seperti <br> dan <strong>
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'Oke'
    }).then(() => {
      highlightCorrectAnswerButton(correctAnswerValue);
    });
  }
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = `Waktu: ${timeLeft} detik`;
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      showResult(); // Panggil showResult saat waktu habis
    }
  }, 1000);
}

function showResult() {
  gameDiv.style.display = 'none'; // Sembunyikan div permainan
  resultDiv.style.display = 'block'; // Tampilkan div hasil langsung
  
  // Dapatkan teks proses pengerjaan untuk jawaban yang benar
  const explanationText = getConversionExplanation(currentQuestionAmount, currentQuestionType, currentCorrectAnswer, currentTargetUnit);
  
  // Tampilkan jawaban yang benar dan proses pengerjaannya di dalam elemen correctAnswerDisplay
  // Gunakan innerHTML untuk mendukung tag HTML seperti <br> dan <strong>
  correctAnswerDisplay.innerHTML = `Jawaban yang benar adalah: <strong>${currentCorrectAnswer} ${currentTargetUnit}</strong>.<br><br>${explanationText}`;
  
  // Pastikan tombol 'Main Lagi' mengarah ke startGame(currentQuestionType)
  document.querySelector('#result button').onclick = () => startGame(currentQuestionType);
}

function startGame(type) {
  currentQuestionType = type;
  menuDiv.style.display = 'none';
  gameDiv.style.display = 'block';
  resultDiv.style.display = 'none';
  gameStarted = true;
  score = 0;
  scoreElement.textContent = `Skor: ${score}`;
  displayQuestion();
}

function nextQuestion() {
  displayQuestion();
}

function resetGame() {
  clearInterval(countdownInterval);
  menuDiv.style.display = 'flex';
  gameDiv.style.display = 'none';
  resultDiv.style.display = 'none';
  score = 0;
  scoreElement.textContent = `Skor: ${score}`;
  gameStarted = false;
}

resetGame();