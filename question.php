<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Quiz Search</title>
        <link rel="stylesheet" href="dbStyles.css">
        <script src="scripts/question.js"></script>
    </head>
    <body>
        <h1>PHP Quiz App</h1>

        <h2>Search for Quizzes by Tags in the Questions</h2>

        <div class="containerMain">
            <br>
            <button id="AddButton">Add</button>
            <button id="DeleteButton" disabled>Delete</button>
            <button id="UpdateButton" disabled>Update</button>
            <br>
            <div id="AddUpdatePanel">
                <div>
                    <div class="formLabel">Quiz ID</div><input id="questionIDInput" type="text">
                </div>
                <div>
                    <div class="formLabel">Quiz Name</div><input id="nameInput" type="text">
                </div>
                Number of Choices 
                <select id="nChoices" name="nChoices">
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                </select><br>
                <ol type="a" id="choices">
                    <li><input id="choice1" name="choice1" type="text" required></li>
                    <li><input id="choice2" name="choice2" type="text" required></li>
                    <li><input id="choice3" name="choice3" type="text" required></li>
                </ol>
                Answer
                <input id="answer" type="text">
                Tags
                <input id="tags" type="text">
                <div>
                    <button id="DoneButton">Done</button>
                    <button id="CancelButton">Cancel</button>
                </div>
            </div>
            <div id="search">
                <p>Type a tag name or any part of a tag name:</p>
                <input id="tags">
                <button id="SearchButton">Search</button>
            </div>
            <br><br>
            <table id="tableSearch">
                <tr></tr>
            </table>
        </div>
    </body>
</html>
