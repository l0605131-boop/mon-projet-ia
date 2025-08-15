document.getElementById('analyseForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const ctr = document.getElementById('ctr').value;
    const likes = document.getElementById('likes').value;
    const dislikes = document.getElementById('dislikes').value;
    const resultDiv = document.getElementById('result');

    let suggestions = [];

    // Logique d'analyse
    const totalVotes = parseInt(likes) + parseInt(dislikes);
    const likeRatio = totalVotes > 0 ? (likes / totalVotes) * 100 : 0;
    
    if (ctr < 3) {
        suggestions.push("Le **taux de clics (CTR)** est faible. Cela suggère que la **miniature** ou le **titre** ne sont pas assez accrocheurs. Essayez de les rendre plus percutants pour attirer l'attention !");
    } else if (ctr >= 3 && ctr < 6) {
        suggestions.push("Le **taux de clics (CTR)** est moyen. La miniature et le titre sont bons, mais peuvent être améliorés.");
    } else {
        suggestions.push("Le **taux de clics (CTR)** est élevé ! La **miniature** et le **titre** sont excellents.");
    }

    if (totalVotes === 0) {
        suggestions.push("Il n'y a pas assez de données pour les 'J'aime'/'Je n'aime pas'.");
    } else if (likeRatio < 80) {
        suggestions.push("Le **ratio de 'J'aime'** est bas. Cela peut indiquer que le **montage**, le **sujet de la vidéo** ou le **contenu en général** n'a pas répondu aux attentes. Pensez à revoir le contenu pour les prochaines vidéos.");
    } else {
        suggestions.push("Le **ratio de 'J'aime'** est élevé. Le **contenu** de la vidéo a plu ! Continuez comme ça.");
    }

    // Afficher les résultats
    resultDiv.innerHTML = "<h2>Suggestions d'amélioration :</h2><ul>" +
                          suggestions.map(s => "<li>" + s + "</li>").join('') +
                          "</ul>";
});
