export function createShuffleOrder(round, count = 12) {
  const indexes = Array.from({ length: count }, (_, index) => index);
  let seed = 421221 + round * 997;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [indexes[index], indexes[swap]] = [indexes[swap], indexes[index]];
  }

  return indexes;
}
