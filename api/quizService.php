<?php

require_once(__DIR__ . '/../db/QuizAccessor.php');
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
} else{
    //not supported
}

/**
 * Returns the following:
 * 1. If quizID is set: All data for a single matching quiz.
 * 2. If quizInfo is set: quizID, quizTitle for all quizzes.
 * 3. Otherwise: All data for all quizzes (SLOW).
 */
function doGet() {
    if (isset($_GET["quizID"])) {

        try {
            $qa = new QuizAccessor();

            $results = $qa->getQuizByID($_GET['quizID']);
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);

            echo $resultsJson;
        } catch (Exception $e) {
            sendErrorJson($e->getMessage());
        }
    } else if (isset($_GET["quizInfo"])) {
        try {
            $qa = new QuizAccessor();
            $results = $qa->getQuizInfo();
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
        } catch (Exception $ex) {
            sendErrorJson($ex->getMessage());
        }
    } else {
        try {
            $qa = new QuizAccessor();
            $results = $qa->getAllQuizzes();
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            //ChromePhp::log($resultsJson);
            echo $resultsJson;
        } catch (Exception $e) {
            sendErrorJson($e->getMessage());
        }
    }
}

function doDelete() {
    if (isset($_GET['itemid'])) { 
        $id = $_GET['itemid']; 
        // Only the ID of the item matters for a delete,
        // but the accessor expects an object, 
        // so we need a dummy object.
        $quizItemObj = new Quiz($id, "dummyCat", 2, "ab", 0, "asd", "asd", 0, "asd");

        // delete the object from DB
        $mia = new QuizAccessor();
        $success = $mia->deleteQuiz($quizItemObj);
        echo $success;
    } else {
        // Bulk deletes not implemented.
        ChromePhp::log("Sorry, bulk deletes not allowed!");
    }
}

// aka CREATE
function doPost() {
    if (isset($_GET['quizid'])) { 
        // The details of the item to insert will be in the request body.
        $body = file_get_contents('php://input');
        $contents = json_decode($body, true);

        // create a Quiz object
        $quizItemObj = new Quiz($contents['quizID'], $contents['name'], $contents['points']);
        // add the object to DB
        $mia = new QuizAccessor();
        $success = $mia->addQuiz($quizItemObj);
        echo $success;
    } else {
        // Bulk inserts not implemented.
        ChromePhp::log("Sorry, bulk inserts not allowed!");
    }
}

// aka UPDATE
function doPut() {
    if (isset($_GET['itemid'])) { 
        // The details of the item to update will be in the request body.
        $body = file_get_contents('php://input');
        $contents = json_decode($body, true);

        // create a Quiz object
        $quizItemObj = new Quiz($contents['quizID'], $contents['name'], $contents['level'], $contents['type'], $contents['ritual'], $contents['castingTime'],$contents['components'],$contents['concentration'],$contents['source']);

        // update the object in the  DB
        $mia = new QuizAccessor();
        $success = $mia->updateQuiz($quizItemObj);
        echo $success;
    } else {
        // Bulk updates not implemented.
        ChromePhp::log("Sorry, bulk updates not allowed!");
    }
}

function sendErrorJson($errMsg) {
    ChromePhp::log($errMsg);
    $err = array("ERROR" => $errMsg);
    echo json_encode($err);
}
