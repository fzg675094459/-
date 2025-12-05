
export enum GameState {
  INTRO = 'INTRO',
  EXPLORATION = 'EXPLORATION',
  READING = 'READING', // Reading the paper diary
  OBSERVING = 'OBSERVING', // Looking at visual clues (blood, objects)
  PUZZLE = 'PUZZLE',
  JUMPSCARE = 'JUMPSCARE',
  ENDING = 'ENDING'
}

export enum ExplorationStage {
  ENTER = 0,
  FIND_PAPER = 1, // Paper found/read
  FIND_CLUE = 2,  // Blood stain inspected
  UNLOCK_ALTAR = 3 // Ready to unlock
}

export interface AudioConfig {
  bgmVolume: number;
  sfxVolume: number;
  muted: boolean;
}

export enum PuzzleSymbol {
  THUNDER = '⚡', // Zhen (震)
  WIND = '💨', // Xun (巽)
  FIRE = '🔥', // Li (离)
  MOUNTAIN = '⛰️' // Gen (艮)
}
