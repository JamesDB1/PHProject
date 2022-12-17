window.onload = function () {
    //Add menu to menuContainer
    let menuhtml = '<a  href="takeQuiz.php">Take Quiz</a><a href="quizSearch.php">Search quizzes</a>';
    menuhtml += '<a href="quizResults.php">Search quiz results</a><a href="question.php">Search questions</a>';
    menuhtml += `<a href='modifyUser.php'>Modify Users</a>`;
    menuhtml += '<div class="menuContainer-right"><a class="active" id="loginButton" href="login-js.php">Log in</a>';
    menuhtml += '<a id="createAccountButton" href="newUser-guest.php">Sign up</a></div>';
    document.querySelector(".menuContainer").innerHTML = menuhtml;
};