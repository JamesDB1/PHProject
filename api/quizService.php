<?php

require_once(__DIR__ . '/../db/QuizAccessor.php');

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

function doGet() {
    if (isset($_GET["quizID"])) {
        
        try {
            $qra = new QuizResultAccessor();
            $results = $qra->getResultsByQuery("select * from Quiz where quizID = '" . $_GET['quizID'] . "'");
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
        } catch (Exception $e) {
            echo "ERROR " . $e->getMessage();
        }
    } else {

    }
}