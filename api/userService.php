<?php

require_once(__DIR__ . '/../entity/User.php');
require_once(__DIR__ . '/../db/UserAccessor.php');
require_once(__DIR__ . '/../utils/ChromePhp.php');

/*
 * Important Note:
 * 
 * Even if the method is not GET, the $_GET array will still contain any
 * parameters defined in the ".htaccess" file. The syntax "?key=value" is 
 * interpreted as a GET parameter and therefore stored in the $_GET array.
 */

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    doGet();
} else if ($method === "POST") {
    doPost();
} else if ($method === "DELETE") {
    doDelete();
} else if ($method === "PUT") {
    doPut();
}

function doGet() {
    try {
        $ua = new UserAccessor();
        $results = $ua->getAllAccounts();
        $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
        echo $resultsJson;
    } catch (Exception $e) {
        echo "ERROR " . $e->getMessage();
    }
}

function doPost() {
    $body = file_get_contents('php://input'); // body of HTTP request
    $contents = json_decode($body, true);
    ChromePhp::log("Inside Post Service");

    $username = $contents["username"];
    $password = $contents["password"];
    $permissionLevel = $contents["permissionLevel"];
    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $result = new User($username, $hash, $permissionLevel);

        $ua = new UserAccessor();

        $success = $ua->insertAccount($result);
        echo $success;
    } catch (Exception $ex) {
        sendErrorJson($ex->getMessage());
    }
}

function doPut() {
    $body = file_get_contents('php://input'); // body of HTTP request
    $contents = json_decode($body, true);
    ChromePhp::log("Inside Put Service");

    $username = $contents["username"];
    $password = $contents["password"];
    $permissionLevel = $contents["permissionLevel"];
    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $result = new User($username, $hash, $permissionLevel);

        $ua = new UserAccessor();

        $success = $ua->updateAccount($result);
        echo $success;
    } catch (Exception $ex) {
        sendErrorJson($ex->getMessage());
    }
}

function doDelete() {
    $body = file_get_contents('php://input'); // body of HTTP request
    $contents = json_decode($body, true);
    ChromePhp::log("Inside Delete Service");

    $username = $contents["username"];


    try {
        $result = new User($username, "dummyHash", "dummyPermission");

        $ua = new UserAccessor();

        $success = $ua->deleteAccount($result);
        echo $success;
    } catch (Exception $ex) {
        sendErrorJson($ex->getMessage());
    }
}

function sendErrorJson($errMsg) {
    ChromePhp::log($errMsg);
    $err = array("ERROR" => $errMsg);
    echo json_encode($err);
}
