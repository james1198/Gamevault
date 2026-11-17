const games = [];
export function loadGames(gameList) {
  games.length = 0;
  games.push(...gameList);
}

export function addGame(game) {
  games.push(game);
}

export function findGame(id) {
  return games.find(game => game.id === id);
}
export function removeGame(id) {
  const index = games.findIndex(game => game.id === id);
  if (index !== -1) {
    games.splice(index, 1);
    return true;
  }
  return false;
}
export function displayGames() {
  games.forEach((game, index) => 
    console.log(`${index + 1}. ${game.id} - ${game.title}`));
}