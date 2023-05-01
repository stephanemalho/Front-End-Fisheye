async function getPhotographerData() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");

  const response = await fetch("../data/photographers.json");

  const data = await response.json();
  const photographer = data.photographers.filter(
    (photographer) => photographer.id == id
  );
    console.log(photographer[0].tagline);

  showPhotographerHeader(photographer[0]);
  showPhotographer(photographer[0].media);
  
  const responseMedia = await fetch("../data/photographers.json");
  const dataMedia = await responseMedia.json();
  const media = dataMedia.media.filter((media) => media.photographerId == id);
  console.log(media);

}



function showPhotographer(photographerMedias) {
  
  let mediaContainerHTML = "";

  photographerMedias.forEach((media) => {
    mediaContainerHTML += `
    <div class="cards" id="23523434" tabindex="0">
    <div class="descriptionBox">
    <h2>${media.title}</h2>
    <button class="likes"><p>${media.likes}</p><i class="fas fa-heart" aria-hidden="true"></i></button>
    </div>
    <img src="assets/photos/${media.image}" alt="${media.title}"></div>
    `;
  }
  );
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
    <h1 tabindex=${photographerProfile.tabindex + 1}>${photographerProfile.name}</h1>
    <div tabindex=${photographerProfile.tabindex + 1}> 
    <h2>${photographerProfile.city}, ${photographerProfile.country}</h2>
    <p>${photographerProfile.tagline}</p>
    </div>
  </div>
  </figure>
  <p class="banner" tabindex="0"><span><i class="fas fa-heart" aria-label=" fois liké">  </i></span> ${
  photographerProfile.price
}€/jour</p>
  `;
}


function getLikes(photographerId) {
  let likes = 0;
  dataMedia.media.forEach((media) => {
    if (media.photographerId == photographerId) {
      likes += media.likes;
    }
  });
  return likes;
}

getPhotographerData();