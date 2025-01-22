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
async function getCategories() { // creation de la fonction getcatégories
  const url = "http://localhost:5678/api/categories"; // lien vers mon API categories
  try {
    const response = await fetch(url); // effectue une requete http get vers l'API
    if (!response.ok) { // vérifie si la repose est correct 
      throw new Error(`Reponse status: ${response.status}`); // lève l'erreur en cas de réponse non valide
    }
    const json = await response.json(); // conversion de la reponse ne JSON
    for (let i = 0; i < json.length; i++) { // parcourir les catégories récupéres
      filterButton(json[i]); // et appelle la fonction filterButton pour chaque catégorie
    }
  } catch (error) {
    console.error(error.message); // gérer les problèmes de connxion sur l'API
  }

}
getCategories(); //j'appelle ma fonction getcategories

// recuperer mes data sur l'api (noms de filtre)
function filterButton(data) { // cration de la fonction filterButton à partir des données reçues
  const div = document.createElement("div");// creation d'une DIV pour représenter mes boutons
  div.className = data.id; // ajoute dela class qui correspond à l'identifiant du filtre (data.id)
  div.addEventListener("click", () => getWorks(data.id)); // ajoute d'un eventlistener à ma fonction getworks avec l'id du filtre
  div.innerHTML = `${data.name}`; // insere le filtre (data.name) dans le contenu html du bouton
  document.querySelector(".div-container").append(div); // Ajoute du bouton créé dans un conteneur HTML existant avec la classe "div-container"
}
document.querySelector(".Tous").addEventListener("click", () => getWorks()); // Ajout d'evenlistener pour le bouton ayant la classe "Tous"

// permet d'afficher les éléments quand on se logue 
function displayAddBanner() {
  const aLink = document.querySelector(".js-modal"); //je déclare le lien aLink
  const logOut = document.getElementById("logout");  // je déclare le logout
  if (sessionStorage.authToken) { // si on t'authentifie correctement avec la clé token 
    const editBanner = document.createElement('div'); // alors on créé une div
    editBanner.className = 'edit'; // on ajoutre à cette div la class 'edit'
    //lien edit avec le modal
    editBanner.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';

    document.body.prepend(editBanner);
    const hiddenFilter = document.querySelector(".div-container"); // div-container = bloc-filtre
    const logIn = document.getElementById("logIn");
    logIn.style.display = "none"; // faire disparaitre le login
    logOut.style.visibility = "visible"; // rendre visible le logout
    hiddenFilter.style.display = "none"; // faire disparaitre les filtres
    aLink.style.visibility = "visible";// rendre visible le aLink
  } else {
    logIn.style.visibility = "visible";// rendre visible
    logOut.style.display = "none"; // faire disparaitre le logout
    aLink.style.visibility = "hidden"; // masquer le aLink
  }

  // ajouter un eventlistener sur le logOut
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
  addEventListenerToAddPhotoButton(); // la fonction ajoute un eventlistener au bouton ajouter photo
});
// ajout eventlistener sur le bouton close
function addEventListenercloseModal() {
  const closeModal = document.querySelector(".fa-xmark");
  closeModal.addEventListener("click", () => {
    modal.style.visibility = "hidden"
  });
}
addEventListenercloseModal(); // ajout eventlistener sur le bouton close


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
  const deleteApi = "http://localhost:5678/api/works/";
  let response = await fetch(deleteApi + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

};

// ajouter une photo dans la modale
const showAddPhotoModal = function () {
  // Contenu de la modale
  document.querySelector(".modal-wrapper").innerHTML = `
    <div class="fermer">
      <i class="fa-solid fa-arrow-left"></i>
      <i class="fa-solid fa-xmark"></i>
    </div>
    <p title="titlemodal" class="gallery-photo">Ajout photo</p>
    <div class="center">
      <div class="blue">
        <div id="preview-container"></div>
        <i class="fa-regular fa-image"></i>
        <label for="plusPhoto" class="formFile">+ Ajouter photo</label>
        <input id="plusPhoto" type="file" accept="image/jpg, image/png">
        <p class="format">jpg, png : 4mo max</p>
      </div>
      <div class="addPhotoForm">
        <form class="valider" action="#" method="post">
          <label for="title">Titre</label>
          <input type="text" name="title" id="title" />
          <label for="category">Catégorie</label>
          <select name="category" id="category">
            <option value="Objets">Objets</option>
            <option value="Appartements">Appartements</option>
            <option value="Hotels & restaurants">Hotels & restaurants</option>
          </select>
          <hr/>
        <input type="submit" value="Valider" id="valider">
        </form>
        
      </div>
    </div>
  `;

  // Gérer le bouton de retour
  const backButton = document.querySelector(".fa-arrow-left");
  backButton.addEventListener("click", () => { // ajoute eventlistener sur le bouton backButton
    // Logique pour revenir à la vue précédente
    document.querySelector(".modal-wrapper").innerHTML = `
      <div class="fermer">
        <i></i> <i class="fa-solid fa-xmark"></i>
      </div>
      <p title="titlemodal" class="gallery-photo">Galerie photo</p>
      <div class="gallery-modal"></div>
      <div class="addPhotoForm"></div>
      <hr/>
      <input class="addPhoto" type="submit" value="Ajouter une photo">
    `
    // Afficher les figures
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
        data.forEach(item => showFigureModal(item));
      });

    addEventListenerToAddPhotoButton(); // la fonction ajoute un eventlistener à un bouton ajouter photo
    addEventListenercloseModal() // ajout eventlistener sur le bouton close

  });

  // Gérer la prévisualisation de la photo

  document.getElementById("plusPhoto").addEventListener('change', function (event) {
    const file = event.target.files[0];
    console.log(file)

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) { // Vérification des conditions : type et taille
      const reader = new FileReader();
      reader.onload = function (e) {
        const previewContainer = document.getElementById("preview-container");
        const faImage = document.querySelector(".fa-image");
        const buttonAddPhotoPlus = document.querySelector(".formFile");
        const formatImage = document.querySelector(".format");
        faImage.style.display = "none"; // faire disparaitre la fontawersome fa-image
        buttonAddPhotoPlus.style.display = "none"; // faire disparaitre le bouton + Ajouter photo
        formatImage.style.display = "none"; // faire disparaitre le texte qui indique le format du fichier

        // Effacer les anciennes prévisualisations
        previewContainer.innerHTML = '';

        // Ajouter une nouvelle image
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'uploaded photo';
        img.style.maxWidth = "126px"; // Ajuster la largeur maximale
        previewContainer.appendChild(img);
      };

      // Lire le fichier en tant qu'URL base64
      reader.readAsDataURL(file);
    } else {
      alert('Format accepté : jpeg ou png, taille max 4Mo');
    }
  });
  addEventListenercloseModal(); // la fonction ajoute un eventlistener à un bouton
};

// la fonction ajoute un eventlistener à un bouton
function addEventListenerToAddPhotoButton() {
  const addPhotoButton = document.querySelector(".addPhoto"); // on récupère le bouton
  if (addPhotoButton) { // on vérifie l'existance du bouton
    addPhotoButton.addEventListener('click', showAddPhotoModal); // au click on appel la fonction showAddPhotoModal
  }
}

// ajoute un evenlistener sur le bouton valider 

// 
document.getElementById("#valider")
addEventListener("submit", addEventListenerButtonValider)



async function addEventListenerButtonValider(e) {
  event.preventDefault();
  // Récupérer les données du formulaire
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const fileInput = document.getElementById("plusPhoto");
  const file = fileInput.files[0]; // Le fichier sélectionné
  console.log("#category :", category)
  console.log("#fileInput :", fileInput)
  console.log("#title :", title)
  console.log("#category :", category)



  // let response = await fetch(loginApi, {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json",
  //     },
  // body: JSON.stringify(user),
  // });
  // console.log(response); // quand la reponse est bonne on a un status de 200 sinon status 401

  // // message d'erreur page logIn
  // if (response.status != 200) {
  //     const errorMessage =  document.createElement("div");
  //     errorMessage.className = 'error';
  //     errorMessage.innerHTML = 'Email ou Mot de passe incorrect';
  //     document.querySelector('form').prepend(errorMessage); // créer un espace pour accueillir le message d'erreur 
  // }
  // else {
  //     let result = await response.json();
  //     const token = result.token;
  //     sessionStorage.setItem("authToken", token);// Stock le token
  //     window.location.href = ("index.html"); // redirige vers la parge d'accueil 
  // }

}