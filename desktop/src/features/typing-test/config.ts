export interface TypingTestConfig {
  defaultDuration: number;
  availableDurations: number[];
  sampleTexts: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}

export const typingTestConfig: TypingTestConfig = {
  defaultDuration: 60,
  availableDurations: [15, 30, 60, 120],
  sampleTexts: {
    beginner:
      "The quick brown fox jumps over the lazy dog. This is a simple sentence for beginners to practice typing.",
    intermediate:
      "Typing speed and accuracy are important skills in today's digital world. Practicing regularly helps improve these abilities significantly.",
    advanced:
      "In the realm of computer science, understanding fundamental concepts such as data structures, algorithms, and programming paradigms is crucial for developing efficient software solutions that can scale and adapt to changing requirements.",
  },
};
