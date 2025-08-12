document.addEventListener('DOMContentLoaded', () => {
    const longTitleInput = document.getElementById('long-title');
    const shortenBtn = document.getElementById('shorten-btn');
    const shortenedTitleDisplay = document.getElementById('shortened-title');

    if (longTitleInput && shortenBtn && shortenedTitleDisplay) {
        shortenBtn.addEventListener('click', async () => {
            const fullTitle = longTitleInput.value.trim();
            if (fullTitle === "") {
                shortenedTitleDisplay.textContent = "Veuillez entrer un titre.";
                return;
            }

            shortenedTitleDisplay.textContent = "Raccourcissement en cours...";

            try {
                const response = await fetch('/api/shorten', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: fullTitle }),
                });

                if (!response.ok) {
                    throw new Error('Erreur du serveur.');
                }

                const data = await response.json();
                shortenedTitleDisplay.textContent = data.shortenedTitle;

            } catch (error) {
                console.error('Erreur:', error);
                shortenedTitleDisplay.textContent = "Une erreur est survenue. Veuillez réessayer.";
            }
        });
    }
});
