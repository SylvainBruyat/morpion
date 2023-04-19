export type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

export type Move = {
  squareId: number;
  player: Player;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null;
};

export type Game = {
  moves: Move[];
  currentPlayer: Player;
  status: GameStatus;
};

export type GameState = {
  currentGameMoves: Move[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};

export type SaveStateCb = (previousState: GameState) => GameState;

type PlayerWithWins = Player & { wins: number };

export type DerivedStats = {
  playersWithStats: PlayerWithWins[];
  ties: number;
};
