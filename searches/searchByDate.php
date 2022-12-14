<?php

require_once(__DIR__ . '/../db/QuizResultAccessor.php');

/*
 * Important Note:
 * 
 * We know that $_GET["scoremin"] $_GET["scoremin"] and  exists because .htaccess creates it.
 */

$datestart = $_GET["datestart"];
$dateend = $_GET["dateend"];
try {
    $qra = new QuizResultAccessor();
    $results = $qra->getResultsByDate($datestart, $dateend);
    $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
    echo $resultsJson;
} catch (Exception $e) {
    echo "ERROR " . $e->getMessage() . $datestart . $dateend;
}