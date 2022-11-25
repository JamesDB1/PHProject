<?php

function connect_db()
{
    $db = new PDO(
        "mysql:host=localhost;dbname=quizappdb",
        "phproject",
        "project_password"
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // throw exceptions
    return $db;
}