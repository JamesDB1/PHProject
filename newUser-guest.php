<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Home Page</title>
        <script src="scripts/newUser-guest.js"></script>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class="container">
            <div class='loginMenu'>
                <h2>Create an Account with QuizApp</h2>
                <div>
                    <label class="inputLabel"for='txtUsername'>Username:</label>
                    <input class="inputRequired" id='txtUsername' type='text' required>
                    <label class="inputLabel" for='txtPassword'>Type Password:</label>
                    <input class="inputRequired"id='txtPassword' type='password' required>
                    <label class="inputLabel" for='txtVerifyPass'>Verify Password:</label>
                    <input class="inputRequired" id='txtVerifyPass' type='password' required>
                    <button id="btnSubmit" >Submit</button>
                </div>
            </div>
        </div>
    </body>
</html>
