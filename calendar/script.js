document.addEventListener('DOMContentLoaded', function () {
  const postItContainer = document.getElementById('post-it-container');
  const postItContentInput = document.getElementById('post-it-content');
  const postItDayInput = document.getElementById('post-it-day');
  const postItHourInput = document.getElementById('post-it-hour');

  function ajouterPostIt() {
    // Charger les événements du localStorage
    loadEventsFromLocalStorage();

    const postItContent = postItContentInput.value;
    const postItDay = postItDayInput.value;
    const postItHour = postItHourInput.value;

    if (postItContent && postItDay && postItHour) {
      const postItDiv = document.createElement('div');
      postItDiv.classList.add('post-it');
      postItDiv.innerHTML = `<span>${postItContent}</span><br><span>${postItHour}</span>`;
      postItDiv.draggable = true;
      postItDiv.addEventListener('dragstart', (e) => onDragStart(e));

      const dayContainer = document.querySelector(`#${postItDay}`);
      dayContainer.appendChild(postItDiv);

      // Sauvegarder dans le localStorage
      saveEventToLocalStorage(postItContent, postItDay, postItHour);

      // Réinitialiser les champs du formulaire
      postItContentInput.value = '';
      postItDayInput.value = 'lundi'; // Remettre le jour par défaut
      postItHourInput.value = '';
    }
  }

  function onDragStart(e) {
    e.dataTransfer.setData('text/plain', ''); // nécessaire pour le glisser-déposer
  }

  function saveEventToLocalStorage(content, day, hour) {
    const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
    const newEvent = {
      content: content,
      day: day,
      hour: hour
    };

    existingEvents.push(newEvent);
    localStorage.setItem('events', JSON.stringify(existingEvents));
  }

  function loadEventsFromLocalStorage() {
    const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
    
    // Effacer tous les post-its existants
    postItContainer.innerHTML = '';

    existingEvents.forEach((event) => {
        const postItDiv = document.createElement('div');
        postItDiv.classList.add('post-it');
        postItDiv.innerHTML = `<span>${event.content}</span><br><span>${event.hour}</span>`;
        postItDiv.draggable = true;
        postItDiv.addEventListener('dragstart', (e) => onDragStart(e));

        const dayContainer = document.querySelector(`#${event.day}`);
        dayContainer.appendChild(postItDiv);
    });
  }


  function onContextMenu(e) {
    e.preventDefault();

    const clickedElement = e.target;
    const isPostIt = clickedElement.classList.contains('post-it');

    if (isPostIt) {
      // Demander confirmation avant de supprimer
      const shouldDelete = confirm('Voulez-vous vraiment supprimer ce Post-it?');

      if (shouldDelete) {
        clickedElement.remove();
        removeEventFromLocalStorage(clickedElement);
      }
    }
  }

  const calendarContainer = document.getElementById('calendar');
  calendarContainer.addEventListener('contextmenu', onContextMenu);

  function removeEventFromLocalStorage(element) {
    const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
    const titleToRemove = element.querySelector('span').textContent;
    
    // Vérifier si l'élément a un parent avant d'accéder à son jour
    const dayContainer = element.parentNode;
    if (dayContainer) {
        const dayToRemove = dayContainer.id;
        const hourToRemove = element.querySelector('span:nth-child(2)').textContent;

        const updatedEvents = existingEvents.filter(event =>
            !(event.content === titleToRemove && event.day === dayToRemove && event.hour === hourToRemove)
        );

        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // Charger les événements du localStorage après la suppression
        loadEventsFromLocalStorage();
    }
  }


  // Charger les événements du localStorage lors du chargement de la page
  loadEventsFromLocalStorage();

  // Ajouter l'événement de sauvegarde lors de l'ajout d'un post-it
  const addButton = document.querySelector('button');
  addButton.addEventListener('click', ajouterPostIt);
});
