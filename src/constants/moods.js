export const MOODS = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: '#ef4444' },
  { value: 2, emoji: '😔', label: 'Sad', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
  { value: 4, emoji: '😊', label: 'Happy', color: '#22c55e' },
  { value: 5, emoji: '😄', label: 'Very Happy', color: '#10b981' },
];

export const getMoodByValue = (value) => {
  return MOODS.find(mood => mood.value === value) || MOODS[2];
};