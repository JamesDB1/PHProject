<?php
$projectRoot = __DIR__ . '/..';
require_once($projectRoot . '/entity/Question.php');
require_once($projectRoot . '/entity/QuizResult.php');
require_once($projectRoot . '/entity/Tag.php');
require_once($projectRoot . '/entity/User.php');
require_once($projectRoot . '/entity/Question.php');

class Common
{
    public $Tag = new Tag(12, "Test", "TestCategory");
    public $Question = new Question("Question1", "QuestionText", ["ChoiceA", "ChoiceB", "ChoiceC", "ChoiceD"], 1, [$Tag, $Tag]);
    public $Quiz = new Quiz("QU-123", "QuizTitleName", [$Question, $Question, $Question, $Question, $Question, $Question, $Question], [1, 2, 3, 4, 5, 6, 7]);
}