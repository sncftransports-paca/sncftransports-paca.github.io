// Variable globale pour stocker les données des gares
let stationsData = null;

// Fonction pour récupérer des paramètres d'URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fonction d'affichage des détails d'une gare
function displayStationDetail(station) {
  const container = document.getElementById('station');
  container.innerHTML = `
    <h1 style="padding: 5px; margin: 10px 0 7px 0;">${station.nom}</h1>
    ${
      station.ptinteret
        ? `<p style="font-size: 25px; color: #fff; background-color: #5E3E2C; padding: 2px; display: inline-block; margin: 0 0 15px 0;"><strong>${station.ptinteret}</strong></p><br>`
        : ''
    }
    <img class="station-img" src="${station.image && station.image.trim() !== '' ? 'images/' + station.image : station.imagelink}" alt="${station.nom}">
    <!-- Crédit de l'image -->
    <div class="image-credit">
      <p class="img-credit">Image de <a href="${station.imagepage}" target="_blank">${station.imageauthor}</a> ${station.imagelicense || ''}</p>
    </div>
    <div>
      ${station.lignes.map(ligne => `
        <div>
          ${
            ligne.type === "TER"
              ? `<span class="badge-type">${getTypeIcon(ligne.type)}</span>`
              : `<span class="badge-type"><a href="construction.html">${getTypeIcon(ligne.type)}</a></span>`
          }
          ${
            ligne.type === "TER" ? ligne.lines.map(numero => `
              <a href="ligne.html?ligne=${encodeURIComponent(numero)}" class="badge">
                <img src="icons/lignes/${numero.replace(/ /g, "_")}.svg" alt="${numero}" onerror="this.onerror=null; this.src='icons/lignes/${numero.replace(/ /g, "_")}.jpeg';">
              </a>
            `).join('') : ''
          }
        </div>
      `).join('')}
    </div>
    <div class="table-container">
      <table class="styled-table">
        <colgroup>
          <col style="width: 40%;">
          <col style="width: 60%;">
        </colgroup>
        <tbody>
          <tr>
            <td><strong>Ouverture</strong></td>
            <td>${station.statistiques[0].ouverture}</td>
          </tr>
          <tr>
            <td><strong>Voies</strong></td>
            <td>${station.statistiques[0].voies}</td>
          </tr>
          <tr>
            <td><strong>Quais</strong></td>
            <td>${station.statistiques[0].quais}</td>
          </tr>
          <tr>
            <td><strong>Accessibilité</strong></td>
            <td>${station.statistiques[0].accessible}</td>
          </tr>
          <tr>
            <td><strong>Fréquentation</strong></td>
            <td>${station.statistiques[0].frequentation}</td>
          </tr>
          <tr>
            <td><strong>Communes</strong></td>
            <td>${station.statistiques[0].communes.join(', ')}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br>
    <!-- Carte -->
    <div id="map" class="fade-in"></div>
    <!-- Écrans Enrail -->
    <div id="iframe-container" class="station-detail fade-in">
      <h2>Écrans <a href="https://enrail.org" class="enrail-link">Enrail</a></h2>
      <p>Écran des prochains départs</p>
      <div class="iframe-wrapper">
        <iframe src="${station.enrail_links[0].link}" title="Intégration Enrail, prochains départs" class="enrail-iframe"></iframe>
        <button class="fullscreen-btn">Agrandir</button>
      </div>
      <p>Écran des prochaines arrivées</p>
      <div class="iframe-wrapper">
        <iframe src="${station.enrail_links[2].link}" title="Informations supplémentaires" class="enrail-iframe"></iframe>
        <button class="fullscreen-btn">Agrandir</button>
      </div>
    </div>
    <!-- Bouton Voir plus -->
    <div class="buttons">
      <a href="${station.enrail_links[1].link}" class="button" target="_blank">Voir plus</a>
    </div>
  `;
  
  // Initialisation de la carte avec Leaflet
  const map = L.map('map').setView([station.statistiques[0].latitude, station.statistiques[0].longitude], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
  L.marker([station.statistiques[0].latitude, station.statistiques[0].longitude]).addTo(map)
    .bindPopup(station.nom)
    .openPopup();
}

// Tout le code s'exécute une fois que le DOM est entièrement chargé
document.addEventListener("DOMContentLoaded", function() {
  // Chargement des données depuis le fichier JSON
  fetch('stations.json')
    .then(response => response.json())
    .then(data => {
      stationsData = data;
      // Si l'URL contient une clé de station, affiche ses détails
      const stationKey = getQueryParam('station');
      if (stationKey && stationsData[stationKey]) {
        displayStationDetail(stationsData[stationKey]);
      }
    })
    .catch(error => console.error('Erreur chargement station:', error));
  
  // Gestion de la barre de recherche et affichage dynamique de la liste des gares
  const searchInput = document.getElementById('search');
  const searchResults = document.getElementById('searchResults');
  searchInput.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    searchResults.innerHTML = "";
    if (query === "" || !stationsData) {
      searchResults.style.display = "none";
      return;
    }
    // Filtre les gares dont le nom contient la chaîne recherchée
const filteredKeys = Object.keys(stationsData).filter(key => {
  return stationsData[key].nom.toLowerCase().includes(query);
}).slice(0, 5); // Limite à 5 résultats
    if (filteredKeys.length > 0) {
      const ul = document.createElement("ul");
      filteredKeys.forEach(key => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "station.html?station=" + encodeURIComponent(key);
        a.textContent = stationsData[key].nom;
        li.appendChild(a);
        ul.appendChild(li);
      });
      searchResults.appendChild(ul);
      searchResults.style.display = "block";
    } else {
      searchResults.innerHTML = "<p style='padding:10px;'>Aucune gare trouvée.</p>";
      searchResults.style.display = "block";
    }
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('fullscreen-modal');
  const modalIframe = document.getElementById('modal-iframe');
  const closeModal = document.getElementById('close-modal');

  if (!modal || !modalIframe || !closeModal) {
    console.error("Un ou plusieurs éléments de la modale n'ont pas été trouvés.");
    return;
  }

  // Utilisation de la délégation d'événements sur le body
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('fullscreen-btn')) {
      const iframe = e.target.previousElementSibling;
      if (iframe && iframe.src) {
        modalIframe.src = iframe.src;
        modal.style.display = 'flex';
        closeModal.style.display = 'block';
        document.body.classList.add('modal-open');
        console.log("Modale ouverte avec succès.");
      }
    }
  });
  
  // Écouteur pour fermer la modale
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    closeModal.style.display = 'none';
    modalIframe.src = "";
    document.body.classList.remove('modal-open');
    console.log("Modale fermée.");
  });
});

document.addEventListener("DOMContentLoaded", function() {
  // Récupération du bouton "Retour en haut"
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (!scrollTopBtn) {
    console.error("L'élément 'scrollTopBtn' n'a pas été trouvé.");
    return; // Arrête l'exécution si l'élément n'existe pas
  }
  
  // Ajout de l'écouteur de clic une seule fois
  scrollTopBtn.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
  // Mise à jour de l'affichage du bouton lors du scroll
  window.addEventListener("scroll", function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });
});