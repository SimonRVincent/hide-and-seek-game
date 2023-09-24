import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // renamed for clarity

  return (
    <div className="App">
      {currentScreen === 'menu' && <MainMenu setScreen={setCurrentScreen} />}
      {currentScreen === 'choice' && <ChoiceScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'lobby' && <LobbyScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'hider' && <HiderScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'seeker' && <SeekerScreen setScreen={setCurrentScreen} />}
      {/* Add other screens here similarly */}
    </div>
  );
}

function MainMenu({ setScreen }) {
  return (
    <div>
      <h1>Hide and Seek</h1>
      <button onClick={() => setScreen('choice')}>Play</button>
    </div>
  );
}

function ChoiceScreen({ setScreen }) {
  return (
    <div>
      <button onClick={() => setScreen('lobby')}>Create Game</button>
      <button>Join Game</button> {/* Note: This button doesn't have any onClick functionality yet */}
    </div>
  );
}

function LobbyScreen({ setScreen }) {
  return (
    <div>
      {/* Mock player list */}
      <div>You 👑</div>
      <div>Player 2</div>
      <div>Player 3</div>
      <div>Player 4</div>
      <div>Player 5</div>

      <button onClick={() => setScreen('hider')}>Start as Hider</button>
      <button onClick={() => setScreen('seeker')}>Start as Seeker</button>
    </div>
  );
}

function HiderScreen({ setScreen }) {
  // Here, you'd implement the score increasing logic and other functionalities for the Hider
  const [score, setScore] = useState(0);
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    if (isFound) return;  // If the hider is found, don't increase the score

    const interval = setInterval(() => {
      setScore(prevScore => prevScore + 1);
    }, 1000);  // Increase score by 1 every second

    return () => clearInterval(interval);  // Cleanup on component unmount
  }, [isFound]);

  return (
    <div onClick={() => !isFound && setIsFound(true)}>
      {isFound ? (
        <div>
          <h2>You've been found!</h2>
          <p>Score: {score}</p>
          <button onClick={() => setScreen('menu')}>Return to Main Menu</button>
        </div>
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
  const [hint, setHint] = useState(null);  // 'hotter', 'colder', or null
  const [hintTimer, setHintTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (score > 0) {
        setScore(prevScore => prevScore - 1);
      } else {
        clearInterval(interval);  // End the game if score reaches 0
      }
    }, 1000);

    return () => clearInterval(interval);  // Cleanup on component unmount
  }, [score]);

  useEffect(() => {
    if (hintTimer > 0) {
      const hintInterval = setInterval(() => {
        setHint(prevHint => (prevHint === 'hotter' ? 'colder' : 'hotter'));
        setHintTimer(prevTimer => prevTimer - 3);
      }, 3000);

      return () => clearInterval(hintInterval);
    } else {
      setHint(null);
    }
  }, [hintTimer]);

  const handleHintClick = () => {
    if (score >= 40) {
      setScore(prevScore => prevScore - 40);
      setHint('hotter');  // Starting hint (can be randomized if needed)
      setHintTimer(10);   // Set for 10 seconds of hints
    }
  };

  const handleGiveUp = () => {
    setScore(0);  // Set score to 0 if the seeker gives up
  };

  return (
    <div>
      <h2>Seek!</h2>
      <p>Score: {score}</p>
      {score === 0 ? (
        <div>
          <p>Your score is: {score}</p>
          <button onClick={() => setScreen('menu')}>Return to Main Menu</button>
        </div>
      ) : (
        <div>
          {hint && <div className={hint}>{hint}</div>}
          <button onClick={handleHintClick}>Hint</button>
          <button onClick={handleGiveUp}>Give up</button>
        </div>
      )}
    </div>
  );
}

export default App;
