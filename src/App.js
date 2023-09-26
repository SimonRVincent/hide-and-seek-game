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

  const [players, setPlayers] = useState([
    { id: 1, icon: '👤', found: false },
    { id: 2, icon: '👥', found: false },
    { id: 3, icon: '👦', found: false },
    { id: 4, icon: '👧', found: false },
  ]);

  const handlePlayerClick = (playerId) => {
    setPlayers(players.map(player =>
      player.id === playerId ? { ...player, found: true } : player
    ));
  };

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
          <div className="players">
            {players.filter(player => !player.found).map(player => (
              <span key={player.id} className="player-icon" onClick={() => handlePlayerClick(player.id)}>
                {player.icon}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function SeekerScreen({ setScreen }) {
  const [score, setScore] = useState(300);
  const [hint, setHint] = useState(null);
  const [hintDuration, setHintDuration] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      if (score > 0) setScore(prevScore => prevScore - 1);
      if (score === 0) setIsGameOver(true);
    }, 1000);

    return () => clearInterval(scoreInterval);
  }, [score]);

  useEffect(() => {
    if (hintDuration && hintDuration > 0) {
      const countdown = setInterval(() => {
        setHintDuration(prevDuration => prevDuration - 10);
      }, 10);

      return () => clearInterval(countdown);
    } else {
      setHint(null); // stop showing the hint when the duration is over
    }
  }, [hintDuration]);

  useEffect(() => {
    if (hint) {
      // Toggle hint every 3.5 seconds
      const toggleHint = setInterval(() => {
        setHint(prevHint => (prevHint === '🔥' ? '❄️' : '🔥'));
      }, 3500);

      return () => clearInterval(toggleHint);
    }
  }, [hint]);

  const handleHintClick = () => {
    if (score >= 40) {
      setScore(prevScore => prevScore - 40);
      setHint('🔥');
      setHintDuration(10000);
    }
  };

  const handleGiveUp = () => {
    setScore(0);
    setIsGameOver(true);
  };

  // Initial list of players (all hiders)
  const [players, setPlayers] = useState([
    { id: 1, icon: '👤', found: false },
    { id: 2, icon: '👥', found: false },
    { id: 3, icon: '👦', found: false },
    { id: 4, icon: '👧', found: false },
  ]);

  const handlePlayerClick = (playerId) => {
    setPlayers(players.map(player =>
      player.id === playerId ? { ...player, found: true } : player
    ));
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

  if (hint) {
    return (
      <div>
        <h2>Hint Time Left: {(hintDuration / 1000).toFixed(2)}s</h2>
        <Alert variant={hint === '🔥' ? 'danger' : 'info'}><span className="large-emoji">{hint}</span></Alert>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>Seek!</h2>
        <p>Score: {score}</p>
      </div>
      <div className="players">
        {players.filter(player => !player.found).map(player => (
          <span key={player.id} className="player-icon" onClick={() => handlePlayerClick(player.id)}>
            {player.icon}
          </span>
        ))}
      </div>
      <div>
        {hint && <Alert variant={hint === '🔥' ? 'danger' : 'info'}><span className="large-emoji">{hint}</span></Alert>}
        <Button variant="primary" className="mr-2" onClick={handleHintClick}>Hint<br/>(-40pts)</Button>
      </div>
      <div>
        <Button variant="dark" onClick={handleGiveUp}>Give up</Button>
        {score === 0 && <Button onClick={() => setScreen('menu')} className="mt-2">Return to Main Menu</Button>}
      </div>
    </div>
  );
}









export default App;

