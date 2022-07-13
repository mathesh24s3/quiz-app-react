import React from "react";

export default function Quiz(props) {

  return (
    <li>
      <h3 className="quiz--questions">{props.question}</h3>
      <div>
        {props.options.map((option) => (
          <button
            className={
              option.isSelected
                ? "quiz--options selected"
                : "quiz--options"
            }
            id = {option.id}
            onClick={() => props.selectOption(props.qid, option.id)}
          >
            {option.choice}
          </button>
        ))}
      </div>
    </li>
  );
}
