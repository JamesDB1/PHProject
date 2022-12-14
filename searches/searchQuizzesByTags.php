<?php

require_once(__DIR__ . '/../db/QuizAccessor.php');

$tags = $_GET["tags"]; // array of tags


        try {
            $qa = new QuizAccessor();
            $results = $qa->getQuizzesByTags($tags);
            $resultsJson = json_encode($results, JSON_NUMERIC_CHECK);
            echo $resultsJson;
        } catch (Exception $e) {
            echo "ERROR " . $e->getMessage();
        }
    