import { test, expect } from "vitest";
import validation from "./validation.js";

const { validateGame } = validation;

test("a valid game title should pass validation", () => {
  const result = validateGame(
    "The Legend of Zelda",
    "Adventure",
    "Nintendo Switch",
    "Want to Play",
    10
  );

  expect(result).toBeNull();
});

test("an empty game title should fail validation", () => {
  const result = validateGame(
    "   ",
    "Adventure",
    "Nintendo Switch",
    "Want to Play",
    10
  );

  expect(result).toBe("Game title is required.");
});