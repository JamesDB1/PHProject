<?php

require_once('dbconnect.php');
require_once('QuizAccessor.php');
require_once(__DIR__ . '/../entity/QuizResult.php');
require_once(__DIR__ . '/../utils/ChromePhp.php');

class QuizResultAccessor {

    private $insertString = "INSERT INTO quizresult VALUES " .
            "(:resultID, :quizID, :username, :quizStart, :quizEnd, :userAnswers, :scoreNum, :scoreDem)";
    private $insertStatement = NULL;
    private $conn = NULL;

    public function __construct() {
        $this->conn = connect_db();
        if (is_null($this->conn)) {
            throw new Exception("no connection");
        }

        $this->insertStatement = $this->conn->prepare($this->insertString);
        ChromePhp::log("....constructing... success.....");
        ChromePhp::log($this->insertStatement);
        if (is_null($this->insertStatement)) {
            throw new Exception("bad statement: '" . $this->insertString . "'");
        }
    }

    public function getResultsByQuery($query) {
        $results = [];
        $stmt = null;
        $dbresults = null;
        try {
//            $conn = connect_db();
            $stmt = $this->conn->prepare($query);
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

    public function getResultsByQueryEmpty($query) {
        $results = [];
        $stmt = null;
        $dbresults = null;
        try {
//            $conn = connect_db();
            $stmt = $this->conn->prepare($query);
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
            $quiz = $quizAcc->getQuizByIDEmpty($r["quizID"]);
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
        return $this->getResultsByQueryEmpty("select * from QuizResult where username = '" . $username . "'");
    }

    public function getResultsByScore($scoremin, $scoremax) {
        return $this->getResultsByQueryEmpty("select * from quizresult where (100*scoreNumerator/scoreDenominator) between " . $scoremin . " AND " . $scoremax);
    }

    public function getNumberOfRows() {
        $stmt = $this->conn->prepare("SELECT COUNT(resultID) AS numRows FROM quizresult");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $numberOfRows = intval($result[0]["numRows"]);
        return $numberOfRows;
    }

    private function buildAnswerString($ans) {
        $res = "";
        for ($i = 0; $i < count($ans); $i++) {
            $res .= $ans[$i] . ($i < count($ans) - 1 ? "|" : "");
        }
        return $res;
    }
    
    private function fixDatetimeFormat($dt){
        $datetime = str_replace("T", " ", $dt);
        $datetime = substr($datetime, 0, strpos($datetime, "."));
        return $datetime;        
    }

    public function insertQuizResult($quizResult) {
        $resultID = $quizResult->getResultID();
        $quizID = $quizResult->getQuiz()["quizID"];
        $username = $quizResult->getUser()["username"];
        $quizStartTime = $quizResult->getStartTime();
        $quizEndTime = $quizResult->getEndTime();
        $userAnswers = $quizResult->getAnswers();
        $scoreNumerator = intval($quizResult->getScoreNumerator());
        $scoreDenominator = intval($quizResult->getScoreDenominator());
        
        //Get answers in pipe-separated string
        $answerString = $this->buildAnswerString($userAnswers);
        
        //Fix the times to match MySQL format
        $startString = $this->fixDatetimeFormat($quizStartTime);
        $endString = $this->fixDatetimeFormat($quizEndTime);        


        try {
            $this->insertStatement->bindParam(":resultID", $resultID);
            $this->insertStatement->bindParam(":quizID", $quizID);
            $this->insertStatement->bindParam(":username", $username);
            $this->insertStatement->bindParam(":quizStart", $startString);
            $this->insertStatement->bindParam(":quizEnd", $endString);
            $this->insertStatement->bindParam(":userAnswers", $answerString);
            $this->insertStatement->bindParam(":scoreNum", $scoreNumerator);
            $this->insertStatement->bindParam(":scoreDem", $scoreDenominator);

            $succ = $this->insertStatement->execute();
            //Determine if a row was modified;
            $rc = $this->insertStatement->rowCount();
            $success = $rc; //1 = good; 0 = failed
        } catch (PDOException $ex) {
            $success = 0;
        } finally {
            if (!is_null($this->insertStatement)) {
                $this->insertStatement->closeCursor();
            }           
            return $success;
        }
    }
}
