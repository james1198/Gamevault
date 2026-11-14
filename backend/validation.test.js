import { test, expect } from "vitest"

test("a valid game title should pass validation", () => {
  const title = "The Legend of Zelda";
  expect(typeof title === 'string' && title.trim().length > 0).toBe(true);
});

test("an empty game title should fail validation", () => {
  const title = "   ";
  expect(typeof title === 'string' && title.trim().length > 0).toBe(false);
});
