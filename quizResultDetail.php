<!DOCTYPE html>
<!--
Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
Click nbfs://nbhost/SystemFileSystem/Templates/Scripting/EmptyPHPWebPage.php to edit this template
-->
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>View Quiz Result Details</title>
        <script src="scripts/quizResultDetails.js"></script>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class ='wrapper'>
            <?php
            $qrID = $_GET['id'];
            echo "<h2>Details for <span id='qrID'>" . $qrID . "</span></h2>";
            ?>
            <div id = "displayQuizRecord">
                <!-- Table added in JS -->
            </div>
            <div class="home_link">
                <a href='quizResults.php'>Back to QR Search</a>
                <a href="index.php">Home</a>
            </div>
        </div>

    </body>
</html>
