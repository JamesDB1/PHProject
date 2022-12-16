<?php

require_once('dbconnect.php');
require_once('QuestionAccessor.php');
require_once(__DIR__ . '/../entity/Quiz.php');
require_once(__DIR__ . '/../utils/ChromePhp.php');

class QuizAccessor {

    public function getQuizByID($quizID) {

        try {
            $conn = connect_db();
            $stmt = $conn->prepare("select * from Quiz where quizID = :quizID");
            $stmt->bindParam(":quizID", $quizID);
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (count($dbresults) !== 1) {
                throw new Exception("duplicate quizIDs found in Quiz table!");
            }

            $dbquiz = $dbresults[0];
            $questionAcc = new QuestionAccessor();
            $quizTitle = $dbquiz["quizTitle"];
            $questions = $questionAcc->getQuestionsForQuiz($quizID);
            $points = $this->getPointsForQuiz($quizID);
            $result = new Quiz($quizID, $quizTitle, $questions, $points);
        } catch (Exception $e) {
            $result = null;
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
            return $result;
        }
    }

    public function getQuizByIDEmpty($quizID) {
        $result = null;
        $stmt = null;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("select * from Quiz where quizID = :quizID");
            $stmt->bindParam(":quizID", $quizID);
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (count($dbresults) !== 1) {
                throw new Exception("duplicate quizIDs found in Quiz table!");
            }

            $dbquiz = $dbresults[0];
            $quizTitle = $dbquiz["quizTitle"];
            $questions = null;
            $points = null;
            $result = new Quiz($quizID, $quizTitle, $questions, $points);
        } catch (Exception $e) {
            $result = null;
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
        }

        return $result;
    }

    public function getAllQuizzes() {
        ChromePhp::log("CHeck");
        $results = [];
        $stmt = null;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("select * from Quiz");
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $questionAcc = new QuestionAccessor();

            foreach ($dbresults as $r) {
                $quizID = $r["quizID"];
                $quizTitle = $r['quizTitle'];
                $questions = $questionAcc->getQuestionsForQuiz($quizID);
                $points = $this->getPointsForQuiz($quizID);
                $obj = new Quiz($quizID, $quizTitle, $questions, $points);
                array_push($results, $obj);
            }
        } catch (Exception $ex) {
            $results = [];
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
        }

        return $results;
    }

    private function getPointsForQuiz($quizID) {
        $points = [];
        $stmt = null;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("SELECT points FROM QuizQuestion WHERE quizID = :quizID");
            $stmt->bindParam(":quizID", $quizID);
            $stmt->execute();
            $dbpoints = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $points = [];
            foreach ($dbpoints as $p) {
                array_push($points, intval($p["points"]));
            }
        } catch (Exception $ex) {
            $points = [];
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
        }

        return $points;
    }

    /**
     * Quicker method to get basic quiz info in order to populate menus.
     * The purpose of this is to address performance issues with some parts 
     * of the app.
     */
    public function getQuizInfo() {
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("SELECT quizID, quizTitle FROM Quiz");
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $ex) {
            return $ex->getMessage();
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
            return $dbresults;
        }
    }

    public function getQuizzesByTags($tags) {
        $tags = "%" . $tags . "%";
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("select distinct quiz.* from quiz, quizquestion, questiontag, tag where quizquestion.quizID = quiz.quizID AND quizquestion.questionID = questiontag.questionID AND questiontag.tagID = tag.tagID AND tag.tagName LIKE :tags");
            $stmt->bindParam(":tags", $tags);
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $ex) {
            return $ex->getMessage();
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
            return $dbresults;
        }
    }

    public function deleteQuiz($quiz) {
        $success = false;

        $quizid = $quiz->getQuizID(); // only the ID is needed

        try {
            $conn = connect_db();
            $stmt = $conn->prepare("delete from quizquestion where quizid = :quizid; delete from quiz where quizid = :quizid");
            $stmt->bindParam(":quizid", $quizid);
            $success = $stmt->execute();
            $rc = $stmt->rowCount();
        }
        catch (PDOException $e) {
            ChromePhp::log($e);
            $success = false;
        }
        finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
            return $success;
        }
    }

    
    public function addQuiz($quiz) {
        $success = false;
        ChromePhp::log("CHECK");
        $quizid = $quiz->getQuizID();
        $title = $quiz->getQuizTitle();
        $questions = $quiz->getQuestions();
        $points = $quiz->getPoints();
        $values = "(";
        for($i = 0; $i < (count($questions) - 1); $i++){
            $values .= "'" . $quizid . "', '" . $questions[$i] . "', " . $points[$i] . "), (";
        }
        $values .= "'" . $quizid . "', '" . $questions[(count($questions) - 1)] . "', " . $points[(count($questions) - 1)] . ")";
        
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("insert into quiz values (:quizid, :title); insert into quizquestion values :values ");
            $stmt->bindParam(":quizid", $quizid);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":values", $values);
            $success = $stmt->execute();
            $rc = $stmt->rowCount();
        }
        catch (PDOException $e) {
            ChromePhp::log($e);
            $success = false;
        }
        finally {
            ChromePhp::log($values);
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
            return $success;
        }
    }

    /**
     * Updates a menu item in the database.
     * 
     * @param MenuItem $item an object of type MenuItem, the new values to replace the database's current values
     * @return boolean indicates if the item was updated
     */
    public function updateQuiz($quiz) {
        $success = false;

        ChromePhp::log("CHECK");
        $quizid = $quiz->getQuizID();
        $title = $quiz->getQuizTitle();
        $questions = $quiz->getQuestions();
        $points = $quiz->getPoints();
        $values = "(";
        for($i = 0; $i < (count($questions) - 1); $i++){
            $values .= "'" . $quizid . "', '" . $questions[$i] . "', " . $points[$i] . "), (";
        }
        $values .= "'" . $quizid . "', '" . $questions[(count($questions) - 1)] . "', " . $points[(count($questions) - 1)] . ")";
        
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("update set quiz values (:quizid, :title); insert into quizquestion values :values ");
            $stmt->bindParam(":quizid", $quizid);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":values", $values);
            $success = $stmt->execute();
            $rc = $stmt->rowCount();
        }
        catch (PDOException $e) {
            $success = false;
        }
        finally {
            if (!is_null($this->updateStatement)) {
                $this->updateStatement->closeCursor();
            }
            return $success;
        }
    }
}
