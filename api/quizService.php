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
} else {
    // not supported yet
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
//            ChromePhp::log("DOGET FOR quizID " . $_GET["quizID"]);
            $qa = new QuizAccessor();

            $results = $qa->getQuizByID($_GET['quizID']);
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
//            ChromePhp::log("RES FROM QuizAccessor SINGLE " . $resultsJson);
        } catch (Exception $e) {
            sendErrorJson($e->getMessage());
        }
    } else if (isset($_GET["quizInfo"])) {
        try {
            $qa = new QuizAccessor();
            $results = $qa->getQuizInfo();
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
            ChromePhp::log($resultsJson);
        } catch (Exception $ex) {
            sendErrorJson($ex->getMessage());
        }
    } else {
        try {
            $qa = new QuizAccessor();
            $results = $qa->getAllQuizzes();
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
//            ChromePhp::log($resultsJson);
            echo $resultsJson;
        } catch (Exception $e) {
            sendErrorJson($e->getMessage());
        }
    }
}

function sendErrorJson($errMsg) {
    ChromePhp::log($errMsg);
    $err = array("ERROR" => $errMsg);
    echo json_encode($err);
}
