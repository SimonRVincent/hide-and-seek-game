import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // renamed for clarity

  return (
    <div className="App">
      {currentScreen === 'menu' && <MainMenu setScreen={setCurrentScreen} />}
      {currentScreen === 'choice' && <ChoiceScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'lobby' && <LobbyScreen setScreen={setCurrentScreen} />}
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
  return (
    <div>
      Hider Screen
      {/* Placeholder for score and other UI */}
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
