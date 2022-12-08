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
        if(($permissionLevel === "USER")){
            echo '<script src="scripts/homePage-Admin.js"></script>';
        } else if(($permissionLevel === "ADMIN")){
            echo '<script src="scripts/homePage-Admin.js"></script>';
        } else if(($permissionLevel === "SUPER")){
            echo '<script src="scripts/homePage-Admin.js"></script>';
        }
        ?>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class="container">
            <h1 class="mb-4">Welcome, <?php echo $username; ?>!</h1>

            <div id="menu">
                <p>Show <?php echo $permissionLevel ?> menu here.</p>
            </div>

<!--            <section id="userSearch" class="border border-secondary p-3 mb-3">
                <h3>Search for Quiz Results by User</h3>

                <form>
                    <select id="userInput"></select>
                    <button id="getResultsButton">Get Results</button>
                </form>
                
                <div class="quizResults"></div>
            </section>

            <section id="scoreSearch"class="border border-secondary p-3">
                <h3>Search for Quiz Results By Score</h3>

                <form>
                    Min: <input id="scoreMin" type="number" min="0" max="100"><br>
                    Max: <input id="scoreMax" type="number" min="0" max="100"><br>
                    <button id="getScoreResultsButton">Get Results</button>
                </form>
            
                <div class="quizResults"></div>
            </section>
        </div>-->
    </body>
</html>
