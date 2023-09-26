import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Alert, Badge } from "react-bootstrap";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("menu");

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
      <h1 className="display-4">Hide and Seek</h1>
      <p className="lead">A fun game to play.</p>{" "}
      {/* Optional tagline or instructions */}
      <Button variant="primary" onClick={() => setScreen("choice")}>
        Play
      </Button>
    </div>
  );
}

function ChoiceScreen({ setScreen }) {
  return (
    <div>
      <Button
        variant="success"
        className="mr-2"
        size="lg"
        onClick={() => setScreen("lobby")}
      >
        Create Game
      </Button>
      <Button variant="info" size="lg">
        Join Game
      </Button>
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
    "Player 1": "👤",
    "Player 2": "👽",
    "Player 3": "👦",
    "Player 4": "👧",
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
        <ul className="list-unstyled display-6" style={{ paddingLeft: '15px' }}>
          {["Player 1", "Player 2", "Player 3", "Player 4"].map(
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
        className="mr-2"
        onClick={() => setScreen("hider")}
        style={{ visibility: "hidden", fontSize: "1.5em" }}
      >
        Start as Hider
      </Button>
      <Button
        variant="danger"
        onClick={() => setScreen("seeker")}
        style={{ visibility: "hidden", fontSize: "1.5em" }}
      >
        Start as Seeker
      </Button>
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

  return (
    <div onClick={() => !isFound && setIsFound(true)}>
      {isFound ? (
        <Alert variant="success">
          <Alert.Heading>You've been found!</Alert.Heading>
          <p>Score: {score}</p>
          <Button onClick={() => setScreen("menu")}>Return to Main Menu</Button>
        </Alert>
      ) : (
        <div>
          <div className="fixed-top mt-4">
            <h1 className="display-3 fw-bold">Hide!</h1>
            <p className="display-4">Score: {score}</p>
            {showAlert && (
              <Alert variant="info">
                Get the highest score by hiding for as long as possible!
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
            <Button variant="dark" className="mt-2" onClick={handleGiveUp}>
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

  if (isGameOver) {
    return (
      <Alert variant="success">
        Game Over <br />
        Score: {score} <br />
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
            Find all the hiders before your score drops to 0!
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
            <Button onClick={() => setScreen("menu")} className="mt-2">
              Return to Main Menu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
