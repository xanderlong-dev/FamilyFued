export default function AnswerBlock({answer, id, flip}) {
    const revealToggle = () => {
        console.log("clicked an answer, is it flipped: " + flip);
    }
    
    return (
        <div
            className={`answer ${flip ? 'revealed' : ''}`} 
            onClick={() => revealToggle()}>
            <div className='front'>
                {id}
            </div>
            <div className='back'>
                <div className="answer-text">
                    {answer.answer}
                </div>
                <div className="answer-points">{answer.count}</div>
            </div>
        </div>
    )
}