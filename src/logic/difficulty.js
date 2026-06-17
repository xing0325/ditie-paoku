export const BASE_SPEED = 0.34;   // 世界单位 / 帧 @60fps
export const MAX_SPEED = 0.9;
const RAMP = 0.00006;             // 每米加速度
export function speedAt(distance) {
  return Math.min(MAX_SPEED, BASE_SPEED + Math.max(0, distance) * RAMP);
}
