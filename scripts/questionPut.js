let addOrUpdate; // to track whether we're doing an add or an update

window.onload = function () {

    // add event handlers for buttons
    document.querySelector("#nChoices").addEventListener("change", createOptions);
    document.getElementById('form').addEventListener("submit", checkEvent);
};

function createOptions() {
    let newList = ""
    let i = 0;
    
    while(i < document.querySelector("#nChoices").value){
        i++;
        newList+="<li><input id='choice" + i + "' name='choice" + i + "' type='text' required></li>";
    }
    
    document.querySelector("#choices").innerHTML = newList;
}

function checkEvent(event) {
    let an = document.getElementById('answer').value;
    let j = 0;
    let check = true;
    
    while(j < document.querySelector("#nChoices").value){
        j++;
        let cString = "choice" + j;
        let guess = document.getElementById(cString).value;
        if(guess === an){
            check = false;
        }
        else{
            document.getElementById('errorSpan').innerHTML = "Error: answer must match a choice!";
        }
    }
    
    if(check){
        event.preventDefault();
    }
}