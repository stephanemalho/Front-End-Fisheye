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
  )}</span>${photographerProfile.price}€/jour</p>
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
      <div class="cards" tabindex="0" onclick="displayLightbox(${index})">
      <div class="descriptionBox">
      <h2>${profileMedia.title}</h2>
      <button class="likes"><p>${profileMedia.likes}</p><i class="fas fa-heart" aria-hidden="true"></i></button>
      </div>
      <img src="assets/photos/${profileMedia.image}" alt="${profileMedia.title}"></div>
      `)
        : profileMedia.video
        ? (mediaContainerHTML += `
      <div class="cards" tabindex="0" onclick="displayLightbox(${index})">
      <div class="descriptionBox">
      <h2>${profileMedia.title}</h2>
      <button class="likes"><p>${profileMedia.likes}</p><i class="fas fa-heart" aria-hidden="true"></i></button>
      </div>
      <video src="assets/videos/${profileMedia.video}" alt="${profileMedia.title}" controls="true"></video></div>
      `)
        : null;
    }
  });
  const mediaContainer = document.querySelector(".photograph-medias");
  mediaContainer.innerHTML = mediaContainerHTML;
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
  // document.querySelector(".carrousel-media").innerHTML = `
  // <div class="media" >
  // <img src="assets/photos/${medias[mediaIndex].image}" alt="${medias[mediaIndex].title}" class="mediaElement" aria-label="image de ${medias[mediaIndex].title}">
  // </div>
  // `;
  { medias[mediaIndex].image ?
    (document.querySelector(".carrousel-media").innerHTML = `
    <div class="media" >
    <img src="assets/photos/${medias[mediaIndex].image}" alt="${medias[mediaIndex].title}" class="mediaElement" aria-label="image de ${medias[mediaIndex].title}">
    </div>
    ` ): (
    document.querySelector(".carrousel-media").innerHTML = `
    <div class="media" >
    <video src="assets/videos/${medias[mediaIndex].video}" alt="${medias[mediaIndex].title}" class="mediaElement" aria-label="video de ${medias[mediaIndex].title}" controls="true"></video>
    </div>
    `)
  
  }
}

function closeSlider() {
  const container = document.querySelector("#carrousel");
  container.style.display = "none";
  container.setAttribute("aria-hidden", "true");
  const photograph = document.querySelector("#photographer-main");
  photograph.style.display = "block";
}

getPhotographerData();
