var questions = [];
var currentQuestion = 0;
var score = 0;
var selectedIndex = null;
var answers = [];

var landingSection = document.getElementById("landing-section");
var quizSection = document.getElementById("quiz-section");
var resultSection = document.getElementById("result-section");
var questionNumber = document.getElementById("question-number");
var questionText = document.getElementById("question-text");
var optionsContainer = document.getElementById("options-container");
var answerMessage = document.getElementById("answer-message");
var scoreText = document.getElementById("score-text");
var progressBar = document.getElementById("progress-bar");
var progressFill = document.getElementById("progress-fill");
var feedback = document.getElementById("feedback");

// This loads the questions from the backend when the page opens.
async function loadQuestions() {
  try {
    var response = await fetch("/api/questions");
    if (!response.ok) {
      throw new Error("The questions could not be loaded.");
    }

    questions = await response.json();
  } catch (error) {
    console.error(error);
    landingSection.hidden = true;
    quizSection.hidden = false;
    feedback.textContent =
      "Could not load questions. Make sure the backend server is running.";
  }
}

// This displays the current question and creates its four radio-button choices.
function showQuestion() {
  var questionData = questions[currentQuestion];
  selectedIndex = null;
  answerMessage.hidden = true;
  feedback.textContent = "";
  questionNumber.textContent =
    "Question " + (currentQuestion + 1) + " of " + questions.length;
  progressFill.style.width =
    ((currentQuestion + 1) / questions.length * 100) + "%";
  progressBar.setAttribute("aria-valuenow", currentQuestion + 1);
  questionText.textContent = questionData.question;
  optionsContainer.textContent = "";

  var strayText = questionText.nextSibling;
  if (
    strayText &&
    strayText.nodeType === 3 &&
    strayText.textContent.trim() === "-"
  ) {
    strayText.parentNode.removeChild(strayText);
  }

  for (var optionIndex = 0; optionIndex < questionData.options.length; optionIndex++) {
    var label = document.createElement("label");
    var radioButton = document.createElement("input");
    var optionText = document.createElement("span");

    label.className = "option-label";
    radioButton.type = "radio";
    radioButton.name = "quiz-answer";
    radioButton.value = optionIndex;
    radioButton.addEventListener("change", selectAnswer);
    optionText.textContent = questionData.options[optionIndex];

    label.appendChild(radioButton);
    label.appendChild(optionText);
    optionsContainer.appendChild(label);
  }
}

// This hides the welcome screen and starts the quiz at its first question.
function startQuiz() {
  if (questions.length === 0) {
    return;
  }

  currentQuestion = 0;
  score = 0;
  answers = [];
  landingSection.hidden = true;
  resultSection.hidden = true;
  quizSection.hidden = false;
  showQuestion();
}

// This remembers the selected choice so it can still be changed before Next.
function selectAnswer(event) {
  selectedIndex = Number(event.target.value);
  answerMessage.hidden = true;
  feedback.textContent = "";
}

// This moves to the next question or shows the completion message at the end.
async function goToNextQuestion() {
  if (selectedIndex === null) {
    answerMessage.hidden = false;
    return;
  }

  answerMessage.hidden = true;
  feedback.textContent = "";
  answers[currentQuestion] = selectedIndex;

  if (currentQuestion < questions.length - 1) {
    selectedIndex = null;
    currentQuestion++;
    showQuestion();
    return;
  }

  try {
    var response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answers })
    });

    if (!response.ok) {
      throw new Error("The final score could not be loaded.");
    }

    var result = await response.json();
    score = result.score;
    quizSection.hidden = true;
    resultSection.hidden = false;
    scoreText.textContent =
      "Your score: " + result.score + " out of " + result.total;
  } catch (error) {
    console.error(error);
  }
}

// This resets the quiz and shows the first question again.
function restartQuiz() {
  startQuiz();
}

document.getElementById("start-button").addEventListener("click", startQuiz);
document.getElementById("next-button").addEventListener("click", goToNextQuestion);
document.getElementById("restart-button").addEventListener("click", restartQuiz);

loadQuestions();
// --- AUTH JS ---
var loginBtn = document.getElementById("login-btn");
var signupBtn = document.getElementById("signup-btn");

if (loginBtn) {
  loginBtn.onclick = async function() {
    var email = document.getElementById("auth-email").value;
    var password = document.getElementById("auth-password").value;
    var res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });
    var data = await res.json();
    document.getElementById("auth-msg").innerText = data.message;
    if (res.ok) {
      document.getElementById("welcome-msg").innerText = "Welcome, " + data.name + "!";
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("landing-section").classList.remove("hidden");
    }
  };
}

if (signupBtn) {
  signupBtn.onclick = async function() {
    var name = document.getElementById("auth-name").value;
    var email = document.getElementById("auth-email").value;
    var password = document.getElementById("auth-password").value;
    var res = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, password: password })
    });
    var data = await res.json();
    document.getElementById("auth-msg").innerText = data.message;
  };
}
