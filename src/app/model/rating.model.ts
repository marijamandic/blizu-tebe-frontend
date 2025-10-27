export interface Rating {
  id: number;
  score: number;
  comment?: string;
  timeStamp: Date;
  raterId: number;
  ratedId: number;
}
