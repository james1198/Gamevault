# GameVault

GameVault is a full-stack game collection manager built with React Native, Expo, Node.js, Express, and SQLite. It also demonstrates mobile location features, external API integration, deep linking, background location updates, animations, and multiple data structures.

**Repository:** https://github.com/james1198/Gamevault

## Table of Contents

- [Course Context](#course-context)
- [Project Overview](#project-overview)
- [Features](#features)
- [Mobile and Course Requirement Alignment](#mobile-and-course-requirement-alignment)
- [Data Structures and Algorithm Analysis](#data-structures-and-algorithm-analysis)
- [Software Development and Data Analytics Alignment](#software-development-and-data-analytics-alignment)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Mobile Configuration](#mobile-configuration)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Privacy and Permissions](#privacy-and-permissions)
- [Limitations and Future Work](#limitations-and-future-work)

## Course Context

This project is intended to demonstrate course concepts related to mobile application development, application life cycles, user interfaces, data management, memory management, system services, and external web services.

The application also provides a practical final-project example for:

- Designing and implementing at least two data structures.
- Performing insertion, deletion, searching, and traversal.
- Comparing implementations of the same data structure.
- Evaluating algorithms and operations using Big O notation.
- Building and integrating a full-stack software development solution.

## Project Overview

GameVault allows a user to:

- Add games to a personal collection.
- Search and view the collection.
- Edit titles, genres, platforms, statuses, and ratings.
- Delete games.
- View collection statistics.
- Get the current device location.
- Search for nearby video game stores with an external API.
- Display the current location and nearby stores on a map.
- Start or stop background location tracking.
- Open the games section through a custom deep link.

The frontend communicates with a REST API backed by SQLite. A JavaScript array and two hash-table implementations provide in-application data structure operations and comparison logging.

## Features

### Game Collection Management

- Create, read, update, and delete games.
- Validate required titles, statuses, and ratings.
- Filter games by title.
- Display total, currently playing, completed, and incomplete counts.

### Location and Maps

- Request foreground location permission.
- Retrieve the current GPS/network location.
- Search within a 5-kilometer radius using the Overpass API.
- Display the user and nearby stores with React Native Maps.
- Support starting and stopping background location updates on a development mobile build.

### Mobile System Integration

- Custom deep link: `gamevault://games`
- Expo deep-link URL handling with `Linking`.
- Expo Task Manager background location task.
- iOS background location configuration.
- Native alerts and platform-specific behavior.

### User Interface

- Responsive layout for mobile and web.
- `Animated.Text` title fade-in effect.
- Pressable buttons, text fields, picker controls, scrolling, and structured sections.
- Platform-specific handling for alerts and deep links.

## Mobile and Course Requirement Alignment

| Requirement | GameVault Implementation |
| --- | --- |
| Device location | Uses `expo-location` to request permission and retrieve current coordinates. |
| Background service | Defines a Task Manager task and starts/stops location updates while permission is granted. |
| Broadcast intents / system events | Handles incoming `gamevault://games` deep links through Expo `Linking`; Android/iOS deep-link behavior is provided through the app scheme. |
| External API | Sends an Overpass API query to find nearby shops tagged as `video_games`. |
| Retrieved data in UI | Store names and coordinates are displayed in the interface and as map markers. |
| Animation | Uses an animated title fade-in when the application starts. |
| User interaction | Provides text inputs, a platform picker, buttons, scrolling, editing, and deletion controls. |
| Maps and location outcome | Shows the device position and nearby store markers on a map. |
| Deep-link outcome | Lets another app or browser open the games section using a custom scheme. |
| Push notifications | Push notifications are not currently implemented; native alerts provide local user feedback. |

## Data Structures and Algorithm Analysis

GameVault demonstrates an array and two hash-table collision-handling strategies.

### Implemented Structures

| Structure | File | Representation |
| --- | --- | --- |
| Dynamic array | `frontend/src/algorithms/gameArray.js` | JavaScript array of game objects |
| Hash table with chaining | `frontend/src/algorithms/hashTableChaining.js` | Fixed array of buckets; each bucket contains a linked-style array chain |
| Hash table with linear probing | `frontend/src/algorithms/hashTableLinear.js` | Fixed array containing entries or deleted-entry markers |

### Operations

- Array insertion: append a game.
- Array deletion: find the index and splice.
- Array search: linear search by game ID.
- Hash-table insertion/update: calculate a bucket, then insert or update an entry.
- Hash-table search: calculate a bucket and search the bucket or probe positions.
- Hash-table deletion: remove a chained entry or mark a linear-probing slot as deleted.
- Traversal: iterate through array values or hash-table buckets/slots.

### Complexity Analysis

Assume `n` is the number of stored games and load factor is `α = n / tableSize`.

| Operation | Array | Chaining Hash Table | Linear-Probing Hash Table |
| --- | --- | --- | --- |
| Insertion | `O(1)` average append; `O(n)` when JavaScript reallocates or shifts | `O(1)` average | `O(1)` average; may become `O(n)` under clustering/full tables |
| Deletion | `O(n)` | `O(1 + chainLength)` average; `O(n)` worst case | `O(1)` average; `O(n)` worst case |
| Search | `O(n)` | `O(1 + chainLength)` average; `O(n)` worst case | `O(1)` average; `O(n)` worst case |
| Traversal | `O(n)` | `O(tableSize + n)` | `O(tableSize)` |

Space usage:

- Array: `O(n)`.
- Chaining hash table: `O(n + tableSize)`.
- Linear-probing hash table: `O(tableSize)`.

### Implementation Comparison

The app creates both hash-table implementations from the loaded game list and executes repeated searches on the array and hash tables. Results are printed to the console. Chaining generally handles collisions by keeping multiple entries in one bucket, while linear probing stores entries directly in table slots and searches subsequent positions when necessary.

Linear probing can become slower when many entries collide. Chaining usually handles this more gracefully, but allocates additional bucket/entry objects. The array is simplest and avoids hash and collision logic, but searches require a linear scan.

## Software Development and Data Analytics Alignment

### Software Development

- React Native and Expo mobile/web frontend.
- Node.js and Express REST API.
- SQLite persistence.
- External API integration.
- Location and background system services.
- GitHub source control and reproducible npm setup.

### Business and Data Analytics

GameVault provides basic collection data that could support future EDA or dashboard features, including game counts by status, title search, platform, genre, and rating. A production analytics extension could clean and export SQLite records into SQL, Pandas, Power BI, or Tableau.

### Artificial Intelligence

The current project does not contain a machine-learning model or inference API. A future recommendation feature could use collection metadata to suggest games or predict user interests.

## Technology Stack

### Frontend

- React 19
- React Native 0.88
- Expo 58
- Expo Location
- Expo Task Manager
- React Native Maps
- React Native Picker
- React Native Safe Area Context

### Backend

- Node.js
- Express 5
- `better-sqlite3`
- CORS
- Vitest

### External Data

- OpenStreetMap Overpass API for nearby `shop=video_games` locations.

## Project Structure

```text
Gamevault/
├── backend/
│   ├── database.js          # SQLite connection and table creation
│   ├── server.js            # Express REST API
│   ├── validation.test.js   # Input validation tests
│   └── gamevault.db         # SQLite database
├── frontend/
│   ├── app.json             # Expo and iOS configuration
│   └── src/
│       ├── App.jsx          # Main application UI and services
│       ├── GameStoreMap.jsx # Native map component
│       ├── GameStoreMap.web.jsx
│       └── algorithms/      # Array and hash-table implementations
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Expo CLI access through `npx`
- A simulator/device, or a modern browser for web testing
- A development build for background location tracking; Expo Go may not support all required native behavior

### 1. Start the Backend

From the repository root:

```powershell
cd backend
npm install
npm start
```

The API listens on `0.0.0.0:5000`. It is available locally at:

```text
http://localhost:5000
```

Check the health endpoint:

```text
http://localhost:5000/api/health
```

### 2. Configure the Frontend API Address

The frontend currently selects:

- `http://localhost:5000` in a browser.
- `http://10.0.0.243:5000` on native platforms.

Before testing on a physical device or emulator, replace `10.0.0.243` in `frontend/src/App.jsx` with the IP address of the computer running the backend.

The device and computer must be able to reach each other on the local network.

### 3. Start the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm start
```

Alternatively:

```powershell
npm run web
npm run android
npm run ios
```

## Mobile Configuration

The Expo app scheme is `gamevault`, as configured in `frontend/app.json`.

Test the custom link in a development build:

```text
gamevault://games
```

Background location on iOS requires:

- A native development build instead of Expo Go.
- Foreground location permission.
- Always location permission.
- The iOS `location` background mode.
- A real device or a simulator that supports the required location behavior.

If location permissions are denied or unavailable, the app reports an appropriate alert and does not continue that location action.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API status |
| `GET` | `/api/games` | Retrieve games; optional `?search=` filter |
| `POST` | `/api/games` | Add a game |
| `PUT` | `/api/games/:id` | Update a game |
| `DELETE` | `/api/games/:id` | Delete a game |

Example create request:

```json
{
  "title": "The Legend of Zelda",
  "genre": "Adventure",
  "platform": "Nintendo Switch",
  "status": "Want to Play",
  "rating": 10
}
```

Valid statuses:

- `Want to Play`
- `Currently Playing`
- `Completed`

## Testing

Backend validation tests can be run with Vitest:

```powershell
cd backend
npx vitest run
```

Frontend linting:

```powershell
cd frontend
npm run lint
```

For end-to-end verification, test the following:

1. Add, edit, search, and delete a game.
2. Reload the app and confirm SQLite data persists.
3. Grant location permission and obtain coordinates.
4. Search for nearby stores.
5. Start and stop background tracking on a development build.
6. Open `gamevault://games` and confirm the games section is shown.
7. Test responsive behavior on web and a mobile device.

## Privacy and Permissions

GameVault requests location only for:

- Finding the user's current position.
- Finding nearby game stores.
- Optional background location tracking that the user starts manually.

Location values are used for local searches and are not inserted into the SQLite game database. The app sends coordinates to the Overpass API while searching for stores. Users should review the OpenStreetMap/Overpass usage terms and protect API keys or account data when deploying a public version.

## 10-Week Project Timeline

| Week | Milestone |
| --- | --- |
| 1 | Problem definition, repository setup, technology selection |
| 2 | Database schema and mobile UI design |
| 3 | Initial data preparation and collection requirements |
| 4 | Backend and baseline frontend implementation |
| 5 | API refinement and location feature design |
| 6 | Frontend game management and external-store integration |
| 7 | End-to-end API, location, map, and deep-link integration |
| 8 | Validation, testing, and quality assurance |
| 9 | Deployment preparation and mobile build configuration |
| 10 | Final documentation, demo, and project presentation |

## Deliverables

- Completed mobile and web application.
- Source code in this GitHub repository.
- Express REST API.
- SQLite database implementation.
- Mobile location, map, deep-link, and background-task integration.
- Data structure implementations and complexity analysis.
- README documentation.

## Limitations and Future Work

- The native API address is currently hard-coded and should be configured through environment variables.
- Store results depend on Overpass API availability and OpenStreetMap tagging.
- Push notifications are not currently implemented.
- A geofence and truly contextual location alerts could be added.
- The project can be expanded with authentication, cloud deployment, CI/CD, dashboards, export tools, and an AI-based recommendation model.
