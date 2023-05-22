let currentPhotographerMedias = [];
let sliderIndex = 0;

async function getPhotographerData() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");

  const response = await fetch("./photographers.json");
  const data = await response.json();
  const photographer = data.photographers.filter(
    (photographer) => photographer.id == id
  );

  const responseMedia = await fetch("./photographers.json");
  const dataMedia = await responseMedia.json();
  const medias = dataMedia.media.filter((media) => media.photographerId == id);

  currentPhotographerMedias = [...medias];

  showPhotographerHeader(photographer[0]);
  showPhotographerMedias(medias);
  getUserNameToForm(photographer[0]);
  sortMedia(medias);
}

function showPhotographerHeader(photographerProfile) {
  const photographerCard = document.querySelector(".photograph-header");
  photographerCard.innerHTML = `
  <figure>
  <figcaption tabindex=${photographerProfile.tabindex}>
    <img src="assets/photographers/${
      photographerProfile.portrait
    }" alt="portrait de ${photographerProfile.name} aria-label="profil de  ${
    photographerProfile.name
  }" " >
  </figcaption>
  <button class="contact_button" onclick="displayModal()" tabindex=${
    photographerProfile.tabindex
  } >Contactez-moi</button>
  <div class="photograph-info">
    <h1 tabindex=${photographerProfile.tabindex}>${
    photographerProfile.name
  }</h1>
    <div tabindex=${photographerProfile.tabindex}> 
    <h2>${photographerProfile.city}, ${photographerProfile.country}</h2>
    <p>${photographerProfile.tagline}</p>
    </div>
  </div>
  </figure>
  <p class="banner" tabindex="0"><span aria-label="Aimé ${getLikes(
    photographerProfile.id
  )}fois, ${photographerProfile.price}€ par jour"><i class="fas fa-heart"></i>${getLikes(
    photographerProfile.id
  )}</span><span>${photographerProfile.price}€/jour</span></p>
  `;
}

function getUserNameToForm(photographer) {
  const namedForm = document.querySelector(".contact_header");
  namedForm.innerHTML = `
  <h2>Contacter:</h2>
  <button aria-label="fermer le formulaire" id="close" onclick="closeModal()">X</button>
  <h3>${photographer.name}</h3>
  `;
}

function showMediaFilter() {
  const showList = document.querySelector(".list-box");
  // change the display none for display flex
  showList.style.display = "flex";
}

function hiddeMediaFilter() {
  const showList = document.querySelector(".list-box");
  const listItems = document.querySelectorAll(".list-box li");
  // Retirer les attributs aria-label des éléments <li>
  listItems.forEach(function (item) {
    item.removeAttribute("aria-label");
  });
  // Définir aria-hidden sur true pour l'élément <ul>
  showList.setAttribute("aria-hidden", "true");
  // Changer display:none à display:flex
  showList.style.display = "none";
}

function showPhotographerMedias(profileMedias) {
  let mediaContainerHTML = "";
  profileMedias.forEach((profileMedia, index) => {
    {
      profileMedia.image
        ? (mediaContainerHTML += `
      <div id=${profileMedia.id} class="cards" tabindex="0" onclick="displayLightbox(${index})" onkeydown="handleCardKeyDown(${index}, event)" >
      <div class="descriptionBox">
      <h2>${profileMedia.title}</h2>
      <button class="likes" onclick="handleLike(event)" onkeydown="handleLikeEnter(event)"><p>${profileMedia.likes}</p><i class="fas fa-heart" aria-hidden="true"></i></button>
      </div>
      <img src="assets/photos/${profileMedia.image}" alt="${profileMedia.title}"></div>
      `)
        : profileMedia.video
        ? (mediaContainerHTML += `
      <div id=${profileMedia.id} class="cards" tabindex="0" onclick="displayLightbox(${index})" onkeydown="handleCardKeyDown(${index}, event)">
      <div class="descriptionBox">
      <h2>${profileMedia.title}</h2>
      <button class="likes" onclick="handleLike(event)" onkeydown="handleLikeEnter(event)"><p>${profileMedia.likes}</p><i class="fas fa-heart" aria-hidden="true"></i></button>
      </div>
      <video src="assets/videos/${profileMedia.video}" alt="${profileMedia.title}" controls="true"></video></div>
      `)
        : null;
    }
  });
  const mediaContainer = document.querySelector(".photograph-medias");
  mediaContainer.innerHTML = mediaContainerHTML;
}

function handleCardKeyDown(index, event) {
  console.log("event " + event.key);
  if (event.key === "Enter") {
    displaySlider(parseInt(index), currentPhotographerMedias);
  }
}

function handleLikeEnter(event) {
  event.stopPropagation();
  if (event.key === "Enter") {
    console.log("enter" + event.key);
  }
}

function handleLike(event) {
  event.stopPropagation();
  const likeButton = event.currentTarget;
  const mediaId = likeButton.parentNode.parentNode.id;
  const like = likeButton.querySelector("p");
  const likesNumber = parseInt(like.textContent);
  const media = currentPhotographerMedias;
  media.forEach((media) => {
    if (media.id == mediaId) {
      console.log(media.id);
      console.log(mediaId);
      if (like.classList.contains("liked")) {
        likeButton.setAttribute("aria-label", "annuler le like");
        like.classList.remove("liked");
        {
          media.likes = likesNumber - 1;
        }
        likeButton.innerHTML = `
        <p>${likesNumber - 1}</p>
        <i class="fas fa-heart "></i>
        `;
      } else {
        likeButton.setAttribute("aria-label", "ajouter un like");
        {
          media.likes = likesNumber + 1;
        }
        likeButton.innerHTML = `
        <p class="liked">${likesNumber + 1}</p>
        <i class="fas fa-heart red"></i>
        `;
      }

      console.log("likes " + media.likes);
      const likes = document.querySelector(".banner span");
      likes.innerHTML = `
      <i class="fas fa-heart" aria-label=" nombres de likes"></i>
      <span>${getLikes(media.photographerId)}</span>
          `;
    }
  });
}

function getLikes(photographerId) {
  media = currentPhotographerMedias;
  let likes = 0;
  media.forEach((media) => {
    if (media.photographerId == photographerId) {
      likes += media.likes;
    }
  });
  console.log(likes);
  return likes;
}

function displayLightbox(cardIndex) {
  displaySlider(cardIndex, currentPhotographerMedias);
  sliderIndex = cardIndex;
  console.log("sliderindex " + sliderIndex);
}

function displaySlider(mediaIndex, medias) {
  const container = document.querySelector("#carrousel");
  container.style.display = "block";
  container.setAttribute("aria-hidden", "false");
  const photograph = document.querySelector("#photographer-main");
  photograph.style.display = "none";

  const currentMedia = medias[mediaIndex];
  const mediaElement = currentMedia.image ?? currentMedia.video;

if (mediaElement) {
  const mediaType = currentMedia.image ? "img" : "video";
  const mediaAlt = currentMedia.title;
  const mediaLabel = `${mediaType} de ${mediaAlt}`;

  console.log("type" + mediaType);

  document.querySelector(".carrousel-media").innerHTML = `
    <div class="media">
      <${mediaType} tabindex="0" src="assets/${mediaType === "video" ? "videos" : "photos"}/${mediaElement}" alt="${mediaAlt}" class="mediaElement" aria-label="${mediaLabel}" ${mediaType === "video" ? "controls" : ""}></${mediaType}>
      <p tabindex="0" class="mediaTitle">${mediaAlt}</p>
    </div>
  `;
  console.log(mediaElement);
} else {
  // Gérer le cas où il n'y a ni image ni vidéo
  document.querySelector(".carrousel-media").innerHTML = `
    <div class="media">
      <h1>Aucune vidéo à afficher pour le moment</h1>
    </div>
  `;
}

  const previousButton = document.querySelector(".left");
  const nextButton = document.querySelector(".right");

  previousButton.addEventListener("click", previousImg);
  nextButton.addEventListener("click", nextImg);
}

function closeSlider() {
  const container = document.querySelector("#carrousel");
  container.style.display = "none";
  container.setAttribute("aria-hidden", "true");
  const photograph = document.querySelector("#photographer-main");
  photograph.style.display = "block";
}

function sortMedia() {
  const arialist = document.getElementById("openMediaList");
  arialist.setAttribute("aria-label", "Trier les médias");
  const chevronUp = document.querySelector(".fa-chevron-up");
  chevronUp.setAttribute("tabindex", "0");
  // add event on key Enter to show the list
  chevronUp.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.stopPropagation();
      hiddeMediaFilter();
    }
  });
  chevronUp.addEventListener("click", function (e) {
    e.stopPropagation();
    hiddeMediaFilter();
  });

  const listItems = document.querySelectorAll(".list-box li");
  const span = document.querySelector(".list-box li:first-child span");

  listItems.forEach(function (item, index) {
    item.setAttribute("tabindex", "0"); // Ajout de l'attribut "tabindex" pour chaque élément de la liste
    item.setAttribute("role", "option"); // Ajout du rôle "option" pour chaque élément de la liste

    // Gestion de la navigation en boucle avec la touche Tab
    item.addEventListener("keydown", function (event) {
      if (event.key === "Tab" && !event.shiftKey) {
        if (this === listItems[listItems.length - 1]) {
          // Tab depuis la dernière li, définir le focus sur la span
          event.preventDefault();
          span.focus();
        }
      } else if (event.key === "Tab" && event.shiftKey) {
        if (this === listItems[0] && document.activeElement === span) {
          // Shift + Tab depuis la span, définir le focus sur la dernière li
          event.preventDefault();
          listItems[listItems.length - 1].focus();
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        var selectedValue = this.getAttribute("value");
        switch (selectedValue) {
          case "populaire":
            media.sort((a, b) => b.likes - a.likes);
            break;
          case "date":
            media.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
          case "titre":
            media.sort((a, b) => a.title.localeCompare(b.title));
            break;
          default:
            media.sort((a, b) => b.likes - a.likes);
            break;
        }
        showPhotographerMedias(media);
      }
    });

    item.addEventListener("click", function () {
      var selectedValue = this.getAttribute("value");
      switch (selectedValue) {
        case "populaire":
          media.sort((a, b) => b.likes - a.likes);
          break;
        case "date":
          media.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "titre":
          media.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          media.sort((a, b) => b.likes - a.likes);
          break;
      }
      showPhotographerMedias(media);
    });
  });

  // Ajout de l'accessibilité pour chaque élément de la liste
  listItems.forEach(function (item) {
    item.setAttribute("aria-selected", "false");
    item.addEventListener("click", function () {
      listItems.forEach(function (li) {
        li.setAttribute("aria-selected", "false");
      });
      this.setAttribute("aria-selected", "true");
    });
  });
}

function previousImg() {
  if (sliderIndex > 0) {
    sliderIndex--;
    displaySlider(sliderIndex, currentPhotographerMedias);
  } else {
    sliderIndex = currentPhotographerMedias.length - 1;
    displaySlider(sliderIndex, currentPhotographerMedias);
  }
}

function nextImg() {
  if (sliderIndex < currentPhotographerMedias.length - 1) {
    sliderIndex++;
    displaySlider(sliderIndex, currentPhotographerMedias);
  } else {
    sliderIndex = 0;
    displaySlider(sliderIndex, currentPhotographerMedias);
  }
}


getPhotographerData();
