export interface Discussion {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  isClosed: boolean;
  adminId?: number;
  localCommunityId?: number;
}
