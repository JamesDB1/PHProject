<?php

require_once(__DIR__ . '/../db/QuestionAccessor.php');

$tags = explode("|", $_GET["tags"]); // array of tags


        try {
            $qa = new QuestionAccessor();
            $results = $qa->getResultsByQuery("select * from Question where questionID = '" . $_GET['questionID'] . "'");
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
        } catch (Exception $e) {
            echo "ERROR " . $e->getMessage();
        }
    