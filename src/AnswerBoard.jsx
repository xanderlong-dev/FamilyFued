import AnswerBlock from "./AnswerBlock"
import { useEffect, useState } from "react";

export default function AnswerBoard({answers, answerBlocks}) {
    const filler = {answer: null};
    const paddedAnswers = [...answers];
    while (paddedAnswers.length < 8) {
        paddedAnswers.push(filler);
    }

    return (
        <div className="answer-board">
            {paddedAnswers.map((answer, index) => {
                return answer.answer ? <AnswerBlock answer={answer}
                key={index} id={index + 1} flip={answerBlocks[index].flip}/> : <div className="filler-answer" key={index}></div>
            })}
        </div>
    )
}