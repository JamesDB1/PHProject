window.onload = function () {
    try {
        //Tag Search
        let html = '<section id="tagSearch"><h3>Search for Quizzes By Tag</h3>';
        html += '<form>Tag: <input id="tags" type="text"><br>';
        html += '<br><button id="getTagResultsButton">Get Results</button></form></section>';
        //Results
        html += '<section>\n\ <div class="quizResults"></div></section></div>';
        document.body.innerHTML  += html;
    } finally {
        document.querySelector("#getTagResultsButton").addEventListener("click", getResultsByTags);
        getQuizzes();
    }
};

function getQuizzes() {
    let url = "quizapp/quizzes";
    let title = "All Quiz Results";
    let element = document.querySelector(".quizResults");
    buildResultsSection(url, element, title);
}

function getResultsByTags(e) {
    e.preventDefault();
    let tags = document.querySelector("#tags").value;
    let url = "quizapp/quizzes/search:tags=" + tags;
    let title = "Quiz Results that contain " + tags + " in their tag";
    let element = document.querySelector(".quizResults");
    buildResultsSection(url, element, title);
}

function buildResultsSection(url, element, title) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let resp = xhr.responseText;
            let data = JSON.parse(resp);
            let html = "<h4>" + title + "</h4>";
            html += "<table>";
            html += "<tr><th>Question ID</th><th>Question</th></tr>";
            for (let i = 0; i < data.length; i++) {
                let temp = data[i];
                html += "<tr>";
                html += "<td>" + temp.quizID + "</td>";
                html += "<td>" + temp.quizTitle + "</td>";                            
                html += "</tr>";
            }
            html += "</table>";
            element.innerHTML = html;
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

