# Online Quiz Application

## Description

This is a web-based multiple-choice quiz. It gives the user five questions and shows the final score at the end.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express
- cors

## Project Structure

```text
Online quiz application/
├── index.html              - The main quiz page.
├── css/
│   └── style.css           - Styles for the quiz page.
├── js/
│   └── script.js           - Runs the quiz and connects to the server.
└── backend/
    ├── server.js           - Starts the server and defines the API routes.
    ├── questions.js        - Stores the quiz questions and correct answers.
    ├── scores.json         - Stores saved player scores.
    └── package.json        - Lists project details and dependencies.
```

## How to Run Locally

1. Open a terminal in the `backend` folder.
2. Run `npm install`.
3. Run `npm start`.
4. Open http://localhost:3000 in a browser.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/questions` | Returns the quiz questions without the correct answers. |
| POST | `/api/submit` | Checks submitted answers and returns the score and total. |
| GET | `/api/scores` | Returns saved scores from highest to lowest. |
| POST | `/api/scores` | Checks and saves one new score entry. |

## How the Score Works

The browser sends the selected answers to `/api/submit`. The server compares the answers with the correct answers stored in `questions.js` and returns the score and total number of questions.

## Live Demo

https://online-quiz-application-dohp.onrender.com

## Known Limitations

- Scores can reset when the server restarts.
- The free server sleeps when idle.
- The correct answers are stored on the server.
# Online Quiz Application

A web-based multiple-choice quiz. Answers are sent to the server at the end, and the final score is shown.

## Technologies Used

HTML, CSS, JavaScript, Node.js, Express, cors

## Project Structure

- index.html: the quiz page
- css/style.css: the styling
- js/script.js: the quiz logic in the browser
- backend/server.js: the Express server and API routes
- backend/questions.js: the questions and correct answers
- backend/scores.json: saved scores
- backend/package.json: project settings and dependencies

## How to Run Locally

1. Open a terminal in the backend folder.
2. Run `npm install`.
3. Run `npm start`.
4. Open http://localhost:3000 in your browser.

## API Routes

| Method | Route | Purpose |
|---|---|---|
| GET | /api/questions | Returns the questions without answers |
| POST | /api/submit | Receives the selected answers and returns the score |
| GET | /api/scores | Returns saved scores |
| POST | /api/scores | Saves a name and score |

## How the Score Works

The browser sends the selected answers to /api/submit. The server compares them with the correct answers in questions.js and returns the score and total.

## Live Demo

https://online-quiz-application-dohp.onrender.com

## Known Limitations

- Scores reset when the server restarts.
- The free server sleeps when idle, so the first load can take about a minute.
- Correct answers are stored on the server, but anyone who reads the server code can see them.