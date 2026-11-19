import { useState, useEffect } from 'react'
import { loadGames, findGame } from './algorithms/gameArray'
import { HashTable } from './algorithms/hashTableChaining'
import { linearHashTable } from './algorithms/hashTableLinear'
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker'

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
  function testArraySearch(gameId) {
    if (game.length === 0) {
      console.log('no game available to search') 
      return
    }
    const firstGameId = game[0].id
    const result = findGame(firstGameId)
    console.log('DSA array search result:', result)
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
      .then((games) => {
        setGame(games)
      })
      .catch((error) => console.error('Failed to fetch games:', error))
  }, [])
  useEffect(() => {
    loadGames(game)
    const hashTable = new HashTable(Math.max(5, game.length * 2))
    game.forEach((currentGame) => {
      hashTable.set(currentGame.id, currentGame)
    })
    console.log('chaining hash table:', hashTable)
    console.log('Games in Hash Table:', hashTable.getAllGames())
    if (game.length > 0) {
      console.log('Chaining Search Result:', hashTable.get(game[0].id))
    }
    const linearTable = new linearHashTable(Math.max(5, game.length * 2 + 1))
    game.forEach((currentGame) => {
      linearTable.set(currentGame.id, currentGame)
    })
    console.log('Linear Probing Table:', linearTable.getAllGames())
    if (game.length > 0) {
      console.log('Linear Probing Search Result:', linearTable.get(game[0].id))
    }
    if (game.length > 0) {
      const searchId = game[0].id

        const repetitions = 10000

        const chainingStart = performance.now()
        for (let i = 0; i < repetitions; i++) {
          hashTable.get(searchId)
        }
        const chainingEnd = performance.now()

        const linearStart = performance.now()
        for (let i = 0; i < repetitions; i++) {
          linearTable.get(searchId)
        }
        const linearEnd = performance.now()
      
        console.log('Chaining search time:', chainingEnd - chainingStart, 'ms')
        console.log('Linear probing search time:', linearEnd - linearStart, 'ms')
      }
  }, [game])

    return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0f172a' }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#38bdf8',
          marginBottom: 15,
        }}
      >
        GameVault
      </Text>
      <Pressable onPress={() => setEditMode(!editMode)}>
        <Text>
          {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
        </Text>
      </Pressable>


      <Text>Welcome to GameVault, your ultimate game collection manager.</Text>
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Games</Text>
          <Text style={styles.statValue}>{game.length}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Currently Playing</Text>
          <Text style={styles.statValue}>{playingGames}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Completed</Text>
          <Text style={styles.statValue}>{completedGames}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Incomplete</Text>
          <Text style={styles.statValue}>{game.length - completedGames - playingGames}</Text>
        </View>
      </View>

      <TextInput
        value={gameTitle}
        onChangeText={setGameTitle}
        placeholder="Game title"
          style={{
          borderWidth: 1,
          borderColor: '#999',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />
            <TextInput
        value={gameGenre}
        onChangeText={setGameGenre}
        placeholder="Game genre"
        style={{
          borderWidth: 1,
          borderColor: '#999',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />
              <TextInput
          value={gamePlatform}
          onChangeText={setGamePlatform}
          placeholder="Game platform"
          style={{
            borderWidth: 1,
            borderColor: '#999',
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        />
      <Pressable onPress={addGame}>
        <Text>Add Game</Text>
      </Pressable>

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search games"
        style={{
          borderWidth: 1,
          borderColor: '#999',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Pressable onPress={() => setSearchTerm('')}>
        <Text>Clear Search</Text>
      </Pressable>

      <Text>Current Game Title: {gameTitle}</Text>

      <View style={styles.gamesGrid}>
        {filteredGames.map((currentGame) => (
          <View style={styles.gameCard} key={currentGame.id}>
            <Text style={styles.gameTitle}>{currentGame.title}</Text>

            <TextInput
              value={editedGames[currentGame.id]?.genre ?? currentGame.genre ?? ''}
              editable={editMode}
              onChangeText={(value) =>
                handleGameEdit(currentGame.id, 'genre', value)
              }
              placeholder="Genre"
              style={{
                borderWidth: 1,
                borderColor: '#999',
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />

            <TextInput
              value={editedGames[currentGame.id]?.platform ?? currentGame.platform ?? ''}
              editable={editMode}
              onChangeText={(value) =>
                handleGameEdit(currentGame.id, 'platform', value)
              }
              placeholder="Platform"
              style={{
                borderWidth: 1,
                borderColor: '#999',
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />

            <Text>
              Status: {editedGames[currentGame.id]?.status ?? currentGame.status}
            </Text>
            <TextInput
              value={String(
                editedGames[currentGame.id]?.rating !== undefined
                  ? (editedGames[currentGame.id].rating ?? '')
                  : (currentGame.rating ?? '')
              )}
              editable={editMode}
              keyboardType="numeric"
              onChangeText={(value) =>
                handleGameEdit(
                  currentGame.id,
                  'rating',
                  value === '' ? null : Number(value)
                )
              }
              placeholder="Rating (1-10)"
              style={{
                borderWidth: 1,
                borderColor: '#999',
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />

            <View>
              <Text>Status:</Text>
              <Picker
                selectedValue={editedGames[currentGame.id]?.status ?? currentGame.status}
                disabled={!editMode}
                onValueChange={(value) => handleGameEdit(currentGame.id, 'status', value)}
              >
                <Picker.Item label="Want to Play" value="Want to Play" />
                <Picker.Item label="Currently Playing" value="Currently Playing" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

            {editMode && (
              <Pressable onPress={() => deleteGame(currentGame.id)}>
                <Text>Delete</Text>
              </Pressable>
            )}
            {editMode && (
              <Pressable onPress={() => saveGameChanges(currentGame.id)}>
                <Text>Save</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default App

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
  },
  statCard: {
    padding: 12,
    margin: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 22,
  },
  gamesGrid: {
    marginTop: 15,
  },
  gameCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})