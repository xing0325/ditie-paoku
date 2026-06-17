export function createGame() {
  return {
    state: 'running',
    derail() { if (this.state === 'running') this.state = 'dead'; },
    reset() { this.state = 'running'; },
  };
}
