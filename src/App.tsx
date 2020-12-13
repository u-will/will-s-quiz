import React, { MouseEvent, useState } from 'react';
//conponents
import { QuestionCard } from './components/QuestionCard';
import { fetchQuizQuestions } from './API';
//types 
import { Difficulty, QuestionState } from './API';
//  styles
import { GlobalStyle, Wrapper } from './App.style';

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;

}


const App: React.FC = () => {


  const [loading, setLoading] = useState(false);
  const [questions, setQuestion] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(question)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    try {
      const newQuestion = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );
      setQuestion(newQuestion);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);

    } catch (error) {
      console.error(error);
    }


  }


  const checkAnswer = (e: MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {

      const answer = e.currentTarget.value;

      const correct = questions[number].correct_answer === answer;
  
      if (correct) setScore(prev => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };


  const nextQuestion = () => {

    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    }
    setNumber(nextQuestion);
  }
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>WILL'S QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            Strat
          </button>
        ) : null}

        {!gameOver ? <p className="score"> Score:{score}</p> : null}
        {loading && <p>Loading Question...</p>}

        {!loading && !gameOver && (<QuestionCard
          questionNumber={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />)}

        {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (<button className="next" onClick={nextQuestion}>
          Next Question
        </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App; 
