let quizResult;
window.onload = function () {
    const resultID = document.querySelector("#qrID").innerHTML.trim();
    console.log("Processing request for " + resultID);

    fetchResult(resultID);
};

async function fetchResult(id) {
    const url = `quizapp/`


}

function buildResultTable(quizResult) {
    let tableLocation = document.querySelector("#displayQuizRecord");
    //open resultsArea div and table
    let tableHTML = "<div id = 'quizResultsArea'><table>";
    //build table header row
    tableHTML += "<tr>";
    tableHTML += "<th>Question</th>";
    tableHTML += "<th>Question Text</th>";
    tableHTML += "<th>Correct Answer</th>";
    tableHTML += "<th>Your Answer</th>";
    tableHTML += "<th>Score</th>";
    tableHTML += "</tr>";
}