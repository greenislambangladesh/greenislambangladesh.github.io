document.addEventListener('DOMContentLoaded', () => {
    // Helper to get day of the year
    function getDayOfYear() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // Utility to safely update element content
    function updateElement(id, content) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = content;
    }

    const day = getDayOfYear();

    // Show loading placeholders
    updateElement('daily-ayah-arabic', 'Loading Arabic Ayah...');
    updateElement('daily-ayah-english', 'Loading English Translation...');
    updateElement('daily-ayah-reference', '');
    updateElement('daily-hadith', 'Loading Hadith...');
    updateElement('daily-hadith-reference', '');

    async function fetchAyah() {
        const totalAyahs = 6236;
        const ayahNum = (day % totalAyahs) + 1;
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/editions/quran-uthmani,en.asad`);
            const data = await response.json();
            if (data.code === 200) {
                const arabic = data.data[0].text;
                const english = data.data[1].text;
                const surah = data.data[0].surah.englishName;
                const ayahInSurah = data.data[0].numberInSurah;

                updateElement('daily-ayah-arabic', arabic);
                updateElement('daily-ayah-english', english);
                updateElement('daily-ayah-reference', `<em>${surah} ${ayahInSurah}</em>`);
            } else {
                updateElement('daily-ayah-arabic', 'Failed to load Ayah.');
                updateElement('daily-ayah-english', '');
                updateElement('daily-ayah-reference', '');
            }
        } catch (error) {
            updateElement('daily-ayah-arabic', 'Error fetching Ayah.');
            updateElement('daily-ayah-english', '');
            updateElement('daily-ayah-reference', '');
            console.error('Error fetching Ayah:', error);
        }
    }

    async function fetchHadith() {
        const totalBukhariHadiths = 7563;
        const hadithId = (day % totalBukhariHadiths) + 1;
        try {
            const response = await fetch(`https://random-hadith-generator.vercel.app/bukhari/${hadithId}`);
            const data = await response.json();
            if (data.data) {
                const hadithText = `${data.data.header} ${data.data.hadith_english}`;
                const reference = data.data.refno;

                updateElement('daily-hadith', hadithText);
                updateElement('daily-hadith-reference', `<em>${reference}</em>`);
            } else {
                updateElement('daily-hadith', 'Failed to load Hadith.');
                updateElement('daily-hadith-reference', '');
            }
        } catch (error) {
            updateElement('daily-hadith', 'Error fetching Hadith.');
            updateElement('daily-hadith-reference', '');
            console.error('Error fetching Hadith:', error);
        }
    }

    fetchAyah();
    fetchHadith();

    // Fade-in animations for sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('opacity-0', 'transition-opacity', 'duration-1000');
        setTimeout(() => section.classList.remove('opacity-0'), 300);
    });
});