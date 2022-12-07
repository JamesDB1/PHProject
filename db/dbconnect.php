<?php

function connect_db()
{
    $db = new PDO(
        "mysql:host=localhost;dbname=quizappdb",
        "admin",
        "admin"
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // throw exceptions
    return $db;
}