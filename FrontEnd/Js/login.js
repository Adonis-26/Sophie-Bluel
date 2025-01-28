const loginApi = "http://localhost:5678/api/users/login";

//selection de "loginform", on l'ajoute un evènement submit
document.querySelector("loginform") 
    addEventListener("submit", entranceLogin)

// la fonction est appelé lorsque le formulaire est soumis
async function entranceLogin(event) {
    event.preventDefault();

    // données saisies du formulaire
    let user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    //données envoyé à l'API
    let response = await fetch(loginApi, {
        method: "POST", // methode HTTP  utilisée pour envoyer les données 
        headers: {
            "Content-Type": "application/json", // indique que les données sont en format JSON
        },
    body: JSON.stringify(user), // convertit l'objet 'user' en chaine JSON pour l'envoyer
    });
    console.log(response); // quand la reponse est bonne on a un status de 200 sinon status 401

    // vérifie le statue de la réponse 
    if (response.status != 200) { // si le statut HTTP n'est pas 200
        if (!document.querySelector('.error')) { // vérifie qu'aucun message d'erreur n'est déjà présent sur la page
            const errorMessage = document.createElement("div");// crée un élément "div" pour afficher le message d'erreur 
            errorMessage.className = 'error'; // attribue une class CSS "error" au message
            errorMessage.innerHTML = 'Email ou Mot de passe incorrect'; // texte message d'erreur 
            document.querySelector('form').prepend(errorMessage); // créer un espace pour accueillir le message d'erreur 
        }
    }
    else {// si le statut HTTP est 200
        let result = await response.json(); // convertit la reponse JSON en objet JS
        const token = result.token; // recupère la token de la réponse
        sessionStorage.setItem("authToken", token);// Stock le token dans la sessionStorage
        window.location.href = ("index.html"); // redirige vers la parge d'accueil 
    }
   
}