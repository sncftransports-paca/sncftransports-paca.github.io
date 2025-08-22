// Fonction pour charger le footer depuis un fichier HTML
    function loadFooter() {
    fetch('/footer.html')
      .then(response => response.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
      })
      .catch(error => console.warn('Erreur lors du chargement du footer:', error));
  }

  // Appeler la fonction pour charger le footer
  loadFooter();