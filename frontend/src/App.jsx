import { useEffect, useState, useRef } from 'react'
import {
  Alert, Animated, Platform, Pressable, Linking,
  ScrollView, StyleSheet, Text, TextInput,
  useWindowDimensions, View
} from 'react-native'
import {
  SafeAreaView,
  SafeAreaProvider
} from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { loadGames, findGame } from './algorithms/gameArray'
import { HashTable } from './algorithms/hashTableChaining'
import { linearHashTable } from './algorithms/hashTableLinear'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import GameStoreMap from './GameStoreMap'
import Constants, { ExecutionEnvironment } from 'expo-constants'


const API = Platform.OS === 'web'
  ? 'http://localhost:5000'
  : 'http://10.0.0.243:5000'
const BACKGROUND_LOCATION_TASK = 'GameVault-Background-Location'

if  (Platform.OS !== 'web') {
  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
    if (error) {
      console.log('Background location task error:', error)
      return
    }

    const latestlocation = data?.locations?.[0]
    if (latestlocation) {
      console.log('Background location:', 
        latestlocation.coords.latitude, 
        latestlocation.coords.longitude)
    }
  })
}


function Button({ title, onPress, type = 'primary' }) {
  const scale = useRef(new Animated.Value(1)).current

  function animatedButton(vaule) {
    Animated.spring(scale, {
      toValue: value,
      friction: 5,
      tension: 150,
      useNativeDriver: Platform.OS !== 'web'
    }).start()
  }


  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateButton(0.95)}
        onPressOut={() => animateButton(1)}
        style={[styles.button, styles[type]]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </Animated.View>
  )
}

function Field({ value, onChangeText, placeholder, editable = true }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#aabbd3"
      editable={editable}
      style={[styles.input, !editable && styles.disabled]}
    />
  )
}

export default function App() {
  const { width } = useWindowDimensions()
  const wide = width > 900
  const scrollRef = useRef(null)
  const gamesPosition = useRef(0)
  const pendingGamesLink = useRef(false)
  const chainingRef = useRef(null)
  const linearRef = useRef(null)
  const [games, setGames] = useState([])
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [platform, setPlatform] = useState('')
  const [search, setSearch] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [edits, setEdits] = useState({})
  const [location, setLocation] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [nearbyStores, setNearbyStores] = useState([])
  const [loadingStores, setLoadingStores] = useState(false)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    function handleDeepLink(event) {

      if (event.url.startsWith('gamevault://')) {
        notify('GameVault opened via deep link: ' + event.url)

        if (event.url.startsWith('gamevault://games')) {
          pendingGamesLink.current = true

          if (scrollRef.current && gamesPosition.current > 0) {
            scrollRef.current.scrollTo({
              y: gamesPosition.current,
              animated: true
            })

            pendingGamesLink.current = false
          }
        }
      }
    }

    const subscription = Linking.addEventListener('url', handleDeepLink)
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url })
    })

    return () => subscription.remove()
  }, [])
  const titleOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: Platform.OS !== 'web'
    }).start()
  }, [titleOpacity])

  function notify(message) {
    if (Platform.OS === 'web') globalThis.alert(message)
    else Alert.alert('GameVault', message)
  }

  async function getCurrentLocation() {
    setLoadingLocation(true)

    try {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        notify('Location permission denied')
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      })

      setLocation(currentLocation.coords)
    } catch (error) {
      notify('Unable to get location')

    } finally {
      setLoadingLocation(false)
    }
  }

async function startBackgroundTracking() {
  if (Platform.OS === 'web') {
    return notify('Background tracking requires an iOS development build.')
  }

if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
  return notify(
    'Background tracking requires a development build, not Expo Go.'
  )
}

  try {
    const foreground = await Location.requestForegroundPermissionsAsync()

    if (foreground.status !== 'granted') {
      return notify('Foreground location permission is required.')
    }

    const background = await Location.requestBackgroundPermissionsAsync()

    if (background.status !== 'granted') {
      return notify('Background location permission is required.')
    }

    await Location.startLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK,
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 100,
        showsBackgroundLocationIndicator: true
      }
    )

    setIsTracking(true)
    notify('Background tracking started.')
  } catch (error) {
    notify('Unable to start tracking: ' + error.message)
  }
}

async function stopBackgroundTracking() {
  try {
    const running = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK
    )

    if (running) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
    }

    setIsTracking(false)
    notify('Background tracking stopped.')
  } catch (error) {
    notify('Unable to stop tracking: ' + error.message)
  }
}


  async function fetchNearbyStores() {
    if (!location) {
      return notify('Please get your location first')
    }

    setLoadingStores(true)

    try {
     const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 15000)

const url = `https://nominatim.openstreetmap.org/search?format=json&q=video%20game%20store&viewbox=${location.longitude - 0.2},${location.latitude + 0.2},${location.longitude + 0.2},${location.latitude - 0.2}&bounded=1&limit=10`

const response = await fetch(url, {
  signal: controller.signal,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'GameVault-StudentProject/1.0'
  }
}).finally(() => clearTimeout(timeout))

if (!response.ok) {
  throw new Error('Store search failed')
}

const data = await response.json()

const stores = data.map(store => ({
  id: store.place_id,
  name: store.display_name.split(',')[0],
  latitude: Number(store.lat),
  longitude: Number(store.lon)
}))

setNearbyStores(stores)

if (stores.length === 0) {
  notify('No nearby game stores found')
}

    } catch (error) {
      notify('Store search error: ' + error.message)
    } finally {
      setLoadingStores(false)
    }
  }
        

  useEffect(() => {
    fetch(`${API}/api/games`)
      .then(res => {
        if (!res.ok) throw Error('Unable to load games')
        return res.json()
      })
      .then(setGames)
      .catch(() => notify('Unable to load games'))
  }, [])


  useEffect(() => {
    loadGames(games)

    chainingRef.current = new HashTable(Math.max(5, games.length * 2))
    linearRef.current = new linearHashTable(Math.max(5, games.length * 2 + 1))

    games.forEach(game => {
      chainingRef.current.set(game.id, game)
      linearRef.current.set(game.id, game)
    })
  }, [games])

  async function request(path, method = 'GET', data) {
    const response = await fetch(`${API}/api/games${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(data !== undefined ? { body: JSON.stringify(data) } : {})
    })

    if (!response.ok) throw Error(`Request failed: ${method}`)
    return method === 'DELETE' ? null : response.json()
  }

  async function addGame() {
    if (!title.trim()) return notify('Enter a game title')

    try {
      const created = await request('', 'POST', {
        title: title.trim(),
        genre: genre.trim(),
        platform: platform.trim(),
        status: 'Want to Play',
        rating: 1
      })

      setGames(previous => [...previous, created])
      setTitle('')
      setGenre('')
      setPlatform('')
    } catch {
      notify('Unable to add game')
    }
  }

  function editGame(id, field, value) {
    setEdits(previous => ({
      ...previous,
      [id]: { ...previous[id], [field]: value }
    }))
  }

  async function saveGame(id) {
    const changes = edits[id]
    if (!changes) return

    if (changes.rating != null &&
        (!Number.isInteger(changes.rating) ||
         changes.rating < 1 || changes.rating > 10)) {
      return notify('Rating must be a whole number from 1 to 10')
    }

    const original = chainingRef.current?.get(id)
    if (!original) return

    try {
      const updated = await request(`/${id}`, 'PUT', {
        ...original, ...changes
      })

      setGames(previous =>
        previous.map(game => game.id === id ? updated : game)
      )

      setEdits(previous => {
        const remaining = { ...previous }
        delete remaining[id]
        return remaining
      })
    } catch {
      notify('Unable to save changes')
    }
  }

    async function deleteGame(id) {
      const game = linearRef.current?.get(id)

      if (!game) return notify('Game not found')

      try {
      await request(`/${id}`, 'DELETE')
      setGames(previous => previous.filter(game => game.id !== id))
    } catch {
      notify('Unable to delete game')
    }
  }

  function confirmDelete(id) {
    const game = findGame(id)
    if (!game) return notify('Game not found')
    if (Platform.OS === 'web') {
      if (globalThis.confirm(`Delete ${game.title}?`)) deleteGame(id)
    } else {
      Alert.alert('Delete Game', `Delete ${game.title}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive',
          onPress: () => deleteGame(id) }
      ])
    }
  }

  const completed = games.filter(g => g.status === 'Completed').length
  const playing = games.filter(g => g.status === 'Currently Playing').length
  const filtered = games.filter(g =>
    (g.title || '').toLowerCase().includes(search.toLowerCase())
  )

  const statistics = [
    ['Total Games', games.length],
    ['Currently Playing', playing],
    ['Completed', completed],
    ['Incomplete', games.length - completed - playing]
  ]


  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.screen}>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.Text 
        style={[styles.title, { opacity: titleOpacity }]}>
          GameVault
        </Animated.Text>
        <Text style={styles.subtitle}>
          Your ultimate game collection manager
        </Text>

        <Button
          title={loadingLocation ? 'Loading Location...' : 'Get Current Location'}
          onPress={getCurrentLocation}
        />

        <View style={{ width: '100%', maxWidth: 700 }}>
          <Button
            title="Start Background Tracking"
            onPress={startBackgroundTracking}
          />

          <Button
            title="Stop Background Tracking"
            onPress={stopBackgroundTracking}
          />

          <Text style={styles.subtitle}>
            Tracking: {isTracking ? 'Active' : 'Inactive'}
          </Text>
        </View>


        {location && (
          <View style={styles.section}>
            <Text style={styles.heading}>Current Location</Text>

            <Text style={styles.subtitle}>
              Latitude: {location.latitude}
              </Text>
            <Text style={styles.subtitle}>
               longitude: {location.longitude}
            </Text>
          </View>
        )}

        <Button
          title={loadingStores ? 'Searching...' : 'Find Nearby Game Stores'}
          onPress={fetchNearbyStores}
        />

        {location && (
          <View style={styles.section}>
            <Text style={styles.heading}>
              Nearby Game Stores Map
            </Text>
            <GameStoreMap
              location={location}
              nearbyStores={nearbyStores}
            />
          </View>
        )}

        

          {nearbyStores.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.heading}>Nearby Game Stores</Text>

        {nearbyStores.map(store => (
          <View key={store.id}>
            <Text style={styles.label}>{store.name}</Text>

            <Text style={styles.subtitle}>
              Latitude: {store.latitude}
            </Text>

            <Text style={styles.subtitle}>
              Longitude: {store.longitude}
            </Text>
          </View>
        ))}
      </View>
    )}

        <Button
          title={editMode ? 'Exit Edit Mode' : 'Edit Mode'}
          onPress={() => setEditMode(!editMode)}
        />

        {/* Statistics */}
        <View style={styles.stats}>
          {statistics.map(([label, value]) => (
            <View
              key={label}
              style={[styles.statCard, {
                width: wide ? '22%' : '46%'
              }]}
            >
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statNumber}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Add Game */}
        <View style={styles.section}>
          <Text style={styles.heading}>Add a Game</Text>

          <Field value={title} onChangeText={setTitle}
            placeholder="Game title" />
          <Field value={genre} onChangeText={setGenre}
            placeholder="Genre" />
          <Field value={platform} onChangeText={setPlatform}
            placeholder="Platform" />

          <Button title="Add Game" onPress={addGame} />
        </View>

        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.heading}>Your Games</Text>

          <Field value={search} onChangeText={setSearch}
            placeholder="Search games" />

          {search.length > 0 && (
            <Button title="Clear Search"
              type="secondary" onPress={() => setSearch('')} />
          )}

          <Text style={styles.subtitle}>
            {filtered.length} {filtered.length === 1 ? 'game' : 'games'}
          </Text>
        </View>

        {/* Game Collection */}  
        <View
          style={styles.gamesGrid}
          onLayout={(layoutEvent) => {
            gamesPosition.current = layoutEvent.nativeEvent.layout.y

            if (pendingGamesLink.current) {
              scrollRef.current?.scrollTo({
                y: gamesPosition.current,
                animated: true
              })

              pendingGamesLink.current = false
            }
          }}
        >

          {filtered.length === 0 && (
            <Text style={styles.subtitle}>
              {search ? 'No matching games.' : 'Your library is empty.'}
            </Text>
          )}

          {filtered.map(game => {
            const current = { ...game, ...edits[game.id] }

            return (
              <View
                key={game.id}
                style={[styles.gameCard, {
                  width: wide ? '48%' : '100%'
                }]}
              >
                <Text style={styles.gameTitle}>{game.title}</Text>

                <Text style={styles.label}>Genre</Text>
                <Field
                  value={current.genre ?? ''}
                  editable={editMode}
                  onChangeText={v => editGame(game.id, 'genre', v)}
                  placeholder="Genre"
                />

                <Text style={styles.label}>Platform</Text>
                <Field
                  value={current.platform ?? ''}
                  editable={editMode}
                  onChangeText={v => editGame(game.id, 'platform', v)}
                  placeholder="Platform"
                />

                <Text style={styles.label}>Rating (1–10)</Text>
                <Field
                  value={String(current.rating ?? '')}
                  editable={editMode}
                  onChangeText={v => editGame(game.id, 'rating',
                    v === '' ? null : Number(v))}
                  placeholder="Rating"
                />

                <Text style={styles.label}>Status</Text>
                <Text style={styles.status}>{current.status}</Text>

                <Picker
                  selectedValue={current.status}
                  enabled={editMode}
                  onValueChange={v => editGame(game.id, 'status', v)}
                  style={styles.picker}
                >
                  <Picker.Item label="Want to Play" value="Want to Play" />
                  <Picker.Item label="Currently Playing"
                    value="Currently Playing" />
                  <Picker.Item label="Completed" value="Completed" />
                </Picker>

                {editMode && (
                  <View style={styles.actions}>
                    <Button title="Delete" type="danger"
                      onPress={() => confirmDelete(game.id)} />
                    <Button title="Save"
                      onPress={() => saveGame(game.id)} />
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1220' },
  container: {
    alignItems: 'center', alignSelf: 'center',
    width: '100%', maxWidth: 1200,
    padding: 20, paddingBottom: 50
  },
  title: {
    color: '#fff', fontSize: 42,
    fontWeight: 'bold', textAlign: 'center', marginTop: 20
  },
  subtitle: {
    color: '#fff', fontSize: 15,
    textAlign: 'center', marginVertical: 12
  },
  heading: {
    color: '#fff', fontSize: 23,
    fontWeight: 'bold', textAlign: 'center', marginBottom: 15
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 22,
    alignItems: 'center', margin: 5, minHeight: 44
  },
  primary: { backgroundColor: '#4361ee' },
  secondary: { backgroundColor: '#24314b' },
  danger: { backgroundColor: '#6b3541' },
  buttonText: {
    color: '#fff', fontWeight: 'bold',
    fontSize: 15, textAlign: 'center'
  },
  stats: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', width: '100%',
    maxWidth: 900, marginVertical: 20
  },
  statCard: {
    backgroundColor: '#172238', borderRadius: 12,
    borderWidth: 1, borderColor: '#2c3e57',
    padding: 15, margin: 5, minWidth: 130,
    flexGrow: 1, alignItems: 'center'
  },
  statLabel: {
    color: '#fff', fontSize: 14,
    fontWeight: '600', textAlign: 'center'
  },
  statNumber: {
    color: '#fff', fontSize: 30,
    fontWeight: 'bold', marginTop: 8
  },
  section: {
    width: '100%', maxWidth: 700,
    backgroundColor: '#111a2b',
    borderRadius: 14, padding: 18, marginBottom: 20
  },
  input: {
    backgroundColor: '#24314b', color: '#fff',
    borderColor: '#3b4d6b', borderWidth: 1,
    borderRadius: 8, padding: 12,
    fontSize: 16, marginVertical: 6, width: '100%'
  },
  disabled: { backgroundColor: '#1b263a' },
  gamesGrid: {
    width: '100%', flexDirection: 'row',
    flexWrap: 'wrap', justifyContent: 'center', gap: 16
  },
  gameCard: {
    backgroundColor: '#172238', borderRadius: 14,
    borderWidth: 1, borderColor: '#2c3e57',
    padding: 18, gap: 8
  },
  gameTitle: {
    color: '#fff', fontSize: 21,
    fontWeight: 'bold', textAlign: 'center'
  },
  label: { color: '#fff', fontSize: 14 },
  status: { color: '#fff', textAlign: 'center' },
  picker: {
    color: '#fff', backgroundColor: '#24314b',
    width: '100%'
  },
  actions: {
    flexDirection: 'row', justifyContent: 'center',
    flexWrap: 'wrap', marginTop: 10
  }
})

