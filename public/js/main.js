document.addEventListener('DOMContentLoaded', function () {

  function toggleSquareForm() {
    const squareForm = document.getElementById('squareForm');
    squareForm.style.display = (squareForm.style.display === 'none' || squareForm.style.display === '') ? 'flex' : 'none';
  }

  function addSquare() {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const categorySelect = document.getElementById('category');
    const container = document.getElementById('container');
    const squareDiv = document.createElement('div');
    squareDiv.classList.add('square');
    squareDiv.classList.add('draggable');
    squareDiv.classList.add(categorySelect.value);

    const deleteIcon = document.createElement('div');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.textContent = 'X';
    deleteIcon.addEventListener('click', () => {
      squareDiv.remove();
      removeSquareFromLocalStorage(squareDiv);
    });

    const titleElement = document.createElement('h2');
    titleElement.textContent = titleInput.value;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = descriptionInput.value;

    const categoryElement = document.createElement('p');
    categoryElement.textContent = categorySelect.value;

    squareDiv.appendChild(deleteIcon);
    squareDiv.appendChild(titleElement);
    squareDiv.appendChild(descriptionElement);
    squareDiv.appendChild(categoryElement);

    container.appendChild(squareDiv);

    titleInput.value = '';
    descriptionInput.value = '';

    addDraggableFeature(squareDiv);
    saveSquareToLocalStorage(squareDiv);
  }

  function addDraggableFeature(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
      isDragging = true;
      element.classList.add('dragging');
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.classList.remove('dragging');
        saveSquareToLocalStorage(element);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const x = e.clientX - offsetX - 1650;
        const y = e.clientY - offsetY -20;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
      }
    });
  }

  function saveSquareToLocalStorage(element) {
    const existingSquares = JSON.parse(localStorage.getItem('squares')) || [];
    const newSquare = {
      title: element.querySelector('h2').textContent,
      description: element.querySelector('p').textContent,
      category: element.classList[2],
      position: {
        left: element.style.left,
        top: element.style.top
      }
    };

    const existingIndex = existingSquares.findIndex(square => square.title === newSquare.title);
    if (existingIndex !== -1) {
      existingSquares.splice(existingIndex, 1);
    }

    existingSquares.push(newSquare);
    localStorage.setItem('squares', JSON.stringify(existingSquares));
  }

  function loadSquaresFromLocalStorage() {
    const existingSquares = JSON.parse(localStorage.getItem('squares')) || [];
    existingSquares.forEach((square) => {
      const container = document.getElementById('container');
      const squareDiv = document.createElement('div');
      squareDiv.classList.add('square');
      squareDiv.classList.add('draggable');

      squareDiv.classList.add(square.category);

      const deleteIcon = document.createElement('div');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.textContent = 'X';
      deleteIcon.addEventListener('click', () => {
        squareDiv.remove();
        removeSquareFromLocalStorage(squareDiv);
      });

      const titleElement = document.createElement('h2');
      titleElement.textContent = square.title;

      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = square.description;

      squareDiv.appendChild(deleteIcon);
      squareDiv.appendChild(titleElement);
      squareDiv.appendChild(descriptionElement);

      container.appendChild(squareDiv);

      addDraggableFeature(squareDiv);

      squareDiv.style.left = parseFloat(square.position.left) + 'px';
      squareDiv.style.top = parseFloat(square.position.top) + 'px';
    });
  }

  function removeSquareFromLocalStorage(element) {
    const existingSquares = JSON.parse(localStorage.getItem('squares')) || [];
    const titleToRemove = element.querySelector('h2').textContent;

    const updatedSquares = existingSquares.filter(square => square.title !== titleToRemove);
    localStorage.setItem('squares', JSON.stringify(updatedSquares));
  }

  function changerFondEcran(input) {
    const fichierImage = input.files[0];

    if (fichierImage) {
      convertirEnBase64(fichierImage, (imageBase64) => {
        localStorage.setItem('backgroundImage', imageBase64);
        document.body.style.backgroundImage = `url('${imageBase64}')`;
      });
    }
  }

  function convertirEnBase64(fichier, callback) {
    const reader = new FileReader();

    reader.onload = function () {
      callback(reader.result);
    };

    reader.readAsDataURL(fichier);
  }

  const imageBase64 = localStorage.getItem('backgroundImage');
  if (imageBase64) {
    document.body.style.backgroundImage = `url('${imageBase64}')`;
  }

  // Event Listeners
  const addSquareButton = document.querySelector('#addSquareButton');
  const showFormButton = document.querySelector('#showFormButton');
  const imageInput = document.getElementById('imageInput');
  const searchInput = document.getElementById('searchInput');

  showFormButton.addEventListener('click', toggleSquareForm);
  addSquareButton.addEventListener('click', addSquare);
  imageInput.addEventListener('change', function () {
    changerFondEcran(this);
  });

  searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      performSearchOnCalendarPage();
    }
  });

  loadSquaresFromLocalStorage();
});

function afficherHeure() {
  const maintenant = new Date();
  const heures = maintenant.getHours();
  const minutes = maintenant.getMinutes();

  const heureFormattee = `${heures < 10 ? '0' + heures : heures}:${minutes < 10 ? '0' + minutes : minutes}`;

  document.getElementById('heure').textContent = heureFormattee;
}

setInterval(afficherHeure, 1000);
afficherHeure();

function performSearchOnCalendarPage() {
  // Obtenir le terme de recherche
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  // Charger les post-it depuis le stockage local
  const storedPostItKeys = JSON.parse(localStorage.getItem('postItKeys')) || [];
  const results = [];

  // Rechercher les post-it qui contiennent le terme de recherche
  storedPostItKeys.forEach(key => {
    const data = JSON.parse(localStorage.getItem('postIts'))[key];
    if (data.content.toLowerCase().includes(searchTerm)) {
      results.push(data);
    }
  });

  // Afficher les résultats
  displaySearchResults(results);
}

function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById('search-results-container');
  searchResultsContainer.innerHTML = ''; // Efface les résultats précédents

  if (results.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'Aucun résultat trouvé.';
    searchResultsContainer.appendChild(noResultsMessage);
  } else {
    results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('search-result');

      const contentParagraph = document.createElement('p');
      contentParagraph.textContent = result.content;

      const dayParagraph = document.createElement('p');
      dayParagraph.textContent = result.day;

      const hourParagraph = document.createElement('p');
      hourParagraph.textContent = result.hour;

      resultDiv.appendChild(contentParagraph);
      resultDiv.appendChild(dayParagraph);
      resultDiv.appendChild(hourParagraph);

      searchResultsContainer.appendChild(resultDiv);
    });
  }
}
