export class linearHashTable {
  constructor(size = 101) {
    this.size = size;
    this.table = new Array(size).fill(null);
    this.DELETED = { deleted: true };
  }

  hash(key) {
    key = String(key);
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  set(key, value) {
    let index = this.hash(key);
    let attempts = 0;
    let firstDeleted = -1;
    while (this.table[index] !== null && attempts < this.size) {
      if (this.table[index] === this.DELETED) {
        if (firstDeleted === -1) {
          firstDeleted = index;
        }
      } else if (this.table[index].key === key) {
        this.table[index] = { key, value };
        return true;
      }
      index = (index + 1) % this.size;
      attempts++;
    }
    if (firstDeleted !== -1) {
      this.table[firstDeleted] = { key, value };
      return true;
    }
    if (this.table[index] === null) {
      this.table[index] = { key, value };
      return true;
    }
    console.log("Hash table is full!");
    return false;
  }

  get(key) {
    let index = this.hash(key);
    let attempts = 0;
    while (this.table[index] !== null && attempts < this.size) {
      if (this.table[index] !== this.DELETED && this.table[index].key === key) {
        return this.table[index].value;
      }
      index = (index + 1) % this.size;
      attempts++;
    }
    return null;
  }

  remove(key) {
    let index = this.hash(key);
    let attempts = 0;
    while (this.table[index] !== null && attempts < this.size) {
      if (this.table[index] !== this.DELETED && this.table[index].key === key) {
        this.table[index] = this.DELETED;
        return true;
      }
      index = (index + 1) % this.size;
      attempts++;
    }
    return false;
  }

  displayGames() {
    this.table.forEach(entry => {
      if (entry !== null && entry !== this.DELETED) {
        console.log(entry.key, entry.value);
      }
    });
  }
  getAllGames() {
    const games = [];
    this.table.forEach(entry => {
      if (entry !== null && entry !== this.DELETED) {
        games.push(entry.value);
      }
    });
    return games;
  }
}
