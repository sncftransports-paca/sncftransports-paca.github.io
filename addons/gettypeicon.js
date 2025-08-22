// Associe type à icône
function getTypeIcon(type) {
  switch (type) {
    case 'train':
      return '<img src="icons/train.svg" alt="Train">';
    case 'TER':
      return '<img src="icons/ter.svg" alt="TER">';
    case 'Intercités':
      return '<img src="icons/intercites.svg" alt="Intercités">';
    case 'TGV OUIGO':
      return '<img src="icons/tgv_ouigo_grande_vitesse.svg" alt="TGV OUIGO Grande Vitesse">';
    case 'TGV inOui':
      return '<img src="icons/tgv_inoui.svg" alt="TGV inOui">';
    case 'métro':
      return '<img src="icons/metro.svg" alt="Métro">';
    case 'tram':
      return '<img src="icons/tram.svg" alt="Tramway">';
    default:
      return '';
  }
}