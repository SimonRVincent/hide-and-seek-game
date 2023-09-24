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
  // Here, you'd implement the score decreasing logic, hint functionality, and other features for the Seeker
  return (
    <div>
      Seeker Screen
      {/* Placeholder for score, hint button, and other UI */}
    </div>
  );
}

export default App;
