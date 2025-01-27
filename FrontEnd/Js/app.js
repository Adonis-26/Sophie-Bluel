//1.1 la galerie fonctionnelle affichée avec la liste des travaux provenant du back-end

//recupérer mon works dapuis API
async function getWorks(filter) { 
  document.querySelector(".gallery").innerHTML = ""; // réinitialise la galerie en vidant son avant de la remplir 
  const url = "http://localhost:5678/api/works"; //url de l'API pour récupérer les travaux
  try {
    const response = await fetch(url); // effectue une requete GET vers l'API
    if (!response.ok) { // vérifie que la réponse est correcte (code 200)
      throw new Error(`Reponse status: ${response.status}`); // lève une erreu si la reponse n'est pas correct
    }
    const json = await response.json(); // convertis la reponse json en format objet JS
    if (filter) { // si le filtre est fourni
      const filtrer = json.filter((data) => data.categoryId === filter);// filtre les éléments par catégorie en fonction de l'ID du filtre
      for (let i = 0; i < filtrer.length; i++) { // boucle sur les éléments filtés pour les afficher dans la galerie et la modale
        showFigure(filtrer[i]); //affiche l'élément dans la galerie
        showFigureModal(json[i]);//affiche l'élément dans la modale
      }
    }
    else {
      for (let i = 0; i < json.length; i++) { // si aucun filtre n'est appliqué, afficher tous les éléments
        showFigure(json[i]); //affiche l'élément dans la galerie
        showFigureModal(json[i]);//affiche l'élément dans la modale
      }
    }
    //delete img modall
    const trashIcon = document.querySelectorAll(".fa-trash-can");// récupéré tous les icones de type "fa-trash-can" et ajoute un getionnaire d'évènements
    trashIcon.forEach((e) =>
      e.addEventListener('click', (event) => deleteWorks(event))); // ajout d'un eventlistener sur chaque icône
  } catch (error) {
    console.error(error.message);
  }
}
getWorks(); // appel de la fonction getworks pour récupérer et afficher les traveaux

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
      createFilterButtons(json[i]); // et appelle la fonction createFilterButtons pour chaque catégorie
    }
  } catch (error) {
    console.error(error.message); // gérer les problèmes de connexion sur l'API
  }

}
getCategories(); 

// creation des bouttons qui permettent de filtrer les projets par catégorie
function createFilterButtons(data) { 
  const div = document.createElement("div");// creation d'une DIV pour représenter mes boutons
  div.className = data.id; // ajout de la class qui correspond à l'identifiant du filtre (data.id)
  div.addEventListener("click", () => getWorks(data.id)); // ajout d'un eventlistener au button 
  div.innerHTML = `${data.name}`; // insere le nom de la catégorie dans le contenu html du bouton
  document.querySelector(".div-container").append(div); // Ajout du bouton créé dans un conteneur HTML existant avec la classe "div-container"
}
document.querySelector(".all-categories").addEventListener("click", () => getWorks()); // Ajout d'evenlistener pour le bouton ayant la classe "Tous"

// permet de vérifier si user est connecté avant d'afficher le bon mode
function checkAndSwitchToConnectedMode() {
  const aLink = document.querySelector(".js-modal"); 
  const logOut = document.getElementById("logout");  
  if (sessionStorage.authToken) { // si on a une token dans la session
    const editBanner = document.createElement('div'); // on crée une idv
    editBanner.className = "edit"; // dans cette div, on ajoute une class "edite"
    //bannière mode édition quand on est connecté
    editBanner.innerHTML = `<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>`; 

    document.body.prepend(editBanner);// ajout de "editBanner" au debut document html
    const hiddenFilter = document.querySelector(".div-container"); 
    const logIn = document.getElementById("logIn");
    logIn.style.display = "none"; // faire disparaitre le login quand on se connecte
    logOut.style.visibility = "visible"; // rendre visible le logout quand on se connecte
    hiddenFilter.style.display = "none"; // faire disparaitre les filtres quand on se connecte
    aLink.style.visibility = "visible";// rendre visible le aLink quand on se connecte
  } else {
    logIn.style.visibility = "visible";// rendre visible quand on n'est pas connecté
    logOut.style.display = "none"; // faire disparaitre le logout quand on n'est pas connecté
    aLink.style.visibility = "hidden"; // masquer le aLink quand on n'est pas connecté
  }

  // ajouter un eventlistener sur le logOut
  logOut.addEventListener("click", e => {
    sessionStorage.clear(); // efface les données dans la sessionStorage
  })
};
checkAndSwitchToConnectedMode(); // j'appelle la fonction qui vérifie que je suis bien connecté pour me déconnecter

const modal = document.querySelector('.modal')
modal.style.visibility = "hidden"//masquer la modale
const openModal = document.querySelector(".js-modal");
openModal.addEventListener("click", () => { // ajout d'un eventlistener pour d'ouvrir la modale
  modal.style.visibility = "visible" // rendre la modale visible
  addEventListenerToAddPhotoButton(); // ajout un eventlistener au bouton pour ajouter photo
});

// fonction fermer la modale
function addEventListenercloseModal() {// ajout eventlistener sur le bouton close
  const closeModal = document.querySelector(".fa-xmark");
  closeModal.addEventListener("click", () => { 
    modal.style.visibility = "hidden" // caché la modale quand on la ferme
  });
}
addEventListenercloseModal(); // appel de l'eventlistener sur le bouton close pour fermer la modale 


//afficher les figures modal
function showFigureModal(data) {
  const figure = document.createElement("figure"); // creation d'un élément HTML 'figure' 
  figure.innerHTML = `<div class="image-container">
<img src="${data.imageUrl}" alt="${data.title}">
<i id=${data.id} class="fa-solid fa-trash-can delete-icon" style="color: #f7f9fc;" title="Supprimer"></i>
</div>`; // Ajout du contenu HTML à la figure avec une image et une icône de suppression
  
  document.querySelector(".gallery-modal").append(figure);// Sélectionne l'élément avec la classe "gallery-modal" dans le document html
}

// fonction supprimer les éléments
async function deleteWorks(event) {
  const token = sessionStorage.authToken; // récupère l'autentification de la token
  const id = event.srcElement.id; // récupère id de l'élément à supprimer à partir de l'élément déclenché 
  const deleteApi = "http://localhost:5678/api/works/"; // récuprère l'url de l'API pour la supression
  let response = await fetch(deleteApi + id, { // envoie une requete DELETE à l'API pour supprimer les traveaux
    method: "DELETE", // methode HTTP DELETE pour demander la suppression 
    headers: { // ajouter un heauder d'autorisation avec un token au format Bearer
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
    fetch("http://localhost:5678/api/works") // effectue une requette get vers l'API
      .then(response => response.json()) // convertis la reponse de l'API en format json
      .then(data => { //parcourt les éléments récupérés dans la réponse
        data.forEach(item => showFigureModal(item));
      });

    addEventListenerToAddPhotoButton(); // la fonction ajoute un eventlistener à un bouton ajouter photo
    addEventListenercloseModal() // la fonction ajoute eventlistener sur le bouton close
  });

  // Gérer la prévisualisation de la photo
  document.getElementById("plusPhoto").addEventListener("change", function (event) { // l'ajout d'un eventlistener à ID plusPhoto
    const file = event.target.files[0]; // récupère le 1er fichier selectionné par user

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) { // Vérification des conditions : type et taille
      const reader = new FileReader(); //autorise un FileReader pour lire le fichier
      reader.onload = function (e) { // récupère les éléments pour mettre sur l'interface
        const previewContainer = document.getElementById("preview-container");
        const faImage = document.querySelector(".fa-image");
        const buttonAddPhotoPlus = document.querySelector(".formFile");
        const formatImage = document.querySelector(".format");
        faImage.style.display = "none"; // faire disparaitre la fontawersome fa-image
        buttonAddPhotoPlus.style.display = "none"; // faire disparaitre le bouton + Ajouter photo
        formatImage.style.display = "none"; // faire disparaitre le texte qui indique le format du fichier

        previewContainer.innerHTML = '';// Effacer les anciennes prévisualisations

        // Ajouter une nouvelle image
        const img = document.createElement("img"); // creation d'une nouvelle balise img pour la prévisualisation
        img.src = e.target.result; //definit la source de l'img 
        img.alt = "uploaded photo"; // texte alternatif pour l'image 
        img.style.maxWidth = "126px"; // Ajuster la largeur maximale
        previewContainer.appendChild(img); // ajout de l'img au conteneur de prévisualisation
      };

      // Lire le fichier en tant qu'URL base64
      reader.readAsDataURL(file);
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
document.getElementById("#valider")
addEventListener("submit", addEventListenerButtonValider)

async function addEventListenerButtonValider(event) {
  event.preventDefault();
  // Récupérer les données du formulaire
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const fileInput = document.getElementById("plusPhoto");
  const file = fileInput.files[0]; // Le fichier sélectionné

  // Vérification des champs
  if (!title || !category || !file) {
    // Vérifiez si un message d'erreur 
    if (!document.querySelector('.error')) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error";
      errorMessage.innerHTML = "Remplir champs et ajouter une photo";
      document.querySelector("form").prepend(errorMessage); // Ajouter le message d'erreur au début du formulaire
    }
    return;
  }

   // Récupérer le token stocké
   const token = sessionStorage.getItem("authToken");
  // Préparer les données pour l'envoi
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", file); // Ajout du fichier

  
  // Envoyer les données à l'API
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });


}