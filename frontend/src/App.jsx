import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [game, setGame] = useState([])
  const [gameTitle, setGameTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)

  function addGame() {
    if (gameTitle.trim() === '') {
      return
    }

    const newGame = {
      title: gameTitle,
      genre: 'Unknown',
      platform: '',
      status: 'Want to Play',
      rating: 1,
    }

    fetch('http://localhost:5000/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGame),
    })
      .then((response) => response.json())
      .then((createdGame) => setGame((games) => [...games, createdGame]))
      .catch((error) => console.error('Failed to add game:', error))

    setGameTitle('')
  }

  async function deleteGame(gameId) {
    const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setGame((games) => games.filter((currentGame) => currentGame.id !== gameId))
    }
  }

  async function updateStatus(gameId, newStatus) {
    const gameToUpdate = game.find((currentGame) => currentGame.id === gameId)
    if (!gameToUpdate) return

    const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...gameToUpdate, status: newStatus }),
    })

    if (!response.ok) {
      alert('Failed to update game status')
      return
    }

    const updatedGame = await response.json()
    setGame((previousGames) =>
      previousGames.map((currentGame) =>
        currentGame.id === gameId ? updatedGame : currentGame,
      ),
    )
  }

  async function updateGame(gameId, updates) {
    const gameToUpdate = game.find((currentGame) => currentGame.id === gameId)
    if (!gameToUpdate) return

    const updatedGame = { ...gameToUpdate, ...updates }
    const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGame),
    })

    if (!response.ok) {
      alert('Failed to update game')
      return
    }

    const serverUpdatedGame = await response.json()
    setGame((previousGames) =>
      previousGames.map((currentGame) =>
        currentGame.id === gameId ? serverUpdatedGame : currentGame,
      ),
    )
  }
  const completedGames = game.filter(
  (currentGame) => currentGame.status === 'Completed'
).length
  const filteredGames = game.filter((currentGame) =>
    (currentGame.title || '').toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const playingGames = game.filter(
  (currentGame) => currentGame.status === 'Currently Playing'
).length

  useEffect(() => {
    fetch('http://localhost:5000/api/games')
      .then((response) => response.json())
      .then((games) => setGame(games))
      .catch((error) => console.error('Failed to fetch games:', error))
  }, [])

  return (
    <>
      <h1>GameVault</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
      </button>

      <p>Welcome to GameVault, your ultimate game collection manager.</p>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Games</h3>
          <p>{game.length}</p>
        </div>

        <div className="stat-card">
          <h3>Currently Playing</h3>
          <p>{playingGames}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completedGames}</p>
        </div>
        <div className="stat-card">
          <h3>Incomplete</h3>
          <p>{game.length - completedGames - playingGames}</p>
        </div>
      </div>

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
      <button onClick={() => setSearchTerm('')}>Clear Search</button>

      <p>Current Game Title: {gameTitle}</p>

      <div className="games-grid">
        {filteredGames.map((currentGame) => (
          <div className="game-card" key={currentGame.id}>
            <h3>{currentGame.title}</h3>

            <input
              type="text"
              value={currentGame.genre ?? ''}
              disabled={!editMode}
              onChange={(event) =>
                updateGame(currentGame.id, { genre: event.target.value })
              }
              placeholder="Genre"
            />

            <input
              type="text"
              value={currentGame.platform ?? ''}
              disabled={!editMode}
              onChange={(event) =>
                updateGame(currentGame.id, { platform: event.target.value })
              }
              placeholder="Platform"
            />

            <p>Status: {currentGame.status}</p>

            <input
              type="number"
              min="1"
              max="10"
              value={currentGame.rating ?? ''}
              disabled={!editMode}
              onChange={(event) =>
                updateGame(currentGame.id, {
                  rating:
                    event.target.value === '' ? null : Number(event.target.value),
                })
              }
              placeholder="Rating"
            />

            <select
              value={currentGame.status}
              disabled={!editMode}
              onChange={(event) =>
                updateStatus(currentGame.id, event.target.value)
              }
            >
              <option value="Want to Play">Want to Play</option>
              <option value="Currently Playing">Currently Playing</option>
              <option value="Completed">Completed</option>
            </select>

            {editMode && (
              <button onClick={() => deleteGame(currentGame.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
