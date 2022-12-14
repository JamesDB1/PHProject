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
            echo '<script src="scripts/questionSearch.js"></script>';
        } else if(($permissionLevel === "SUPER")){
            echo '<script src="scripts/homePage-Admin.js"></script>';
        }
        ?>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class="container">
            <h1>Welcome, <?php echo $username; ?>!</h1>

            <div id="menu">
                <p>Show <?php echo $permissionLevel ?> menu here.</p>
            </div>
    </body>
</html>
