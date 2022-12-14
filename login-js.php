<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Login Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <link href='styles.css' rel='stylesheet'>
        <script src="scripts/login.js"></script>
    </head>
    <body>
        <div class="container">
            <h1 class="mb-4">Login Page</h1>

            <form>
                <div class="mb-3">
                    <label for="usernameInput" class="form-label">User Name</label>
                    <input id="usernameInput" type="text" class="form-control" required value="admin1">
                    <span id="usernameError" class="text-danger"></span>
                </div>
                <div class="mb-3">
                    <label for="passwordInput" class="form-label">Password</label>
                    <input id="passwordInput" type="password" class="form-control" required value="admin1">
                    <span id="passwordError" class="text-danger"></span>
                </div>
                <button id="loginButton" class="btn btn-primary" type="submit">Login</button>
            </form>
            <h3>Don't have an account? No problem.</h3>
            <a href='newUser-guest.php'>Create a User Account</a>
        </div>
    </body>
</html>
