document.addEventListener('DOMContentLoaded', () => {
    const romawiToAngkaBtn = document.getElementById('romawi-to-angka-btn');
    const angkaToRomawiBtn = document.getElementById('angka-to-romawi-btn');
    const mainMenu = document.getElementById('main-menu');
    const gameSection = document.getElementById('game-section');
    const questionTypeDisplay = document.getElementById('question-type');
    const questionDisplay = document.getElementById('question-display');
    const optionsContainer = document.getElementById('options-container');
    const timerDisplay = document.getElementById('timer-display');
    const resultDisplay = document.getElementById('result-display');
    const scoreDisplay = document.getElementById('score-display');
    
    // Deklarasi ulang tombol "Kembali ke Menu"
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    
    let currentMode = '';
    let score = 0;
    let timer;
    let timeLeft = 30;
    let correctAnswer = '';
    let questionAnswerMap = {};
    let autoProceedTimer; // Timer baru untuk otomatis lanjut
    
    const romanNumerals = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    
    const romanKeys = Object.keys(romanNumerals);
    const romanValues = Object.values(romanNumerals);
    
    function romanToArabic(roman) {
        let result = 0;
        let i = 0;
        while (i < roman.length) {
            if (i + 1 < roman.length && romanNumerals[roman.substring(i, i + 2)]) {
                result += romanNumerals[roman.substring(i, i + 2)];
                i += 2;
            } else {
                result += romanNumerals[roman.substring(i, i + 1)];
                i += 1;
            }
        }
        return result;
    }
    
    function arabicToRoman(num) {
        let result = '';
        for (const key of romanKeys) {
            while (num >= romanNumerals[key]) {
                result += key;
                num -= romanNumerals[key];
            }
        }
        return result;
    }
    
    function getRandomRoman(min, max) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        return arabicToRoman(num);
    }
    
    function getRandomArabic(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function generateRomawiToAngkaQuestion() {
        const question = getRandomRoman(1, 1000);
        const answer = romanToArabic(question);
        return { question, answer };
    }
    
    function generateAngkaToRomawiQuestion() {
        const question = getRandomArabic(1, 1000);
        const answer = arabicToRoman(question);
        return { question, answer };
    }
    
    function generateOptions(correctAnswer, mode) {
        const options = new Set();
        options.add(correctAnswer);
        
        while (options.size < 4) {
            let randomOption;
            if (mode === 'romawiToAngka') {
                randomOption = getRandomArabic(Math.max(1, correctAnswer - 50), correctAnswer + 50);
                // Pastikan angka yang dihasilkan memiliki representasi Romawi yang valid
                if (romanToArabic(arabicToRoman(randomOption)) !== randomOption) {
                    continue;
                }
            } else {
                randomOption = getRandomRoman(Math.max(1, romanToArabic(correctAnswer) - 50), romanToArabic(correctAnswer) + 50);
            }
            options.add(randomOption);
        }
        
        return Array.from(options).sort(() => Math.random() - 0.5);
    }
    
    function startTimer() {
        timeLeft = 30;
        timerDisplay.textContent = `Waktu: ${timeLeft} detik`;
        resultDisplay.textContent = '';
        clearInterval(timer);
        clearTimeout(autoProceedTimer); // Hapus timer otomatis lanjut jika ada
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Waktu: ${timeLeft} detik`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleAnswer(null);
            }
        }, 1000);
    }
    
    function displayQuestion() {
        resetGameDisplay();
        let questionData;
        if (currentMode === 'romawiToAngka') {
            questionTypeDisplay.textContent = 'Desimal yang Mana ya ?';
            questionData = generateRomawiToAngkaQuestion();
        } else {
            questionTypeDisplay.textContent = 'Romawi yang Mana ya?';
            questionData = generateAngkaToRomawiQuestion();
        }
        
        questionDisplay.textContent = questionData.question;
        correctAnswer = questionData.answer;
        questionAnswerMap = { question: questionData.question, answer: questionData.answer };
        
        const options = generateOptions(correctAnswer, currentMode);
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(option));
            optionsContainer.appendChild(button);
        });
        
        startTimer();
    }
    
    function handleAnswer(selectedOption) {
        clearInterval(timer);
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => btn.disabled = true);
        
        if (selectedOption === correctAnswer) {
            resultDisplay.textContent = 'Benar!';
            resultDisplay.style.color = '#28a745';
            score += 10;
            const correctButton = Array.from(optionButtons).find(btn => btn.textContent == correctAnswer);
            if (correctButton) {
                correctButton.classList.add('correct');
            }
        } else {
            resultDisplay.textContent = `Salah! Jawaban yang benar ${correctAnswer}.`;
            resultDisplay.style.color = '#dc3545';
            const selectedButton = Array.from(optionButtons).find(btn => btn.textContent == selectedOption);
            if (selectedButton) {
                selectedButton.classList.add('incorrect');
            }
            const correctButton = Array.from(optionButtons).find(btn => btn.textContent == correctAnswer);
            if (correctButton) {
                correctButton.classList.add('correct');
            }
        }
        scoreDisplay.textContent = `Skor: ${score}`;
        
        // Mengatur timer untuk otomatis lanjut ke pertanyaan berikutnya
        // Ini akan membiarkan pengguna melihat hasilnya sebentar
        autoProceedTimer = setTimeout(() => {
            displayQuestion();
        }, 3000); // Lanjut setelah 3 detik
    }
    
    function resetGameDisplay() {
        resultDisplay.textContent = '';
        timerDisplay.textContent = 'Waktu: 30 detik';
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
        });
        optionsContainer.innerHTML = '';
    }
    
    romawiToAngkaBtn.addEventListener('click', () => {
        currentMode = 'romawiToAngka';
        mainMenu.classList.remove('active');
        gameSection.classList.add('active');
        score = 0;
        scoreDisplay.textContent = `Skor: ${score}`;
        displayQuestion();
    });
    
    angkaToRomawiBtn.addEventListener('click', () => {
        currentMode = 'angkaToRomawi';
        mainMenu.classList.remove('active');
        gameSection.classList.add('active');
        score = 0;
        scoreDisplay.textContent = `Skor: ${score}`;
        displayQuestion();
    });
    
    // Tambahkan event listener untuk tombol "Kembali ke Menu"
    backToMenuBtn.addEventListener('click', () => {
        clearInterval(timer); // Hentikan timer game
        clearTimeout(autoProceedTimer); // Hentikan timer otomatis lanjut jika ada
        gameSection.classList.remove('active'); // Sembunyikan game section
        mainMenu.classList.add('active'); // Tampilkan menu utama
        score = 0; // Reset skor
        scoreDisplay.textContent = `Skor: ${score}`;
        resetGameDisplay(); // Reset tampilan game
    });
}); // Akhir dari DOMContentLoaded