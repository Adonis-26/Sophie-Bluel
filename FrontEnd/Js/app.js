//1.1 la galerie fonctionnelle affichée avec la liste des travaux provenant du back-end
async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok){
        throw new Error(`Reponse status: ${response.status}`);
    }
      const json = await response.json();
      //console.log(json);
    for(let i = 0; i < json.length; i++) {
     AfficherFigure(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}
getWorks();

//afficher les figure
function AfficherFigure(data) {
  const figure = document.createElement("figure");
  figure.innerHTML =`<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`; 
//afficher la galerie 
  document.querySelector(".gallery").append(figure);
}

//=========================================================================================

//1.2 Réalisation du filtre des travaux : Ajout des filtres pour afficher les travaux par catégorie

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok){
        throw new Error(`Reponse status: ${response.status}`);
    }
      const json = await response.json();
    console.log(json);
    for(let i = 0; i < json.length; i++) {
     Filter(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}
getCategories();


function Filter(data){
  // mes div correspondes à mes 4 blocs de filtres
  const div = document.createElement("div");
  div.innerHTML = `${data.name}`; 
 
  document.querySelector(".div-container").append(div);
}