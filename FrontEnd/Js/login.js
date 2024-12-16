const loginApi = "http://localhost:5678/api/users/login";

document.querySelector("loginform")
    addEventListener("submit", entranceLogin)

async function entranceLogin(event) {
    event.preventDefault();

    let user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    let response = await fetch(loginApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    body: JSON.stringify(user),
    });
    console.log(response); // quand la reponse est bonne on a un status de 200 sinon status 401

    // message d'erreur page logIn
    if (response.status != 200) {
        const errorMessage =  document.createElement("div");
        errorMessage.className = 'error';
        errorMessage.innerHTML = 'Email ou Mot de passe incorrect';
        document.querySelector('form').prepend(errorMessage);
    }
    else {
        let result = await response.json();
        const token = result.token;
        sessionStorage.setItem("authToken", token);// Stock le token
        console.log(token); 
    
    window.location.href = ("index.html"); // redirige vers la parge d'accueil    
    }
   
}


