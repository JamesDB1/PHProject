<?php

require_once(__DIR__ . '/../db/QuestionAccessor.php');
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
            $qa = new QuestionAccessor();

            $results = $qa->getQuestionByID($_GET['quizID']);
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);

            echo $resultsJson;
        } catch (Exception $e) {
            sendErrorJson($e->getMessage());
        }
    } else if (isset($_GET["quizInfo"])) {
        try {
            $qa = new QuestionAccessor();
            $results = $qa->getQuizInfo();
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
        } catch (Exception $ex) {
            sendErrorJson($ex->getMessage());
        }
    } else {
        try {
            $qa = new QuestionAccessor();
            $results = $qa->getAllQuestions();
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            //ChromePhp::log($resultsJson);
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