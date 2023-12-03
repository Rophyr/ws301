document.addEventListener("DOMContentLoaded", function () {
  const addPostItButton = document.getElementById("add-post-it-button");

  loadPostIts();



  addPostItButton.addEventListener("click", function () {
    const postItContent = document.getElementById("post-it-content").value;
    const postItDay = document.getElementById("post-it-day").value;
    const postItHour = document.getElementById("post-it-hour").value;

    if (postItContent && postItDay && postItHour) {
      createPostIt(postItContent, postItDay, postItHour);
      clearForm();
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  });

  function createPostIt(content, day, hour) {
    const postItKey = generatePostItKey(content, day, hour);
    const postIt = document.createElement("div");
    postIt.classList.add("post-it");
    postIt.setAttribute("data-key", postItKey);

    const closeBtn = document.createElement("span");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", function () {
      const postItContainer = document.getElementById(`${day}-container`);
      postItContainer.removeChild(postIt);
      removePostItFromLocalStorage(postItKey);
    });

    postIt.innerHTML = `<strong>${day} - ${hour}</strong><br>${content}`;
    postIt.appendChild(closeBtn);

    const postItContainer = document.getElementById(`${day}-container`);
    postItContainer.appendChild(postIt);

    savePostItKeyToLocalStorage(postItKey);
    savePostItToLocalStorage(postItKey, { content, day, hour });
  }

  function clearForm() {
    document.getElementById("post-it-content").value = "";
    document.getElementById("post-it-day").value = "lundi";
    document.getElementById("post-it-hour").value = "";
  }

  function savePostItToLocalStorage(key, data) {
    const storedPostIts = JSON.parse(localStorage.getItem("postIts")) || {};
    storedPostIts[key] = data;
    localStorage.setItem("postIts", JSON.stringify(storedPostIts));
  }

  function savePostItKeyToLocalStorage(key) {
    const storedPostItKeys = JSON.parse(localStorage.getItem("postItKeys")) || [];
    if (!storedPostItKeys.includes(key)) {
      storedPostItKeys.push(key);
      localStorage.setItem("postItKeys", JSON.stringify(storedPostItKeys));
    }
  }

  function loadPostIts() {
    const storedPostItKeys = JSON.parse(localStorage.getItem("postItKeys")) || [];
    storedPostItKeys.forEach(key => {
      const data = JSON.parse(localStorage.getItem("postIts"))[key];
      createPostIt(data.content, data.day, data.hour);
    });
  }

  function removePostItFromLocalStorage(postItKey) {
    const storedPostIts = JSON.parse(localStorage.getItem("postIts")) || {};
    delete storedPostIts[postItKey];
    localStorage.setItem("postIts", JSON.stringify(storedPostIts));

    const storedPostItKeys = JSON.parse(localStorage.getItem("postItKeys")) || [];
    const indexToRemove = storedPostItKeys.indexOf(postItKey);
    if (indexToRemove !== -1) {
      storedPostItKeys.splice(indexToRemove, 1);
      localStorage.setItem("postItKeys", JSON.stringify(storedPostItKeys));
    }
  }

  function generatePostItKey(content, day, hour) {
    return `${content}-${day}-${hour}`;
  }

  function searchPostIts(query) {
    const postItContainer = document.getElementById("post-it-container");
    const postIts = postItContainer.querySelectorAll(".post-it");

    postIts.forEach((postIt) => {
      const content = postIt.textContent.toLowerCase();
      if (content.includes(query.toLowerCase())) {
        postIt.style.display = "block";
      } else {
        postIt.style.display = "none";
      }
    });
  }

  const imageBase64 = localStorage.getItem('backgroundImage');
  if (imageBase64) {
    document.body.style.backgroundImage = `url('${imageBase64}')`;
  }

  const searchBar = document.querySelector(".search-bar input");
  searchBar.addEventListener("input", function () {
    const searchQuery = searchBar.value.trim();
    searchPostIts(searchQuery);
  });
});
