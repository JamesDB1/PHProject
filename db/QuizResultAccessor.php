<?php

require_once('dbconnect.php');
require_once('QuizAccessor.php');
require_once(__DIR__ . '/../entity/QuizResult.php');

class QuizResultAccessor {

    public function getResultsByQuery($query) {
        $results = [];
        $stmt = null;
        $dbresults = null;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $results = [];
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
        }

        $quizAcc = new QuizAccessor();

        foreach ($dbresults as $r) {
            $quiz = $quizAcc->getQuizByID($r["quizID"]);
            $resultID = $r["resultID"];
            $username = $r["username"];
            $quizStartTime = $r["quizStartTime"];
            $quizEndTime = $r["quizEndTime"];
            $userAnswers = $r["userAnswers"];
            $scoreNumerator = $r["scoreNumerator"];
            $scoreDenominator = $r["scoreDenominator"];
            $obj = new QuizResult($resultID, $quiz, $username, $quizStartTime, $quizEndTime, $userAnswers, $scoreNumerator, $scoreDenominator);
            array_push($results, $obj);
        }

        return $results;
    }

    public function getAllResults() {
        return $this->getResultsByQuery("select * from QuizResult");
    }

    public function getResultsByUser($username) {
        return $this->getResultsByQuery("select * from QuizResult where username = '" . $username . "'");
    }

    public function getResultsByScore($scoremin, $scoremax) {        
        return $this->getResultsByQuery("select * from quizresult where (100*scoreNumerator/scoreDenominator) between " . $scoremin . " AND " . $scoremax);
    }
}
