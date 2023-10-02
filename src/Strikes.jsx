export default function Strikes({strikeCount, showStrikes}) {
    const strikeArray = Array.from({length: strikeCount}, (_,index) => index + 1);

    return (
        <div className={`strikes ${showStrikes ? 'shown' : ''}`}>
            {strikeArray.map(value => (
                <div className="strikesUnit" key={`strike-${value}`}>X</div>
            ))} 
        </div>
    )
}