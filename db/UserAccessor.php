<?php

require_once 'dbconnect.php';
require_once(__DIR__ . '/../entity/User.php');
require_once(__DIR__ . '/../utils/ChromePhp.php');

class UserAccessor {

    private $insertString = "INSERT INTO quizappuser VALUES " .
            "(:username, :password, :permissionLevel)";
    private $insertStatement = NULL;

    public function __construct() {
        $this->conn = connect_db();
        if (is_null($this->conn)) {
            throw new Exception("no connection");
        }

        $this->insertStatement = $this->conn->prepare($this->insertString);
        ChromePhp::log("....constructing... success.....");
        if (is_null($this->insertStatement)) {
            throw new Exception("bad statement: '" . $this->insertString . "'");
        }
    }

    public function getAllUsers() {
        $result = [];
        $stmt = null;
        try {
            $stmt = $this->conn->prepare("select * from QuizAppUser where permissionLevel='USER'");
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($dbresults as $r) {
                $username = $r['username'];
                $password = $r['password'];
                $obj = new User($username, $password, "USER");
                array_push($result, $obj);
            }
        } catch (Exception $e) {
            $result = [];
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
        }

        return $result;
    }

    public function getAllAccounts() {
        $result = [];
        $stmt = null;
        try {
            $stmt = $this->conn->prepare("select * from QuizAppUser");
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($dbresults as $r) {
                $username = $r['username'];
                $password = $r['password'];
                $perm = $r['permissionLevel'];
                $obj = new User($username, $password, $perm);
                array_push($result, $obj);
            }
        } catch (Exception $e) {
            $result = [];
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
        }

        return $result;
    }

    public function getAccountForUser($username) {
        $result = null;
        $stmt = null;
        try {
            $stmt = $this->conn->prepare("select * from QuizAppUser where username = :username");
            $stmt->bindParam(":username", $username);
            $stmt->execute();
            $dbresults = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (count($dbresults) === 1) {
                $result = new User($dbresults[0]["username"], $dbresults[0]["password"], $dbresults[0]["permissionLevel"]);
            }
        } catch (Exception $e) {
            $result = null;
        } finally {
            if (!is_null($stmt)) {
                $stmt->closeCursor();
            }
        }

        return $result;
    }

    public function insertAccount($user) {
        $username = $user->getUsername();
        $password = $user->getPassword();
        $permission = $user->getPermissionLevel();

        try {
            $this->insertStatement->bindParam(":username", $username);
            $this->insertStatement->bindParam(":password", $password);
            $this->insertStatement->bindParam(":permissionLevel", $permission);

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
