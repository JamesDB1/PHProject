<?php
require_once(__DIR__ . '/../entity/QuizResult.php');
require_once(__DIR__ . '/../db/QuizResultAccessor.php');
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
}

function sendErrorJson($errMsg) {
    ChromePhp::log($errMsg);
    $err = array("ERROR" => $errMsg);
    echo json_encode($err);
}

function doGet() {
    if (isset($_GET["username"])) {

        try {
            $qra = new QuizResultAccessor();
            $results = $qra->getResultsByQuery("select * from QuizResult where username = '" . $_GET['username'] . "'");
            // should now create array of QuizResult objects

            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);

            echo $resultsJson;
        } catch (Exception $e) {
            echo "ERROR " . $e->getMessage();
        }
    } else if (isset($_GET["resultID"])){
                try {
            $qra = new QuizResultAccessor();
            $results = $qra->getResultsByQuery("select * from QuizResult where resultID = '" . $_GET['resultID'] . "'");
            // should now create array of QuizResult objects

            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);

            echo $resultsJson;
        } catch (Exception $e) {
            echo "ERROR " . $e->getMessage();
        }
    } else {

        try {
            $qra = new QuizResultAccessor();
            $results = $qra->getAllResults();
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
        } catch (Exception $e) {
            echo "ERROR " . $e->getMessage();
        }
    }
}

function doPost() {
    if (isset($_GET["username"])) {

        $body = file_get_contents('php://input'); // body of HTTP request
        $contents = json_decode($body, true);
        ChromePhp::log("Inside Post Service");

        try {
            //Determine the resultID (auto-increment a non-integer value)
            $qra = new QuizResultAccessor();
            $id = $qra->getNumberOfRows() + 1001;            
            $resultID = "QR-" . $id;
            
            $quiz = $contents["quiz"];
            $user = $contents["user"];
            $startTime = $contents["startTime"];
            $endTime = $contents["endTime"];
            $answers = $contents["answers"];
            $scoreNumerator = $contents["scoreNumerator"];
            $scoreDenominator = $contents["scoreDenominator"];
            
            $result = new QuizResult($resultID, $quiz, $user, $startTime, $endTime, $answers,$scoreNumerator,$scoreDenominator);

            $success = $qra->insertQuizResult($result);
            echo $success;
        } catch (Exception $ex) {
            sendErrorJson($ex->getMessage());
        }
    } else {
        sendErrorJson('Bulk Inserts are not supported.');
    }
}
