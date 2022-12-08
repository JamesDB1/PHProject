let quizData; //the quizData object from JSON will go here
let user = ""; //userName entered by user will go here
let correctAnswerText = []; //array to hold the correct answer text

window.onload = function () {
    document
            .querySelector("#tabContainer")
            .addEventListener("click", handleTabClick);
    document.querySelector("#btnSubmit").addEventListener("click", submitAnswers);
    document.querySelector("#btnStart").addEventListener("click", startQuiz);
    fetchQuizzes();
};

/**
 * Called when page is loaded to add quiz topics to the menu in the
 * Setup area
 */

async function fetchQuizzes() {
    let url = "quizapp/quizzes"; // file name or server-side process name
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
                console.log(quiz.quizID, quiz.quizTitle);
                html += `<option value="${quiz.quizID}">${quiz.quizTitle}</option>`;
            }
            select.innerHTML = html;
        }
    }
}

/**
 * Called when Start Quiz button is clicked
 */
function startQuiz() {
    user = document.querySelector("#txtUser").value;
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
    console.log(quizId); //not used for the moment
    let url = `quizapp/quizzes/` + quizId; // file name or server-side process name
    const response = await fetch(url);
    if (!response.ok) {
        alert("Error fetching quizzes. \n\n" + "Status code: " + response.status);
    } else {
        const data = await response.json();
        //If there is an exception, the backend returns text with an ERROR field
        if (data.ERROR) {
            alert("Error fetching quizzes. \n\n" + data.ERROR);
        } else {
            //Parse the JSON data and build a quiz
            //        buildQuiz(xmlhttp.responseText); execute when server responds
//                console.log(data.quizTitle, data.questions);
                buildQuiz(data);
        }
    }
    //Reveal #theQuiz
    document.querySelector("#theQuiz").classList.remove("hidden");
}

/**
 * Accepts a JSON file from the AJAX call and outputs it to the
 * global quizData[] array; then constructs HTML that goes into the
 * quizArea div.
 * @param {Object} quizData the quiz object
 */
function buildQuiz(quizData) {
    let quizTitleArea = document.querySelector("#quizTitle");
    let quizArea = document.querySelector("#quizArea");
    let tabContainer = document.querySelector("#tabContainer");
    
    console.log(quizData);

    //reset elements of the quiz in case a new quiz is started
    tabContainer.innerHTML = "";
    quizArea.innerHTML = "";
    correctAnswerText = [];

    quizTitleArea.innerHTML = `<h1>${quizData.quizTitle}</h1>`; //add Title

//    addDevButton(quizTitleArea); //add random answer devButton to title area

    let tabHTML = "";
    for (let i = 0; i < quizData.questions.length; i++) {
        tabHTML += `<div class = "tab">Question ${i + 1}</div>`; //add a tab
    }
    tabContainer.innerHTML += tabHTML;

    for (let i = 0; i < quizData.questions.length; i++) {
        let q = quizData.questions[i];
        console.log(q.choices);

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
                `<input type = "radio" name = "${qNumber}" value="${qChoices[j]}" /> ` +
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
 * @param {element} quizTitleArea #quizTitleArea
 */
function addDevButton(quizTitleArea) {
    let devButton = '<div class = "devButtonArea">';
    devButton +=
            '<button id = "devButton" class = "developerButton">Generate Random Answers</button>';
    devButton += "</div>";
    quizTitleArea.innerHTML += devButton;

    //Change #Question to #Q for querySelectorAll in case < 10 questions
    let tabLabel = "#Question";
    if (quizData.questions.length > 10) {
        tabLabel = "#Q";
    }

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
    let numberCorrect = 0;

    //make sure the user has answered all questions
    if (userAnswers.length !== quizData.questions.length) {
        alert("You must answer all of the questions.");
        return;
    }
    //tally the correct answers
    for (let i = 0; i < userAnswers.length; i++) {
        userAnswersValues.push(userAnswers[i].value);
        if (userAnswers[i].value === correctAnswerText[i]) {
            numberCorrect++;
        }
    }
    //show the user their score
    let answersHTML =
            `<div class = "yourScore">Your Score: ` +
            `${numberCorrect} / ${quizData.questions.length} </div>`;

    answersHTML += buildTable(userAnswersValues);

    document.querySelector("#answersArea").innerHTML = answersHTML;

    createQuizRecord(userAnswersValues, numberCorrect);
}

/**
 * Called by submitAnswers function to build a table of results
 * @param {Array} userAnswers user's answers
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

    for (let i = 0; i < userAnswers.length; i++) {
        //check to see if the answer is right -- if so, row score is 1
        //and no class is added; if not, score is 0 and class is 'incorrect'
        let questionScore = 0;
        if (userAnswers[i] === correctAnswerText[i]) {
            questionScore = 1;
            tableHTML += "<tr>";
        } else {
            tableHTML += "<tr class = 'incorrect'>";
        }
        //now add the row data
        tableHTML += `<td>Question ${i + 1}</td>`;
        tableHTML += `<td>${quizData.questions[i].questionText}</td>`;
        tableHTML += `<td>${correctAnswerText[i]}</td>`;
        tableHTML += `<td>${userAnswers[i]}</td>`;
        tableHTML += `<td>${questionScore}</td>`;
        tableHTML += "</tr>";
    }
    tableHTML += "</table></div>"; //close table and resultsArea div
    return tableHTML;
}

/**
 * Called by submitAnswers to create a record Object when the user
 * submits their answers.
 * @param {Array} userAnswers Array of strings containing ACs
 * @param {Number} numberCorrect The total number user got correct
 */
function createQuizRecord(userAnswers, numberCorrect) {
    let datetime = new Date().toISOString();
    let quizRecord = {
        user: user,
        dateTime: datetime,
        userAnswers: userAnswers,
        score: numberCorrect,
        quiz: quizData,
    };

    addRecordToCollection(quizRecord);
}

/**
 * Called by createQuizRecord to send the quiz record object to
 * the server for storage in JSON format.
 * @param {Object} quizRecord quizRecord object 
 */
function addRecordToCollection(quizRecord) {
    let account = "londonj";
    let collection = "sampleResults";
    let url = `https://assignment0.com/jsonstore/webservice/${account}/collections/${collection}/records`;
    let method = "POST";
    let jsonString = JSON.stringify(quizRecord);
    let payload = JSON.stringify({jsonString: jsonString});

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
        }
    };

    xhr.open(method, url, true);
    xhr.send(payload);
}

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
