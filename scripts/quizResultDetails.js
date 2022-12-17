let quizResult;
window.onload = function () {
    const resultID = document.querySelector("#qrID").innerHTML.trim();
    console.log("Processing request for " + resultID);

    fetchResult(resultID);
};

async function fetchResult(id) {
    const url = `quizapp/quizResults/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
        alert("Error fetching quiz. \n\n" + "Status code: " + response.status);
    } else {
        const data = await response.text();
        if (data.search("ERROR") >= 0) {
            alert("Accessor Error... see console for error");
            console.log(data);
        } else {
            quizResult = JSON.parse(data);
            buildResultTable(quizResult);
        }
    }


}

function buildResultTable(qr) {
    const result = qr[0];
    console.log(result);

    let answerStrings = result.answers.split("|");
    const userAnswers = answerStrings.map(function (str) {
        // using map() to convert array of strings to numbers
        return parseInt(str);
    });

    let correctAnswers = [];
    for (let q of result.quiz.questions) {
        correctAnswers.push(q.answer);
    }
    console.log("CORRECT");
    console.log(correctAnswers);
    console.log("USER");
    console.log(userAnswers);

    let tableLocation = document.querySelector("#displayQuizRecord");
    //open resultsArea div and table
    let tableHTML = `<h3>Quiz Title: ${result.quiz.quizTitle}</h3>`;
    tableHTML += "<div id = 'quizResultsArea'><table>";
    //build table header row
    tableHTML += "<thead><tr>";
    tableHTML += "<th>Question</th>";
    tableHTML += "<th>Question Text</th>";
    tableHTML += "<th>Correct Answer</th>";
    tableHTML += "<th>Your Answer</th>";
    tableHTML += "<th>Score</th>";
    tableHTML += "</tr></thead>";
    tableHTML += "<tbody><tr>";

    let userScore = 0;
    let totalPoints = 0;
    
    for (let i = 0; i < userAnswers.length; i++) {
        const choicesText = result.quiz.questions[i].choices;
        const userAnsIndex = userAnswers[i];
        totalPoints += result.quiz.points[i];
        //check to see if the answer is right -- if so, row score is 1
        //and no class is added; if not, score is 0 and class is 'incorrect'
        let questionScore = 0;
        if (userAnsIndex === result.quiz.questions[i].answer) {
            questionScore = result.quiz.points[i];
            userScore += questionScore;
            tableHTML += "<tr>";
        } else {
            tableHTML += "<tr class = 'incorrect'>";
        }
        //now add the row data
        tableHTML += `<td>Question ${i + 1}</td>`;
        tableHTML += `<td>${result.quiz.questions[i].questionText}</td>`;
        tableHTML += `<td>${choicesText[correctAnswers[i]]}</td>`;
        tableHTML += `<td>${choicesText[userAnsIndex]}</td>`;
        tableHTML += `<td>${questionScore}</td>`;
        tableHTML += "</tr>";
    }
    tableHTML += `<tr><td class="bold right" colspan="4">Total Score</td><td class="bold">${userScore} / ${totalPoints}</td></tr>`;
    tableHTML += "</table></div>";

    tableLocation.innerHTML = tableHTML;
}