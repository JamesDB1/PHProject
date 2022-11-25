<?php

require __DIR__ . "/../db/UserAccessor.php";

$username = $_POST['username'];
$password = $_POST['password'];

$acc = new UserAccessor();
$users = $acc->getAllAccounts();
$user = null;

//print_r($users);

foreach ($users as $temp) {
    if ($username === $temp->getUsername()) {
        $user = $temp;
        break;
    }
}

if ($user === null) {
    echo "no such user";
} else {
    echo "user ok";
    /// password stuff
    $ok = password_verify($password, $user->getPassword());
    if ($ok) {
        echo "password matches";
    } else {
        echo "wrong password";
    }
}
 
