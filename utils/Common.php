<?php
$projectRoot = __DIR__ . '/..';
require_once($projectRoot . '/class/Question.php');
require_once($projectRoot . '/class/QuizResult.php');
require_once($projectRoot . '/class/Tag.php');
require_once($projectRoot . '/class/User.php');
require_once($projectRoot . '/class/Question.php');

class Common
{
    public $Tag = new Tag(12, "Test", "TestCategory");
    public $Question = new Question("Question1", "QuestionText", ["ChoiceA", "ChoiceB", "ChoiceC", "ChoiceD"], 1, [$Tag, $Tag]);
    public $Quiz = new Quiz("QU-123", "QuizTitleName", [$Question, $Question, $Question, $Question, $Question, $Question, $Question], [1, 2, 3, 4, 5, 6, 7]);
}