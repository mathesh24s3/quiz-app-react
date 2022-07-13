import { nanoid } from "nanoid";
import React from "react";
import LandingPage from "./components/LandingPage";
import Quiz from "./components/Quiz";

function App() {
  const [startQuiz, setStartQuiz] = React.useState(false);
  const [quizArray, setQuizArray] = React.useState([]);
  const [checkAnswer, setCheckAnswer] = React.useState(1);
  const [count, setCount] = React.useState(0);
  const [startAgain , setStartAgain] = React.useState(0)

  function start() {
    setStartQuiz(true);
    
  }

  function restart() {
    setStartAgain(prevStartAgain=> prevStartAgain+1)
  }

  React.useEffect(function setQuiz() {
    async function getQuiz() {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=5&category=11&difficulty=medium&type=multiple"
      );
      const data = await response.json();

      setQuizArray(
        data.results.map((quiz) => {
          const [...options] = quiz.incorrect_answers;
          const correctAnswer = quiz.correct_answer;
          options.push(correctAnswer);
          return {
            qid: nanoid(),
            question: quiz.question,
            options: options.map((option) => ({
              id: Math.floor(
                Math.random() * Math.floor(Math.random() * Date.now())
              ),
              choice: option,
              isSelected: false,
            })),
            correct_answer: quiz.correct_answer,
          };
        })
      );

      setQuizArray((prevQuizArray) =>
        prevQuizArray.map((quiz) => ({
          ...quiz,
          options: quiz.options.sort((a, b) => a.id - b.id),
        }))
      );
    }

    setCount(0)

    getQuiz();
  }, [startAgain]);

  
  function selectOption(qid, optionId) {
    setQuizArray((prevQuizArray) =>
      prevQuizArray.map((quiz) =>
        quiz.qid === qid
          ? {
              ...quiz,
              options: quiz.options.map((option) =>
                option.id === optionId
                  ? { ...option, isSelected: true }
                  : { ...option, isSelected: false }
              ),
            }
          : quiz
      )
    );
  }


  function check() {
    const allSelected = quizArray.map((quiz) =>
      quiz.options.every((option) => option.isSelected === false)
    );
    const atleastOneSelected = allSelected.every(
      (selected) => selected === false
    );

    atleastOneSelected ? setCheckAnswer(true) : setCheckAnswer(false);
    if (atleastOneSelected) {
      for (const quiz of quizArray) {
        for (const option of quiz.options) {
          if (option.isSelected && option.choice === quiz.correct_answer) {
            const optionElement = document.getElementById(option.id);
            optionElement.classList.add("correct");
            setCount((prevCount) => prevCount + 1);
          } else if (
            option.isSelected &&
            option.choice !== quiz.correct_answer
          ) {
            const optionElement = document.getElementById(option.id);
            optionElement.classList.add("wrong");
          }
        }
      }
    }
  }

  const quizElement = quizArray.map((quiz) => {
    return (
      <Quiz
        key={quiz.qid}
        qid={quiz.qid}
        question={quiz.question}
        options={quiz.options}
        correct_answer={quiz.correct_answer}
        selectOption={selectOption}
        checkAnswer={checkAnswer}
      />
    );
  });

  return (
    <main>
      {!startQuiz && <LandingPage start={start} />}
      {startQuiz && <ul className="quiz">{quizElement}</ul>}
      {startQuiz && (
        <div className="check--ans">
          {!checkAnswer && <p>Attend every questions!!!</p>}
          {!count ? (
            <button className="btn" onClick={check}>
              Check answers
            </button>
          ) : (
            <div>
              <p>
                You scored {count}/{quizArray.length} correct answers
              </p>
              <button className="btn" onClick={restart}>Start again</button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
