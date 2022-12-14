<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Quiz Search</title>
        <link rel="stylesheet" href="dbStyles.css">
        <script src="scripts/quiz.js"></script>
    </head>
    <body>
        <h1>PHP Quiz App</h1>

        <h2>Search for Quizzes by Tags in the Questions</h2>

        <div class="containerMain">
            <br>
            <button id="TakeQuizButton">Take Quiz</button>
            <button id="AddButton">Add</button>
            <button id="DeleteButton" disabled>Delete</button>
            <button id="UpdateButton" disabled>Update</button>
            <br>
            <div id="AddUpdatePanel">
                <div>
                    <div class="formLabel">Quiz ID</div><input id="quizIDInput" type="text">
                </div>
                <div>
                    <div class="formLabel">Quiz Name</div><input id="nameInput" type="text">
                </div>
                <table id="tableUpdate">
                    <tr></tr>
                </table>
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
