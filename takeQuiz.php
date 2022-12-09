<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz App Enhanced Edition</title>
    <script src="scripts/takeQuiz.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="wrapper">
        <div id="setup" class="addBorder">
            <span>Setup</span>
            <div class="gameInfo">
                <div class="setupUsername">
                    <label for="txtUser">Please enter your name:</label>
                    <input id="txtUser" value="Admin1">
                </div>
                <div class="setupTopic">
                    <label for="cmbTopic">Please choose a topic for your Quiz:</label>
                    <select name="cmbTopic" id="cmbTopic" title="QuizTopics">
                        <!--Topics added in JS-->
                    </select>
                </div>
                <button id ="btnStart">Start Quiz</button>
            </div>
        </div>
        <div id="theQuiz" class = "hidden">
            <div id="quizTitle">
                <!-- Quiz title goes here -->
            </div>
            <div id="tabContainer">
                <!-- Tabs go here -->
            </div>
            <div id="quizArea">
                <!-- Quiz goes here -->
            </div>
            <div id="submitArea">
                <button id="btnSubmit">Submit</button>
            </div>
            <div id="answersArea">
                <!-- Answers go here when submit is pressed -->
            </div>
        </div>
        <div class="home_link">
            <a href="index.php">Home</a>
        </div>
    </div>
</body>
<!-- DevButton code, thanks Steve -->
<script>

</script>

</html>