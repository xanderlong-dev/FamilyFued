import { useState, useEffect, useRef } from 'react'
import Strikes from './Strikes'
import AnswerBoard from './AnswerBoard'
import Question from './Question'
import Counter from './Counter'
import goodanswer from './assets/goodanswer.mp3'
import badanswer from './assets/badanswer.mp3'
import roundWinMusic from './assets/roundWon.mp3'
import introMusic from './assets/introFamilyFued.mp3'
import survey_questions from './game8questions.json'

function App() {
  const [roundPoints, setRoundPoints] = useState(0);
  const [teamAPoints, setTeamAPoints] = useState(0);
  const [teamBPoints, setTeamBPoints] = useState(0);
  const strikes = useRef(0);
  const [showStrikes, setShowStrikes] = useState(false);
  const [AteamGuessing, setAteamGuessing] = useState(false);
  const [BteamGuessing, setBteamGuessing] = useState(false);
  const [answerBlocks, setAnswerBlocks] = useState([
    {id: 1, flip: false},
    {id: 2, flip: false},
    {id: 3, flip: false},
    {id: 4, flip: false},
    {id: 5, flip: false},
    {id: 6, flip: false},
    {id: 7, flip: false},
    {id: 8, flip: false},
]);
const blockRef = useRef([false, false, false, false, false, false, false, false]);
const winThreshold = 300;

  
  const [qanda, setQandA] = useState(survey_questions[0]);
  let isTeamAPlaying = true;
  let stealPhase = false;
  let faceoffPhase = true;
  let endRevealPhase = false;
  let roundIsStartable = false;
  let roundModifier = 1;
  let roundPointsTotal = 0;
  let teamATotal = 0;
  let teamBTotal = 0;
  let roundNum = 1;

  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true);
    return () => document.removeEventListener('keydown', detectKeyDown);
  }, [])

  const detectKeyDown = (e) => {
    const key = e.key;
    if(/[1-8]/.test(key)){
      const num = parseInt(key);
      if(!blockRef.current[num-1] && survey_questions[roundNum-1].answers.length >= num) {
        playSound(goodanswer);
        toggleFlip(num);
        handleCorrectAnswer(num);
      }
    } else if (key === '0') {
      playSound(badanswer);
      handleWrongAnswer();
    } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
      if(faceoffPhase) handlePassOrPlay(key === 'ArrowLeft');
    } else if (key === ' ' && roundIsStartable) {
      newRound();
    }
  }

  const playSound = (source) => {
    const sound = new Audio(source);
    sound.play();
  }

  const toggleFlip = (id) => {
    blockRef.current[id-1] = true;
    setAnswerBlocks(prev => prev.map((block) => {
      return block.id === id ? {...block, flip: blockRef.current[id-1]} : block;
    }));

}

  const handleCorrectAnswer = (number) => {
    if(!endRevealPhase) {
      let earnedPoints = 0;
      const revealedAnswer = survey_questions[roundNum-1].answers[number-1];
      earnedPoints = revealedAnswer.count * roundModifier;
      setRoundPoints(prev => prev + earnedPoints);
      roundPointsTotal += earnedPoints;
    }
    //if steal or if board is clear, end round
    if(checkBoardClear()){
      if(!endRevealPhase) {
        celebrateRoundWin();
      } else {
      endRevealPhase = false;
      }
      
    }
    if (stealPhase) {
      endRevealPhase = true;
      stealPhase = false;
      celebrateRoundWin();
    }
    
  }

  const celebrateRoundWin = () => {
    awardPoints(roundPointsTotal);
    playSound(roundWinMusic);
  }

  const checkBoardClear = () => {
    let ret = true;
    for(let i = 0; i < survey_questions[roundNum-1].answers.length; i++) {
      ret = blockRef.current[i] && ret;
    }
    return ret;
  }

  const mainRoundStart = () => {
    faceoffPhase = false;
    strikes.current = 0;
  }

  const handleWrongAnswer = () => {
    if(faceoffPhase){
      strikes.current = 1;
    } else {
      strikes.current = strikes.current + 1;}
    setShowStrikes(true);
    const timer = setTimeout(() => {
      setShowStrikes(false);
    }, 1500);
    if(stealPhase) {
      isTeamAPlaying = !isTeamAPlaying;
      setActiveTeam();
      stealPhase = false;
      celebrateRoundWin();
      endRevealPhase = true;
    } else if(strikes.current >= 3) {
      startStealPhase();
    }
    
    
    return () => clearTimeout(timer);
  }

  const handlePassOrPlay = (team) => {
    isTeamAPlaying = team;
    setActiveTeam();
    mainRoundStart();
  }

  const startStealPhase = () => {
    const roundPause = setTimeout(() => {
      stealPhase = true;
      isTeamAPlaying = !isTeamAPlaying;
      setActiveTeam();
      strikes.current = 0;
    }, 3000);

    return () => clearTimeout(roundPause);
    
    
  }

  const setActiveTeam = () => {
    
    setAteamGuessing(isTeamAPlaying);
    setBteamGuessing(!isTeamAPlaying);
  }

  const newRound = () => {
    playSound(introMusic);
    loadNewQuesitons(roundNum);
    roundNum++;
    switch (roundNum) {
      case 3:
      case 4:
        roundModifier = 2;
        break;
      case 5:
        roundModifier = 3;
        break;
      default:
        roundModifier = 1;
    }
    console.log("Round " + roundNum + " Started");
    setRoundPoints(0);
    roundPointsTotal = 0;
    strikes.current = 0;
    faceoffPhase = true;
    setAteamGuessing(false);
    setBteamGuessing(false);
  }

  const loadNewQuesitons = (num) => {
    setQandA(survey_questions[num]);
    setAnswerBlocks([
      {id: 1, flip: false},
      {id: 2, flip: false},
      {id: 3, flip: false},
      {id: 4, flip: false},
      {id: 5, flip: false},
      {id: 6, flip: false},
      {id: 7, flip: false},
      {id: 8, flip: false},
  ]);
  blockRef.current=[false, false, false, false, false, false, false, false];
  }

  const awardPoints = (pointsToTeam) => {
    if(isTeamAPlaying) {
      setTeamAPoints(prev => prev + pointsToTeam);
      teamATotal += pointsToTeam;
    }
      else {
        setTeamBPoints(prev => prev + pointsToTeam);
        teamBTotal += pointsToTeam;
      }
    setRoundPoints(0);
    roundPointsTotal = 0;
    const roundPause = setTimeout(() => {
      roundOver();
    }, 500);

    return () => clearTimeout(roundPause);
    
  }

  const roundOver = () => {    
    if(roundNum < 5 && teamATotal < winThreshold && teamBTotal < winThreshold){
      roundIsStartable = true;
    } else {
      const winner = teamATotal > teamBTotal ? "Team A" : "Team B";
      console.log("Winner: " + winner);
    }
    
  }



  return <div className='App'>
    <div className="container">
      <Counter id='teamACounter' activeTeam={AteamGuessing} points={teamAPoints}/>
      <Counter id='roundCounter' activeTeam={false} points={roundPoints}/>
      <Counter id='teamBCounter' activeTeam={BteamGuessing} points={teamBPoints}/>
      <AnswerBoard answers={qanda.answers} answerBlocks={answerBlocks}/>
      <Question question={qanda.question}/>
      <Strikes strikeCount={strikes.current} showStrikes={showStrikes}/>
    </div>
  </div>;
}

export default App
