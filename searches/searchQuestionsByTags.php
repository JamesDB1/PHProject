<?php

require_once(__DIR__ . '/../db/QuestionAccessor.php');

$tags = $_GET["tags"]; 


        try {
            $qa = new QuestionAccessor();
            $results = $qa->getQuestionsByTags($tags);
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
        } catch (Exception $e) {
            echo "ERROR " . $e->getMessage();
        }
    