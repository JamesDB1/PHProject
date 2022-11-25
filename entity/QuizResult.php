<?php

class menuitem implements JsonSerializable
{
    private $resultID;
    private $quiz;
    private $user;
    private $answers;
    private $startTime;
    private $endTime;
    private $scoreNumerator;
    private $scoreDenominator;

    public function __construct($resultID, $quiz, $user, $answers, $startTime, $endTime, $scoreNumerator, $scoreDenominator)
    {
        $this->resultID = $resultID;
        $this->quiz = $quiz;
        $this->user = $user;
        $this->answers = $answers;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
        $this->scoreNumerator = $scoreNumerator;
        $this->scoreDenominator = $scoreDenominator;
    }

    public function getResultID()
    {
        return $this->resultID;
    }

    public function getQuiz()
    {
        return $this->quiz;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getAnswers()
    {
        return $this->answers;
    }

    public function getStartTime()
    {
        return $this->startTime;
    }

    public function getEndTime()
    {
        return $this->endTime;
    }

    public function getScoreNumerator()
    {
        return $this->scoreNumerator;
    }

    public function getScoreDenominator()
    {
        return $this->scoreDenominator;
    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}