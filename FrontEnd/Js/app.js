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
      }
    }
    else {
      for (let i = 0; i < json.length; i++) {
        showFigure(json[i]);
      }
    }
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
      console.log(json[i]);

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
