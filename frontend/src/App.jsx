import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [game, setGame] = useState([
    {
      title: "Minecraft",
      genre: "Sandbox",
      platform: "PC",
      status: "Want to Play",
      rating: 9
    },
    {
      title: "The Legend of Zelda: Breath of the Wild",
      genre: "Action-Adventure",
      platform: "Nintendo Switch",
      status: "Want to Play",
      rating: 10
    },
    {
      title: "Fortnite",
      genre: "Battle Royale",
      platform: "PC",
      status: "Want to Play",
      rating: 8
    }
  ])
  const [gameTitle, setGameTitle] = useState("")
  function addGame() {
    if (gameTitle.trim() === "") {
      return
    }
    const newGame = {
      title: gameTitle,
      genre: "Unknown",
      platform: "",
      status: "Want to Play",
      rating: 1
    }
    console.log("Sending game:", newGame)
    fetch("http://localhost:5000/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newGame)
    })
      .then((response) => response.json())
      .then((game) => setGame((games) => [...games, game]))
    setGameTitle("")
  }
  function deleteGame(indexToDelete) {
    setGame((game) => game.filter((_, index) => index !== indexToDelete))
  }
  function updateGameStatus(indexToUpdate, newStatus) {
    const updatedGame = game.map((game, index) =>
      index === indexToUpdate ? { ...game, status: newStatus } : game
    )
    setGame(updatedGame)
  }
  const [searchTerm, setSearchTerm] = useState("")
  const filteredGames = game.filter((game) =>
    (game.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  )
  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((response) => response.json())
      .then((games) => setGame(games))
  }, [])

  return (
    <>
      <h1>GameVault</h1>
      <p>Welcome to GameVault, your ultimate game collection manager.</p>
      <h2>My Games: {game.length}</h2>
      <input
        type="text"
        value={gameTitle}
        onChange={(event) => setGameTitle(event.target.value)}
        placeholder="Game title"
      />
      <button onClick={addGame}>Add Game</button>
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search games"
      />
      <button onClick={() => setSearchTerm("")}>Clear Search</button>
      <p>Current Game Title: {gameTitle}</p>
      {filteredGames.map((game, index) => (
        <div className="game-card" key={game.id}>
          <h3>{game.title}</h3>
          <p>Genre: {game.genre}</p>
          <p>Platform: {game.platform}</p>
          <p>Status: {game.status}</p>
          <p>Rating: {game.rating}</p>
          <button onClick={() => deleteGame(index)}>Delete Game</button>
          <select
            value={game.status}
            onChange={(event) =>
              updateGameStatus(index, event.target.value)
            }
          >
            <option value="Want to Play">Want to Play</option>
            <option value="Playing">Playing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ))}
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
