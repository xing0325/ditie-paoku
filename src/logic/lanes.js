export const LANE_COUNT = 3;
export const LANE_GAP = 4;              // 相邻车道 x 间距
export function laneX(i) { return (i - 1) * LANE_GAP; }
export function clampLane(i) { return Math.max(0, Math.min(LANE_COUNT - 1, i)); }
export function nextLane(current, dir) { return clampLane(current + Math.sign(dir)); }
