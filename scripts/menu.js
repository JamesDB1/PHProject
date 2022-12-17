window.onload = function () {
    //Add menu to menuContainer
    let menuhtml = '<a class="active" href="takeQuiz.php">Home</a><a href="quizSearch.php">News</a>';
    menuhtml += '<a href="quizzes.php">Contact</a><a href="question.php">Search questions</a>';
    menuhtml += `<a href='modifyUser.php'>Modify Users</a>`;
    menuhtml += '<div class="menuContainer-right"><a id="loginButton" href="login-js.php">Log in</a>';
    menuhtml += '<a id="createAccountButton" href="newUser-guest.php">Sign up</a></div>';
    document.querySelector(".menuContainer").innerHTML = menuhtml;
};