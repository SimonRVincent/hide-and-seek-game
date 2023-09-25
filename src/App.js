import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Alert, Badge } from 'react-bootstrap';
import './App.css';

function App() {
  const [screen, setScreen] = useState('menu');

  return (
    <Container fluid style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>  {/* Adjusting height as per requirement and adding display, justifyContent and alignItems */}

      <div className="text-center">  {/* Adjusting width as per requirement and adding text-center */}
        {screen === 'menu' && <MainMenu setScreen={setScreen} />}
        {screen === 'choice' && <ChoiceScreen setScreen={setScreen} />}
        {screen === 'lobby' && <LobbyScreen setScreen={setScreen} />}
        {screen === 'hider' && <HiderScreen setScreen={setScreen} />}
        {screen === 'seeker' && <SeekerScreen setScreen={setScreen} />}
      </div>
    </Container>
  );
}


function MainMenu({ setScreen }) {
  return (
    <div className="p-5 rounded-lg m-3">
      <h1 className="display-4">Hide and Seek</h1>
      <p className="lead">A fun game to play.</p>  {/* Optional tagline or instructions */}
      <Button variant="primary" onClick={() => setScreen('choice')}>Play</Button>
    </div>
  );
}


function ChoiceScreen({ setScreen }) {
  return (
    <div>
      <Button variant="success" className="mr-2" onClick={() => setScreen('lobby')}>Create Game</Button>
      <Button variant="info">Join Game</Button>
    </div>
  );
}

function LobbyScreen({ setScreen }) {
  // For simplicity, we're not fleshing out the lobby fully
  return (
    <div>
      <h2>Lobby</h2>
      {/* Dummy player list */}
      <ul className='list-unstyled'>
        <li>Player 1 <Badge variant="secondary">You</Badge></li>
        <li>Player 2</li>
        <li>Player 3</li>
        <li>Player 4</li>
      </ul>
      <Button variant="warning" className="mr-2" onClick={() => setScreen('hider')}>Start as Hider</Button>
      <Button variant="danger" onClick={() => setScreen('seeker')}>Start as Seeker</Button>
    </div>
  );
}

function HiderScreen({ setScreen }) {
  const [score, setScore] = useState(0);
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFound) setScore(prevScore => prevScore + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFound]);

  return (
    <div onClick={() => !isFound && setIsFound(true)}>
      {isFound ? (
        <Alert variant="success">
          <Alert.Heading>You've been found!</Alert.Heading>
          <p>Score: {score}</p>
          <Button onClick={() => setScreen('menu')}>Return to Main Menu</Button>
        </Alert>
      ) : (
        <div>
          <h2>Hide!</h2>
          <p>Score: {score}</p>
        </div>
      )}
    </div>
  );
}

function SeekerScreen({ setScreen }) {
  const [score, setScore] = useState(300);
  const [hint, setHint] = useState(null);
  const [hintTimer, setHintTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (score > 0) {
        setScore(prevScore => prevScore - 1);
      } else {
        setIsGameOver(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [score]);

  useEffect(() => {
    const hintInterval = setInterval(() => {
      if (hintTimer > 0) {
        setHint(prevHint => (prevHint === '🔥' ? '❄️' : '🔥'));
        setHintTimer(prevTimer => prevTimer - 3);
      } else {
        setHint(null);
      }
    }, 3000);
    return () => clearInterval(hintInterval);
  }, [hintTimer]);

  const handleHintClick = () => {
    if (score >= 40) {
      setScore(prevScore => prevScore - 40);
      setHint('🔥');
      setHintTimer(10);
    }
  };

  const handleGiveUp = () => {
    setScore(0);
    setIsGameOver(true);
  };

  if (isGameOver) {
    return (
      <Alert variant="success">
        Game Over <br />
        Score: {score} <br />
        <Button variant="secondary" size="lg" onClick={() => setScreen('menu')}>Return to Main Menu</Button>
      </Alert>
    );
  }

  return (
    <div>
      <h2>Seek!</h2>
      <p>Score: {score}</p>
      {hint && <Alert variant={hint === '🔥' ? 'danger' : 'info'}><span className="large-emoji">{hint}</span></Alert>}
      <Button variant="primary" className="mr-2" onClick={handleHintClick}>Hint</Button>
      <Button variant="dark" onClick={handleGiveUp}>Give up</Button>
      {score === 0 && <Button onClick={() => setScreen('menu')} className="mt-2">Return to Main Menu</Button>}
    </div>
    
  );
}

export default App;

