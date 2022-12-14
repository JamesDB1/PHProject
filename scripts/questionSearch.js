window.onload = function () {
    document.querySelector("#searchButton").addEventListener("click", doSearch);
};

function doSearch() {
    //alert("coming soon");
    let searchTerm = document.querySelector("#searchInput").value;

    let url = "quizapp/quizzes";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let resp = xhr.responseText;
            let matchingQuizzes = findMatchingQuizzes(resp, searchTerm);
            console.log(matchingQuizzes);
            buildTable(matchingQuizzes);
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function findMatchingQuizzes(jsonData, searchTerm) {
    let quizzes = JSON.parse(jsonData);
    let matchingQuizzes = [];
    let resultsElement = document.querySelector("#quizzes");
    resultsElement.innerHTML = "";
    for (let i = 0; i < quizzes.length; i++) {
        let getOut = false;
        let quiz = quizzes[i];
        let questions = quiz.questions;
        for (let j = 0; j < questions.length; j++) {
            let question = questions[j];
            let tags = question.tags;
            for (let k = 0; k < tags.length; k++) {
                let tag = tags[k];
                if (tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    matchingQuizzes.push(quiz);
                    getOut = true;
                    break;
                }
            }
            if (getOut !== false) {
                getOut = false;
                break;
            }
        }
    }
    return matchingQuizzes;
}

function buildTable(quizzes) {
    let resultsElement = document.querySelector("#quizzes");
    html = "<table>";
    html += "<tr><th>Quiz ID</th><th>Quiz Title</th></tr>";
    for (let i = 0; i < quizzes.length; i++) {
        let quiz = quizzes[i];
        html += "<tr>";
        html += "<td>" + quiz.quizID + "</td>";
        html += "<td>" + quiz.quizTitle + "</td>";
        html += "</tr>";
    }
    html += "</table>";
    resultsElement.innerHTML += html;
}

