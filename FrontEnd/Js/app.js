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
    //console.log(json);
    for (let i = 0; i < json.length; i++) {
      FilterButton(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }

}
getCategories();

// recuperer mes data sur l'api (noms de filtre)
function FilterButton(data) {
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

const modal = document.querySelector('.modal')
modal.style.visibility = "hidden"

const openModal = document.querySelector(".js-modal");
openModal.addEventListener("click", () => {
  modal.style.visibility = "visible"
});

const closeModal = document.querySelector(".fermer");
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

async function deleteWorks(event) {
  const id = event.srcElement.id;
  const deleteApi = "http://localhost:5678/api/works/";
  const token = sessionStorage.authToken;
  let response = await fetch(deleteApi + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (response.status == 401 || response.status == 500) {
    const errorMessage = document.createElement("div");
    errorMessage.className = 'error-login';

  }
  else {
    console.log(result);
  }

}