document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const campurContainer = document.getElementById('campurContainer');
    const operationTextSpan = document.getElementById('operationText');
    const angka1Span = document.getElementById('angka1');
    const angka2Span = document.getElementById('angka2');
    const operatorSpan = document.getElementById('operator');
    const jawabanInput = document.getElementById('jawaban');
    const submitBtn = document.getElementById('submitBtn');
    const waktuSpan = document.getElementById('waktu');
    const pesanP = document.getElementById('pesan');
    const skorSpan = document.getElementById('skor');
    const operationButtons = document.querySelectorAll('.operation-buttons button');
    
    // Game state variables
    let angka1;
    let angka2;
    let jawabanBenar;
    let skor = 0;
    let waktuSisa = 30;
    let timerInterval;
    let operasi = 'multiply'; // Default operation
    
    // Helper function to get operator symbol
    const getOperatorSymbol = (op) => {
        const symbols = {
            'multiply': '×',
            'divide': '/',
            'add': '+',
            'subtract': '-'
        };
        return symbols[op] || '?';
    };
    
    // Function to start a new game round
    const mulaiGame = () => {
        angka1 = Math.floor(Math.random() * 10) + 1;
        angka2 = Math.floor(Math.random() * 10) + 1;
        
        if (operasi === 'divide') {
            jawabanBenar = angka1;
            angka1 = jawabanBenar * angka2;
        } else if (operasi === 'add') {
            jawabanBenar = angka1 + angka2;
        } else if (operasi === 'subtract') {
            if (angka1 < angka2) {
                [angka1, angka2] = [angka2, angka1]; // Swap to ensure positive result
            }
            jawabanBenar = angka1 - angka2;
        } else { // multiply
            jawabanBenar = angka1 * angka2;
        }
        
        angka1Span.textContent = angka1;
        angka2Span.textContent = angka2;
        operatorSpan.textContent = getOperatorSymbol(operasi);
        jawabanInput.value = '';
        pesanP.textContent = '';
        pesanP.className = '';
        waktuSisa = 30;
        waktuSpan.textContent = waktuSisa;
        
        clearInterval(timerInterval);
        timerInterval = setInterval(updateWaktu, 3000);
        jawabanInput.blur();
    };
    
    // Function to update the timer
    const updateWaktu = () => {
        waktuSisa--;
        waktuSpan.textContent = waktuSisa;
        
        if (waktuSisa <= 0) {
            clearInterval(timerInterval);
            pesanP.textContent = `Waktu habis! Jawaban ${jawabanBenar}.`;
            pesanP.className = 'incorrect';
            setTimeout(mulaiGame, 2000);
        }
    };
    
    // Function to handle user's answer
    const handleAnswer = () => {
        if (waktuSisa > 0) {
            clearInterval(timerInterval);
            const jawabanPengguna = parseInt(jawabanInput.value);
            
            if (jawabanPengguna === jawabanBenar) {
                pesanP.textContent = 'Benar!';
                pesanP.className = 'correct';
                skor++;
                skorSpan.textContent = skor;
            } else {
                pesanP.textContent = `Salah! Jawaban ${jawabanBenar}.`;
                pesanP.className = 'incorrect';
            }
            setTimeout(mulaiGame, 2000);
        }
    };
    
    // Function to update active button styling
    const updateOperationButtons = (activeButton) => {
        operationButtons.forEach(btn => btn.classList.remove('active'));
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };
    
    // Event listeners for operation buttons
    operationButtons.forEach(button => {
        button.addEventListener('click', function() {
            operasi = this.id.replace('Btn', ''); // Extract operation from button ID
            operationTextSpan.textContent = this.dataset.operationName; // Use data attribute for display name
            updateOperationButtons(this);
            mulaiGame();
        });
    });
    
    // Event listener for submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', handleAnswer);
    } else {
        console.error('Tombol Jawab tidak ditemukan!');
    }
    
    // Initial setup when the page loads
    if (campurContainer) {
        campurContainer.style.display = 'block';
        skor = 0;
        skorSpan.textContent = skor;
        // Set initial active button and start game
        const initialButton = document.getElementById('multiplyBtn');
        if (initialButton) {
            updateOperationButtons(initialButton);
            operationTextSpan.textContent = initialButton.dataset.operationName;
            mulaiGame();
        } else {
            console.error('Tombol perkalian tidak ditemukan!');
        }
        jawabanInput.blur();
    } else {
        console.error('Elemen campurContainer tidak ditemukan!');
    }
});