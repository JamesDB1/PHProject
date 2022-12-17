window.onload = function () {
    document.querySelector("#loginButton").addEventListener("click", doLogin);
};

function doLogin(e) {
    e.preventDefault();

    document.querySelector("#usernameError").innerHTML = "";
    document.querySelector("#passwordError").innerHTML = "";

    let username = document.querySelector("#usernameInput").value;
    let password = document.querySelector("#passwordInput").value;

    let obj = {
        username: username,
        password: password
    };

    let url = "login";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            resp = xhr.responseText;
            if (resp === "no such user") {
                document.querySelector("#usernameError").innerHTML = resp;
            } else if (resp === "wrong password") {
                document.querySelector("#passwordError").innerHTML = resp;
            } else if (resp === "login successful") {
                window.location.href = "quizResults.php";
            } else {
                alert("BAD RESPONSE from server - investigate! (Response: '" + resp + "')");
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.send(JSON.stringify(obj));
}