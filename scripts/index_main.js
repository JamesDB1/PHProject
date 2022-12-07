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
    let resultsElement = document.querySelector("#matchingQuizzes");
    resultsElement.innerHTML = "";
    for (let i = 0; i < quizzes.length; i++) {
        let quiz = quizzes[i];
        let questions = quiz.questions;
        for (let j = 0; j < questions.length; j++) {
            let question = questions[j];
            let tags = question.tags;
            for (let k = 0; k < tags.length; k++) {
                let tag = tags[k];
                if (tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    matchingQuizzes.push(quiz);
                    resultsElement.innerHTML += "<h2>" + tag.tagName + "</h2>";
                    break;
                }
            }
        }
    }
    return matchingQuizzes;
}

function buildTable(quizzes) {
    let resultsElement = document.querySelector("#matchingQuizzes");
    let html = "<ul>";
    for (let i = 0; i < quizzes.length; i++) {
        let quiz = quizzes[i];
        html += "<li>" + quiz.quizTitle + "</li>";
        html += "<li>" + quiz.questions[0].tags[0].tagCategory  + "</li>";
    }
    html += "</ul>";
    resultsElement.innerHTML += html;
}

