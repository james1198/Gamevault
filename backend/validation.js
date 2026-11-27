const validStatuses = [
  "Want to Play",
  "Currently Playing",
  "Completed"
];

function validateGame(title, genre, platform, status, rating) {
  if (typeof title !== "string" || !title.trim()) {
    return "Game title is required.";
  }

  if (typeof genre !== "string" || typeof platform !== "string") {
    return "Genre and platform must be text.";
  }

  if (!validStatuses.includes(status)) {
    return "Invalid game status.";
  }

  if (
    rating !== null &&
    (!Number.isInteger(rating) || rating < 1 || rating > 10)
  ) {
    return "Rating must be between 1 and 10.";
  }

  return null;
}

module.exports = { validateGame };