<?php

require_once 'dbconnect.php';
require_once(__DIR__ . '/../entity/User.php');


class UserAccessor {

    public function getAllUsers()
    {
        $result = [];
        $stmt = null;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("select * from QuizAppUser where permissionLevel='USER'");
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

    public function getAllAccounts()
    {
        $result = [];
        $stmt = null;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("select * from QuizAppUser");
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

}
