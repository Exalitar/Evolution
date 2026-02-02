export interface PlayerState {
  level: number;
  score: number;
  energy: number;
}

export const createInitialPlayerState = (): PlayerState => ({
  level: 1,
  score: 0,
  energy: 100,
});
