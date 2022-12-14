/**
 * These variables will store the start time obj (needed for quiz result),
 * The user obj (needed for quiz result), and the quizData array, which is used
 * throughout the application.
 */
let startTime;
let user = "";
let quizData = [];

window.onload = function () {
    document
            .querySelector("#tabContainer")
            .addEventListener("click", handleTabClick);
    document.querySelector("#btnStart").addEventListener("click", startQuiz);
    document.querySelector("#btnSubmit").addEventListener("click", submitAnswers);    
    fetchAllQuizInfo();

};

/**
 * Called when page is loaded to fetch the correct user (using textbox for now)
 */

async function fetchUser() {
    let url = "quizapp/users"; // file name or server-side process name
    const response = await fetch(url);
    if (!response.ok) {
        alert("Error fetching users. \n\n" + "Status code: " + response.status);
    } else {
        const data = await response.json();
        //If there is an exception, the backend returns text with an ERROR field
        if (data.ERROR) {
            alert("Error fetching users. \n\n" + data.ERROR);
        } else {
            //Match our user to results
            let txtUser = document.querySelector("#txtUser").value;
            for (let u of data) {
                if (u.username.toLowerCase() === txtUser.toLowerCase()) {
                    user = u;
                    break;
                } 
            }
        }
    }
}
/**
 * Called when page is loaded to add quiz topics to the menu in the
 * Setup area
 */

async function fetchAllQuizInfo() {

    let url = "quizapp/quizzes/quizInfo"; // file name or server-side process name
    const response = await fetch(url);
    if (!response.ok) {
        alert("Error fetching quizzes. \n\n" + "Status code: " + response.status);
    } else {
        const data = await response.json();
        //If there is an exception, the backend returns text with an ERROR field
        if (data.ERROR) {
            alert("Error fetching quizzes. \n\n" + data.ERROR);
        } else {
            //Populate Select with quizzes
            let select = document.querySelector("#cmbTopic");
            let html = "";
            for (let quiz of data) {
//                console.log(quiz.quizID, quiz.quizTitle);
                html += `<option value="${quiz.quizID}">${quiz.quizTitle}</option>`;
            }
            select.innerHTML = html;
        }
    }
}

/**
 * Called when Start Quiz button is clicked
 */
async function startQuiz() {    
    startTime = new Date();
    await fetchUser();
    if (!user) {
        alert("You must enter your name before you can begin.");
        return;
    }

    let id = document.querySelector("#cmbTopic").value;
    // document.querySelector("#btnStart").disabled = true;
    // document.querySelector("#btnStart").classList.add("disabled");

    document.querySelector("#quizArea").innerHTML = "";
    document.querySelector("#tabContainer").innerHTML = "";
    document.querySelector("#answersArea").innerHTML = "";
    getJSON(id);
}


/**
 * Retrieves JSON data from a file from the database
 * and then calls buildQuiz using the response text
 * @param {type} quizId - The quiz that will be displayed
 */
async function getJSON(quizId) {     
    let url = `quizapp/quizzes/` + quizId;
    const response = await fetch(url);
    if (!response.ok) {
        alert("Error fetching quizzes. \n\n" + "Status code: " + response.status);
    } else {
        const data = await response.json();
        //If there is an exception, the backend returns text with an ERROR field
        if (data.ERROR) {
            alert("Error fetching quizzes. \n\n" + data.ERROR);
        } else {
            //Build quiz HTML
            buildQuiz(data);
        }
    }
    //Reveal #theQuiz
    document.querySelector("#theQuiz").classList.remove("hidden");

}

/**
 * Accepts a quiz object from the Fetch call and 
 * then constructs HTML that goes into the quizArea div.
 * @param {Object} data the quiz object from Json/Fetch
 */
function buildQuiz(data) {
    let quizArea = document.querySelector("#quizArea");
    let tabContainer = document.querySelector("#tabContainer");

    //reset elements of the quiz in case a new quiz is started
    tabContainer.innerHTML = "";
    quizArea.innerHTML = "";

    quizData = data;

    document.querySelector("#quizTitle").innerHTML = `<h1>${quizData.quizTitle}</h1>`; //add Title

    addDevButton(quizData); //add random answer devButton to title area

    let tabHTML = "";
    for (let i = 0; i < quizData.questions.length; i++) {
        tabHTML += `<div class = "tab">Question ${i + 1}</div>`; //add a tab
    }
    tabContainer.innerHTML += tabHTML;

    for (let i = 0; i < quizData.questions.length; i++) {
        let q = quizData.questions[i];
        
        questionHTML = `<div id = "Question${i + 1}" class = tabContent>`; //open tabContent div
        questionHTML += `<div class = questionNumber>Question ${i + 1}</div>`;
        questionHTML += `<div class = questionBody>`; //open questionBody div
        questionHTML += `<p>${q.questionText}</p>`;
        questionHTML += buildChoices(q.choices, i);
        questionHTML += "</div>"; //close questionBody div
        questionHTML += "</div>"; //close tabContent div

        quizArea.innerHTML += questionHTML;
    }
    sizeTabs();
    document.querySelector(".tab").click(); //select the first tab
}

/**
 * Constructs the answer choices for a given question and adds the
 * text of the correct answers to the correctAnswerText[] array.
 * @param {Array} qChoices The answer choices
 * @param {int} qNumber The 0-indexed question number
 * @returns HTML with answer choices and radio buttons
 */
function buildChoices(qChoices, qNumber) {
    let choicesHTML = "";
    for (let j = 0; j < qChoices.length; j++) {
        choicesHTML +=
                `<input type = "radio" name = "${qNumber}" value="${j}" /> ` +
                `${qChoices[j]} <br/>`;
    }
    //record the correct answer for this question in a global array
//    let answerIndex = quizData.questions[qNumber].answer;
//    let answerText = qChoices[answerIndex];
//    correctAnswerText.push(answerText);
    return choicesHTML;
}

/**
 * Called by buildQuiz to add DevButton to Quiz in the Title Area
 * Thanks, Steve!
 * 
 */
function addDevButton() {
    let quizTitleArea = document.querySelector("#quizTitle");

    let devButton = '<div class = "devButtonArea">';
    devButton +=
            '<button id = "devButton" class = "developerButton">Generate Random Answers</button>';
    devButton += "</div>";
    quizTitleArea.innerHTML += devButton;

    //Change #Question to #Q for querySelectorAll in case > 10 questions
    let tabLabel = quizData.questions.length <= 10 ? "#Question" : "#Q";

    //Loop through questions and check a random radio button for each
    document.querySelector("#devButton").addEventListener("click", () => {
        for (let i = 1; i <= quizData.questions.length; i++) {
            let buttons = document.querySelectorAll(
                    tabLabel + i + " input[type='radio']"
                    );
            let index = Math.floor(Math.random() * buttons.length);
            buttons[index].checked = true;
        }
    });
}

/**
 * Called when the submit button is pressed - Function
 * creates a div with the user's total score and builds a table
 * showing the Question #, Question text, Correct answer,
 * user answer, and score for each question.
 */
function submitAnswers() {
    let userAnswers = document.querySelectorAll("input[type='radio']:checked");
    let userAnswersValues = [];
    let score = 0;
    let totalPts = 0;

    //make sure the user has answered all questions
    if (userAnswers.length !== quizData.questions.length) {
        alert("You must answer all of the questions.");
        return;
    }

    //tally the correct answers
    for (let i = 0; i < userAnswers.length; i++) {
        const questionVal = quizData.points[i];
        totalPts += questionVal;
        userAnswersValues.push(userAnswers[i].value);
        if (Number(userAnswersValues[i]) === quizData.questions[i].answer) {
            score += questionVal;
        }
    }
    //show the user their score
    let answersHTML =
            `<div class = "yourScore">Your Score: ` +
            `${score} / ${totalPts} </div>`;

    answersHTML += buildTable(userAnswersValues, quizData);

    document.querySelector("#answersArea").innerHTML = answersHTML;

    createQuizResult(userAnswersValues, score);
}

/**
 * Called by submitAnswers function to build a table of results
 * @param {Array} userAnswers user's answers
 * @param {Obj} quizData The data to be used for the quiz
 * @returns string with HTML table
 */
function buildTable(userAnswers) {
    //open resultsArea div and table
    let tableHTML = "<div id = 'resultsArea'><table>";
    //build table header row
    tableHTML += "<tr>";
    tableHTML += "<th>Question #</th>";
    tableHTML += "<th>Question Text</th>";
    tableHTML += "<th>Correct Answer</th>";
    tableHTML += "<th>Your Answer</th>";
    tableHTML += "<th>Score</th>";
    tableHTML += "</tr>";

    let correctAnswers = [];
    for (let q of quizData.questions) {
        correctAnswers.push(q.answer);
    }
    
    for (let i = 0; i < userAnswers.length; i++) {
        const choicesText = quizData.questions[i].choices;
        const userAnsIndex = Number(userAnswers[i]);

        //check to see if the answer is right -- if so, row score is 1
        //and no class is added; if not, score is 0 and class is 'incorrect'
        let questionScore = 0;
        if (userAnsIndex === quizData.questions[i].answer) {
            questionScore = quizData.points[i];
            tableHTML += "<tr>";
        } else {
            tableHTML += "<tr class = 'incorrect'>";
        }
        //now add the row data
        tableHTML += `<td>Question ${i + 1}</td>`;
        tableHTML += `<td>${quizData.questions[i].questionText}</td>`;
        tableHTML += `<td>${choicesText[correctAnswers[i]]}</td>`;
        tableHTML += `<td>${choicesText[userAnsIndex]}</td>`;
        tableHTML += `<td>${questionScore}</td>`;
        tableHTML += "</tr>";
    }
    tableHTML += "</table></div>"; //close table and resultsArea div
    return tableHTML;
}

/**
 * Called by submitAnswers to create a result Object when the user
 * submits their answers.
 * @param {Array} userAnswers Array of indexes
 * @param {Number} score The total number user got correct
 */
function createQuizResult(userAnswers, score) {
    let endTime = new Date();

    let denom = 0;
    for (let p of quizData.points) {
        denom += p;
    }

    let quizResult = {
        resultID: "NEW",
        user: user,
        startTime: startTime,
        endTime: endTime,
        answers: userAnswers,
        scoreNumerator: score,
        scoreDenominator: denom,
        quiz: quizData,
    };

    console.log("QR OBJ: " + quizResult);
    postResult(quizResult);
}

/**
 * Called by createQuizResult to send the quiz result object to
 * the server for storage in JSON format.
 * @param {Object} quizResult quizResult object 
 */
async function postResult(quizResult) {
    console.log("USER" + user);
    let url = `quizapp/quizResults/user/` + user.username;
    const resp = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(quizResult),
    });
    
    const msg = await resp.json();
    
    if (msg === 1){
        alert("QuizResult POST to database succeeded.");
    } else if (msg === 0){
        alert("QuizResult POST to database FAILED.");
    } else {
        //If there is an exception, the backend returns a JSON object with an ERROR field
        alert("Server-side error. \n\n" + ERROR.msg);
}}

/**
 * @_______TAB_MANAGEMENT_FUNCTIONS_______
 */

/**
 * Called when a tab is clicked
 * @param {Event} evt tab click event
 */
function handleTabClick(evt) {
    // format the selected tab
    let tab = evt.target;
    deselectAllTabs();
    tab.classList.add("active");

    // reveal the content section with an ID that corresponds to the active tab.
    let id = tab.innerHTML;
    id = id.replace(" ", "");
    hideAllSections();
    document.querySelector("#" + id).classList.remove("hidden");
}

/**
 * Removes active tab style before newly clicked tab is styled
 */
function deselectAllTabs() {
    let tabs = document.querySelectorAll(".tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
}

/**
 * Hides all contents before the clicked tab content is revealed
 */
function hideAllSections() {
    let sections = document.querySelectorAll(".tabContent");
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add("hidden");
    }
}

/**
 * Resizes the tabs based on the number of questions.
 * If > 10 question, "Question" is changed to "Q".
 * Load AllQuiz.json to test
 */
function sizeTabs() {
    let tabs = document.querySelectorAll(".tab");
    let tabContentsArr = document.querySelectorAll(".tabContent");

    let tabWidth = 100 / tabs.length;
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.cssText += `width:${tabWidth - 0.3}%`;
    }
    if (tabs.length > 10) {
        for (let i = 0; i < tabs.length; i++) {
            let tabHTML = tabs[i].innerHTML;
            tabHTML = tabHTML.replace("Question ", "Q"); //Change 'Question' to 'Q'
            tabs[i].innerHTML = tabHTML;

            tabContentsArr[i].id = `Q${i + 1}`; //change the tabContent ID to match
        }
    }
}
