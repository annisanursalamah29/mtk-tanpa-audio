document.addEventListener('DOMContentLoaded', () => {
    // Mendapatkan elemen DOM
    const mainMenu = document.getElementById('main-menu');
    const screens = document.querySelectorAll('.screen');
    const menuButtons = document.querySelectorAll('.btn[data-target]');
    const backToMenuButtons = document.querySelectorAll('.back-to-menu');

    // Objek untuk menyimpan data pertanyaan per kategori
    const questions = {
        'nun-sukun-tanwin': [
            {
                question: "Contoh bacaan Idzhar Halqi adalah...",
                choices: ["مِنْ خَيْرٍ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "مِنْ وَالٍ"],
                answer: "عَلِيمٌ حَكِيمٌ"
            },
            {
                question: "Contoh bacaan Idgham Bi Ghunnah adalah...",
                choices: ["مِنْ عَمَلٍ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                answer: "خَيْرٌ لَّكُمْ"
            },
            {
                question: "Contoh bacaan Idgham Bila Ghunnah adalah...",
                choices: ["مِنْ رَبِّهِمْ", "مِنْ خَيْرٍ", "عَلِيمٌ حَكِيمٌ", "مِنْ وَالٍ"],
                answer: "مِنْ رَبِّهِمْ"
            },
            {
                question: "Contoh bacaan Iqlab adalah...",
                choices: ["سَمِيعٌ بَصِيرٌ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                answer: "سَمِيعٌ بَصِيرٌ"
            },
            {
                question: "Contoh bacaan Ikhfa Haqiqi adalah...",
                choices: ["مِنْ خَيْرٍ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "مِنْ وَالٍ"],
                answer: "مِنْ وَالٍ"
            },
            {
                question: "Hukum bacaan pada kata 'مِنْ عَمَلٍ' adalah...",
                choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Ikhfa Haqiqi", "Iqlab"],
                answer: "Idzhar Halqi"
            },
            {
                 question: "Hukum bacaan pada kata 'مِنْ غِلٍّ' adalah...",
                 choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Ikhfa Haqiqi", "Iqlab"],
                 answer: "Idzhar Halqi"
            },
            {
                 question: "Hukum bacaan pada kata 'خَيْرٌ لَّكُمْ' adalah...",
                 choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Ikhfa Haqiqi", "Iqlab"],
                 answer: "Idgham Bi Ghunnah"
            },
            {
                 question: "Hukum bacaan pada kata 'مِنْ رَبِّهِمْ' adalah...",
                 choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Idgham Bila Ghunnah", "Iqlab"],
                 answer: "Idgham Bila Ghunnah"
            },
            {
                 question: "Hukum bacaan pada kata 'سَمِيعٌ بَصِيرٌ' adalah...",
                 choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Ikhfa Haqiqi", "Iqlab"],
                 answer: "Iqlab"
            },
            {
                 question: "Hukum bacaan pada kata 'مِنْ وَالٍ' adalah...",
                 choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Ikhfa Haqiqi", "Iqlab"],
                 answer: "Ikhfa Haqiqi"
            },
            {
                 question: "Hukum bacaan pada kata 'عَلِيمٌ حَكِيمٌ' adalah...",
                 choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Ikhfa Haqiqi", "Iqlab"],
                 answer: "Idzhar Halqi"
            },
            {
                 question: "Hukum bacaan pada kata 'مِنْ خَيْرٍ' adalah...",
                 choices: ["Idgham Bi Ghunnah", "Idzhar Halqi", "Ikhfa Haqiqi", "Iqlab"],
                 answer: "Idzhar Halqi"
            },
            {
                question: "Contoh bacaan Idzhar Halqi dengan huruf 'ain (ع) adalah...",
                choices: ["مِنْ عَمَلٍ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "سَمِيعٌ بَصِيرٌ"],
                answer: "مِنْ عَمَلٍ"
            },
            {
                question: "Contoh bacaan Idzhar Halqi dengan huruf ghain (غ) adalah...",
                choices: ["مِنْ غِلٍّ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "مِنْ وَالٍ"],
                answer: "مِنْ غِلٍّ"
            },
            {
                question: "Contoh bacaan Idgham Bi Ghunnah dengan huruf ya' (ي) adalah...",
                choices: ["خَيْرٌ يَقُولُ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "مِنْ وَالٍ"],
                answer: "خَيْرٌ يَقُولُ"
            },
            {
                question: "Contoh bacaan Idgham Bi Ghunnah dengan huruf nun (ن) adalah...",
                choices: ["مِنْ نُورٍ", "مِنْ خَيْرٍ", "عَلِيمٌ حَكِيمٌ", "سَمِيعٌ بَصِيرٌ"],
                answer: "مِنْ نُورٍ"
            },
            {
                question: "Contoh bacaan Idgham Bi Ghunnah dengan huruf mim (م) adalah...",
                choices: ["مِنْ مَالٍ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                answer: "مِنْ مَالٍ"
            },
            {
                 question: "Contoh bacaan Idgham Bi Ghunnah dengan huruf wawu (و) adalah...",
                 choices: ["مِنْ وَالٍ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "سَمِيعٌ بَصِيرٌ"],
                 answer: "مِنْ وَالٍ"
            },
            {
                 question: "Contoh bacaan Idgham Bila Ghunnah dengan huruf lam (ل) adalah...",
                 choices: ["مِنْ لَّدُنْهُ", "مِنْ خَيْرٍ", "عَلِيمٌ حَكِيمٌ", "سَمِيعٌ بَصِيرٌ"],
                 answer: "مِنْ لَّدُنْهُ"
            },
            {
                 question: "Contoh bacaan Idgham Bila Ghunnah dengan huruf ra' (ر) adalah...",
                 choices: ["مِنْ رَبِّهِمْ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                 answer: "مِنْ رَبِّهِمْ"
            },
            {
                 question: "Contoh bacaan Iqlab dengan huruf ba' (ب) adalah...",
                 choices: ["سَمِيعٌ بَصِيرٌ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                 answer: "سَمِيعٌ بَصِيرٌ"
            },
            {
                 question: "Contoh bacaan Ikhfa Haqiqi dengan huruf tsa' (ث) adalah...",
                 choices: ["مِنْ ثَمَرَةٍ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "سَمِيعٌ بَصِيرٌ"],
                 answer: "مِنْ ثَمَرَةٍ"
            },
            {
                 question: "Contoh bacaan Ikhfa Haqiqi dengan huruf jim (ج) adalah...",
                 choices: ["مِنْ جِنٍّ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                 answer: "مِنْ جِنٍّ"
            },
             {
                question: "Contoh bacaan Ikhfa Haqiqi dengan huruf dal (د) adalah...",
                choices: ["مِنْ دُونِ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "سَمِيعٌ بَصِيرٌ"],
                answer: "مِنْ دُونِ"
            },
            {
                question: "Contoh bacaan Ikhfa Haqiqi dengan huruf dzal (ذ) adalah...",
                choices: ["مِنْ ذُرِّيَّةٍ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                answer: "مِنْ ذُرِّيَّةٍ"
            },
            {
                question: "Contoh bacaan Ikhfa Haqiqi dengan huruf zai (ز) adalah...",
                choices: ["مِنْ زَيْنَةٍ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "سَمِيعٌ بَصِيرٌ"],
                answer: "مِنْ زَيْنَةٍ"
            },
            {
                question: "Contoh bacaan Ikhfa Haqiqi dengan huruf sin (س) adalah...",
                choices: ["مِنْ سُوءٍ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                answer: "مِنْ سُوءٍ"
            },
            {
                question: "Contoh bacaan Ikhfa Haqiqi dengan huruf syin (ش) adalah...",
                choices: ["مِنْ شَرٍّ", "مِنْ رَبِّهِمْ", "عَلِيمٌ حَكِيمٌ", "سَمِيعٌ بَصِيرٌ"],
                answer: "مِنْ شَرٍّ"
            },
            {
                question: "Contoh bacaan Ikhfa Haqiqi dengan huruf shod (ص) adalah...",
                choices: ["مِنْ صَلْصَالٍ", "مِنْ غِلٍّ", "خَيْرٌ لَّكُمْ", "مِنْ وَالٍ"],
                answer: "مِنْ صَلْصَالٍ"
            }
        ],
        'alif-lam': [
            {
                question: "Contoh Alif Lam Qamariyah adalah...",
                choices: ["الْقَمَرُ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                answer: "الْقَمَرُ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah adalah...",
                choices: ["الشَّمْسُ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "الشَّمْسُ"
            },
            {
                 question: "Pada kata 'الْكِتَابُ', Alif Lam dibaca...",
                 choices: ["Jelas (Qamariyah)", "Tidak Jelas (Syamsiyah)", "Idgham", "Ikhfa"],
                 answer: "Jelas (Qamariyah)"
            },
            {
                 question: "Pada kata 'الشَّمْسُ', Alif Lam dibaca...",
                 choices: ["Jelas (Qamariyah)", "Tidak Jelas (Syamsiyah)", "Idgham", "Ikhfa"],
                 answer: "Tidak Jelas (Syamsiyah)"
            },
            {
                 question: "Pada kata 'الرَّحْمٰنُ', Alif Lam dibaca...",
                 choices: ["Jelas (Qamariyah)", "Tidak Jelas (Syamsiyah)", "Idgham", "Ikhfa"],
                 answer: "Tidak Jelas (Syamsiyah)"
            },
            {
                 question: "Pada kata 'النَّاسُ', Alif Lam dibaca...",
                 choices: ["Jelas (Qamariyah)", "Tidak Jelas (Syamsiyah)", "Idgham", "Ikhfa"],
                 answer: "Tidak Jelas (Syamsiyah)"
            },
            {
                 question: "Pada kata 'الْعَالَمِينَ', Alif Lam dibaca...",
                 choices: ["Jelas (Qamariyah)", "Tidak Jelas (Syamsiyah)", "Idgham", "Ikhfa"],
                 answer: "Jelas (Qamariyah)"
            },
            {
                 question: "Pada kata 'الْأَرْضِ', Alif Lam dibaca...",
                 choices: ["Jelas (Qamariyah)", "Tidak Jelas (Syamsiyah)", "Idgham", "Ikhfa"],
                 answer: "Jelas (Qamariyah)"
            },
            {
                 question: "Huruf setelah Alif Lam pada kata 'الْحَمْدُ' adalah...",
                 choices: ["ح", "ش", "ر", "ن"],
                 answer: "ح"
            },
            {
                 question: "Huruf setelah Alif Lam pada kata 'الصَّلَاةُ' adalah...",
                 choices: ["ص", "ك", "غ", "ء"],
                 answer: "ص"
            },
            {
                 question: "Huruf setelah Alif Lam pada kata 'الْعَصْرِ' adalah...",
                 choices: ["ع", "ت", "ض", "ظ"],
                 answer: "ع"
            },
            {
                 question: "Huruf setelah Alif Lam pada kata 'الذِّكْرُ' adalah...",
                 choices: ["ذ", "ب", "ج", "د"],
                 answer: "ذ"
            },
            {
                 question: "Huruf setelah Alif Lam pada kata 'الْفَجْرِ' adalah...",
                 choices: ["ف", "ل", "م", "و"],
                 answer: "ف"
            },
            {
                 question: "Huruf setelah Alif Lam pada kata 'الظَّالِمِينَ' adalah...",
                 choices: ["ظ", "ا", "ي", "ء"],
                 answer: "ظ"
            },
            {
                question: "Contoh Alif Lam Qamariyah dengan huruf 'ain (ع) adalah...",
                choices: ["الْعَالَمِينَ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                answer: "الْعَالَمِينَ"
            },
            {
                question: "Contoh Alif Lam Qamariyah dengan huruf ghain (غ) adalah...",
                choices: ["الْغَفُورُ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                answer: "الْغَفُورُ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah dengan huruf ra' (ر) adalah...",
                choices: ["الرَّحْمٰنُ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "الرَّحْمٰنُ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah dengan huruf nun (ن) adalah...",
                choices: ["النَّاسُ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "النَّاسُ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah dengan huruf lam (ل) adalah...",
                choices: ["اللَّيْلُ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "اللَّيْلُ"
            },
            {
                 question: "Contoh Alif Lam Syamsiyah dengan huruf dzal (ذ) adalah...",
                 choices: ["الذِّكْرُ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                 answer: "الذِّكْرُ"
            },
            {
                 question: "Contoh Alif Lam Qamariyah dengan huruf qaf (ق) adalah...",
                 choices: ["الْقَمَرُ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                 answer: "الْقَمَرُ"
            },
             {
                question: "Contoh Alif Lam Qamariyah dengan huruf kaf (ك) adalah...",
                choices: ["الْكِتَابُ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                answer: "الْKِتَابُ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah dengan huruf tsa (ث) adalah...",
                choices: ["الثَّوَابُ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "الثَّوَابُ"
            },
            {
                question: "Contoh Alif Lam Qamariyah dengan huruf ha' (ح) adalah...",
                choices: ["الْحَمْدُ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                answer: "الْحَمْدُ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah dengan huruf shad (ص) adalah...",
                choices: ["الصَّلَاةُ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "الصَّلَاةُ"
            },
            {
                question: "Contoh Alif Lam Qamariyah dengan huruf jim (ج) adalah...",
                choices: ["الْجَنَّةُ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                answer: "الْجَنَّةُ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah dengan huruf dal (د) adalah...",
                choices: ["الدُّنْيَا", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "الدُّنْيَا"
            },
            {
                question: "Contoh Alif Lam Qamariyah dengan huruf fa' (ف) adalah...",
                choices: ["الْفَجْرِ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                answer: "الْفَجْرِ"
            },
            {
                question: "Contoh Alif Lam Syamsiyah dengan huruf zha (ظ) adalah...",
                choices: ["الظَّالِمِينَ", "الْكِتَابُ", "الْعَالَمِينَ", "الْأَرْضِ"],
                answer: "الظَّالِمِينَ"
            },
            {
                question: "Contoh Alif Lam Qamariyah dengan huruf hamzah (ء) adalah...",
                 choices: ["الْأَرْضِ", "الشَّمْسُ", "الرَّحْمٰنُ", "النَّاسُ"],
                 answer: "الْأَرْضِ"
             }
        ],
        'qalqalah': [
            {
                 question: "Contoh Qalqalah Sugra pada kata yang berharakat sukun asli adalah...",
                 choices: ["يَطْمَعُ", "قَالَ", "فَاقْطَعْ", "تَبَّ"],
                 answer: "يَطْمَعُ"
            },
            {
                 question: "Contoh Qalqalah Kubra pada kata di akhir ayat adalah...",
                 choices: ["قُلْ", "خَلَقَ", "فَاقْطَعْ", "تَبَّ"],
                 answer: "تَبَّ"
            },
            {
                 question: "Huruf Qalqalah pada kata 'يَطْمَعُ' adalah...",
                 choices: ["ط", "ق", "ب", "ج"],
                 answer: "ط"
            },
            {
                 question: "Huruf Qalqalah pada kata 'قُلْ' adalah...",
                 choices: ["ق", "ط", "ب", "ج"],
                 answer: "ق"
            },
            {
                 question: "Huruf Qalqalah pada kata 'تَبَّ' adalah...",
                 choices: ["ب", "ق", "ط", "ج"],
                 answer: "ب"
            },
            {
                 question: "Huruf Qalqalah pada kata 'فَاقْطَعْ' adalah...",
                 choices: ["ق", "ط", "ب", "ج"],
                 answer: "ق"
            },
            {
                 question: "Jenis Qalqalah pada kata 'يَطْمَعُ' adalah...",
                 choices: ["Sugra", "Kubra", "Akbar", "Asghar"],
                 answer: "Sugra"
            },
            {
                 question: "Jenis Qalqalah pada kata 'قُلْ' adalah...",
                 choices: ["Sugra", "Kubra", "Akbar", "Asghar"],
                 answer: "Kubra"
            },
            {
                 question: "Jenis Qalqalah pada kata 'تَبَّ' adalah...",
                 choices: ["Sugra", "Kubra", "Akbar", "Asghar"],
                 answer: "Kubra"
            },
            {
                 question: "Jenis Qalqalah pada kata 'فَاقْطَعْ' adalah...",
                 choices: ["Sugra", "Kubra", "Akbar", "Asghar"],
                 answer: "Sugra"
            },
             {
                question: "Contoh Qalqalah Sugra dengan huruf qaf (ق) adalah...",
                choices: ["يَقْطَعُونَ", "قَالَ", "فَاقْطَعْ", "تَبَّ"],
                answer: "يَقْطَعُونَ"
            },
            {
                question: "Contoh Qalqalah Sugra dengan huruf tha' (ط) adalah...",
                choices: ["يَطْمَعُونَ", "خَلَقَ", "فَاقْطَعْ", "تَبَّ"],
                answer: "يَطْمَعُونَ"
            },
            {
                question: "Contoh Qalqalah Sugra dengan huruf ba' (ب) adalah...",
                choices: ["يَبْتَغُونَ", "قَالَ", "فَاقْطَعْ", "تَبَّ"],
                answer: "يَبْتَغُونَ"
            },
            {
                question: "Contoh Qalqalah Sugra dengan huruf jim (ج) adalah...",
                choices: ["يَجْعَلُونَ", "خَلَقَ", "فَاقْطَعْ", "تَبَّ"],
                answer: "يَجْعَلُونَ"
            },
            {
                question: "Contoh Qalqalah Sugra dengan huruf dal (د) adalah...",
                choices: ["يَدْعُونَ", "قَالَ", "فَاقْطَعْ", "تَبَّ"],
                answer: "يَدْعُونَ"
            },
            {
                 question: "Contoh Qalqalah Kubra dengan huruf qaf (ق) di akhir ayat adalah...",
                 choices: ["خَلَقَ", "قُلْ", "فَاقْطَعْ", "تَبَّ"],
                 answer: "قُلْ"
            },
            {
                 question: "Contoh Qalqalah Kubra dengan huruf tha' (ط) di akhir ayat adalah...",
                 choices: ["خَلَقَ", "قَالَ", "مُحِيطْ", "تَبَّ"],
                 answer: "مُحِيطْ"
            },
            {
                 question: "Contoh Qalqalah Kubra dengan huruf ba' (ب) di akhir ayat adalah...",
                 choices: ["خَلَقَ", "قَالَ", "فَاقْطَعْ", "تَبَّ"],
                 answer: "تَبَّ"
            },
            {
                 question: "Contoh Qalqalah Kubra dengan huruf jim (ج) di akhir ayat adalah...",
                 choices: ["خَلَقَ", "قَالَ", "فَاقْطَعْ", "بُرُوجْ"],
                 answer: "بُرُوجْ"
            },
            {
                 question: "Contoh Qalqalah Kubra dengan huruf dal (د) di akhir ayat adalah...",
                 choices: ["خَلَقَ", "قَالَ", "فَاقْطَعْ", "أَحَدْ"],
                 answer: "أَحَدْ"
            },
            {
                 question: "Kata 'خَلَقَ' tidak mengandung Qalqalah karena...",
                 choices: ["Tidak sukun", "Di tengah kata", "Huruf bukan Qalqalah", "Di awal kata"],
                 answer: "Tidak sukun"
            },
            {
                 question: "Kata 'قَالَ' tidak mengandung Qalqalah karena...",
                 choices: ["Tidak sukun", "Di tengah kata", "Huruf bukan Qalqalah", "Di awal kata"],
                 answer: "Tidak sukun"
            },
            {
                 question: "Kata 'فَاقْطَعْ' mengandung Qalqalah Sugra karena...",
                 choices: ["Sukun asli", "Di akhir kata", "Huruf Qalqalah", "Di awal kata"],
                 answer: "Sukun asli"
            },
            {
                 question: "Kata 'تَبَّ' mengandung Qalqalah Kubra karena...",
                 choices: ["Di akhir ayat", "Sukun asli", "Huruf Qalqalah", "Di awal kata"],
                 answer: "Di akhir ayat"
            },
            {
                 question: "Kata 'يَقْطَعُونَ' mengandung Qalqalah...",
                 choices: ["Sugra", "Kubra", "Akbar", "Tidak ada"],
                 answer: "Sugra"
            },
            {
                 question: "Kata 'مُحِيطْ' mengandung Qalqalah...",
                 choices: ["Kubra", "Sugra", "Akbar", "Tidak ada"],
                 answer: "Kubra"
            },
            {
                 question: "Kata 'بُرُوجْ' mengandung Qalqalah...",
                 choices: ["Kubra", "Sugra", "Akbar", "Tidak ada"],
                 answer: "Kubra"
            },
            {
                 question: "Kata 'أَحَدْ' mengandung Qalqalah...",
                 choices: ["Kubra", "Sugra", "Akbar", "Tidak ada"],
                 answer: "Kubra"
            },
            {
                 question: "Kata 'يَبْتَغُونَ' mengandung Qalqalah...",
                 choices: ["Sugra", "Kubra", "Akbar", "Tidak ada"],
                 answer: "Sugra"
            },
            {
                 question: "Kata 'يَجْعَلُونَ' mengandung Qalqalah...",
                 choices: ["Sugra", "Kubra", "Akbar", "Tidak ada"],
                 answer: "Sugra"
            }
        ],
        'mad': [
            {
                 question: "Contoh Mad Wajib Muttasil adalah...",
                 choices: ["جَاءَ", "قَالُوا", "بِمَا أُنزِلَ", "هَٰذَا"],
                 answer: "جَاءَ"
            },
            {
                 question: "Contoh Mad Jaiz Munfasil adalah...",
                 choices: ["بِمَا أُنزِلَ", "قَالُوا", "جَاءَ", "هَٰذَا"],
                 answer: "بِمَا أُنزِلَ"
            },
            {
                 question: "Contoh Mad Thabi'i adalah...",
                 choices: ["قَالُوا", "جَاءَ", "بِمَا أُنزِلَ", "هَٰذَا"],
                 answer: "قَالُوا"
            },
            {
                 question: "Contoh Mad 'Aridh Lissukun adalah...",
                 choices: ["الْعَالَمِينَ", "جَاءَ", "بِمَا أُنزِلَ", "قَالُوا"],
                 answer: "الْعَالَمِينَ"
            },
            {
                 question: "Panjang bacaan Mad Wajib Muttasil adalah...",
                 choices: ["4-5 harakat", "2 harakat", "6 harakat", "1 harakat"],
                 answer: "4-5 harakat"
            },
            {
                 question: "Panjang bacaan Mad Jaiz Munfasil adalah...",
                 choices: ["4-5 harakat", "2 harakat", "6 harakat", "1 harakat"],
                 answer: "4-5 harakat"
            },
            {
                 question: "Panjang bacaan Mad Thabi'i adalah...",
                 choices: ["2 harakat", "4-5 harakat", "6 harakat", "1 harakat"],
                 answer: "2 harakat"
            },
            {
                 question: "Panjang bacaan Mad 'Aridh Lissukun adalah...",
                 choices: ["2, 4, atau 6 harakat", "2 harakat", "4-5 harakat", "1 harakat"],
                 answer: "2, 4, atau 6 harakat"
            },
            {
                 question: "Pada kata 'جَاءَ', Mad terjadi karena...",
                 choices: ["Hamzah dalam satu kata", "Hamzah di kata berbeda", "Sukun di akhir kata", "Tidak ada"],
                 answer: "Hamzah dalam satu kata"
            },
            {
                 question: "Pada kata 'بِمَا أُنزِلَ', Mad terjadi karena...",
                 choices: ["Hamzah di kata berbeda", "Hamzah dalam satu kata", "Sukun di akhir kata", "Tidak ada"],
                 answer: "Hamzah di kata berbeda"
            },
            {
                 question: "Pada kata 'قَالُوا', Mad terjadi karena...",
                 choices: ["Alif setelah fathah", "Hamzah di kata berbeda", "Sukun di akhir kata", "Tidak ada"],
                 answer: "Alif setelah fathah"
            },
            {
                 question: "Pada kata 'الْعَالَمِينَ', Mad terjadi karena...",
                 choices: ["Sukun di akhir kata", "Hamzah di kata berbeda", "Alif setelah fathah", "Tidak ada"],
                 answer: "Sukun di akhir kata"
            },
            {
                 question: "Contoh Mad Badal adalah...",
                 choices: ["آمَنُوا", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "آمَنُوا"
            },
            {
                 question: "Contoh Mad Lazim Mutsaqqal Kilmi adalah...",
                 choices: ["الطَّآمَّةُ", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "الطَّآمَّةُ"
            },
            {
                 question: "Contoh Mad Layyin adalah...",
                 choices: ["خَوْفٌ", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "خَوْفٌ"
            },
            {
                 question: "Contoh Mad 'Iwad adalah...",
                 choices: ["عَلِيمًا", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "عَلِيمًا"
            },
             {
                question: "Contoh Mad Wajib Muttasil dengan hamzah di akhir adalah...",
                choices: ["السَّمَاءُ", "قَالُوا", "بِمَا أُنزِلَ", "هَٰذَا"],
                answer: "السَّمَاءُ"
            },
            {
                question: "Contoh Mad Jaiz Munfasil dengan hamzah di awal adalah...",
                choices: ["إِنَّا أَعْطَيْنَا", "قَالُوا", "جَاءَ", "هَٰذَا"],
                answer: "إِنَّا أَعْطَيْنَا"
            },
            {
                question: "Contoh Mad Thabi'i dengan wawu sukun setelah dhammah adalah...",
                choices: ["يَقُولُونَ", "جَاءَ", "بِمَا أُنزِلَ", "هَٰذَا"],
                answer: "يَقُولُونَ"
            },
            {
                question: "Contoh Mad 'Aridh Lissukun dengan ya' sukun di akhir adalah...",
                choices: ["الْمُهْتَدِينَ", "جَاءَ", "بِمَا أُنزِلَ", "قَالُوا"],
                answer: "الْمُهْتَدِينَ"
            },
            {
                 question: "Contoh Mad Badal dengan hamzah sebelum huruf mad adalah...",
                 choices: ["أُوتُوا", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "أُوتُوا"
            },
            {
                 question: "Contoh Mad Lazim Mukhaffaf Kilmi adalah...",
                 choices: ["آلْآنَ", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "آلْآنَ"
            },
            {
                 question: "Contoh Mad Layyin dengan wawu sukun sebelum fathah adalah...",
                 choices: ["بَيْتٌ", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "بَيْتٌ"
            },
            {
                 question: "Contoh Mad 'Iwad dengan tanwin fathah di akhir adalah...",
                 choices: ["شَيْئًا", "قَالُوا", "جَاءَ", "بِمَا أُنزِلَ"],
                 answer: "شَيْئًا"
            },
            {
                 question: "Mad yang terjadi karena ada hamzah dalam satu kata disebut...",
                 choices: ["Wajib Muttasil", "Jaiz Munfasil", "Thabi'i", "'Aridh Lissukun"],
                 answer: "Wajib Muttasil"
            },
            {
                 question: "Mad yang terjadi karena ada hamzah di dua kata berbeda disebut...",
                 choices: ["Jaiz Munfasil", "Wajib Muttasil", "Thabi'i", "'Aridh Lissukun"],
                 answer: "Jaiz Munfasil"
            },
            {
                 question: "Mad yang terjadi karena alif setelah fathah disebut...",
                 choices: ["Thabi'i", "Wajib Muttasil", "Jaiz Munfasil", "Lazim"],
                 answer: "Thabi'i"
            },
            {
                 question: "Mad yang terjadi karena waqaf pada huruf yang sebelumnya berharakat mad disebut...",
                 choices: ["'Aridh Lissukun", "Thabi'i", "Lazim", "Badal"],
                 answer: "'Aridh Lissukun"
            },
            {
                 question: "Mad yang terjadi karena ada wawu atau ya' sukun yang didahului huruf berharakat fathah dan diwaqafkan disebut...",
                 choices: ["Layyin", "Thabi'i", "Badal", "Lazim"],
                 answer: "Layyin"
            },
            {
                 question: "Mad yang terjadi karena pengganti tanwin fathah saat waqaf disebut...",
                 choices: ["'Iwad", "Lazim", "Badal", "Layyin"],
                 answer: "'Iwad"
            }
        ]
    };

    let currentQuestionIndex = {}; // Melacak indeks pertanyaan saat ini untuk setiap kategori
    let categoryScores = {};    // Objek untuk menyimpan skor per kategori
    let timer; // Variabel untuk menyimpan interval timer
    const TIME_LIMIT = 30; // Batas waktu per pertanyaan dalam detik
    const CORRECT_ANSWER_SCORE = 10; // Skor untuk jawaban benar

    // Inisialisasi currentQuestionIndex dan categoryScores untuk setiap kategori saat DOMContentLoaded
    for (const category in questions) {
        currentQuestionIndex[category] = 0;
        categoryScores[category] = 0; // Inisialisasi skor kategori ke 0
    }

    // Fungsi untuk menampilkan screen tertentu
    function showScreen(id) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
    }

    // Fungsi untuk memulai timer
    function startTimer(category) {
        resetTimer(); // Pastikan timer sebelumnya dihentikan
        let timeLeft = TIME_LIMIT;
        const countdownDisplay = document.getElementById(`countdown-${category}`);
        if (countdownDisplay) { // Periksa apakah elemen timer ada di screen aktif
            countdownDisplay.textContent = timeLeft;
            countdownDisplay.classList.remove('time-up'); // Reset tampilan waktu habis
        }

        timer = setInterval(() => {
            timeLeft--;
            if (countdownDisplay) {
                countdownDisplay.textContent = timeLeft;
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                if (countdownDisplay) {
                    countdownDisplay.textContent = 'Waktu Habis!';
                    countdownDisplay.classList.add('time-up');
                }
                // Otomatis jawab salah jika waktu habis
                const currentCategoryQuestions = questions[category];
                if (currentCategoryQuestions && currentCategoryQuestions[currentQuestionIndex[category]]) {
                    const currentQ = currentCategoryQuestions[currentQuestionIndex[category]];
                    checkAnswer(category, null, currentQ.answer, null, true); // null untuk selectedChoice dan clickedButton, true untuk isTimeUp
                } else {
                    // Jika tidak ada pertanyaan yang tersisa (misalnya sudah di akhir array)
                    // Langsung lanjutkan ke pertanyaan berikutnya atau kembali ke menu
                    handleEndOfCategory(category);
                }
            }
        }, 1000); // Setiap 1 detik
    }

    // Fungsi untuk menghentikan dan mereset timer
    function resetTimer() {
        clearInterval(timer); // Hentikan interval
        // Cari display timer di screen yang sedang aktif dan reset teksnya
        const activeCountdownDisplay = document.querySelector('.screen.active .timer-display span');
        if (activeCountdownDisplay) {
            activeCountdownDisplay.textContent = TIME_LIMIT;
            activeCountdownDisplay.classList.remove('time-up');
        }
    }

    // Fungsi untuk memperbarui tampilan skor
    function updateScoreDisplay(category) {
        const scoreDisplayEl = document.getElementById(`score-${category}`);
        if (scoreDisplayEl) {
            scoreDisplayEl.textContent = categoryScores[category];
        }
    }

    // Fungsi untuk memuat pertanyaan
    function loadQuestion(category) {
        resetTimer(); // Reset timer sebelum memuat pertanyaan baru

        const questionEl = document.getElementById(`question-${category}`);
        const choicesEl = document.getElementById(`choices-${category}`);

        // Pastikan tampilan skor diperbarui setiap kali pertanyaan baru dimuat
        updateScoreDisplay(category);

        if (!questions[category] || questions[category].length === 0) {
            questionEl.textContent = "Tidak ada pertanyaan untuk kategori ini.";
            choicesEl.innerHTML = "";
            return;
        }

        // Mengacak urutan pertanyaan untuk kategori saat ini
        // Hanya acak jika belum pernah diacak sebelumnya dalam sesi kategori ini
        if (!questions[category].shuffledOnce) {
             questions[category].sort(() => Math.random() - 0.5);
             questions[category].shuffledOnce = true; // Menandai bahwa sudah diacak sekali
        }

        const questionData = questions[category][currentQuestionIndex[category]];

        questionEl.textContent = questionData.question;
        choicesEl.innerHTML = ''; // Kosongkan pilihan sebelumnya

        // Acak pilihan jawaban
        const shuffledChoices = [...questionData.choices].sort(() => Math.random() - 0.5);

        shuffledChoices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-btn');
            button.textContent = choice;
            // Menambahkan event listener untuk memeriksa jawaban
            button.addEventListener('click', () => checkAnswer(category, choice, questionData.answer, button, false)); // false untuk isTimeUp
            choicesEl.appendChild(button);
        });

        startTimer(category); // Mulai timer setelah pertanyaan dimuat
    }

    // Fungsi untuk memeriksa jawaban
    function checkAnswer(category, selectedChoice, correctAnswer, clickedButton, isTimeUp = false) {
        resetTimer(); // Hentikan timer begitu jawaban dipilih atau waktu habis

        const allChoiceButtons = document.querySelectorAll(`#choices-${category} .choice-btn`);
        allChoiceButtons.forEach(button => {
            button.disabled = true; // Nonaktifkan semua tombol setelah memilih
            if (button.textContent === correctAnswer) {
                button.classList.add('correct'); // Tandai jawaban yang benar
            }
        });

        let titleText, iconType, messageText;

        if (isTimeUp) {
            titleText = 'Waktu Habis!';
            iconType = 'error';
            messageText = `Jawaban Salah. Yang benar adalah: ${correctAnswer}`;
        } else if (selectedChoice === correctAnswer) {
            // Jawaban benar, tambahkan skor
            categoryScores[category] += CORRECT_ANSWER_SCORE;
            updateScoreDisplay(category); // Perbarui tampilan skor
            if (clickedButton) { // Pastikan clickedButton ada sebelum mencoba menambah kelas
                clickedButton.classList.add('correct');
            }
            titleText = 'Jawaban Benar!';
            iconType = 'success';
            messageText = `Skor Anda bertambah ${CORRECT_ANSWER_SCORE} poin!`;
        } else {
            // Jawaban salah
            if (clickedButton) { // Pastikan clickedButton ada sebelum mencoba menambah kelas
                clickedButton.classList.add('incorrect');
            }
            titleText = 'Jawaban Salah!';
            iconType = 'error';
            messageText = `Yang benar adalah: ${correctAnswer}`;
        }

        // Tampilkan SweetAlert
        Swal.fire({
            title: titleText,
            text: messageText,
            icon: iconType,
            timer: 5000, // Menutup otomatis setelah 1.5 detik
            timerProgressBar: true,
            showConfirmButton: false, // Tidak menampilkan tombol OK
            allowOutsideClick: false, // Tidak bisa ditutup dengan klik di luar
            didOpen: () => {
                // Swal.showLoading(); // Opsional: tampilkan loading bar di dalam alert
            }
        }).then(() => {
            // Lanjut ke pertanyaan berikutnya setelah SweetAlert tertutup
            currentQuestionIndex[category]++;
            if (currentQuestionIndex[category] < questions[category].length) {
                loadQuestion(category);
            } else {
                handleEndOfCategory(category);
            }
        });
    }

    // Fungsi untuk menangani akhir dari sebuah kategori
    function handleEndOfCategory(category) {
        Swal.fire({
            title: 'Selesai!',
            text: `Semua pertanyaan untuk kategori ini telah selesai! Total skor Anda: ${categoryScores[category]}`,
            icon: 'info',
            confirmButtonText: 'Kembali ke Menu Utama',
            allowOutsideClick: false // Tidak bisa ditutup dengan klik di luar
        }).then(() => {
            showScreen('main-menu'); // Kembali ke menu utama
            currentQuestionIndex[category] = 0; // Reset indeks untuk kategori ini
            categoryScores[category] = 0; // Reset skor kategori ini
            updateScoreDisplay(category); // Perbarui tampilan skor ke 0
            questions[category].shuffledOnce = false; // Reset status shuffle untuk kategori ini agar pertanyaan diacak lagi saat dimainkan kembali
        });
    }

    // Event Listener untuk tombol menu (navigasi antar kategori)
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetScreenId = event.target.dataset.target;
            showScreen(targetScreenId);
            loadQuestion(targetScreenId); // Muat pertanyaan saat masuk kategori
        });
    });

    // Event Listener untuk tombol "Kembali ke Menu"
    backToMenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            resetTimer(); // Hentikan timer saat kembali ke menu

            // Identifikasi kategori yang sedang aktif untuk mereset datanya
            let activeCategory = null;
            screens.forEach(screen => {
                // Pastikan bukan main-menu dan memiliki id yang sesuai dengan kategori pertanyaan
                if (screen.classList.contains('active') && screen.id !== 'main-menu' && questions[screen.id]) {
                    activeCategory = screen.id;
                }
            });

            if (activeCategory) {
                currentQuestionIndex[activeCategory] = 0; // Reset indeks untuk kategori ini
                categoryScores[activeCategory] = 0; // Reset skor kategori ini
                updateScoreDisplay(activeCategory); // Perbarui tampilan skor ke 0
                questions[activeCategory].shuffledOnce = false; // Reset status shuffle untuk kategori ini
            }

            showScreen('main-menu');
        });
    });

    // Tampilkan menu utama saat pertama kali memuat aplikasi
    showScreen('main-menu');
});