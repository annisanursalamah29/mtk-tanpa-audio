let num1, den1, num2, den2, integer, correctAnswer, choices;
let timeLeft = 30;
let timerInterval;
let currentOperation = 'fraction_plus'; // Default operation
let score = 0;

// Cache DOM elements
const answerContainer = document.getElementById('answers');
const pesanPecahan = document.getElementById('pesan-pecahan');
const skorPecahan = document.getElementById('skor-pecahan');
const timerDisplay = document.getElementById('timer');
const questionDisplay = document.getElementById('question'); // Dapatkan elemen pertanyaan

// Seleksi semua tombol menu
const menuButtons = document.querySelectorAll('.menu-button');

// Fungsi untuk mengatur tombol menu yang aktif secara visual
function setActiveMenuButton(selectedButton) {
    menuButtons.forEach(button => {
        button.classList.remove('active');
    });
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Mengatur operasi matematika yang akan digunakan dan memulai pertanyaan baru
function setOperation(operation) {
    currentOperation = operation;
    // Temukan tombol yang sesuai dengan operasi dan atur sebagai aktif
    const correspondingButton = document.querySelector(`[data-operation="${operation}"]`);
    setActiveMenuButton(correspondingButton);
    generateQuestion();
}

// Memperbarui tampilan skor di halaman
function updateScoreDisplay() {
    skorPecahan.innerText = score;
}

// Objek yang memetakan jenis operasi ke fungsi generator pertanyaan dan jawaban
const operationHandlers = {
    fraction_plus: {
        question: () => {
            num2 = Math.floor(Math.random() * 9) + 1;
            den2 = Math.floor(Math.random() * 9) + 2;
            return `${num1}/${den1} + ${num2}/${den2} = ?`;
        },
        choices: () => generateFractionChoices(num1, den1, num2, den2, '+')
    },
    fraction_minus: {
        question: () => {
            num2 = Math.floor(Math.random() * 9) + 1;
            den2 = Math.floor(Math.random() * 9) + 2;
            if ((num1 / den1) < (num2 / den2)) {
                [num1, num2] = [num2, num1];
                [den1, den2] = [den2, den1];
            }
            return `${num1}/${den1} - ${num2}/${den2} = ?`;
        },
        choices: () => generateFractionChoices(num1, den1, num2, den2, '-')
    },
    fraction_multiply: {
        question: () => {
            num2 = Math.floor(Math.random() * 9) + 1;
            den2 = Math.floor(Math.random() * 9) + 2;
            return `${num1}/${den1} × ${num2}/${den2} = ?`;
        },
        choices: () => generateFractionChoices(num1, den1, num2, den2, '×')
    },
    fraction_divide: {
        question: () => {
            num2 = Math.floor(Math.random() * 9) + 1;
            den2 = Math.floor(Math.random() * 9) + 2;
            return `${num1}/${den1} : ${num2}/${den2} = ?`;
        },
        choices: () => generateFractionChoices(num1, den1, num2, den2, ':')
    },
    decimal: {
        question: () => {
            generateDecimalInput();
            correctAnswer = parseFloat((num1 / den1).toFixed(2));
            return `${num1}/${den1} = ...`;
        },
        choices: () => { } // Tidak ada pilihan untuk desimal, menggunakan input
    },
    integer_plus: {
        question: () => {
            integer = Math.floor(Math.random() * 10) + 1;
            return `${num1}/${den1} + ${integer} = ?`;
        },
        choices: () => generateFractionChoicesWithInteger(num1, den1, integer, '+')
    },
    integer_minus: {
        question: () => {
            integer = Math.floor(Math.random() * 10) + 1;
            if (num1 < (integer * den1)) {
                num1 = integer * den1 + Math.floor(Math.random() * 9) + 1;
            }
            return `${num1}/${den1} - ${integer} = ?`;
        },
        choices: () => generateFractionChoicesWithInteger(num1, den1, integer, '-')
    },
    integer_multiply: {
        question: () => {
            integer = Math.floor(Math.random() * 10) + 1;
            return `${num1}/${den1} × ${integer} = ?`;
        },
        choices: () => generateFractionChoicesWithInteger(num1, den1, integer, '×')
    },
    integer_divide: {
        question: () => {
            integer = Math.floor(Math.random() * 9) + 1;
            return `${num1}/${den1} : ${integer} = ?`;
        },
        choices: () => generateFractionChoicesWithInteger(num1, den1, integer, ':')
    },
};

// Menghasilkan pertanyaan baru berdasarkan `currentOperation`.
// Membersihkan container jawaban, mereset timer, dan memperbarui skor.
function generateQuestion() {
    answerContainer.innerHTML = '';
    num1 = Math.floor(Math.random() * 9) + 1;
    den1 = Math.floor(Math.random() * 9) + 2;

    const handler = operationHandlers[currentOperation];
    if (handler) {
        questionDisplay.innerText = handler.question(); // Gunakan questionDisplay
        handler.choices(); // Panggil fungsi untuk menghasilkan pilihan jika ada
    }

    timeLeft = 30;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    pesanPecahan.innerText = '';
    pesanPecahan.className = '';
    updateScoreDisplay();
    // setActiveButton('btn-' + currentOperation.replace(/_/g, '-')); // Dihapus karena sudah dipanggil di setOperation
}

// Menghasilkan pilihan jawaban berbentuk pecahan.
function generateFractionChoices(n1, d1, n2, d2, operator) {
    let resultNum, resultDen;
    if (operator === '+') {
        resultNum = (n1 * d2) + (n2 * d1);
        resultDen = d1 * d2;
    } else if (operator === '-') {
        resultNum = (n1 * d2) - (n2 * d1);
        resultDen = d1 * d2;
    } else if (operator === '×') {
        resultNum = n1 * n2;
        resultDen = d1 * d2;
    } else if (operator === ':') {
        resultNum = n1 * d2;
        resultDen = d1 * n2;
    }
    correctAnswer = simplifyFraction(resultNum, resultDen);
    choices = [correctAnswer];
    while (choices.length < 4) {
        const randomNum = Math.floor(Math.random() * 30) + 1;
        const randomDen = Math.floor(Math.random() * 15) + 2;
        const randomFraction = simplifyFraction(randomNum, randomDen);
        if (!choices.some(choice => choice.num === randomFraction.num && choice.den === randomFraction.den) &&
            !(randomFraction.num === correctAnswer.num && randomFraction.den === correctAnswer.den)) {
            choices.push(randomFraction);
        }
    }
    shuffleArray(choices);

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = `${choice.num}/${choice.den}`;
        button.onclick = function () { checkAnswerFraction(this); };
        answerContainer.appendChild(button);
    });
}

// Menghasilkan pilihan jawaban berbentuk pecahan untuk operasi pecahan dengan bilangan bulat.
function generateFractionChoicesWithInteger(n1, d1, intVal, operator) {
    let resultNum, resultDen;
    if (operator === '+') {
        resultNum = n1 + (intVal * d1);
        resultDen = d1;
    } else if (operator === '-') {
        resultNum = n1 - (intVal * d1);
        resultDen = d1;
    } else if (operator === '×') {
        resultNum = n1 * intVal;
        resultDen = d1;
    } else if (operator === ':') {
        resultNum = n1;
        resultDen = d1 * intVal;
    }
    correctAnswer = simplifyFraction(resultNum, resultDen);
    choices = [correctAnswer];
    while (choices.length < 4) {
        const randomNum = Math.floor(Math.random() * 30) + 1;
        const randomDen = Math.floor(Math.random() * 15) + 2;
        const randomFraction = simplifyFraction(randomNum, randomDen);
        if (!choices.some(choice => choice.num === randomFraction.num && choice.den === randomFraction.den) &&
            !(randomFraction.num === correctAnswer.num && randomFraction.den === correctAnswer.den)) {
            choices.push(randomFraction);
        }
    }
    shuffleArray(choices);

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = `${choice.num}/${choice.den}`;
        button.onclick = function () { checkAnswerFraction(this); };
        answerContainer.appendChild(button);
    });
}

// Menghasilkan elemen input untuk jawaban desimal.
function generateDecimalInput() {
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.01';
    input.id = 'decimalAnswer';
    input.placeholder = 'Masukkan jawaban (mis: 0.50)';
    answerContainer.appendChild(input);

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Jawab';
    submitButton.onclick = checkAnswerDecimal;
    answerContainer.appendChild(submitButton);

    input.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            checkAnswerDecimal();
        }
    });
    input.focus();
}

// Menyederhanakan pecahan.
function simplifyFraction(num, den) {
    if (den === 0) return { num: num, den: 0 };
    if (num === 0) return { num: 0, den: 1 };

    const gcd = findGCD(Math.abs(num), Math.abs(den));
    let simplifiedNum = num / gcd;
    let simplifiedDen = den / gcd;

    if (simplifiedDen < 0) {
        simplifiedNum *= -1;
        simplifiedDen *= -1;
    }

    return { num: simplifiedNum, den: simplifiedDen };
}

// Menemukan greatest common divisor (GCD) dari dua angka menggunakan algoritma Euclidean.
function findGCD(a, b) {
    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Mengacak urutan elemen dalam array.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Memperbarui waktu yang tersisa setiap detik.
// Jika waktu habis, hentikan timer dan tampilkan hasil timeout.
function updateTimer() {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showTimeoutResult();
    }
}

// Memperbarui teks tampilan timer di halaman.
function updateTimerDisplay() {
    timerDisplay.innerText = `Waktu: ${timeLeft} detik`;
}

// Fungsi untuk menandai elemen jawaban dengan kelas 'correct' atau 'wrong'.
function markAnswerElement(element, isCorrect) {
    element.classList.remove('correct', 'wrong');
    element.classList.add(isCorrect ? 'correct' : 'wrong');
}

// Memeriksa jawaban pecahan yang dipilih oleh pengguna.
// Memberikan feedback visual dan teks, lalu memulai pertanyaan baru setelah jeda.
function checkAnswerFraction(selectedButton) {
    clearInterval(timerInterval);

    const userAnswerText = selectedButton.innerText.split('/');
    const userAnswer = { num: parseInt(userAnswerText[0]), den: parseInt(userAnswerText[1]) };

    const isCorrect = (userAnswer.num === correctAnswer.num && userAnswer.den === correctAnswer.den);

    const allButtons = answerContainer.querySelectorAll('button');
    allButtons.forEach(btn => btn.classList.remove('correct', 'wrong')); // Hapus kelas sebelumnya dari semua tombol

    markAnswerElement(selectedButton, isCorrect); // Tandai tombol yang dipilih

    if (isCorrect) {
        pesanPecahan.innerText = "Benar!";
        pesanPecahan.className = 'correct-text';
        score++;
        updateScoreDisplay();
    } else {
        pesanPecahan.innerText = `Salah! Jawaban adalah ${correctAnswer.num}/${correctAnswer.den}.`;
        pesanPecahan.className = 'wrong-text';
        // Tandai jawaban yang benar
        allButtons.forEach(btn => {
            const btnText = btn.innerText.split('/');
            const btnAnswer = { num: parseInt(btnText[0]), den: parseInt(btnText[1]) };
            if (btnAnswer.num === correctAnswer.num && btnAnswer.den === correctAnswer.den) {
                markAnswerElement(btn, true);
            }
        });
    }

    setTimeout(generateQuestion, 4000);
}

// Memeriksa jawaban desimal yang dimasukkan oleh pengguna.
// Memberikan feedback visual dan teks, lalu memulai pertanyaan baru setelah jeda.
function checkAnswerDecimal() {
    clearInterval(timerInterval);

    const decimalInput = document.getElementById('decimalAnswer');
    const userAnswer = parseFloat(decimalInput.value);

    const isCorrect = (Math.abs(userAnswer - correctAnswer) < 0.005); // Toleransi 0.005 untuk pembulatan

    markAnswerElement(decimalInput, isCorrect); // Tandai input

    if (isCorrect) {
        pesanPecahan.innerText = "Benar!";
        pesanPecahan.className = 'correct-text';
        score++;
        updateScoreDisplay();
    } else {
        pesanPecahan.innerText = `Salah! Jawaban adalah ${correctAnswer.toFixed(2)}.`;
        pesanPecahan.className = 'wrong-text';
    }

    setTimeout(generateQuestion, 4000);
}

// Menampilkan hasil ketika waktu habis.
// Memberikan feedback visual dan teks, lalu memulai pertanyaan baru setelah jeda.
function showTimeoutResult() {
    clearInterval(timerInterval);
    pesanPecahan.innerText = `Waktu Habis! `;
    pesanPecahan.className = 'wrong-text';

    if (currentOperation === 'decimal') {
        pesanPecahan.innerText += `Jawaban ${correctAnswer.toFixed(2)}.`;
        const decimalInput = document.getElementById('decimalAnswer');
        if (decimalInput) {
            markAnswerElement(decimalInput, false); // Input dianggap salah jika waktu habis
            decimalInput.value = correctAnswer.toFixed(2); // Tampilkan jawaban yang benar
        }
    } else {
        pesanPecahan.innerText += `Jawaban ${correctAnswer.num}/${correctAnswer.den}.`;
        const answerButtons = answerContainer.querySelectorAll('button');
        answerButtons.forEach(button => {
            const buttonText = button.innerText.split('/');
            const buttonAnswer = { num: parseInt(buttonText[0]), den: parseInt(buttonText[1]) };
            const isCorrectButton = (buttonAnswer.num === correctAnswer.num && buttonAnswer.den === correctAnswer.den);
            markAnswerElement(button, isCorrectButton);
        });
    }
    setTimeout(generateQuestion, 4000);
}

// Inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan event listener ke setiap tombol menu
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operation = button.dataset.operation; // Ambil operasi dari data-operation
            if (operation) {
                setOperation(operation);
            }
        });
    });


    // Set operasi awal dan tampilkan soal pertama
    setOperation(currentOperation); // Ini akan memanggil generateQuestion() dan setActiveMenuButton()
    updateScoreDisplay();
});