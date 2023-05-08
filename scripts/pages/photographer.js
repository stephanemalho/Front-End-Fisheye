let currentPhotographerMedias = [];

async function getPhotographerData() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");

  const response = await fetch("../data/photographers.json");
  const data = await response.json();
  const photographer = data.photographers.filter(
    (photographer) => photographer.id == id
  );

  const responseMedia = await fetch("../data/photographers.json");
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
    <h1 tabindex=${photographerProfile.tabindex + 1}>${
    photographerProfile.name
  }</h1>
    <div tabindex=${photographerProfile.tabindex + 1}> 
    <h2>${photographerProfile.city}, ${photographerProfile.country}</h2>
    <p>${photographerProfile.tagline}</p>
    </div>
  </div>
  </figure>
  <p class="banner" tabindex="0"><span><i class="fas fa-heart" aria-label=" fois liké"></i>${getLikes(
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
  console.log("event "+ event.key);
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

function displayLightbox(cardId) {
  displaySlider(cardId, currentPhotographerMedias);
  sliderIndex = cardId;
  console.log("sliderindex " + sliderIndex);
}

function displaySlider(mediaIndex, medias) {
  const container = document.querySelector("#carrousel");
  container.style.display = "block";
  container.setAttribute("aria-hidden", "false");
  const photograph = document.querySelector("#photographer-main");
  photograph.style.display = "none";

  let currentIndex = mediaIndex;
  {
    medias[currentIndex].image
      ? (document.querySelector(".carrousel-media").innerHTML = `
    <div class="media" >
    <img src="assets/photos/${medias[currentIndex].image}" alt="${medias[currentIndex].title}" class="mediaElement" aria-label="image de ${medias[currentIndex].title}">
    <p class="mediaTitle">${medias[currentIndex].title}</p>
    </div>
    `)
      : (document.querySelector(".carrousel-media").innerHTML = `
    <div class="media" >
    <video src="assets/videos/${medias[currentIndex].video}" alt="${medias[currentIndex].title}" class="mediaElement" aria-label="video de ${medias[currentIndex].title}" controls="true"></video>
    <p class="mediaTitle">${medias[currentIndex].title}</p>
    </div>
    `);
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
  const mediaList = document.querySelector(".photograph-medias");
  const sortSelect = document.getElementById("sortMedias");
  sortSelect.setAttribute("aria-label", "Trier les médias");

  sortSelect.addEventListener("change", (event) => {
    const value = event.target.value;
    switch (value) {
      case "populaire":
        mediaList.innerHTML = "";
        media.sort((a, b) => b.likes - a.likes);
        break;
      case "date":
        mediaList.innerHTML = "";
        media.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "titre":
        mediaList.innerHTML = "";
        media.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        mediaList.innerHTML = "";
        media.sort((a, b) => b.likes - a.likes);
        break;
    }
    showPhotographerMedias(media);
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
