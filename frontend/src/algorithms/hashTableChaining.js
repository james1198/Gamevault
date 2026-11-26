export class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }

  hash(key) {
    key = String(key);
    let hash = 0;

    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  set(key, value) {
    const index = this.hash(key);
    const existingGame = this.table[index].find(
  item => item.key === key
);

    if (existingGame) {
      existingGame.value = value;
      return;
    }
    this.table[index].push({ key, value });
  }

  get(key) {
    const index = this.hash(key);
    const entry = this.table[index].find(item => item.key === key);
    return entry ? entry.value : null;
  }

  remove(key) {
    const index = this.hash(key);
    const indexInBucket = this.table[index].findIndex(item => item.key === key);
    if (indexInBucket !== -1) {
      this.table[index].splice(indexInBucket, 1);
      return true;
    }
    return false;
  }
  displayGames() {
    this.table.forEach(bucket => {
      bucket.forEach(entry => {
        console.log(entry.key, entry.value);
      });
    });
  }
  getAllGames() {
    const games = [];
    this.table.forEach(bucket => {
      bucket.forEach(entry => {
        games.push(entry.value);
      });
    });
    return games;
  }
}
