export function createScore() {
  let raw = 0;
  return {
    distance: 0, kills: 0,
    advance(d) { raw += d; this.distance = Math.floor(raw); },
    kill() { this.kills += 1; },
  };
}
