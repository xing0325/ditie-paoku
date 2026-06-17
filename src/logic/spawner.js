export function createSpawner({ gap, obstacleEvery, rng }) {
  let acc = 0, count = 0;
  return {
    update(distanceDelta) {
      acc += distanceDelta;
      if (acc < gap) return null;
      acc -= gap;
      count += 1;
      const lane = Math.floor(rng() * 3) % 3;
      const type = count % obstacleEvery === 0 ? 'obstacle' : 'person';
      return { lane, type };
    },
  };
}
