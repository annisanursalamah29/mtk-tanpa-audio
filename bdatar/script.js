const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const startGameButton = document.getElementById('startGameButton');
const howToPlayButton = document.getElementById('howToPlayButton');
const howToPlaySection = document.getElementById('how-to-play');
const backToMenuButton = document.getElementById('backToMenuButton');
const backToMenuFromGameButton = document.getElementById('backToMenuFromGameButton');
const questionText = document.getElementById('question-text');
const shapeContainer = document.querySelector('.shape-container');
const optionsContainer = document.getElementById('options-container');
const resultMessage = document.getElementById('result-message');
const scoreDisplay = document.getElementById('score');
const nextQuestionButton = document.getElementById('nextQuestionButton'); // Tetap ada tapi display: none di HTML
const countdownElement = document.getElementById('countdown');

let score = 0;
let currentQuestion = {};
let timer;
let timeLeft = 60;
let gameActive = false;

let selectedShapeType = 'segitiga';
let selectedQuestionCategory = 'campuran';

// Fungsi untuk menampilkan/menyembunyikan layar
function showScreen(screenId) {
    // Sembunyikan semua layar terlebih dahulu
    menuScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    howToPlaySection.style.display = 'none'; // Pastikan cara bermain juga disembunyikan

    if (screenId === 'menu') {
        menuScreen.style.display = 'flex';
        // Pastikan radio buttons terpilih sesuai nilai terakhir atau default
        document.querySelector(`input[name="shapeType"][value="${selectedShapeType}"]`).checked = true;
        document.querySelector(`input[name="questionCategory"][value="${selectedQuestionCategory}"]`).checked = true;
    } else if (screenId === 'game') {
        gameScreen.style.display = 'flex';
    } else if (screenId === 'howToPlay') {
        // Ketika menampilkan cara bermain, pastikan hanya section itu yang muncul di dalam menu-screen
        menuScreen.style.display = 'flex'; // Tampilkan menu-screen sebagai wadah
        howToPlaySection.style.display = 'block';
        // Sembunyikan menu options
        document.querySelector('.menu-options').style.display = 'none';
        // Sembunyikan h1 (judul utama) sementara di layar cara bermain
        document.querySelector('#menu-screen h1').style.display = 'none';
    }
}

// Fungsi untuk mendapatkan angka random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk membulatkan angka ke 2 desimal
function roundToTwoDecimals(num) {
    return parseFloat(num.toFixed(2));
}

// Fungsi untuk menghitung luas dan keliling
const calculate = {
    segitiga: (alas, tinggi, s1, s2, s3) => {
        const luas = 0.5 * alas * tinggi;
        const keliling = s1 + s2 + s3;
        return { luas: roundToTwoDecimals(luas), keliling: roundToTwoDecimals(keliling) };
    },
    persegi: (sisi) => {
        const luas = sisi * sisi;
        const keliling = 4 * sisi;
        return { luas: roundToTwoDecimals(luas), keliling: roundToTwoDecimals(keliling) };
    },
    persegiPanjang: (panjang, lebar) => {
        const luas = panjang * lebar;
        const keliling = 2 * (panjang + lebar);
        return { luas: roundToTwoDecimals(luas), keliling: roundToTwoDecimals(keliling) };
    },
    lingkaran: (jariJari) => {
        const luas = Math.PI * jariJari * jariJari;
        const keliling = 2 * Math.PI * jariJari;
        return { luas: roundToTwoDecimals(luas), keliling: roundToTwoDecimals(keliling) };
    }
};

// Fungsi untuk menampilkan bentuk CSS yang sesuai
function displayCssShape(shapeType) {
    shapeContainer.innerHTML = ''; // Hapus semua bentuk yang ada
    const shapeDiv = document.createElement('div');

    switch (shapeType) {
        case 'segitiga':
            shapeDiv.classList.add('triangle');
            break;
        case 'persegi':
            shapeDiv.classList.add('square');
            break;
        case 'persegiPanjang':
            shapeDiv.classList.add('rectangle');
            break;
        case 'lingkaran':
            shapeDiv.classList.add('circle');
            break;
        default:
            console.warn('Jenis bentuk tidak dikenal:', shapeType);
            return;
    }
    shapeDiv.style.display = 'block';
    shapeContainer.appendChild(shapeDiv);
}

// FUNGSI BARU UNTUK MENAMPILKAN SWEETALERT PANDUAN
function showGuidanceAlert(shape, calculationType, dimensions, correctAnswer) {
    let title = "Oops! Mari kita ulas cara pengerjaan soal ini:";
    let htmlContent = `<p>Untuk bangun **${shape.charAt(0).toUpperCase() + shape.slice(1)}**:</p>`;

    if (shape === 'segitiga') {
        htmlContent += `
            <p>Dimensi: alas **${dimensions.alas} cm**, tinggi **${dimensions.tinggi} cm**, sisi-sisi **${dimensions.s1} cm, ${dimensions.s2} cm, ${dimensions.s3} cm**.</p>
            <ul>
                <li>**Rumus Luas:** 0.5 × alas × tinggi = 0.5 × ${dimensions.alas} × ${dimensions.tinggi} = <b>${calculate.segitiga(dimensions.alas, dimensions.tinggi, 0,0,0).luas} cm²</b></li>
                <li>**Rumus Keliling:** sisi1 + sisi2 + sisi3 = ${dimensions.s1} + ${dimensions.s2} + ${dimensions.s3} = <b>${calculate.segitiga(0,0,dimensions.s1, dimensions.s2, dimensions.s3).keliling} cm</b></li>
            </ul>
        `;
    } else if (shape === 'persegi') {
        htmlContent += `
            <p>Dimensi: sisi **${dimensions.sisi} cm**.</p>
            <ul>
                <li>**Rumus Luas:** sisi × sisi = ${dimensions.sisi} × ${dimensions.sisi} = <b>${calculate.persegi(dimensions.sisi).luas} cm²</b></li>
                <li>**Rumus Keliling:** 4 × sisi = 4 × ${dimensions.sisi} = <b>${calculate.persegi(dimensions.sisi).keliling} cm</b></li>
            </ul>
        `;
    } else if (shape === 'persegiPanjang') {
        htmlContent += `
            <p>Dimensi: panjang **${dimensions.panjang} cm**, lebar **${dimensions.lebar} cm**.</p>
            <ul>
                <li>**Rumus Luas:** panjang × lebar = ${dimensions.panjang} × ${dimensions.lebar} = <b>${calculate.persegiPanjang(dimensions.panjang, dimensions.lebar).luas} cm²</b></li>
                <li>**Rumus Keliling:** 2 × (panjang + lebar) = 2 × (${dimensions.panjang} + ${dimensions.lebar}) = <b>${calculate.persegiPanjang(dimensions.panjang, dimensions.lebar).keliling} cm</b></li>
            </ul>
        `;
    } else if (shape === 'lingkaran') {
        htmlContent += `
            <p>Dimensi: jari-jari **${dimensions.jariJari} cm**.</p>
            <ul>
                <li>**Rumus Luas:** π × r² = ${Math.PI.toFixed(2)} × ${dimensions.jariJari}² = <b>${calculate.lingkaran(dimensions.jariJari).luas} cm²</b></li>
                <li>**Rumus Keliling:** 2 × π × r = 2 × ${Math.PI.toFixed(2)} × ${dimensions.jariJari} = <b>${calculate.lingkaran(dimensions.jariJari).keliling} cm</b></li>
            </ul>
            <small><i>(Menggunakan nilai π ≈ ${Math.PI.toFixed(2)})</i></small>
        `;
    }

    htmlContent += `<p>Jawaban yang benar adalah <b>${correctAnswer}</b>.</p>`;

    Swal.fire({
        title: title,
        html: htmlContent,
        icon: 'info',
        confirmButtonText: 'Oke, Lanjut!',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button'
        },
        allowOutsideClick: false, // Pengguna harus klik tombol
        allowEscapeKey: false // Pengguna harus klik tombol
    }).then(() => {
        // Ketika SweetAlert ditutup, lanjutkan ke pertanyaan berikutnya
        nextQuestionButton.click();
    });
}

// Fungsi untuk menghasilkan pertanyaan baru
function generateQuestion() {
    resultMessage.textContent = '';
    resultMessage.className = '';
    optionsContainer.innerHTML = '';

    const currentShape = selectedShapeType;
    let questionType;

    if (selectedQuestionCategory === 'campuran') {
        questionType = Math.random() < 0.5 ? 'luas' : 'keliling';
    } else {
        questionType = selectedQuestionCategory;
    }

    let questionTextContent = '';
    let correctAnswer;
    let dimensions = {};

    displayCssShape(currentShape);

    switch (currentShape) {
        case 'segitiga':
            const alasSegitiga = getRandomInt(5, 20);
            const tinggiSegitiga = getRandomInt(5, 20);
            // Untuk keliling, sisi-sisi segitiga harus memenuhi ketidaksetaraan segitiga
            // (jumlah dua sisi > sisi ketiga). Ini adalah penyederhanaan.
            const s1 = alasSegitiga;
            const s2 = getRandomInt(alasSegitiga / 2 + tinggiSegitiga / 2, alasSegitiga + tinggiSegitiga - 1); // Hindari s2, s3 terlalu kecil
            const s3 = getRandomInt(alasSegitiga / 2 + tinggiSegitiga / 2, alasSegitiga + tinggiSegitiga - 1);

            dimensions = { alas: alasSegitiga, tinggi: tinggiSegitiga, s1: s1, s2: s2, s3: s3 };
            const hasilSegitiga = calculate.segitiga(alasSegitiga, tinggiSegitiga, s1, s2, s3);

            if (questionType === 'luas') {
                questionTextContent = `Hitunglah luas segitiga dengan alas ${alasSegitiga} cm dan tinggi ${tinggiSegitiga} cm.`;
                correctAnswer = hasilSegitiga.luas;
            } else {
                questionTextContent = `Hitunglah keliling segitiga dengan sisi ${s1} cm, ${s2} cm, dan ${s3} cm.`;
                correctAnswer = hasilSegitiga.keliling;
            }
            break;

        case 'persegi':
            const sisiPersegi = getRandomInt(5, 20);
            dimensions = { sisi: sisiPersegi };
            const hasilPersegi = calculate.persegi(sisiPersegi);

            if (questionType === 'luas') {
                questionTextContent = `Hitunglah luas persegi dengan sisi ${sisiPersegi} cm.`;
                correctAnswer = hasilPersegi.luas;
            } else {
                questionTextContent = `Hitunglah keliling persegi dengan sisi ${sisiPersegi} cm.`;
                correctAnswer = hasilPersegi.keliling;
            }
            break;

        case 'persegiPanjang':
            const panjangPersegiPanjang = getRandomInt(5, 20);
            let lebarPersegiPanjang = getRandomInt(5, 20);
            while(lebarPersegiPanjang === panjangPersegiPanjang) {
                lebarPersegiPanjang = getRandomInt(5, 20);
            }
            dimensions = { panjang: panjangPersegiPanjang, lebar: lebarPersegiPanjang };
            const hasilPersegiPanjang = calculate.persegiPanjang(panjangPersegiPanjang, lebarPersegiPanjang);

            if (questionType === 'luas') {
                questionTextContent = `Hitunglah luas persegi panjang dengan panjang ${panjangPersegiPanjang} cm dan lebar ${lebarPersegiPanjang} cm.`;
                correctAnswer = hasilPersegiPanjang.luas;
            } else {
                questionTextContent = `Hitunglah keliling persegi panjang dengan panjang ${pansegiPanjang} cm dan lebar ${lebarPersegiPanjang} cm.`;
                correctAnswer = hasilPersegiPanjang.keliling;
            }
            break;

        case 'lingkaran':
            const jariJariLingkaran = getRandomInt(5, 15);
            dimensions = { jariJari: jariJariLingkaran };
            const hasilLingkaran = calculate.lingkaran(jariJariLingkaran);

            if (questionType === 'luas') {
                questionTextContent = `Hitunglah luas lingkaran dengan jari-jari ${jariJariLingkaran} cm. (Gunakan ${Math.PI.toFixed(2)} untuk Pi)`;
                correctAnswer = hasilLingkaran.luas;
            } else {
                questionTextContent = `Hitunglah keliling lingkaran dengan jari-jari ${jariJariLingkaran} cm. (Gunakan ${Math.PI.toFixed(2)} untuk Pi)`;
                correctAnswer = hasilLingkaran.keliling;
            }
            break;

        default:
            questionTextContent = "Pilih jenis bangun datar dari menu.";
            correctAnswer = 0;
            clearInterval(timer);
            gameActive = false;
            return;
    }

    questionText.textContent = questionTextContent;
    // Simpan semua data pertanyaan untuk SweetAlert
    currentQuestion = {
        shape: currentShape,
        questionType: questionType,
        dimensions: dimensions,
        correctAnswer: correctAnswer
    };
    generateOptions(currentQuestion.correctAnswer);
    startTimer();
}

// Fungsi untuk menghasilkan pilihan ganda
function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        let wrongAnswer;
        const deviation = getRandomInt(1, 10);
        if (Math.random() < 0.5) {
            wrongAnswer = correctAnswer + deviation;
        } else {
            wrongAnswer = correctAnswer - deviation;
            if (wrongAnswer < 0 && correctAnswer >= 0) wrongAnswer = correctAnswer + deviation;
            else if (wrongAnswer < 0) wrongAnswer = 0;
        }
        options.add(roundToTwoDecimals(wrongAnswer));
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.dataset.answer = option;
        button.onclick = () => checkAnswer(button);
        optionsContainer.appendChild(button);
    });
}

// Fungsi untuk memeriksa jawaban
function checkAnswer(selectedButton) {
    clearInterval(timer);
    gameActive = false;
    disableOptionButtons();

    const selectedAnswer = parseFloat(selectedButton.dataset.answer);

    if (selectedAnswer === currentQuestion.correctAnswer) {
        resultMessage.textContent = 'Benar!';
        resultMessage.className = 'correct';
        selectedButton.classList.add('correct');
        score += 10;
        scoreDisplay.textContent = score;
        setTimeout(() => {
            nextQuestionButton.click(); // Lanjut ke pertanyaan berikutnya
        }, 1000); // Delay singkat
    } else {
        resultMessage.textContent = `Salah! Jawaban yang benar adalah ${currentQuestion.correctAnswer}.`;
        resultMessage.className = 'wrong';
        selectedButton.classList.add('wrong');
        highlightCorrectAnswerButton();

        // TAMPILKAN SWEETALERT KETIKA JAWABAN SALAH
        showGuidanceAlert(
            currentQuestion.shape,
            currentQuestion.questionType,
            currentQuestion.dimensions,
            currentQuestion.correctAnswer
        );
    }
}

// Fungsi untuk menonaktifkan tombol pilihan
function disableOptionButtons() {
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Fungsi baru untuk menyorot tombol jawaban yang benar
function highlightCorrectAnswerButton() {
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        if (parseFloat(button.dataset.answer) === currentQuestion.correctAnswer) {
            button.classList.add('correct');
        }
    });
}

// Fungsi untuk memulai timer
function startTimer() {
    timeLeft = 60;
    countdownElement.textContent = timeLeft;
    gameActive = true;

    timer = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;
            disableOptionButtons();
            resultMessage.textContent = `Waktu habis! Jawaban yang benar adalah ${currentQuestion.correctAnswer}.`;
            resultMessage.className = 'wrong';
            scoreDisplay.textContent = score;
            highlightCorrectAnswerButton();

            // TAMPILKAN SWEETALERT KETIKA WAKTU HABIS
            showGuidanceAlert(
                currentQuestion.shape,
                currentQuestion.questionType,
                currentQuestion.dimensions,
                currentQuestion.correctAnswer
            );
        }
    }, 1000);
}

// Event Listeners
document.querySelectorAll('input[name="shapeType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        selectedShapeType = this.value;
    });
});

document.querySelectorAll('input[name="questionCategory"]').forEach(radio => {
    radio.addEventListener('change', function() {
        selectedQuestionCategory = this.value;
    });
});

startGameButton.addEventListener('click', () => {
    clearInterval(timer);
    score = 0;
    scoreDisplay.textContent = score;
    showScreen('game');
    generateQuestion();
});

howToPlayButton.addEventListener('click', () => {
    showScreen('howToPlay');
});

backToMenuButton.addEventListener('click', () => {
    showScreen('menu');
    // Tampilkan kembali menu options dan h1 setelah kembali dari cara bermain
    document.querySelector('.menu-options').style.display = 'block';
    document.querySelector('#menu-screen h1').style.display = 'block';
});

backToMenuFromGameButton.addEventListener('click', () => {
    clearInterval(timer);
    stopTimer();
    showScreen('menu');
    gameActive = false;
    disableOptionButtons();
    optionsContainer.querySelectorAll('button').forEach(button => {
        button.classList.remove('correct', 'wrong');
    });
    // Tampilkan kembali menu options dan h1 saat kembali ke menu awal dari game
    document.querySelector('.menu-options').style.display = 'block';
    document.querySelector('#menu-screen h1').style.display = 'block';
});

// nextQuestionButton ini sekarang hanya listeners, pemicu click ada di showGuidanceAlert atau checkAnswer (untuk jawaban benar)
nextQuestionButton.addEventListener('click', () => {
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.remove('correct', 'wrong');
        button.disabled = false;
    });
    generateQuestion();
});

function stopTimer() {
    clearInterval(timer);
    timeLeft = 60;
    countdownElement.textContent = timeLeft;
}

// Pastikan pilihan radio buttons di menu sesuai dengan nilai selectedShapeType dan selectedQuestionCategory saat pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    showScreen('menu');
    document.querySelector(`input[name="shapeType"][value="${selectedShapeType}"]`).checked = true;
    document.querySelector(`input[name="questionCategory"][value="${selectedQuestionCategory}"]`).checked = true;
});