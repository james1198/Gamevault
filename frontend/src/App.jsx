import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [game, setGame] = useState([])
  const [gameTitle, setGameTitle] = useState('')
  const [gameGenre, setGameGenre] = useState('')
const [gamePlatform, setGamePlatform] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editedGames, setEditedGames] = useState({})
  function handleGameEdit(gameId, field, value) {
    setEditedGames((previousEdits) => ({
      ...previousEdits,
      [gameId]: {
        ...previousEdits[gameId],
        [field]: value,
      },
    }))
  }

function addGame() {
  console.log('Add Game button clicked')

  if (gameTitle.trim() === '') {
    return
  }

    const newGame = {
      title: gameTitle.trim(),
      genre: gameGenre.trim(),
      platform: gamePlatform.trim(),
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
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add game')
        }
        return response.json()
      })
      .then((createdGame) => {
        setGame((games) => [...games, createdGame])
        setGameTitle('')
        setGameGenre('')
        setGamePlatform('')
      })
      .catch((error) => console.error('Failed to add game:', error))
  }

  async function deleteGame(gameId) {
    const confirm = window.confirm('Are you sure you want to delete this game?')
    if (!confirm) return
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

  async function saveGameChanges(gameId) {
    const changes = editedGames[gameId]
    if (!changes) return
    if (
      changes.rating !== undefined &&
      changes.rating !== null &&
      (!Number.isInteger(changes.rating) ||
        changes.rating < 1 ||
        changes.rating > 10)
    ) {
      alert('Rating must be a whole number between 1 and 10')
      return
    }

    let saved = false
    try {
      saved = await updateGame(gameId, changes)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Could not connect to the server')
    }

    if (!saved) return
    setEditedGames((previousEdits) => {
      const { [gameId]: _, ...remainingEdits } = previousEdits
      return remainingEdits
    })
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
  return false
}

    const serverUpdatedGame = await response.json()
    setGame((previousGames) =>
      previousGames.map((currentGame) =>
        currentGame.id === gameId ? serverUpdatedGame : currentGame,
      ),
    )
    return true
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
      <input
        type="text"
        value={gameGenre}
        onChange={(event) => setGameGenre(event.target.value)}
        placeholder="Game genre"
      />
      <input
        type="text"
        value={gamePlatform}
        onChange={(event) => setGamePlatform(event.target.value)}
        placeholder="Game platform"
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
              value={editedGames[currentGame.id]?.genre ?? currentGame.genre ?? ''}
              disabled={!editMode}
              onChange={(event) =>
                handleGameEdit(currentGame.id, 'genre', event.target.value)
              }
              placeholder="Genre"
            />

            <input
              type="text"
              value={editedGames[currentGame.id]?.platform ?? currentGame.platform ?? ''}
              disabled={!editMode}
              onChange={(event) =>
                handleGameEdit(currentGame.id, 'platform', event.target.value)
              }
              placeholder="Platform"
            />

            <p>
              Status: {editedGames[currentGame.id]?.status ?? currentGame.status}
            </p>

            <input
              type="number"
              min="1"
              max="10"
              value={
              editedGames[currentGame.id]?.rating !== undefined
                ? (editedGames[currentGame.id].rating ?? '')
                : (currentGame.rating ?? '')
            }
              disabled={!editMode}
              onChange={(event) =>
                handleGameEdit(
                  currentGame.id,
                  'rating',
                  event.target.value === '' ? null : Number(event.target.value),
                )
              }
              placeholder="Rating"
            />

            <select
              value={editedGames[currentGame.id]?.status ?? currentGame.status}
              disabled={!editMode}
              onChange={(event) =>
              handleGameEdit(currentGame.id, 'status', event.target.value)
              }
            >
              <option value="Want to Play">Want to Play</option>
              <option value="Currently Playing">Currently Playing</option>
              <option value="Completed">Completed</option>
            </select>

            {editMode && (
              <button onClick={() => deleteGame(currentGame.id)}>Delete</button>
            )}
            {editMode && (
              <button onClick={() => saveGameChanges(currentGame.id)}>Save</button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
