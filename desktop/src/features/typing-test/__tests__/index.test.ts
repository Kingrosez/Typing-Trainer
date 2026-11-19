import { describe, test, expect } from "vitest";
import { typingTestConfig } from "../config";

describe("Typing Test Configuration", () => {
  test("should have default duration set to 60 seconds", () => {
    expect(typingTestConfig.defaultDuration).toBe(60);
  });

  test("should have available durations including 15, 30, 60, and 120", () => {
    expect(typingTestConfig.availableDurations).toContain(15);
    expect(typingTestConfig.availableDurations).toContain(30);
    expect(typingTestConfig.availableDurations).toContain(60);
    expect(typingTestConfig.availableDurations).toContain(120);
  });

  test("should have sample texts for different difficulty levels", () => {
    expect(typingTestConfig.sampleTexts.beginner).toBeDefined();
    expect(typingTestConfig.sampleTexts.intermediate).toBeDefined();
    expect(typingTestConfig.sampleTexts.advanced).toBeDefined();
  });
});
