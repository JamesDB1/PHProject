window.onload = function () {
    try {
        //User Search
        let html = '<section id="userSearch"><h3>Search for Quiz Results by User</h3>';
        html += '<form><select id="userInput"></select><button id="getResultsButton">Get Results</button></form></section>';
        //Score Search
        html += '<section id="scoreSearch"><h3>Search for Quiz Results By Score</h3>';
        html += '<form>Min: <input id="scoreMin" type="number" min="0" max="100"><br>Max: <input id="scoreMax" type="number" min="0" max="100">';
        html += '<br><button id="getScoreResultsButton">Get Results</button></form></section>';
        //Date Search
        html += '<section id="dateSearch"><h3>Search for Quiz Results By Date</h3>';
        html += '<form>Start: <input id="datestart" type="date"><br>End: <input id="dateend" type="date">';
        html += '<br><button id="getDateResultsButton">Get Results</button></form></section>';
        //Tag Search
        html += '<section id="tagSearch"><h3>Search for Quiz Results By Tag</h3>';
        html += '<form>Tag: <input id="tags" type="text"><br>';
        html += '<br><button id="getTagResultsButton">Get Results</button></form></section>';
        //Results
        html += '<section>\n\ <div class="quizResults"></div></section></div>';
        document.body.innerHTML  += html;
    } finally {
        document.querySelector("#getResultsButton").addEventListener("click", getResultsByUser);
        document.querySelector("#getScoreResultsButton").addEventListener("click", getResultsByScore);
        document.querySelector("#getDateResultsButton").addEventListener("click", getResultsByDate);
        document.querySelector("#getTagResultsButton").addEventListener("click", getResultsByTags);
        getResults();
        loadUsers();
    }
};

function getResults() {
    let url = "quizapp/quizResults";
    let title = "All Quiz Results";
    let element = document.querySelector(".quizResults");
    buildResultsSection(url, element, title);
}

function getResultsByScore(e) {
    e.preventDefault();
    let min = document.querySelector("#scoreMin").value;
    let max = document.querySelector("#scoreMax").value;
    let url = "quizapp/quizResults/search:scoremin=" + min + "&scoremax=" + max;
    let title = "Quiz Results for Score Range from " + min + " to " + max;
    let element = document.querySelector(".quizResults");
    buildResultsSection(url, element, title);
}

function getResultsByUser(e) {
    e.preventDefault();
    let username = document.querySelector("#userInput").value;
    let url = "quizapp/quizResults/search:user=" + username;
    let title = "Quiz Results for " + username;
    let element = document.querySelector(".quizResults");
    buildResultsSection(url, element, title);
}

function getResultsByDate(e) {
    e.preventDefault();
    let min = document.querySelector("#datestart").value;
    let max = document.querySelector("#dateend").value;
    let url = "quizapp/quizResults/search:datestart=" + min + "&dateend=" + max;
    let title = "Quiz Results for Date Range from " + min + " to " + max;
    let element = document.querySelector(".quizResults");
    buildResultsSection(url, element, title);
}

function getResultsByTags(e) {
    e.preventDefault();
    let tags = document.querySelector("#tags").value;
    let url = "quizapp/quizResults/search:tags=" + tags;
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
            html += "<tr><th>User</th><th>Quiz ID</th><th>Quiz Title</th><th>Started</th>" +
                    "<th>Submitted</th><th>Score</th><th>Percent</th><th>View</th></tr>";
            for (let i = 0; i < data.length; i++) {
                let temp = data[i];
                html += "<tr>";
                html += "<td>" + temp.user + "</td>";
                html += "<td>" + temp.quiz.quizID + "</td>";
                html += "<td>" + temp.quiz.quizTitle + "</td>";
                let startTime = temp.startTime.split(" ");
                let endTime = temp.endTime.split(" ");
                html += "<td>" + startTime[0] + " at " + startTime[1] + "</td>";
                html += "<td>" + endTime[0] + " at " + endTime[1] + "</td>";
                html += "<td>" + temp.scoreNumerator + "/" + temp.scoreDenominator + "</td>";
                let percent = temp.scoreNumerator / temp.scoreDenominator * 100;
                html += "<td>" + percent.toFixed(1) + "%</td>";
                html += `<td><button onclick='location.href = "quizResultDetail.php?id=${temp.resultID}"'>Details</button></td>`
                html += "</tr>";
            }
            html += "</table>";
            element.innerHTML = html;
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function loadUsers() {
    let url = "quizapp/users";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let resp = xhr.responseText;
            let data = JSON.parse(resp);
            let html = "";
            for (let i = 0; i < data.length; i++) {
                html += "<option value='" + data[i].username + "'>" + data[i].username + "</option>";
            }
            let elem = document.querySelector("#userInput");
            elem.innerHTML += html;
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}