let addOrUpdate; // need this because the same panel is used for adds and updates

window.onload = function () {
    // add event handler for selections on the table
    document.querySelector("table").addEventListener("click", handleRowClick);
    
    getAllQuizzes();
};


function getAllQuizzes() {
    // let url = "api/getAllItems.php";
    let url = "quizapp/quizzes"; // REST-style: URL refers to an entity or collection, not an action
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            console.log(resp);
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

function buildTable(text) {
    let data = JSON.parse(text);
    let theTable = document.querySelector("table");
    let html = theTable.querySelector("tr").innerHTML;
    for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        html += "<tr>";
        html += "<td>" + temp.quizID + "</td>";
        html += "<td>" + temp.quizTitle + "</td>";
        html += "<td>" + temp.questions.length + "</td>";
        html += "<td><a href=quizapp/quizzes/" + temp.quizID +  ">Take Quiz</a></td>";
        html += "</tr>";
    }
    theTable.innerHTML = html;
}
