<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Quiz Search</title>
        <link rel="stylesheet" href="dbStyles.css">
        <script src="quiz.js"></script>
    </head>
    <body>
        <h1>PHP Quiz App</h1>

        <h2>Search for Quizzes by Tags in the Questions</h2>

        <div class="containerMain">
            <p>Type a tag name or any part of a tag name:</p>
            <input id="searchField">
            <button id="searchButton">Search</button>
            <br><br><br>
            <table>
                <tr>
                    <th>Quiz ID</th>
                    <th>Quiz Name</th>
                    <th># of Questions</th>
                    <th>Action</th>
                </tr>
            </table>
        </div>
    </body>
</html>
