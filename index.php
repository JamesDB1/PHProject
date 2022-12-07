<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Home Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <script src="scripts/index_main.js"></script>
    </head>
    <body>
        <div class="container">
            <div class="row p-3 mb-3 bg-light border border-secondary">
                <div class="col-9 col-xl-10 fs-2">Quiz App</div>
                <div class="col-3 col-xl-2">
                    <a id="loginButton" class="btn btn-outline-secondary me-3" href="login-js.php">Log in</a>
                    <a id="createAccountButton"  class="btn btn-secondary" href="#">Sign up</a>
                </div>
            </div>
            <h3 class="mb-4">Welcome, Guest!</h3>

            <div class="border border-dark p-3">
                <h4>Quiz Search</h4>

                <div class="mb-3">
                    <label for="searchInput" class="form-label">Tags</label>
                    <input type="text" class="form-control" id="searchInput" aria-describedby="searchHelp">
                    <div id="searchHelp" class="form-text">Enter a search word or phrase.</div>
                </div>
                <button id="searchButton" class="btn btn-primary">Search</button>

                <div id="matchingQuizzes"></div>
            </div>
        </div>
    </body>
</html>
