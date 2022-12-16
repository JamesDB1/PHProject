let addOrUpdate; // need this because the same panel is used for adds and updates
let questionOrQuestion;

window.onload = function () {
    // add event handlers for buttons
    document.querySelector("#AddButton").addEventListener("click", addQuestion);
    document.querySelector("#DeleteButton").addEventListener("click", deleteQuestion);
    document.querySelector("#UpdateButton").addEventListener("click", updateQuestion);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#CancelButton").addEventListener("click", cancelAddUpdate);
    document.querySelector("#SearchButton").addEventListener("click", questionSearch);

    // add event handler for selections on the table
    document.querySelector("#tableSearch").addEventListener("click", handleRowClick);
    document.querySelector("#nChoices").addEventListener("change", createOptions);

    getAllQuestions();
};

function getAllQuestions() {
    let url = "quizapp/questions"; // REST-style: URL refers to an entity or collection, not an action
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no... see console for error");
                console.log(resp);
            } else {
                buildTableQues(xmlhttp.responseText);
                hideUpdatePanel();
            }
        }
    };
    questionOrQuestion = "question";
    xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
    xmlhttp.send();
}

function questionSearch(e) {
    e.preventDefault();
    let tags = document.querySelector("#tags").value;
    let url = "quizapp/questions/search:tags=" + tags;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no... see console for error");
                console.log(resp);
            } else {
                buildTableQues(xmlhttp.responseText);
            }
        }
    };
    xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
    xmlhttp.send();
}

function createOptions() {
    let newList = ""
    let i = 0;

    while (i < document.querySelector("#nChoices").value) {
        i++;
        newList += "<li><input id='choice" + i + "' name='choice" + i + "' type='text' required></li>";
    }

    document.querySelector("#choices").innerHTML = newList;
}

function clearSelections() {
    let trs = document.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove("highlighted");
    }
}

function handleRowClick(e) {
    //add style to parent of clicked cell
    clearSelections();
    e.target.parentElement.classList.add("highlighted");

    // enable Delete and Update buttons
    document.querySelector("#DeleteButton").removeAttribute("disabled");
    document.querySelector("#UpdateButton").removeAttribute("disabled");
}


function cancelAddUpdate() {
    hideUpdatePanel();
    getAllQuestions();
}

function processForm() {
    // 1. process the add or update
    // 
    // We need to send the data to the server. 
    // We will create a JSON string and pass it to the "send" method
    // of the HttpRequest object. Then if we send the request with POST or PUT,
    // the JSON string will be included as part of the message body 
    // (not a form parameter).
    let len = document.querySelector("#nChoices").value;
    let choices= [];
    for (let i = 0; i < len; i++) {
        let ident = "#choice" + (i + 1);
        choices.push(document.querySelector(ident).value);
    }
    var questionID = document.querySelector("#questionIDInput").value;
    var questionTitle = document.querySelector("#nameInput").value;
    var answer = document.querySelector("#answer").value;
    var tags = document.querySelector("#tags").value;
    tags = tags.split(",")

    var obj = {
        "questionID": questionID,
        "questionText": questionTitle,
        "choices": choices,
        "answer": answer,
        "tags": tags
    };

    let url = "quizapp/questions/" + questionID;
    let method = (addOrUpdate === "add") ? "POST" : "PUT";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resp = xmlhttp.responseText;
            console.log(resp);
            if (resp.search("ERROR") >= 0 || resp != 1) {
                alert("oh no...");
                console.log(resp);
            } else {
                getAllQuestions();
            }
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send(JSON.stringify(obj));
}

function deleteQuestion() {
    var id = document.querySelector(".highlighted").querySelector("td").innerHTML;
    let url = "quizapp/questions/" + id;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0 || resp != 1) {
                alert("oh no...");
                console.log(resp);
            } else {
                getAllQuestions();
            }
        }
    };
    xmlhttp.open("DELETE", url, true);
    xmlhttp.send(id);
}

function addQuestion() {
    // Show panel, panel handler takes care of the rest
    addOrUpdate = "add";
    resetUpdatePanel();
    showUpdatePanel();
}

function updateQuestion() {
    addOrUpdate = "update";
    resetUpdatePanel();
    populateUpdatePanelWithSelectedItem();
    showUpdatePanel();
}

function showUpdatePanel() {
    document.getElementById("AddUpdatePanel").classList.remove("hidden");
}

function hideUpdatePanel() {
    document.getElementById("AddUpdatePanel").classList.add("hidden");
}

function resetUpdatePanel() {
    document.querySelector("#questionIDInput").value = "";
    document.querySelector("#nameInput").value = "";
}

function populateUpdatePanelWithSelectedItem() {
    var tds = document.querySelector(".highlighted").querySelectorAll("td");
    let arr = tds[2].innerHTML.split("| ");
    let newList = "";
    let i = 0;
    while (i < arr.length) {
        i++;
        newList += "<li><input id='choice" + i + "' name='choice" + i + "' type='text' required></li>";
    }
    document.querySelector("#choices").innerHTML = newList;
    document.querySelector("#questionIDInput").value = tds[0].innerHTML;
    document.querySelector("#nameInput").value = tds[1].innerHTML;
    document.querySelector("#nChoices").value = arr.length;
    for (i = 0; i < arr.length; i++) {
        let ident = "#choice" + (i + 1);
        document.querySelector(ident).value = arr[i].trim();
    }
    document.querySelector("#answer").value = tds[3].innerHTML;
    document.querySelector("#tags").value = tds[4].innerHTML;
}

function buildTableQues(text) {
    let data = JSON.parse(text);
    let theTable = document.querySelector("#tableSearch");
    let html = theTable.querySelector("tr").innerHTML;
    html = "<tr><th>Question ID</th><th>Question</th><th>Choices</th><th>Answer</th><th>Tags</th></tr>";
    for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        html += "<tr>";
        html += "<td>" + temp.questionID + "</td>";
        html += "<td>" + temp.questionText + "</td>";
        let choiceStr = "";
        for (let j = 0; j < temp.choices.length; j++) {
            choiceStr += temp.choices[j] + " | ";
        }
        html += "<td>" + choiceStr.slice(0, (choiceStr.length - 2)) + "</td>";
        html += "<td>" + temp.answer + "</td>";
        let taggo = "";
        if (temp.tags.length > 0) {
            taggo = temp.tags[0].tagName
        }
        for (let j = 1; j < temp.tags.length; j++) {
            taggo += ", " + temp.tags[j].tagName;
        }
        html += "<td>" + taggo + "</td>";
    }
    theTable.innerHTML = html;
}
