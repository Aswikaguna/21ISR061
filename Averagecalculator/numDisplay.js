const MAX_WINDOW_SIZE = 10;
let windowStore = [];

function updateWindow(newNumbers) {
  const prev = [...windowStore];
  const uniqueNew = newNumbers.filter(n => !windowStore.includes(n));

  for (const num of uniqueNew) {
    if (windowStore.length >= MAX_WINDOW_SIZE) {
      windowStore.shift();
    }
    windowStore.push(num);
  }

  return { prev, curr: [...windowStore] };
}

function getAverage() {
  if (windowStore.length === 0) return 0;
  const sum = windowStore.reduce((a, b) => a + b, 0);
  return parseFloat((sum / windowStore.length).toFixed(2));
}

module.exports = { updateWindow, getAverage };
