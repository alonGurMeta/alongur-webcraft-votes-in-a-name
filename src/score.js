import { findBestMatch } from 'string-similarity';
import jaroWinklerDistance from 'jaro-winkler';

const normalize = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const bigrams = (value) => {
  const clean = normalize(value).replace(/[^a-z]/g, '');
  return Array.from({ length: Math.max(0, clean.length - 1) }, (_, index) => clean.slice(index, index + 2));
};

function calculateBiSim(first, second) {
  let x = normalize(first);
  let y = normalize(second);
  if (!x && !y) return 0;
  x = x.charAt(0).toUpperCase() + x.charAt(0) + x.slice(1);
  y = y.charAt(0).toUpperCase() + y.charAt(0) + y.slice(1);
  if (x === y) return 1;

  const scores = new Array(Math.max(0, y.length - 1)).fill(0);
  const xCharacters = x.split('');
  const yCharacters = y.split('');
  for (let i = 1; i < x.length - 1; i += 1) {
    let previous = 0;
    for (let j = 1; j < y.length - 1; j += 1) {
      const current = scores[j - 1];
      const identity = Number(xCharacters[i].toLowerCase() === yCharacters[j].toLowerCase())
        + Number(xCharacters[i - 1].toLowerCase() === yCharacters[j - 1].toLowerCase());
      scores[j - 1] = Math.max(previous + identity / 2, current, scores[Math.max(0, j - 2)]);
      previous = current;
    }
  }
  return (scores[y.length - 3] ?? 0) / Math.max(x.length - 1, y.length - 1, 1);
}

export function compareNames(first, second) {
  if (!normalize(first) && !normalize(second)) {
    return { biSim: 0, dice: 0, jaroWinkler: 0, average: 0, pairs: [], secondPairs: [] };
  }
  const biSim = calculateBiSim(first, second);
  const dice = findBestMatch(normalize(first), [normalize(second)]).ratings[0].rating;
  const jaroWinkler = jaroWinklerDistance(normalize(first), normalize(second));
  const average = biSim * 0.6 + dice * 0.39 + jaroWinkler * 0.01;
  return {
    biSim: Math.round(biSim * 1000) / 1000,
    dice: Math.round(dice * 1000) / 1000,
    jaroWinkler: Math.round(jaroWinkler * 1000) / 1000,
    average: Math.round(average * 1000) / 1000,
    pairs: bigrams(first),
    secondPairs: bigrams(second),
  };
}
