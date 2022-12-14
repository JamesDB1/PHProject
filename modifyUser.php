<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Home Page</title>
        <script src="scripts/quizSearch.js"></script>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class="container">
            <h1>PHP Project - QuizApp Deluxe</h1>
            <div class="tempMenu">
                <h2>Temporary Menu</h2>
                <a href ="takeQuiz.php">Take a quiz</a> 
                <a href ="question.php">Search questions</a> 
                <a href="quizSearch.php">Search quizzes</a>
            </div>
            <div class='loginMenu'>
                <h2>Login Menu</h2>
                <div>
                    <a id="loginButton" href="login-js.php">Log in</a>
                    <a id="createAccountButton" href="newUser-guest.php">Sign up</a>
                </div>
            </div>
            <h3>Welcome, Guest!</h3>

            <div>
                <section id="tagSearch">
                    <h4>Quiz Search</h4>

                    <div>
                        <label for="searchInput" class="form-label">Tags</label>
                        <input type="text" class="form-control" id="searchInput" aria-describedby="searchHelp">
                        <div id="searchHelp" class="form-text">Enter a search word or phrase.</div>
                    </div>
                    <button id="searchButton">Search</button>
                </section>
                <section>
                    <div id="quizzes"></div>
                </section>
            </div>
        </div>
    </body>
</html>
