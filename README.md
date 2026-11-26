This was written with AI if thats an issue I apoligise but i remember you said we could use AI for the Readme in an older quarter
# GameVault

GameVault is a full-stack video game collection manager built with React Native, Expo, Node.js, Express, and SQLite. The application demonstrates software development, mobile application development, data structures, and algorithm analysis.

**Repository:** https://github.com/james1198/Gamevault

**Local Deployment:** http://gamevault.local

## Table of Contents

- [Course Context](#course-context)
- [Project Overview](#project-overview)
- [Features](#features)
- [Mobile Development Requirement Alignment](#mobile-development-requirement-alignment)
- [Data Structures and Algorithm Analysis](#data-structures-and-algorithm-analysis)
- [Software Development Alignment](#software-development-alignment)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Mobile Configuration](#mobile-configuration)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Continuous Integration](#continuous-integration)
- [Local IIS Deployment](#local-iis-deployment)
- [Privacy and Permissions](#privacy-and-permissions)
- [Deliverables](#deliverables)
- [Limitations and Future Work](#limitations-and-future-work)
- [Conclusion](#conclusion)

## Course Context

GameVault was developed as a combined final project for three courses:

- Software Development Capstone
- Mobile Application Development
- Data Structures and Algorithms

The project demonstrates full-stack application development, mobile system integration, persistent data storage, external web services, user interface design, data structures, algorithm performance analysis, automated testing, and local application deployment.

## Project Overview

GameVault allows users to:

- Add video games to a personal collection.
- Search and view saved games.
- Edit game information.
- Delete games.
- Manage game statuses and ratings.
- View collection statistics.
- Retrieve the current device location.
- Search for nearby video game stores using an external API.
- Display the current location and returned store locations on a map.
- Start and stop background location tracking in a supported native build.
- Handle custom deep links.

The frontend communicates with a REST API backed by SQLite. A JavaScript array and two hash-table implementations demonstrate different approaches to storing, searching, and managing collection data.

The production web application is deployed locally using Microsoft Internet Information Services (IIS) and is accessible through a custom hostname.

## Features

### Game Collection Management

- Create, read, update, and delete games.
- Persistent SQLite database storage.
- Input validation and error handling.
- Search games by title.
- Edit mode to prevent accidental changes.
- Game genre and platform management.
- Game ratings from 1 to 10.
- Game status management.

Available game statuses:

- Want to Play
- Currently Playing
- Completed

### Collection Statistics

The application automatically calculates and displays:

- Total games
- Currently playing
- Completed games
- Incomplete games

### Location and Maps

- Requests foreground location permission.
- Retrieves the current device coordinates.
- Uses the OpenStreetMap Nominatim API to search for nearby video game stores.
- Restricts searches to a geographic bounding box around the user's location.
- Displays the device location and returned store locations using React Native Maps.
- Includes a 15-second external API request timeout.
- Provides feedback when no stores are found or a request fails.

### Mobile System Integration

- Custom deep link: `gamevault://games`
- Expo deep-link handling using Linking.
- Expo Task Manager background location task.
- Background location permission handling.
- Start and stop background tracking controls.
- Native alerts and platform-specific behavior.

### User Interface

- Responsive layout for mobile and web.
- Animated title fade-in effect.
- Interactive buttons and text inputs.
- Picker controls.
- Scrollable game collection.
- Responsive game cards.
- Platform-specific alerts.

### Local Deployment

- Production web build generated using Expo.
- Static application files hosted through Microsoft IIS.
- Custom local hostname configured through the Windows hosts file.
- Connection to the local Node.js backend.
- Persistent SQLite database storage.
- Production web access without running the Expo development server.

## Mobile Development Requirement Alignment

| Requirement | GameVault Implementation |
| --- | --- |
| Device location | Uses Expo Location to request permission and retrieve device coordinates. |
| Background service | Uses Expo Task Manager and background location updates. |
| Broadcast intents or platform equivalent | Implements custom deep-link handling using Expo Linking as a proposed platform-equivalent system event mechanism. |
| External API | Uses OpenStreetMap Nominatim to search for nearby video game stores. |
| Retrieved data in UI | Returned store names and coordinates are designed to appear in the interface and on the map. |
| Animation | Uses Animated.Text to create a title fade-in animation. |
| User interaction | Includes buttons, text inputs, pickers, scrolling, editing, and deletion. |
| Maps and location | Displays the device location and supports nearby store markers. |
| Data persistence | Retrieves and stores game collection information through the SQLite-backed REST API. |

### Mobile Verification

The application was tested on a physical iPhone using Expo Go.

Successfully verified functionality includes:

- Application startup.
- Backend connectivity.
- Loading saved games.
- Foreground location services.
- Title animation.
- External API response handling.

The external API successfully returned a response during testing, although no matching nearby stores were returned. Displaying actual nearby store results has not been verified.

Background location tracking and custom deep linking have been implemented but require additional verification using a native development build.

Expo Go does not support all required native functionality.

Deep linking is used as the project's proposed platform-equivalent mechanism for broadcast or system events.

## Data Structures and Algorithm Analysis

GameVault demonstrates three implementations across two types of data structures:

1. Dynamic array
2. Hash table with separate chaining
3. Hash table with linear probing

### Implemented Data Structures

| Structure | File | Representation |
| --- | --- | --- |
| Dynamic array | `frontend/src/algorithms/gameArray.js` | JavaScript array containing game objects |
| Separate chaining | `frontend/src/algorithms/hashTableChaining.js` | Array of buckets containing entries |
| Linear probing | `frontend/src/algorithms/hashTableLinear.js` | Array containing entries and deleted-entry markers |

### Dynamic Array

The dynamic array stores game objects in sequential order.

Supported operations include:

- Insertion
- Deletion
- Searching
- Traversal

Array insertion appends a game to the collection. Searching requires examining entries until a matching game ID is found. Deletion locates the matching game and removes it using the array's splice operation.

**Advantages:**

- Simple implementation.
- Easy traversal.
- Efficient appending.
- Low implementation overhead.

**Disadvantages:**

- Linear search time.
- Deletion may require shifting elements.
- Search performance decreases as the collection grows.

### Hash Table with Separate Chaining

Separate chaining resolves hash collisions by storing multiple entries in the same bucket.

When two keys produce the same hash index, their entries are stored within that bucket rather than overwriting one another.

Supported operations include:

- Insertion
- Updating
- Deletion
- Searching
- Traversal

**Advantages:**

- Efficient average-case searching.
- Handles collisions without requiring adjacent empty slots.
- Can store multiple entries in a bucket.

**Disadvantages:**

- Additional memory is required for buckets and entries.
- Poor hash distribution can create long chains.
- Worst-case searching can become linear.

### Hash Table with Linear Probing

Linear probing resolves collisions by checking subsequent table positions until an available slot or matching key is found.

Deleted-entry markers allow searches to continue through positions that previously contained entries.

Supported operations include:

- Insertion
- Updating
- Deletion
- Searching
- Traversal

**Advantages:**

- Efficient average-case operations with a suitable load factor.
- Entries are stored directly in the table.
- Does not require separate bucket chains.

**Disadvantages:**

- Collisions can create clusters.
- Performance decreases as the table becomes crowded.
- Requires available table capacity for new entries.

### Hash Function

Both hash-table implementations use a polynomial-style hash function to improve key distribution.

The hash calculation multiplies the current hash value by 31, adds the character code of the next character, and applies the modulo operation using the table size.

Improving hash distribution helps reduce collisions and clustering.

### Complexity Analysis

The following analysis assumes:

- `n` represents the number of stored games.
- `m` represents the hash-table capacity.
- `α = n / m` represents the load factor.
- Average-case hash-table performance assumes a suitable load factor and reasonable hash distribution.
- Hash calculation is treated as constant time for bounded-length game IDs.

| Operation | Dynamic Array | Separate Chaining | Linear Probing |
| --- | --- | --- | --- |
| Insertion | O(1) amortized | O(1) average | O(1) average |
| Search | O(n) | O(1) average | O(1) average |
| Deletion | O(n) | O(1) average | O(1) average |
| Traversal | O(n) | O(m + n) | O(m) |
| Worst-case search | O(n) | O(n) | O(m) |
| Worst-case deletion | O(n) | O(n) | O(m) |
| Worst-case insertion | O(n) | O(n) | O(m) |

When hash-table capacity is proportional to the number of stored entries, O(m) can also be expressed as O(n).

### Space Complexity

| Data Structure | Space Complexity |
| --- | --- |
| Dynamic array | O(n) |
| Separate chaining | O(n + m) |
| Linear probing | O(m) |

The dynamic array stores game objects sequentially. Separate chaining requires storage for both the table buckets and their entries. Linear probing stores entries directly within the allocated table.

### Performance Benchmark

Performance testing was conducted using 1,000 temporary game records and 1,000,000 repeated search operations.

The same target game ID was searched using each implementation.

#### Initial Benchmark Results

| Data Structure | Execution Time |
| --- | ---: |
| Dynamic array | 638.1 ms |
| Separate chaining | 24.3 ms |
| Linear probing | 3,699.5 ms |

The initial results showed that separate chaining performed substantially faster than the array and linear-probing implementations.

The original hash function caused significant clustering in the linear-probing implementation.

#### Improved Hash Function Benchmark

After improving the linear-probing hash function, another benchmark was conducted.

| Data Structure | Execution Time |
| --- | ---: |
| Dynamic array | 679.6 ms |
| Separate chaining | 31.5 ms |
| Linear probing | 1,640.4 ms |

The improved hash function reduced linear-probing execution time by approximately 55.7%.

The separate-chaining implementation still produced the fastest measured search performance.

These measurements were collected during development and may vary depending on hardware, table capacity, key distribution, and runtime conditions.

Both hash-table implementations were subsequently updated to use the polynomial-style hash function. A new benchmark comparing both implementations with the identical hash function has not been conducted.

Therefore, the recorded results demonstrate the performance of the implementations at the time of testing rather than a controlled comparison of their final versions.

### Implementation Comparison

The dynamic array provides the simplest approach to storing and traversing game records. However, searching requires a linear scan.

Separate chaining provides efficient searching by distributing entries across buckets. It performed best in the recorded benchmarks.

Linear probing stores entries directly in the table but is sensitive to collisions, clustering, and hash distribution.

The benchmark demonstrates that theoretical time complexity does not always predict actual execution time. Implementation details, collision handling, and hash-function quality significantly affect performance.

### Application Integration

When GameVault loads game records, the application initializes its array and both hash-table implementations using the retrieved data.

Temporary benchmarking code was used during development to compare search performance and was removed from the normal application interface after testing.

SQLite remains the application's primary persistent storage system.

## Software Development Alignment

GameVault demonstrates the following software development concepts:

| Requirement | Implementation |
| --- | --- |
| Project planning | Defined application requirements and collection-management features. |
| System design | Separates the frontend, backend, database, and algorithm implementations. |
| Frontend development | React Native and Expo application. |
| Backend development | Node.js and Express REST API. |
| Database management | SQLite persistent storage. |
| API development | REST endpoints for creating, retrieving, updating, and deleting games. |
| Input validation | Backend validation for game information, ratings, statuses, and IDs. |
| Error handling | Frontend alerts and backend error responses. |
| External integration | OpenStreetMap Nominatim API. |
| Version control | Git and GitHub. |
| Automated testing | Vitest backend validation tests. |
| Continuous integration | GitHub Actions workflow configured to run automated tests. |
| Production build | Expo production web export. |
| Local deployment | Production web application hosted using Microsoft IIS. |
| Custom URL | Windows hosts file and IIS hostname binding. |
| Documentation | GitHub README containing setup instructions and project analysis. |

### System Architecture

GameVault uses a client-server architecture.

The frontend provides the user interface and communicates with the Express backend through HTTP requests.

The backend processes requests, validates submitted information, and performs database operations.

SQLite stores the game collection persistently.

The mobile application communicates separately with the Nominatim external API for location-based store searches.

The production web frontend is hosted through IIS, while the Express backend runs as a separate local Node.js process.

### Application Data Flow

1. The user opens the GameVault application.
2. The frontend sends an HTTP request to the backend.
3. The backend validates the request.
4. SQLite retrieves or modifies the requested records.
5. The backend returns a JSON response.
6. The frontend updates the displayed collection.
7. The application initializes its in-memory data structures using the updated collection.

### Deployment Architecture

```text
Windows Web Browser
        |
        v
http://gamevault.local
        |
        v
Windows Hosts File
127.0.0.1
        |
        v
Microsoft IIS (Port 80)
Expo Production Web Frontend
        |
        | Browser API requests
        v
Node.js / Express (Port 5000)
        |
        v
SQLite Database
```

IIS serves the production frontend files. The frontend sends API requests directly to the local Express backend.

## Technology Stack

### Frontend

- JavaScript
- React
- React Native
- Expo
- Expo Location
- Expo Task Manager
- Expo Constants
- React Native Maps
- React Native Picker
- React Native Safe Area Context

### Backend

- Node.js
- Express
- SQLite
- better-sqlite3
- CORS

### Testing and Development Tools

- Vitest
- Visual Studio Code
- Git
- GitHub
- GitHub Actions
- Expo Go

### Deployment

- Microsoft Windows
- Internet Information Services (IIS)
- IIS Manager
- Expo production web export
- Windows hosts file

### External Data

- OpenStreetMap
- Nominatim API

## Project Structure

```text
Gamevault/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── database.js
│   ├── server.js
│   ├── validation.test.js
│   ├── package.json
│   └── gamevault.db
├── frontend/
│   ├── app.json
│   ├── package.json
│   ├── dist/
│   └── src/
│       ├── App.jsx
│       ├── GameStoreMap.jsx
│       ├── GameStoreMap.web.jsx
│       └── algorithms/
│           ├── gameArray.js
│           ├── hashTableChaining.js
│           └── hashTableLinear.js
└── README.md
```

The `dist` directory is generated when the Expo web application is exported for deployment.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Expo Go for supported mobile testing
- A modern web browser
- Microsoft IIS for local production deployment
- A native development build for unsupported Expo Go features

### 1. Clone the Repository

```bash
git clone https://github.com/james1198/Gamevault.git
cd Gamevault
```

### 2. Start the Backend

From the repository root:

```bash
cd backend
npm install
node server.js
```

The backend listens on port 5000.

Local backend address:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "success",
  "message": "GameVault API is working!"
}
```

### 3. Configure the Frontend API Address

The frontend selects the backend address based on the platform.

```javascript
const API = Platform.OS === 'web'
  ? 'http://localhost:5000'
  : 'http://10.0.0.243:5000'
```

The web application connects to the local backend using localhost.

For mobile testing, replace the native IP address with the current local IP address of the computer running the backend.

On Windows, the IP address can be found using:

```bash
ipconfig
```

The mobile device and computer must be able to communicate over the local network.

### 4. Start the Frontend in Development Mode

Open a separate terminal from the repository root:

```bash
cd frontend
npm install
npx expo start
```

To open the development web application, press `w`.

To open the application on an iPhone, scan the Expo QR code using the iPhone camera.

The backend must remain running during local testing.

The Expo development server is not required when accessing the production web application through IIS.

## Mobile Configuration

### Location Permissions

GameVault requests foreground location permission before retrieving the device's current location.

If permission is denied, the application displays an alert.

### Background Location Tracking

Background location tracking uses Expo Location and Expo Task Manager.

The application provides controls to start and stop location tracking.

Background tracking on iOS requires:

- A compatible native development build.
- Foreground location permission.
- Background location permission.
- Appropriate iOS background location configuration.

Expo Go does not support the full background location functionality required by this feature.

### Deep Linking

The application uses the following custom scheme:

```text
gamevault
```

The custom deep link is:

```text
gamevault://games
```

When the application receives this link, it is designed to navigate the user to the game collection section.

Custom scheme handling requires a compatible native build for complete verification.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check backend availability |
| GET | `/api/games` | Retrieve saved games |
| GET | `/api/games?search=title` | Search games by title |
| POST | `/api/games` | Add a game |
| PUT | `/api/games/:id` | Update a game |
| DELETE | `/api/games/:id` | Delete a game |

### Example Game Object

```json
{
  "title": "The Legend of Zelda",
  "genre": "Adventure",
  "platform": "Nintendo Switch",
  "status": "Want to Play",
  "rating": 10
}
```

### Input Validation

The backend validates submitted information before modifying the database.

Validation includes:

- A nonempty game title.
- Valid genre and platform values.
- A supported game status.
- A rating between 1 and 10, or null where permitted.
- Valid positive integer game IDs for operations requiring an ID.

Invalid requests return appropriate error responses.

## Testing

### Automated Backend Testing

Vitest is used to perform automated backend validation testing.

To run the tests:

```bash
cd backend
npm test
```

### Automated Test Results

| Test | Result |
| --- | --- |
| Valid game title accepted | Passed |
| Empty game title rejected | Passed |

**Total tests:** 2

**Passed:** 2

**Failed:** 0

These tests verify title validation behavior. They do not constitute complete automated coverage of all REST API endpoints.

### Manual Testing

| Feature | Result |
| --- | --- |
| Backend startup | Passed |
| Backend health endpoint | Passed |
| Add games | Passed |
| Edit games | Passed |
| Delete games | Passed |
| Search games | Passed |
| SQLite persistence after restart | Passed |
| Development web application | Passed |
| iPhone application startup | Passed |
| Loading saved games on iPhone | Passed |
| Foreground location services | Passed |
| Title animation | Passed |
| External API response | Passed |
| Actual nearby store results | Not verified |
| Background location tracking | Implemented; native testing pending |
| Custom deep linking | Implemented; native testing pending |
| Expo production web export | Passed |
| IIS installation | Passed |
| Custom hostname resolution | Passed |
| Local IIS website access | Passed |
| Deployed frontend backend connectivity | Passed |

## Continuous Integration

GameVault includes a GitHub Actions continuous integration workflow located at:

```text
.github/workflows/ci.yml
```

The workflow is configured to run automatically when changes are pushed to the repository or when pull requests are created.

The workflow performs the following steps:

1. Checks out the repository.
2. Configures Node.js version 24.
3. Installs backend dependencies using `npm ci`.
4. Runs automated tests using `npm test`.

The workflow configuration is:

```yaml
name: GameVault CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: backend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

The automated tests have passed locally. Successful execution of the GitHub Actions workflow has not been verified.

Production deployment is performed manually by exporting the frontend and copying the generated files to IIS.

Automatic continuous deployment is not currently configured.

## Local IIS Deployment

GameVault was successfully deployed locally using Microsoft Internet Information Services (IIS), following the instructor's local deployment requirements.

The React Native application was exported as a production web application using Expo and hosted through IIS.

A custom hostname was configured using IIS website bindings and the Windows hosts file.

**Deployment date:** November 25, 2026

**Deployment status:** Successful

**Local application URL:** http://gamevault.local

### 1. Enable Internet Information Services

IIS was installed using Windows Features.

Installation steps:

1. Open the Windows Start menu.
2. Search for Turn Windows features on or off.
3. Enable Internet Information Services.
4. Apply the changes.
5. Wait for Windows to complete the installation.

IIS installation was verified by visiting:

```text
http://localhost
```

The default IIS welcome page was displayed successfully.

### 2. Generate the Production Web Build

From the GameVault project directory:

```bash
cd frontend
npx expo export --platform web
```

This command generates a production-ready web application in:

```text
frontend/dist
```

The generated directory contains the HTML, JavaScript bundles, and application assets required to run GameVault in a browser.

### 3. Create the Deployment Directory

The following directory was created:

```text
C:\inetpub\wwwroot\GameVault
```

All contents of the generated `frontend/dist` directory were copied into the IIS deployment directory.

The production directory contains the exported application files, including:

```text
C:\inetpub\wwwroot\GameVault\
├── index.html
├── _expo/
└── Other generated application files and assets
```

### 4. Configure the IIS Website

Internet Information Services Manager was opened, and a new website was created.

The following configuration was used:

| Setting | Value |
| --- | --- |
| Site name | GameVault |
| Physical path | `C:\inetpub\wwwroot\GameVault` |
| Binding type | HTTP |
| IP address | All Unassigned |
| Port | 80 |
| Hostname | gamevault.local |

The website was started through IIS Manager.

### 5. Configure the Windows Hosts File

The Windows hosts file is located at:

```text
C:\Windows\System32\drivers\etc\hosts
```

The following entry was added:

```text
127.0.0.1    gamevault.local
```

This maps the custom hostname to the local computer.

Administrator permissions were required to modify the hosts file.

The entry was successfully added using an administrator Command Prompt:

```cmd
echo 127.0.0.1 gamevault.local >> C:\Windows\System32\drivers\etc\hosts
```

This command only needs to be executed once.

The Windows DNS resolver cache was cleared using:

```cmd
ipconfig /flushdns
```

### 6. Verify Custom Hostname Resolution

The custom hostname was tested using:

```cmd
ping gamevault.local
```

The hostname successfully resolved to:

```text
127.0.0.1
```

Verification results:

- Packets sent: 4
- Packets received: 4
- Packets lost: 0
- Packet loss: 0%

This confirmed that Windows correctly resolved the custom hostname to the local computer.

### 7. Start the Local Backend

The Express backend runs separately from IIS.

From the GameVault project directory:

```bash
cd backend
node server.js
```

The backend is available at:

```text
http://localhost:5000
```

SQLite continues to provide persistent storage for the game collection.

The backend must remain running while the deployed application is being used.

### 8. Access the Deployed Application

The deployed GameVault application is accessible at:

```text
http://gamevault.local
```

The application successfully loaded through the custom hostname, and backend connectivity was verified.

The production frontend does not require the Expo development server to remain running.

### 9. Update the Deployed Application

When frontend source code changes are made, a new production build must be generated.

```bash
cd frontend
npx expo export --platform web
```

The updated contents of the `dist` directory must then be copied into:

```text
C:\inetpub\wwwroot\GameVault
```

Replace the previous production files with the newly generated files.

Refresh the browser to access the updated application.

Backend source code changes require restarting the Node.js backend process.

### Deployment Verification

| Deployment Component | Status |
| --- | --- |
| IIS installation | Successful |
| Production web export | Successful |
| Deployment directory creation | Successful |
| Production file deployment | Successful |
| IIS website configuration | Successful |
| Custom hostname binding | Successful |
| Windows hosts file configuration | Successful |
| Hostname resolution | Successful |
| Production website access | Successful |
| Backend connectivity | Successful |

### Deployment Scope

The deployment is intended for local use on the Windows host computer.

The custom hostname does not require a purchased domain name or external DNS service.

The hostname is configured locally and is not publicly accessible over the internet.

The Windows computer must remain powered on, IIS must be running, and the Node.js backend must be started for the application to function.

Cloud hosting was not required for the instructor-approved local deployment.

## Privacy and Permissions

GameVault requests location access for:

- Retrieving the user's current location.
- Searching for nearby video game stores.
- Optional background location tracking initiated by the user.

Location information is not stored in the SQLite game database.

The application sends a geographic search bounding box derived from the user's coordinates to the Nominatim API when searching for nearby stores.

Background location updates are currently logged locally during tracking.

The application should comply with the OpenStreetMap Nominatim usage policy and provide appropriate OpenStreetMap attribution.

OpenStreetMap contributors: https://www.openstreetmap.org/copyright

Nominatim usage policy: https://operations.osmfoundation.org/policies/nominatim/

## Deliverables

### Software Development Capstone

- Full-stack application.
- React Native and Expo frontend.
- Node.js and Express backend.
- REST API.
- SQLite database.
- Input validation and error handling.
- Automated validation tests.
- Continuous integration configuration.
- GitHub source code.
- Production web build.
- Local Microsoft IIS deployment.
- Custom hostname configuration.
- Successful local deployment verification.
- Project documentation.

### Mobile Application Development

- Mobile application interface.
- iPhone testing using Expo Go.
- Foreground location services.
- Background location service implementation.
- External API integration.
- Map integration.
- Custom deep-link handling.
- UI animation.
- Interactive user controls.
- Native verification of background tracking and deep linking pending.

### Data Structures and Algorithms

- Dynamic array implementation.
- Separate-chaining hash-table implementation.
- Linear-probing hash-table implementation.
- Insertion, deletion, searching, and traversal operations.
- Hash-table collision-handling comparison.
- Big O complexity analysis.
- Space complexity analysis.
- Recorded performance benchmarks.
- Application integration.

## Limitations and Future Work

The current application has the following limitations:

- The local mobile API address is hard-coded and may change when the development computer connects to a different network.
- Nearby store results depend on the information available through OpenStreetMap and Nominatim.
- The Nominatim API may return no matching stores for certain locations.
- Actual nearby store marker results have not yet been verified.
- Background location tracking requires a compatible native development build.
- Custom deep linking requires additional native verification.
- Automated testing currently covers title validation rather than the entire application.
- GitHub Actions execution has not yet been verified.
- The local IIS deployment requires the host computer to remain powered on.
- The Node.js backend must be started manually.
- Production frontend updates require rebuilding and copying files to IIS.
- Automatic continuous deployment is not configured.
- The local deployment uses HTTP rather than HTTPS.
- Browser geolocation may be restricted when accessing the custom HTTP hostname because it is not a secure context.
- The application does not currently implement user authentication or separate user accounts.

Potential future improvements include:

- Automatic backend startup using Windows Task Scheduler or a Windows service.
- HTTPS configuration through IIS.
- Automated deployment.
- User authentication.
- Individual user collections.
- Additional automated tests.
- Improved game store searches.
- Game cover images.
- Collection export functionality.
- Additional collection statistics.

## References

- Expo Web Deployment: https://docs.expo.dev/guides/publishing-websites/
- Microsoft IIS Documentation: https://learn.microsoft.com/en-us/iis/
- React Native Documentation: https://reactnative.dev/docs/getting-started
- Express Documentation: https://expressjs.com/
- SQLite Documentation: https://www.sqlite.org/docs.html
- Vitest Documentation: https://vitest.dev/
- GitHub Actions Documentation: https://docs.github.com/en/actions
- Nominatim Documentation: https://nominatim.org/release-docs/latest/

## Conclusion

GameVault demonstrates the integration of full-stack software development, mobile application development, and data structures and algorithms within a single application.

The project provides persistent game collection management through a REST API and SQLite database while incorporating mobile location services, external API communication, animation, and system event handling.

The data structure implementations demonstrate how different storage and collision-handling strategies affect algorithm performance. Recorded benchmarks highlight the importance of hash-function quality and implementation decisions.

The project also incorporates source control, automated testing, continuous integration configuration, and technical documentation.

The production web application was successfully deployed locally using Microsoft Internet Information Services. A custom hostname was configured through IIS website bindings and the Windows hosts file.

The deployed application is accessible at http://gamevault.local and successfully communicates with the local Express backend.

The local deployment satisfies the instructor's specified IIS and custom hostname deployment requirements.