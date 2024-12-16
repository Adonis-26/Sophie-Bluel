const loginApi = "http://localhost:5678/api/users/login";

document.querySelector("loginform")
    addEventListener("submit", entranceLogin)

async function entranceLogin(event) {
    event.preventDefault();

    let user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    try {
        let response = await fetch(loginApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        // Extraction du résultat JSON
        let result = await response.json();
        console.log("Résultat de l'API :", result);

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
    }
    // Afficher les informations utilisateur dans les logs
    console.log("Email :", user.email);
    console.log("Mot de passe :", user.password);
}


