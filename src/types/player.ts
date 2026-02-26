export interface Player {
  id: number;
  name: string;
  level: "rookie" | "amateur" | "pro";
  score: number;
}

export type PlayerLevel = Player["level"];

export interface PlayersResponse {
  players: Player[];
  total: number;
}

export interface PlayersQueryParams {
  start: number;
  n: number;
  level?: PlayerLevel;
  search?: string;
}
