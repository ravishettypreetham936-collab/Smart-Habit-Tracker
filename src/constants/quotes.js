export const MOTIVATIONAL_QUOTES = [
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    source: "Atomic Habits"
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    source: "Philosophy"
  },
  {
    quote: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    source: "Leadership"
  },
  {
    quote: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun",
    source: "Mindset"
  },
  {
    quote: "First forget inspiration. Habit is more dependable. Habit will sustain you whether you're inspired or not.",
    author: "Octavia Butler",
    source: "Wisdom"
  },
  {
    quote: "At dawn, when you have trouble getting out of bed, tell yourself: 'I have to go to work — as a human being.'",
    author: "Marcus Aurelius",
    source: "Meditations"
  },
  {
    quote: "Habits change into character.",
    author: "Ovid",
    source: "Ancient Proverb"
  },
  {
    quote: "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    author: "James Clear",
    source: "Atomic Habits"
  },
  {
    quote: "The secret of your future is hidden in your daily routine.",
    author: "Mike Murdock",
    source: "Productivity"
  },
  {
    quote: "Discipline equals freedom.",
    author: "Jocko Willink",
    source: "Discipline"
  },
  {
    quote: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    source: "Tao Te Ching"
  },
  {
    quote: "It's not what we do once in a while that shapes our lives. It's what we do consistently.",
    author: "Tony Robbins",
    source: "Mindset"
  }
];

export function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

export function getRandomQuote(excludeIndex = -1) {
  let idx;
  do {
    idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  } while (idx === excludeIndex && MOTIVATIONAL_QUOTES.length > 1);
  return { ...MOTIVATIONAL_QUOTES[idx], index: idx };
}
