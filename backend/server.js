var express = require("express");
var cors = require("cors");
var fs = require("fs");
var path = require("path");
var questions = require("./questions").questions;

var app = express();
var scoresFilePath = path.join(__dirname, "scores.json");

app.use(cors());
app.use(express.json());

// This serves only the frontend CSS and JavaScript folders.
app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));

// This sends the quiz page when someone opens the home address.
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "..", "index.html"));
});

// This returns saved scores, or an empty list if the file is missing or broken.
function readScores() {
  try {
    var fileContents = fs.readFileSync(scoresFilePath, "utf8");
    var savedScores = JSON.parse(fileContents);

    if (Array.isArray(savedScores)) {
      return savedScores;
    }

    console.warn("scores.json is not a list. Using an empty score list.");
    return [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    if (error instanceof SyntaxError) {
      console.warn("scores.json is not valid JSON. Using an empty score list.");
      return [];
    }

    throw error;
  }
}

// This writes the score list into scores.json.
function writeScores(savedScores) {
  fs.writeFileSync(scoresFilePath, JSON.stringify(savedScores, null, 2), "utf8");
}

// This copies a question without including its correct answer.
function hideAnswer(question) {
  return {
    question: question.question,
    options: question.options
  };
}

// This sends all questions without their correct answers.
function getQuestions(request, response) {
  response.json(questions.map(hideAnswer));
}

// This checks submitted answers and returns the number that are correct.
function submitAnswers(request, response) {
  var answers = request.body && request.body.answers;

  if (!Array.isArray(answers) || answers.length !== questions.length) {
    response.status(400).json({
      error: "Answers must be an array of exactly 5 numbers."
    });
    return;
  }

  for (var answerIndex = 0; answerIndex < answers.length; answerIndex++) {
    if (typeof answers[answerIndex] !== "number") {
      response.status(400).json({
        error: "Answers must be an array of exactly 5 numbers."
      });
      return;
    }
  }

  var score = 0;
  for (var questionIndex = 0; questionIndex < questions.length; questionIndex++) {
    if (answers[questionIndex] === questions[questionIndex].answer) {
      score++;
    }
  }

  response.json({ score: score, total: questions.length });
}

// This sorts saved score entries from highest score to lowest.
function compareScores(firstScore, secondScore) {
  return secondScore.score - firstScore.score;
}

// This sends all saved scores from highest to lowest.
function getScores(request, response) {
  var savedScores = readScores();
  response.json(savedScores.slice().sort(compareScores));
}

// This checks and saves one new score entry.
function saveScore(request, response) {
  var name = request.body && request.body.name;
  var score = request.body && request.body.score;

  if (typeof name !== "string" || name.length < 1 || name.length > 30) {
    response.status(400).json({
      error: "Name must be text with 1 to 30 characters."
    });
    return;
  }

  if (typeof score !== "number" || score < 0 || score > 5) {
    response.status(400).json({
      error: "Score must be a number from 0 to 5."
    });
    return;
  }

  var savedEntry = { name: name, score: score };
  var savedScores = readScores();
  savedScores.push(savedEntry);
  writeScores(savedScores);
  response.status(201).json(savedEntry);
}

// Route for getting the questions without their answers.
app.get("/api/questions", getQuestions);

// Route for checking a set of submitted answers.
app.post("/api/submit", submitAnswers);

// Route for getting saved scores in descending score order.
app.get("/api/scores", getScores);

// Route for checking and saving a new score.
app.post("/api/scores", saveScore);

// This starts the server and prints its local address.
function startServer() {
  var port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log("Server running on http://localhost:" + port);
  });
}

startServer();
