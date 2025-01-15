//1.1 la galerie fonctionnelle affichée avec la liste des travaux provenant du back-end

//recupérer mon works dapuis API
async function getWorks(filter) {
  document.querySelector(".gallery").innerHTML = ""; // je récupère ma galerie
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reponse status: ${response.status}`);
    }
    const json = await response.json();
    if (filter) {
      const filtrer = json.filter((data) => data.categoryId === filter);
      for (let i = 0; i < filtrer.length; i++) {
        showFigure(filtrer[i]);
        showFigureModal(json[i]);
      }
    }
    else {
      for (let i = 0; i < json.length; i++) {
        showFigure(json[i]);
        showFigureModal(json[i]);
      }
    }
    //delete img modall
    const trashIcon = document.querySelectorAll(".fa-trash-can");
    trashIcon.forEach((e) =>
      e.addEventListener('click', (event) => deleteWorks(event)));
  } catch (error) {
    console.error(error.message);
  }
}
getWorks();

//afficher les figure
function showFigure(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
    <figcaption>${data.title}</figcaption>`;
  //afficher la galerie 
  document.querySelector(".gallery").append(figure);
}
//=========================================================================================

//1.2 Réalisation du filtre des travaux : Ajout des filtres pour afficher les travaux par catégorie

//recupérer mes categories dapuis API
async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reponse status: ${response.status}`);
    }
    const json = await response.json();
    for (let i = 0; i < json.length; i++) {
      filterButton(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }

}
getCategories();

// recuperer mes data sur l'api (noms de filtre)
function filterButton(data) {
  const div = document.createElement("div");// creation mes 4 boutons de filtre
  div.className = data.id; // nom de class des filtres 
  div.addEventListener("click", () => getWorks(data.id)); // je vois mes objets 1, 2, 3
  div.innerHTML = `${data.name}`;
  document.querySelector(".div-container").append(div);
}
document.querySelector(".Tous").addEventListener("click", () => getWorks());

// permet d'afficher les éléments quand je suis logué 
function displayAddBanner() {
  const aLink = document.querySelector(".js-modal");
  const logOut = document.getElementById("logout");
  if (sessionStorage.authToken) {
    const editBanner = document.createElement('div');
    editBanner.className = 'edit';
    //lien edit avec le modal
    editBanner.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';

    document.body.prepend(editBanner);
    const hiddenFilter = document.querySelector(".div-container"); // div-container = bloc-filtre
    const logIn = document.getElementById("logIn");
    logIn.style.display = "none";
    logOut.style.visibility = "visible";
    hiddenFilter.style.display = "none";
    aLink.style.visibility = "visible";
  } else {
    logIn.style.visibility = "visible";
    logOut.style.display = "none";
    aLink.style.visibility = "hidden";
  }

  // retirer la token quand je click
  logOut.addEventListener("click", e => {
    sessionStorage.clear();
  })
};
displayAddBanner();
//cacher la modale
const modal = document.querySelector('.modal')
modal.style.visibility = "hidden"
// afficher la modale
const openModal = document.querySelector(".js-modal");
openModal.addEventListener("click", () => {
  modal.style.visibility = "visible"
});
// fermer la modale
const closeModal = document.querySelector(".fa-xmark");
closeModal.addEventListener("click", () => {
  modal.style.visibility = "hidden"
});

//afficher les figure modal
function showFigureModal(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<div class="image-container">
<img src="${data.imageUrl}" alt="${data.title}">
<i id=${data.id} class="fa-solid fa-trash-can delete-icon" style="color: #f7f9fc;" title="Supprimer"></i>
</div>`;
  //afficher la galerie 
  document.querySelector(".gallery-modal").append(figure);
}

// suppression éléments
async function deleteWorks(event) {
  const token = sessionStorage.authToken;
  const id = event.srcElement.id;
  console.log("id")
  const deleteApi = "http://localhost:5678/api/works/";
  let response = await fetch(deleteApi + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

};

// ajouter une photo dans la modale
const switchModal = function () {
  document.querySelector(".modal-wrapper").innerHTML = `<div class="fermer">
<i class="fa-solid fa-arrow-left"></i><i class="fa-solid fa-xmark"></i></div>
	<p title="titlemodal" class="gallery-photo"> Ajout photo</p>
    <div class="center"> 
      <div class="blue">
        <i class="fa-regular fa-image"></i>
        <label for="plusPhoto" class="formFile">+ Ajouter photo</label>
        <input id="plusPhoto" type="file" accept ".jpg, .png">
        <p class="format">jpg, png : 4mo max</p>
      </div>
              <div class="addPhotoForm">
              <form action="#" method="post">
                <label for="title">Titre</label>
                <input type="text" name="title" id="title" />
                <label for="category">Catégorie</label>
                <select name="category" id="category">
                  <option value="Objets">Objets</option>
                  <option value="Appartements">Appartements</option>
                  <option value="Hotels & restaurants">Hotels & restaurants</option>
                </select>
              </form>
              <hr/>
              
            <input type="submit" value="Valider">
            </div>
    </div>`

  const backButton = document.querySelector(".fa-arrow-left");
  const openModal = document.querySelector(".js-modal");
  backButton.addEventListener("click", () => {
    document.querySelector(".modal-wrapper").innerHTML = `<div class="fermer"><i></i> <i class="fa-solid fa-xmark"></i></div>
			<p title="titlemodal" class="gallery-photo"> Galerie photo</p>
			<div class="gallery-modal "></div>
			<div class="addPhotoForm"></div>
			<hr/>
			<input class="addPhoto" type="submit" value="Ajouter une photo">`;

    // Afficher les figures
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
        data.forEach(item => showFigureModal(item));
        
        const closeModal = document.querySelector(".fa-xmark");
        closeModal.addEventListener("click", () => {
          modal.style.visibility = "hidden"
        });
        // bouton ajoute photo
        const addPhotoButton = document.querySelector(".addPhoto");
        addPhotoButton.addEventListener('click', switchModal);
      });
      
    const closeModal = document.querySelector(".fa-xmark");
    closeModal.addEventListener("click", () => {
      modal.style.visibility = "hidden"
    });
  });

  // fermer la 2ème modale 
  const closeModal = document.querySelector(".fa-xmark");
  closeModal.addEventListener("click", () => {
  modal.style.visibility = "hidden"
  
  });
  
}
// bouton ajoute photo
const addPhotoButton = document.querySelector(".addPhoto");
addPhotoButton.addEventListener('click', switchModal);

