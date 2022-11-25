<?php

class menuitem implements JsonSerializable
{
    private $quizID;
    private $quizTitle;
    private $questions;
    private $points;

    public function __construct($quizID, $quizTitle, $questions, $points)
    {
        $this->quizID = $quizID;
        $this->quizTitle = $quizTitle;
        $this->questions = $questions;
        $this->points = $points;
    }

    public function getquizID()
    {
        return $this->quizID;
    }

    public function getquizTitle()
    {
        return $this->quizTitle;
    }

    public function getquestions()
    {
        return $this->questions;
    }

    public function getpoints()
    {
        return $this->points;
    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}