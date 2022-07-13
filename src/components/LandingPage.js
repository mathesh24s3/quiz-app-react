import React from "react";

export default function LandingPage(props) {
    return (
        <div className="landing-page">
            <h1 className="page--title">Quizzical</h1>
            <button className="start_quiz  btn" onClick={props.start}>Start quiz</button>
        </div>
    )
}