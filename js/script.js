var questions = [
  {
    question: "Which language is used to add interactivity to web pages?",
    options: ["HTML", "CSS", "JavaScript", "SQL"],
    answer: 2
  },
  {
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "High Transfer Machine Language",
      "Hyperlink Text Management Language",
      "Home Tool Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which part of a computer performs most calculations?",
    options: ["Monitor", "CPU", "Keyboard", "Speaker"],
    answer: 1
  },
  {
    question: "Which of these is a web browser?",
    options: ["Linux", "Python", "Google Chrome", "Microsoft Word"],
    answer: 2
  },
  {
    question: "What does CSS help control on a web page?",
    options: [
      "The page's appearance and layout",
      "The computer's storage",
      "The internet connection",
      "The browser's history"
    ],
    answer: 0
  }
];

var currentQuestionIndex = 0;
var score = 0;

var landingSection = document.getElementById("landing-section");
var quizSection = document.getElementById("quiz-section");
var resultSection = document.getElementById("result-section");
var questionNumber = document.getElementById("question-number");
var questionText = document.getElementById("question-text");
var optionsContainer = document.getElementById("options-container");
var answerMessage = document.getElementById("answer-message");
var scoreText = document.getElementById("score-text");

// This displays the current question and creates its four radio-button choices.
function showQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  answerMessage.hidden = true;
  questionNumber.textContent =
    "Question " + (currentQuestionIndex + 1) + " of " + questions.length;
  questionText.textContent = currentQuestion.question;
  optionsContainer.textContent = "";

  for (var optionIndex = 0; optionIndex < currentQuestion.options.length; optionIndex++) {
    var label = document.createElement("label");
    var radioButton = document.createElement("input");
    var optionText = document.createElement("span");

    label.className = "option-label";
    radioButton.type = "radio";
    radioButton.name = "quiz-answer";
    radioButton.value = optionIndex;
    optionText.textContent = currentQuestion.options[optionIndex];

    label.appendChild(radioButton);
    label.appendChild(optionText);
    optionsContainer.appendChild(label);
  }
}

// This hides the welcome screen and starts the quiz at its first question.
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  landingSection.hidden = true;
  resultSection.hidden = true;
  quizSection.hidden = false;
  showQuestion();
}

// This moves to the next question or shows the completion message at the end.
function goToNextQuestion() {
  var selectedOption = document.querySelector('input[name="quiz-answer"]:checked');

  if (selectedOption === null) {
    answerMessage.hidden = false;
    return;
  }

  if (Number(selectedOption.value) === questions[currentQuestionIndex].answer) {
    score++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    quizSection.hidden = true;
    resultSection.hidden = false;
    scoreText.textContent = "Your score: " + score + " out of " + questions.length;
  }
}

// This resets the quiz and shows the first question again.
function restartQuiz() {
  startQuiz();
}

document.getElementById("start-button").addEventListener("click", startQuiz);
document.getElementById("next-button").addEventListener("click", goToNextQuestion);
document.getElementById("restart-button").addEventListener("click", restartQuiz);
