document.addEventListener('DOMContentLoaded', () => {
    const numberToFactorEl = document.getElementById('number-to-factor');
    const optionsContainer = document.getElementById('options-container');
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');

    let currentNumber = 0;
    let score = 0;
    let correctAnswer = '';
    let solutionSteps = []; // Variabel baru untuk menyimpan langkah-langkah penyelesaian
    
    let timeLeft = 30;
    let timerInterval;

    // --- Fungsi Bantuan Matematika ---

    function isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    // Modifikasi fungsi getPrimeFactorization
    function getPrimeFactorization(num) {
        if (num < 2) return { factors: [], steps: [] };

        let factors = [];
        let steps = [];
        let tempNum = num;
        let originalNum = num; // Simpan angka asli untuk langkah pertama

        steps.push(`Mulai dengan angka: ${originalNum}`);

        for (let i = 2; i <= tempNum; i++) {
            while (tempNum % i === 0) {
                factors.push(i);
                // Tambahkan langkah-langkah
                if (tempNum / i > 1) {
                    steps.push(`${tempNum} dibagi ${i} = ${tempNum / i}`);
                } else {
                    steps.push(`${tempNum} dibagi ${i} = ${tempNum / i} (selesai)`);
                }
                tempNum /= i;
            }
        }
        
        factors.sort((a, b) => a - b);
        steps.push(`Faktor prima yang ditemukan: ${factors.join(', ')}`);
        steps.push(`Faktorisasi prima: ${factors.join(' x ')}`);
        
        return { factors: factors, steps: steps };
    }

    function formatFactors(factors) {
        if (factors.length === 0) return 'Tidak ada faktor prima';
        return factors.join(' x ');
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateIncorrectFactorization(correctFactors, num) {
        let incorrectOptions = [];
        const correctStr = formatFactors(correctFactors);

        // Strategi 1: Tambahkan/kurangi satu faktor (jika memungkinkan)
        if (correctFactors.length > 0) {
            let tempFactors = [...correctFactors];
            // Coba hapus satu faktor
            if (tempFactors.length > 1) {
                tempFactors.pop();
                let newNum = tempFactors.reduce((acc, val) => acc * val, 1);
                if (newNum !== num) {
                    incorrectOptions.push(formatFactors(tempFactors));
                }
            }
            // Coba ganti satu faktor dengan angka acak yang bukan prima atau salah
            tempFactors = [...correctFactors];
            const randomIndex = Math.floor(Math.random() * tempFactors.length);
            const originalFactor = tempFactors[randomIndex];
            let newFactor = originalFactor;
            while (newFactor === originalFactor || isPrime(newFactor)) {
                newFactor = getRandomNumber(2, 10);
            }
            tempFactors[randomIndex] = newFactor;
            if (tempFactors.reduce((acc, val) => acc * val, 1) !== num) {
                 incorrectOptions.push(formatFactors(tempFactors.sort((a,b) => a-b)));
            }
        }

        // Strategi 2: Campurkan faktor dari angka lain yang dekat
        let randomNumNear = num + getRandomNumber(-5, 5);
        if (randomNumNear > 1 && randomNumNear !== num) {
             const randomNumFactors = getPrimeFactorization(randomNumNear).factors; // Ambil hanya factors
             const randomNumStr = formatFactors(randomNumFactors);
             if (randomNumStr !== correctStr && !incorrectOptions.includes(randomNumStr)) {
                 incorrectOptions.push(randomNumStr);
             }
        }

        // Strategi 3: Tambahkan angka non-prima di dalamnya (misal: "4 x 3" bukan "2 x 2 x 3")
        if (correctFactors.length > 0) {
            let nonPrimeFactorOption = [];
            let i = 0;
            if (correctFactors.length >= 2) {
                const combinedFactor = correctFactors[0] * correctFactors[1];
                nonPrimeFactorOption.push(combinedFactor);
                i = 2;
            } else {
                let randomComp = getRandomNumber(4, 10);
                while(isPrime(randomComp)) {
                    randomComp = getRandomNumber(4, 10);
                }
                nonPrimeFactorOption.push(randomComp);
            }
            
            for (; i < correctFactors.length; i++) {
                nonPrimeFactorOption.push(correctFactors[i]);
            }
            if (nonPrimeFactorOption.reduce((acc, val) => acc * val, 1) === num) {
                const nonPrimeStr = formatFactors(nonPrimeFactorOption.sort((a,b) => a-b));
                if (nonPrimeStr !== correctStr && !incorrectOptions.includes(nonPrimeStr)) {
                    incorrectOptions.push(nonPrimeStr);
                }
            }
        }

        while (incorrectOptions.length < 3) {
            let randomNum = getRandomNumber(2, num + 10);
            const { factors } = getPrimeFactorization(randomNum); // Ambil hanya factors
            const factorStr = formatFactors(factors);

            if (factorStr !== correctStr && !incorrectOptions.includes(factorStr)) {
                incorrectOptions.push(factorStr);
            }
            if (incorrectOptions.length < 3 && num < 50) {
                let dummyFactor = getRandomNumber(2, 7);
                let dummyOption = (dummyFactor * getRandomNumber(2, 5)).toString();
                if (dummyFactor !== correctFactors[0]) {
                    dummyOption = dummyFactor + " x " + (num / dummyFactor).toFixed(0);
                    if (num % dummyFactor !== 0) {
                        dummyOption = dummyFactor + " x " + getRandomNumber(2,5) + " x " + getRandomNumber(2,5);
                    }
                }
                if (!incorrectOptions.includes(dummyOption) && getPrimeFactorization(parseInt(dummyOption.split(' x ')[0])).factors.length > 0) {
                    incorrectOptions.push(dummyOption);
                }
            }
        }
        return incorrectOptions.slice(0, 3);
    }

    // --- Fungsi Timer ---
    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 30;
        timeEl.textContent = timeLeft;

        timerInterval = setInterval(() => {
            timeLeft--;
            timeEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeUp();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function handleTimeUp() {
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.disabled = true;
        });

        // Buat HTML untuk langkah-langkah penyelesaian
        const solutionHtml = `
            <p>Yah, waktu kamu sudah habis.</p>
            <p>Jawaban yang benar adalah: <strong>${correctAnswer}</strong></p>
            <h3>Penyelesaian:</h3>
            <div style="text-align: left; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; max-height: 200px; overflow-y: auto;">
                ${solutionSteps.map(step => `<p style="margin: 5px 0;">${step}</p>`).join('')}
            </div>
        `;

        Swal.fire({
            title: 'Waktu Habis!',
            html: solutionHtml,
            icon: 'error',
            confirmButtonText: 'Lanjut',
            allowOutsideClick: false,
            backdrop: true,
            customClass: {
                htmlContainer: 'swal2-html-container-custom' // Tambahkan kelas kustom
            }
        }).then((result) => {
            if (result.isConfirmed) {
                generateNewQuestion();
            }
        });
    }

    // --- Logika Game ---

    function generateNewQuestion() {
        stopTimer();

        const minNum = 10 + Math.floor(score / 5) * 5;
        const maxNum = 50 + Math.floor(score / 5) * 10;
        
        let num = getRandomNumber(minNum, maxNum);
        
        while (isPrime(num) || getPrimeFactorization(num).factors.length < 2) { // Pastikan ada faktor prima
            num = getRandomNumber(minNum, maxNum);
        }

        currentNumber = num;
        const factorizationResult = getPrimeFactorization(currentNumber); // Dapatkan faktor dan langkah
        correctAnswer = formatFactors(factorizationResult.factors);
        solutionSteps = factorizationResult.steps; // Simpan langkah-langkah

        numberToFactorEl.textContent = currentNumber;
        
        const allOptions = [correctAnswer, ...generateIncorrectFactorization(factorizationResult.factors, currentNumber)];
        allOptions.sort(() => Math.random() - 0.5);

        optionsContainer.innerHTML = '';
        allOptions.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option, button), { once: true });
            optionsContainer.appendChild(button);
        });

        document.querySelectorAll('.option-button').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });

        startTimer();
    }

    function checkAnswer(selectedOption, button) {
        stopTimer();

        document.querySelectorAll('.option-button').forEach(btn => {
            btn.disabled = true;
        });

        if (selectedOption === correctAnswer) {
            score++;
            scoreEl.textContent = score;
            button.classList.add('correct');
            
            Swal.fire({
                title: 'Benar Sekali!',
                text: 'Jawabanmu tepat!',
                icon: 'success',
                confirmButtonText: 'Lanjut',
                allowOutsideClick: false,
                backdrop: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    generateNewQuestion();
                }
            });

        } else {
            button.classList.add('wrong');
            document.querySelectorAll('.option-button').forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });

            // Buat HTML untuk langkah-langkah penyelesaian
            const solutionHtml = `
                <p>Sepertinya kurang tepat.</p>
                <p>Jawaban yang benar adalah: <strong>${correctAnswer}</strong></p>
                <h3>Penyelesaian:</h3>
                <div style="text-align: left; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; max-height: 200px; overflow-y: auto;">
                    ${solutionSteps.map(step => `<p style="margin: 5px 0;">${step}</p>`).join('')}
                </div>
            `;

            Swal.fire({
                title: 'Salah!',
                html: solutionHtml,
                icon: 'error',
                confirmButtonText: 'Lanjut',
                allowOutsideClick: false,
                backdrop: true,
                customClass: {
                    htmlContainer: 'swal2-html-container-custom' // Tambahkan kelas kustom
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    generateNewQuestion();
                }
            });
        }
    }

    generateNewQuestion();
});