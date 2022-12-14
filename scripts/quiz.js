let addOrUpdate; // need this because the same panel is used for adds and updates
let quizOrQuestion;

window.onload = function () {
    // add event handlers for buttons
    document.querySelector("#TakeQuizButton").addEventListener("click", takeQuiz);
    document.querySelector("#AddButton").addEventListener("click", addQuiz);
    document.querySelector("#DeleteButton").addEventListener("click", deleteQuiz);
    document.querySelector("#UpdateButton").addEventListener("click", updateQuiz);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#CancelButton").addEventListener("click", cancelAddUpdate);
    document.querySelector("#SearchButton").addEventListener("click", doSearch);

    // add event handler for selections on the table
    document.querySelector("#tableSearch").addEventListener("click", handleRowClick);
    document.querySelector("#tableSearch").addEventListener("dblclick", addToUpdateTbl);
    document.querySelector("#tableUpdate").addEventListener("dblclick", removeFromUpdateTbl);

    getAllQuizzes();
};

function takeQuiz() {
    var id = document.querySelector(".highlighted").querySelector("td").innerHTML;
    let url = "quizapp/quizzes/" + id;
    window.location.href = url;
}

function getAllQuizzes() {
    let url = "quizapp/quizzes"; // REST-style: URL refers to an entity or collection, not an action
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no... see console for error");
                console.log(resp);
            } else {
                buildTable(xmlhttp.responseText);
                clearSelections();
                resetUpdatePanel();
                hideUpdatePanel();
            }
        }
    };
    quizOrQuestion = "quiz";
    xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
    xmlhttp.send();
}

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
            }
        }
    };
    quizOrQuestion = "question";
    xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
    xmlhttp.send();
}

function getQuestionsForQuiz(quizId) {
    let url = `quizapp/quizzes/` + quizId;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no... see console for error");
                console.log(resp);
            } else {
                buildUpdateTable(xmlhttp.responseText);
            }
        }
    };
    xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
    xmlhttp.send();
}

function doSearch(e) {
    (quizOrQuestion === "quiz") ? quizSearch(e) : questionSearch(e);
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

function quizSearch(e) {
    e.preventDefault();
    let tags = document.querySelector("#tags").value;
    let url = "quizapp/quizzes/search:tags=" + tags;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no... see console for error");
                console.log(resp);
            } else {
                buildTable(xmlhttp.responseText);
                clearSelections();
                resetUpdatePanel();
                hideUpdatePanel();
            }
        }
    };
    xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
    xmlhttp.send();
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

function addToUpdateTbl(e) {
    let theTable = document.querySelector("#tableUpdate");
    var tds = document.querySelector(".highlighted").querySelectorAll("td");
    let row = theTable.insertRow(1);

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    
    cell1.innerHTML = tds[0].innerHTML;
    cell2.innerHTML = tds[1].innerHTML;
    cell3.innerHTML = tds[2].innerHTML;
    cell4.innerHTML = tds[3].innerHTML;
    cell5.innerHTML = "<input type='number' value='" + 0 + "'>";
}

function removeFromUpdateTbl(e) {
    e.target.parentElement.remove();
}

function cancelAddUpdate() {
    hideUpdatePanel();
    getAllQuizzes();
}

function processForm() {
    // 1. process the add or update
    // 
    // We need to send the data to the server. 
    // We will create a JSON string and pass it to the "send" method
    // of the HttpRequest object. Then if we send the request with POST or PUT,
    // the JSON string will be included as part of the message body 
    // (not a form parameter).
    var quizID = document.querySelector("#quizIDInput").value;
    var quizTitle = document.querySelector("#nameInput").value;
    let questions = [];
    let points = [];
    let table = document.querySelector("#tableUpdate");
    for(let i = 1; i < table.rows.length; i++){
        questions.push(table.rows[i].cells[0].innerHTML);
        points.push(table.rows[i].cells[4].childNodes[0].value);
    }

    var obj = {
        "quizID": quizID,
        "quizTitle": quizTitle,
        "questions": questions,
        "points": points
    };

    let url = "quizapp/quizzes/" + quizID;
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
                getAllQuizzes();
            }
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send(JSON.stringify(obj));
}

function deleteQuiz() {
    var id = document.querySelector(".highlighted").querySelector("td").innerHTML;
    let url = "quizapp/quizzes/" + id;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0 || resp != 1) {
                alert("oh no...");
                console.log(resp);
            } else {
                getAllQuizzes();
            }
        }
    };
    xmlhttp.open("DELETE", url, true);
    xmlhttp.send(id);
}

function addQuiz() {
    // Show panel, panel handler takes care of the rest
    addOrUpdate = "add";
    resetUpdatePanel();
    showUpdatePanel();
    getAllQuestions();
}

function updateQuiz() {
    addOrUpdate = "update";
    resetUpdatePanel();
    populateUpdatePanelWithSelectedItem();
    showUpdatePanel();
    getAllQuestions();
}

function showUpdatePanel() {
    document.getElementById("AddUpdatePanel").classList.remove("hidden");
}

function hideUpdatePanel() {
    document.getElementById("AddUpdatePanel").classList.add("hidden");
}

function resetUpdatePanel() {
    document.querySelector("#quizIDInput").value = "";
    document.querySelector("#nameInput").value = "";
}

function populateUpdatePanelWithSelectedItem() {
    var tds = document.querySelector(".highlighted").querySelectorAll("td");
    getQuestionsForQuiz(tds[0].innerHTML);
    document.querySelector("#quizIDInput").value = tds[0].innerHTML;
    document.querySelector("#nameInput").value = tds[1].innerHTML;
}

function buildTable(text) {
    let data = JSON.parse(text);
    let theTable = document.querySelector("#tableSearch");
    let html = theTable.querySelector("tr").innerHTML;
    html = "<tr><th>Quiz ID</th><th>Quiz Name</th></tr>"
    for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        html += "<tr>";
        html += "<td>" + temp.quizID + "</td>";
        html += "<td>" + temp.quizTitle + "</td>";
        html += "</tr>";
    }
    theTable.innerHTML = html;
}

function buildTableQues(text) {
    let data = JSON.parse(text);
    let theTable = document.querySelector("#tableSearch");
    let html = theTable.querySelector("tr").innerHTML;
    html = "<tr><th>Question ID</th><th>Question</th><th>Choices</th><th>Answer</th></tr>";
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
    }
    theTable.innerHTML = html;
}

function buildUpdateTable(text) {
    let data = JSON.parse(text);
    let theTable = document.querySelector("#tableUpdate");
    let html = theTable.querySelector("tr").innerHTML;
    html = "<tr><th>Question ID</th><th>Question</th><th>Choices</th><th>Answer</th><th>Points</th></tr>";
    for (let i = 0; i < data.questions.length; i++) {
        let temp = data.questions[i];
        html += "<tr>";
        html += "<td>" + temp.questionID + "</td>";
        html += "<td>" + temp.questionText + "</td>";
        let choiceStr = "";
        for (let j = 0; j < temp.choices.length; j++) {
            choiceStr += temp.choices[j] + " | ";
        }
        html += "<td>" + choiceStr.slice(0, (choiceStr.length - 2)) + "</td>";
        html += "<td>" + temp.answer + "</td>";
        html += "<td><input type='number' value='" + Number(data.points[i]) + "'></td>";
        html += "</tr>";
    }
    theTable.innerHTML = html;
}
