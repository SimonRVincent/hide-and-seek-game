import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, ButtonGroup, Alert, Badge } from "react-bootstrap";
import logo from "./logo.png";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("menu");

  const handleNameEntered = (name) => {
    setScreen('choice');
  }

  return (
    <Container
      fluid
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {" "}
      {/* Adjusting height as per requirement and adding display, justifyContent and alignItems */}
      <div className="text-center">
        {" "}
        {/* Adjusting width as per requirement and adding text-center */}
        {screen === "menu" && <MainMenu setScreen={setScreen} />}
        {screen === "enterName" && <EnterNameScreen onContinue={handleNameEntered} />}
        {screen === "choice" && <ChoiceScreen setScreen={setScreen} />}
        {screen === "lobby" && <LobbyScreen setScreen={setScreen} />}
        {screen === "hider" && <HiderScreen setScreen={setScreen} />}
        {screen === "seeker" && <SeekerScreen setScreen={setScreen} />}
      </div>
    </Container>
  );
}

function MainMenu({ setScreen }) {
  return (
    <div className="p-5 rounded-lg m-3">
      <img src={logo} alt="App Logo" className="app-logo" />
      <p className="lead fs-3 fw-semibold">Hide and seek with some fun twists!</p>
      <Button size='lg' variant="primary" onClick={() => setScreen("enterName")}>
        Play
      </Button>
    </div>
  );
}

function EnterNameScreen({ onContinue }) {
  const [tempName, setTempName] = useState('');

  return (
      <div>
          <h2>Enter Your Name</h2>
          <div>
          <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)} 
              placeholder="Your Name"
          />
          </div>
          <div>
          <Button size="lg" variant="primary" onClick={() => onContinue(tempName)}>Continue</Button>
          </div>
      </div>
  );
}

function ChoiceScreen({ setScreen }) {

  const [joining, setJoining] = useState(false);

  const handleJoinClick = () => {
    setJoining(true);
  };

  const handleScreenClick = () => {
    if (joining) {
      setJoining(false);
      setScreen("lobby");
    }
  };

  return (
    <div onClick={handleScreenClick}>
      {!joining ? (
        <>
          <Button
            variant="success"
            className="mr-2"
            size="lg"
            onClick={() => setScreen("lobby")}
          >
            Create Game
          </Button>
          <Button 
            variant="info" 
            size="lg" 
            onClick={handleJoinClick}
          >
            Join Game
          </Button>
        </>
      ) : (
        <p className="display-4">Joining Now...</p>
      )}
    </div>
  );
}


function LobbyScreen({ setScreen }) {
  const [highlightedPlayer, setHighlightedPlayer] = useState(0);
  const [intervalTime, setIntervalTime] = useState(100); // start with 100ms
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashToggle, setFlashToggle] = useState(false);
  const [chosenSeeker, setChosenSeeker] = useState(null);

  useEffect(() => {
    if (isFlashing) {
      const flashInterval = setInterval(() => {
        setFlashToggle((prev) => !prev);
      }, 500); // Flash every 500ms

      return () => clearInterval(flashInterval);
    } else {
      const roulette = setInterval(() => {
        setHighlightedPlayer((prev) => (prev + 1) % 4);
        setIntervalTime((prev) => {
          if (prev >= 1000) {
            setIsFlashing(true);
            if (prev >= 1000) {
              setIsFlashing(true);
              setChosenSeeker(highlightedPlayer);
              clearInterval(roulette);
            }

            clearInterval(roulette);
          }
          return prev + 100;
        });
      }, intervalTime);

      return () => clearInterval(roulette);
    }
  }, [intervalTime, isFlashing, highlightedPlayer]);

  const playerEmojis = {
    "Simon": "👤",
    "Katie": "👽",
    "Hala": "👧",
    "Nayera": "👦",
    // ... Add more players and their emojis if necessary
  };

  // For simplicity, we're not fleshing out the lobby fully
  return (
    <div>
      <div className="fixed-top mt-4">
        <h1 className="display-3 fw-bold">Lobby</h1>
      </div>
      {/* Dummy player list */}
      <div className="mb-5">
        <ul className="list-unstyled display-6" style={{ paddingLeft: "15px" }}>
          {["Simon", "Katie", "Hala", "Nayera"].map(
            (player, index) => (
              <li
                key={index}
                className={
                  highlightedPlayer === index && isFlashing && flashToggle
                    ? "flash"
                    : highlightedPlayer === index
                    ? "highlighted"
                    : ""
                }
              >
                {playerEmojis[player]} {player}
                {index === 0 ? (
                  <Badge variant="secondary">You</Badge>
                ) : (
                  <Badge variant="transparent" style={{ visibility: "hidden" }}>
                    You
                  </Badge>
                )}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="seekerChosen">
        {chosenSeeker !== null && (
          <span className="display-6" style={{ color: "red" }}>
            Player {highlightedPlayer + 1} is the Seeker
          </span>
        )}
      </div>

      <Button
        variant="warning"
        className="mr-2 invisibleButton"
        onClick={() => setScreen("hider")}
        style={{ opacity: 0 }}
        onMouseOver={(e) => (e.target.style.opacity = 0.5)}
        onMouseOut={(e) => (e.target.style.opacity = 0)}
      >
        Start as Hider
      </Button>
      <Button
        variant="danger"
        className="invisibleButton"
        onClick={() => setScreen("seeker")}
        style={{ opacity: 0 }}
        onMouseOver={(e) => (e.target.style.opacity = 0.5)}
        onMouseOut={(e) => (e.target.style.opacity = 0)}
      >
        Start as Seeker
      </Button>

      <div className="mb-4">
        <div className="mt-4 mb-2">Choose Game Length:</div>
        <ButtonGroup aria-label="Game Lengths">
          <Button variant="outline-primary">5 mins</Button>
          <Button variant="outline-primary">7 mins</Button>
          <Button variant="outline-primary">10 mins</Button>
        </ButtonGroup>

        <div className="mt-3">
          <Button variant="success" size="lg">
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}

function HiderScreen({ setScreen }) {
  const [score, setScore] = useState(0);
  const [isFound, setIsFound] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFound) setScore((prevScore) => prevScore + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFound]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleGiveUp = () => {
    setIsFound(true);
  };

  const [players, setPlayers] = useState([
    { id: 1, icon: "👤", found: false },
    { id: 2, icon: "👽", found: false },
    { id: 3, icon: "👦", found: false },
    { id: 4, icon: "👧", found: false },
  ]);

  const handlePlayerClick = (playerId) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, found: true } : player
      )
    );
  };

  const tauntSound = new Audio(process.env.PUBLIC_URL + '/Mario-coin-sound.mp3');


  const playTauntSound = () => {
    tauntSound.play();
  }

  const increaseScore = () => {
    setScore(prevScore => prevScore + 20);
  }

  const handleTaunt = () => {
    playTauntSound();
    increaseScore();
  }


    // Step 1: Exclude the first player (for demo reasons)
const remainingPlayers = players.slice(1);

// Step 2: Generate random scores for the remaining players
remainingPlayers.forEach(player => {
    player.displayScore = Math.floor(Math.random() * 300);
});

  return (
    <div>
      {isFound ? (
        <Alert variant="success">
          <Alert.Heading className="display-4">You've been found!</Alert.Heading>
          <p className="display-6">Your Score: {score}</p>
        
        <ul className="list-unstyled">
          <li className="scoreBoardList">Your Friend's Scores:</li>
            {remainingPlayers.map(player => (
                <li key={player.id} className="scoreBoardList">
                    {player.icon} {player.displayScore} pts
                </li>
            ))}
        </ul>
          <Button size='lg' onClick={() => setScreen("menu")}>Return to Main Menu</Button>
        </Alert>
      ) : (
        <div>
          <div className="fixed-top mt-4">
            <h1 className="display-3 fw-bold">Hide!</h1>
            <p className="display-4">Score: {score}</p>
            {showAlert && (
              <Alert variant="info">
                <p className="fs-4">Get the highest score by hiding for as long as possible!</p>
              </Alert>
            )}
          </div>
          <div className="players">
            {players
              .filter((player) => !player.found)
              .map((player) => (
                <span
                  key={player.id}
                  className="player-icon"
                  onClick={() => handlePlayerClick(player.id)}
                >
                  {player.icon}
                </span>
              ))}
          </div>
          <div>
          <Button size="lg" onClick={handleTaunt} className="mt-5">
        Taunt <br /> (+20pts)
      </Button>
          </div>
          <div className="fixed-bottom mb-3">
            <Button size='lg' variant="dark" className="mt-2" onClick={handleGiveUp}>
              Give up
            </Button>{" "}
            {/* "Give up" button */}
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
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      if (score > 0) setScore((prevScore) => prevScore - 1);
      if (score === 0) setIsGameOver(true);
    }, 1000);

    return () => clearInterval(scoreInterval);
  }, [score]);

  useEffect(() => {
    if (hintDuration && hintDuration > 0) {
      const countdown = setInterval(() => {
        setHintDuration((prevDuration) => prevDuration - 10);
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
        setHint((prevHint) => (prevHint === "🔥" ? "❄️" : "🔥"));
      }, 3500);

      return () => clearInterval(toggleHint);
    }
  }, [hint]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleHintClick = () => {
    if (score >= 40) {
      setScore((prevScore) => prevScore - 40);
      setHint("🔥");
      setHintDuration(10000);
    }
  };

  const handleGiveUp = () => {
    setScore(0);
    setIsGameOver(true);
  };

  // Initial list of players (all hiders)
  const [players, setPlayers] = useState([
    { id: 1, icon: "👤", found: false },
    { id: 2, icon: "👽", found: false },
    { id: 3, icon: "👦", found: false },
    { id: 4, icon: "👧", found: false },
  ]);

  const handlePlayerClick = (playerId) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, found: true } : player
      )
    );
  };

  // Step 1: Exclude the first player
const remainingPlayers = players.slice(1);

// Step 2: Generate random scores for the remaining players
remainingPlayers.forEach(player => {
    player.displayScore = Math.floor(Math.random() * 300);
});


  if (isGameOver) {
    return (
      <Alert variant="success">
        <p className="display-4">Game Over</p>
        <p className="display-6">Your Score: {score}</p>
        
    <ul className="list-unstyled">
      <li className="scoreBoardList">Your Friend's Scores:</li>
      <li>Your Friend's </li>
        {remainingPlayers.map(player => (
            <li key={player.id} className="scoreBoardList">
                {player.icon} {player.displayScore} pts
            </li>
        ))}
    </ul>

        <Button variant="secondary" size="lg" onClick={() => setScreen("menu")}>
          Return to Main Menu
        </Button>
      </Alert>
    );
  }

  if (hint) {
    return (
      <div>
        <h2>Hint Time Left: {(hintDuration / 1000).toFixed(1)}s</h2>
        <Alert variant={hint === "🔥" ? "danger" : "info"}>
          <span className="large-emoji">{hint}</span>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed-top mt-4">
        <h1 className="display-3 fw-bold">Seek!</h1>
        <p className="display-4">Score: {score}</p>
        {showAlert && (
          <Alert variant="info" className="mt-2">
            <p className="fs-4">Find all the hiders before your score drops to 0!</p>
          </Alert>
        )}
      </div>

      <div className="players">
        {players
          .filter((player) => !player.found)
          .map((player) => (
            <span
              key={player.id}
              className="player-icon"
              onClick={() => handlePlayerClick(player.id)}
            >
              {player.icon}
            </span>
          ))}
      </div>
      <div className="fixed-bottom mb-3">
        <div className="mb-5">
          {hint && (
            <Alert variant={hint === "🔥" ? "danger" : "info"}>
              <span className="large-emoji">{hint}</span>
            </Alert>
          )}
          <Button variant="primary" size="lg" onClick={handleHintClick}>
            Hint
            <br />
            (-40pts)
          </Button>
        </div>
        <div>
          <Button variant="dark" size="lg" onClick={handleGiveUp}>
            Give up
          </Button>
          {score === 0 && (
            <Button size='lg' onClick={() => setScreen("menu")} className="mt-2">
              Return to Main Menu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
