export interface Game {
  created_at: string | null;
  duration: number;
  id: string;
  odds: number;
  pool: number | null;
  starts_at: string;
  time_arr: number[];
  winning_numbers: number[];
  episode_no: number;
  country: string | null;
  prizes: string[] | null;
}
