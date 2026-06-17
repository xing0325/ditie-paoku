export function overlaps(trainLane, trainZ, entLane, entZ, zTol) {
  return trainLane === entLane && Math.abs(trainZ - entZ) <= zTol;
}
