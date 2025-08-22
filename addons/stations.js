// Récupérer et afficher les gares triées par ordre alphabétique
fetch('stations.json')
  .then(response => response.json())
  .then(data => {
    const stationsContainer = document.getElementById('stations');

    // Récupère et trie les clés selon le nom des gares
    const sortedKeys = Object.keys(data).sort((a, b) => {
      return data[a].nom.localeCompare(data[b].nom);
    });

    // Création des cartes pour chaque gare
    sortedKeys.forEach(key => {
      const station = data[key];
      const card = document.createElement('a');
      card.href = `station.html?station=${encodeURIComponent(key)}`;
      card.className = 'station-card';
      card.innerHTML = `
        <img class="station-image" src="${station.image && station.image.trim() !== '' ? 'images/' + station.image : station.imagelink}" alt="${station.nom}">
        <div class="station-content">
          <h2>${station.nom}</h2>
          <div>
            ${station.lignes.map(ligne => `
              <span class="badge">${getTypeIcon(ligne.type)} ${ligne.type.toUpperCase()}</span>
            `).join(' ')}
          </div>
        </div>
        <div class="image-credit">
          <p>Image de <a href="${station.imagepage}" target="_blank">${station.imageauthor}</a></p>
        </div>
      `;
      stationsContainer.appendChild(card);
    });

    // Ajoute un écouteur d'événement sur la barre de recherche
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      // Pour chaque carte de gare, on vérifie si le nom de la gare correspond au texte recherché
      document.querySelectorAll('.station-card').forEach(card => {
        const stationName = card.querySelector('h2').textContent.toLowerCase();
        card.style.display = stationName.includes(query) ? '' : 'none';
      });
    });
  })
  .catch(error => console.error('Erreur chargement gares:', error));
