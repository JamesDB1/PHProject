<!DOCTYPE html>
<?php
session_start();
$userInfo = json_decode($_SESSION["currentUser"], true);
$username = $userInfo["username"];
$permissionLevel = $userInfo["permissionLevel"];
?>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Home Page - User</title>

        <?php
        if (($permissionLevel === "USER")) {
            echo '<script src="scripts/quizPut.js"></script>';
        } else if (($permissionLevel === "ADMIN")) {
            echo '<script src="scripts/quizPut.js"></script>';
        } else if (($permissionLevel === "SUPER")) {
            echo '<script src="scripts/quizPut.js"></script>';
        }
        ?>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <h1>Create a Question</h1>
        <form id="form" action="received.php" method="POST">
            Question ID <input name="questionid" type="text" pattern="QU-\d{3}" required><br>
            Title  <input name="title" type="text" required><br>
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
            Answer:  <input id="answer" name="answer" type="text" required><span id="errorSpan"></span><br>
            Points:  <input id="points" name="points" type="number" min="0" required><br>
            
            
            <button type="submit">Done</button>
        </form>
    </body>
</html>
