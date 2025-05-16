document.addEventListener('DOMContentLoaded', function() {
    const selectTahunBiaya = document.getElementById('tahun-biaya');
    const tahunMulai = 2025;
    const jumlahTahun = 10; // Jumlah tahun yang ingin ditampilkan dalam dropdown

    for (let i = 0; i < jumlahTahun; i++) {
        const tahun = tahunMulai + i;
        const option = document.createElement('option');
        option.value = tahun;
        option.textContent = tahun;
        selectTahunBiaya.appendChild(option);
    }

    // Set tahun 2025 sebagai nilai default yang dipilih
    selectTahunBiaya.value = tahunMulai;
    console.log("DOMContentLoaded dijalankan.");
});

function prediksi() {
    console.log("Fungsi prediksi() dipanggil!");

    const luas = parseFloat(document.getElementById('luas').value);
    const jumlahPintu = parseInt(document.getElementById('jumlah-pintu').value);
    const jumlahJendela = parseInt(document.getElementById('jumlah-jendela').value);
    const jumlahTingkat = parseInt(document.getElementById('jumlah-tingkat').value);
    const jumlahTukang = parseInt(document.getElementById('jumlah-tukang').value);
    const negara = document.getElementById('negara').value;
    const tahunPrediksiBiaya = parseInt(document.getElementById('tahun-biaya').value);
    const tahunSaatIni = 2025;
    const kenaikanHargaPerTahun = 0.05; // Asumsi kenaikan harga 5% per tahun
    const hariKerjaPerBulan = 22; // Asumsi rata-rata hari kerja per bulan
    const efisiensiTukang = 0.8; // Asumsi efisiensi kerja per tukang (perlu disesuaikan)

    console.log("Nilai Input:", { luas, jumlahPintu, jumlahJendela, jumlahTingkat, jumlahTukang, negara, tahunPrediksiBiaya });

    // Faktor susut material (perkiraan)
    const faktorSusut = {
        semen: 0.05,
        pasir: 0.03,
        kerikil: 0.03,
        bata: 0.07,
        besi: 0.02,
        keramik: 0.10,
        kayu: 0.08,
        genting: 0.05,
        bajaRingan: 0.03,
        batuPondasi: 0.05
    };

    // Nilai tukar mata uang ke IDR (PERKIRAAN - HARUS DIGANTI DENGAN DATA REAL-TIME)
    const kursKeIDR = {
        IDR: 1,
        AED: 4300, // Perkiraan Kurs Dirham Dubai ke Rupiah
        SGD: 11800,
        USD: 16000
    };

    // Data harga material per negara (dalam mata uang masing-masing) - Contoh Saja
    const hargaMaterialPerNegara = {
        indonesia: {
            mataUang: 'IDR',
            biayaTukangPerHari_2025: 160000,
            semen: 65000,
            pasir: 270000,
            kerikil: 220000,
            bata: 1600,
            besi: 13000,
            keramik: 55000,
            kayu: 3200000,
            pintu: 900000,
            jendela: 700000,
            lampuPerMeter2: 55000,
            catPerMeter2: 45000,
            gentingPerMeter2: 5500,
            bajaRinganPerMeter2: 160000,
            batuPondasiPerMeter2: 110000
        },
        dubai: {
            mataUang: 'AED',
            biayaTukangPerHari_2025: 400, // Perkiraan Biaya Tukang per Hari (AED)
            semen: 15,
            pasir: 55,
            kerikil: 50,
            bata: 1.5,
            besi: 50,
            keramik: 30,
            kayu: 1800,
            pintu: 1200,
            jendela: 900,
            lampuPerMeter2: 25,
            catPerMeter2: 20,
            gentingPerMeter2: 15,
            bajaRinganPerMeter2: 200,
            batuPondasiPerMeter2: 150
        },
        singapura: {
            mataUang: 'SGD',
            biayaTukangPerHari_2025: 110,
            semen: 11,
            pasir: 33,
            kerikil: 28,
            bata: 0.17,
            besi: 13,
            keramik: 9,
            kayu: 380,
            pintu: 110,
            jendela: 90,
            lampuPerMeter2: 9,
            catPerMeter2: 6,
            gentingPerMeter2: 0.55,
            bajaRinganPerMeter2: 22,
            batuPondasiPerMeter2: 16
        },
        amerika: {
            mataUang: 'USD',
            biayaTukangPerHari_2025: 55,
            semen: 7,
            pasir: 17,
            kerikil: 14,
            bata: 0.65,
            besi: 9,
            keramik: 6,
            kayu: 160,
            pintu: 220,
            jendela: 170,
            lampuPerMeter2: 5,
            catPerMeter2: 4,
            gentingPerMeter2: 0.22,
            bajaRinganPerMeter2: 33,
            batuPondasiPerMeter2: 11
        }
    };

    const dataNegara = hargaMaterialPerNegara[negara];
    if (!dataNegara) {
        console.error("Data negara tidak ditemukan:", negara);
        alert("Data negara tidak ditemukan.");
        return;
    }
    const mataUangAsal = dataNegara.mataUang;
    const kurs = kursKeIDR[mataUangAsal];
    if (kurs === undefined) {
        console.error("Kurs mata uang tidak ditemukan:", mataUangAsal);
        alert("Kurs mata uang tidak ditemukan.");
        return;
    }
    const biayaTukangPerHari_2025 = dataNegara.biayaTukangPerHari_2025 * kurs; // Konversi biaya tukang
    const hargaSatuan = {};
    for (const material in dataNegara) {
        if (typeof dataNegara[material] === 'number') {
            hargaSatuan[material] = dataNegara[material] * kurs; // Konversi harga satuan material
        }
    }

    // Rasio perkiraan material per meter persegi (ini adalah contoh kasar dan perlu disesuaikan)
    const rasioMaterial = {
        semenPerMeter2: 0.2,
        pasirPerMeter2: 0.03,
        kerikilPerMeter2: 0.02,
        bataPerMeter2: 5,
        besiPerMeter2: 0.8,
        keramikPerMeter2: 1.2,
        kayuPerMeter2: 0.005,
        lampu: 0.8,
        cat: 0.2,
        gentingPerMeter2: 15,
        bajaRinganPerMeter2: 1,
        batuPondasiPerMeter2: 0.5,
        semenCorPerMeter2Lantai: 0.15,
        pasirCorPerMeter2Lantai: 0.05,
        kerikilCorPerMeter2Lantai: 0.04,
        besiCorPerMeter2Lantai: 1.2
    };

    if (isNaN(luas) || luas <= 0) {
        alert('Masukkan luas rumah yang valid.');
        return;
    }

    if (isNaN(jumlahTingkat) || jumlahTingkat <= 0) {
        alert('Masukkan jumlah tingkat bangunan yang valid.');
        return;
    }

    if (isNaN(jumlahTukang) || jumlahTukang <= 0) {
        alert('Masukkan perkiraan jumlah tukang yang valid.');
        return;
    }

    if (isNaN(tahunPrediksiBiaya) || tahunPrediksiBiaya < tahunSaatIni) {
        alert('Pilih tahun prediksi biaya yang valid (minimal tahun ' + tahunSaatIni + ').');
        return;
    }

    // Prediksi Biaya
    const tabelBiaya = document.getElementById('tabel-biaya').getElementsByTagName('tbody')[0];
    tabelBiaya.innerHTML = ''; // Bersihkan tabel biaya sebelumnya

    const selisihTahun = tahunPrediksiBiaya - tahunSaatIni;
    const faktorKenaikan = Math.pow(1 + kenaikanHargaPerTahun, selisihTahun);
    const estimasiBiayaTukangPerHari = biayaTukangPerHari_2025 * faktorKenaikan;

    // Perkiraan Waktu Penyelesaian (dalam bulan) berdasarkan luas dan tingkat
    let perkiraanWaktuBulanDasar;
    const luasTotalEkuivalen = luas * jumlahTingkat; // Asumsi kasar, perlu penyesuaian lebih lanjut
    if (luasTotalEkuivalen <= 75) {
        perkiraanWaktuBulanDasar = 4;
    } else if (luasTotalEkuivalen <= 150) {
        perkiraanWaktuBulanDasar = 8;
    } else if (luasTotalEkuivalen <= 300) {
        perkiraanWaktuBulanDasar = 14;
    } else {
        perkiraanWaktuBulanDasar = 22;
    }

    // Penyesuaian waktu berdasarkan jumlah tukang
    const waktuPenyelesaianDisuaikanBulan = perkiraanWaktuBulanDasar / (jumlahTukang * efisiensiTukang);
    const perkiraanHariKerjaTukang = Math.round(waktuPenyelesaianDisuaikanBulan * hariKerjaPerBulan);

    // Perkiraan Material dengan faktor susut dan penyesuaian tingkat
    const luasDasar = luas; // Luas per lantai
    const luasAtap = luas; // Asumsi luas atap sama dengan luas dasar (bisa disesuaikan)
    const jumlahLantaiCor = Math.max(0, jumlahTingkat - 1); // Jumlah lantai yang perlu dicor
    const totalLuasLantaiKeramik = luas * jumlahTingkat; // Asumsi semua lantai dipasang keramik

    const perkiraanMaterial = {
        semen: (luas * rasioMaterial.semenPerMeter2 + (jumlahLantaiCor * luas * rasioMaterial.semenCorPerMeter2Lantai)) * (1 + (faktorSusut.semen || 0)),
        pasir: (luas * rasioMaterial.pasirPerMeter2 + (jumlahLantaiCor * luas * rasioMaterial.pasirCorPerMeter2Lantai)) * (1 + (faktorSusut.pasir || 0)),
        kerikil: (luas * rasioMaterial.kerikilPerMeter2 + (jumlahLantaiCor * luas * rasioMaterial.kerikilCorPerMeter2Lantai)) * (1 + (faktorSusut.kerikil || 0)),
        bata: luas * rasioMaterial.bataPerMeter2 * (1 + (faktorSusut.bata || 0)) * jumlahTingkat,
        besi: (luas * rasioMaterial.besiPerMeter2 + (jumlahLantaiCor * luas * rasioMaterial.besiCorPerMeter2Lantai)) * (1 + (faktorSusut.besi || 0)),
        keramik: totalLuasLantaiKeramik * rasioMaterial.keramikPerMeter2 * (1 + (faktorSusut.keramik || 0)),
        kayu: luas * rasioMaterial.kayuPerMeter2 * (1 + (faktorSusut.kayu || 0)) * jumlahTingkat,
        pintu: jumlahPintu * jumlahTingkat,
        jendela: jumlahJendela * jumlahTingkat,
        lampu: luas * rasioMaterial.lampu * jumlahTingkat,
        cat: luas * rasioMaterial.cat * (1 + (faktorSusut.cat || 0)) * jumlahTingkat,
        genting: luasAtap * rasioMaterial.gentingPerMeter2 * (1 + (faktorSusut.genting || 0)),
        bajaRingan: luasAtap * rasioMaterial.bajaRinganPerMeter2 * (1 + (faktorSusut.bajaRingan || 0)),
        batuPondasi: luasDasar * rasioMaterial.batuPondasiPerMeter2 * jumlahTingkat * 1.5,
        biayaTukang: perkiraanHariKerjaTukang
    };

    let totalBiayaMaterialTahunIni = 0;
    const tabelMaterial = document.getElementById('tabel-material').getElementsByTagName('tbody')[0];
    tabelMaterial.innerHTML = '';

    for (const material in perkiraanMaterial) {
        const barisBaruMaterial = tabelMaterial.insertRow();
        const selNamaMaterial = barisBaruMaterial.insertCell();
        const selJumlahMaterial = barisBaruMaterial.insertCell();
        const selSatuanMaterial = barisBaruMaterial.insertCell();
        const selHargaSatuan = barisBaruMaterial.insertCell();
        const selJumlahHarga = barisBaruMaterial.insertCell();

        selNamaMaterial.textContent = capitalizeFirstLetter(material.replace(/PerMeter2Lantai$/, '').replace(/PerMeter2$/, ''));
        const jumlah = perkiraanMaterial[material];
        const jumlahFormatted = (material === 'biayaTukang') ? jumlah : parseFloat(jumlah.toFixed(2));
        selJumlahMaterial.textContent = jumlahFormatted;

        let hargaSatuanMaterial = 0;
        let satuan = '';
        switch (material) {
            case 'semen': satuan = 'sak'; hargaSatuanMaterial = hargaSatuan.semen; break;
            case 'pasir': satuan = 'm³'; hargaSatuanMaterial = hargaSatuan.pasir; break;
            case 'kerikil': satuan = 'm³'; hargaSatuanMaterial = hargaSatuan.kerikil; break;
            case 'bata': satuan = 'buah'; hargaSatuanMaterial = hargaSatuan.bata; break;
            case 'besi': satuan = 'kg'; hargaSatuanMaterial = hargaSatuan.besi; break;
            case 'keramik': satuan = 'm²'; hargaSatuanMaterial = hargaSatuan.keramik; break;
            case 'kayu': satuan = 'm³'; hargaSatuanMaterial = hargaSatuan.kayu; break;
            case 'pintu': satuan = 'unit'; hargaSatuanMaterial = hargaSatuan.pintu; break;
            case 'jendela': satuan = 'unit'; hargaSatuanMaterial = hargaSatuan.jendela; break;
            case 'lampu': satuan = 'unit'; hargaSatuanMaterial = hargaSatuan.lampuPerMeter2; break;
            case 'cat': satuan = 'kg'; hargaSatuanMaterial = hargaSatuan.catPerMeter2; break;
            case 'genting': satuan = 'buah'; hargaSatuanMaterial = hargaSatuan.gentingPerMeter2; break;
            case 'bajaRingan': satuan = 'm²'; hargaSatuanMaterial = hargaSatuan.bajaRinganPerMeter2; break;
            case 'batuPondasi': satuan = 'm³'; hargaSatuanMaterial = hargaSatuan.batuPondasiPerMeter2; break;
            case 'biayaTukang': satuan = 'hari'; hargaSatuanMaterial = estimasiBiayaTukangPerHari; break;
        }
        selSatuanMaterial.textContent = satuan;
        // Format harga satuan dalam IDR
        selHargaSatuan.textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(hargaSatuanMaterial.toFixed(2));

        const jumlahHarga = (material === 'biayaTukang') ? jumlah * hargaSatuanMaterial * jumlahTukang : jumlah * hargaSatuanMaterial;
        // Format jumlah harga dalam IDR
        selJumlahHarga.textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(jumlahHarga.toFixed(2));

        if (material !== 'biayaTukang') {
            totalBiayaMaterialTahunIni += jumlahHarga;
        }
    }

    const totalBiayaTukangTahunIni = perkiraanHariKerjaTukang * estimasiBiayaTukangPerHari * jumlahTukang;
    const totalKeseluruhanBiayaTahunIni = totalBiayaMaterialTahunIni + totalBiayaTukangTahunIni;
    const estimasiTotalBiaya = totalKeseluruhanBiayaTahunIni * Math.pow(1 + kenaikanHargaPerTahun, selisihTahun);

    const barisBaruBiaya = tabelBiaya.insertRow();
    const selTahun = barisBaruBiaya.insertCell();
    const selBiaya = barisBaruBiaya.insertCell();
    selTahun.textContent = tahunPrediksiBiaya;
    selBiaya.textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(estimasiTotalBiaya.toFixed(2));

    const estimasiWaktuBulanBulat = waktuPenyelesaianDisuaikanBulan <= 1 ? '< 1' : Math.round(waktuPenyelesaianDisuaikanBulan);
    const estimasiWaktuTampil = estimasiWaktuBulanBulat + ' bulan (perkiraan dengan ' + jumlahTukang + ' tukang)';
    document.getElementById('estimasi-waktu').textContent = estimasiWaktuTampil;
    document.getElementById('hasil-prediksi').classList.remove('hidden');
    document.body.style.overflowY = 'auto';

    console.log("Hasil Prediksi Ditampilkan.");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}