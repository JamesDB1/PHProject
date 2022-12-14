/* 
 * SCRIPT CORRESPONDS WITH newUser-guest.php
 */

window.onload = function () {
    document.querySelector("#btnSubmit").addEventListener("click", verifyUser);
};
function verifyUser() {
    const inputs = document.querySelectorAll(".inputRequired");
    let inputOK = true;
    for (let i of inputs) {
        if (i.value === "") {
            inputOK = false;
            break;
        }
    }

    if (inputOK === false) {
        alert('You must fill out all fields!');
        return;
    }
    
    let passOK = false;
    if (inputs[1].value === inputs[2].value) {
        passOK = true;
    }

    if (passOK === false) {
        alert('Passwords do not match!');
    } else {
        postAccount(inputs[0].value, inputs[1].value); //this is the username and password
    }

}

async function postAccount(username, password) {
    let url = `quizapp/users`;
    let user = {
        username: username,
        password: password,
        permissionLevel: "USER",
    }
    
    console.log("JS USER OBJ")
    console.log(user);

    const resp = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
    });
    const msg = await resp.json();

    if (msg === 1) {
        alert("User successfully created. Click OK to return to Home.");
        location.href = "index.php";
    } else if (msg === 0) {
        alert("User creation FAILED.");
    } else {
        //If there is an exception, the backend returns a JSON object with an ERROR field
        alert("Server-side error. \n\n" + msg.ERROR);
    }
}