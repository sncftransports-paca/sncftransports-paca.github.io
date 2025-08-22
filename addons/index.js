fetch('lignes.json')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('lignes-grid');
    data.lignes.forEach(ligne => {
      // Détermine l'icône selon le type
      let icon = 'icons/ter.svg'; // Par défaut
      if (ligne.type === 'Train des Pignes') {
        icon = 'icons/train_pignes.svg';
      }
      const card = document.createElement('div');
      card.className = 'ligne-card';
      card.innerHTML = `
        <img src="${icon}" alt="Icône ${ligne.nom}">
        <h2>${ligne.nom}</h2>
        <a href="ligne.html?ligne=${ligne.id}">Voir la ligne</a>
      `;
      grid.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des lignes :', error);
  });