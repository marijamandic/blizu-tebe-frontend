export interface Discussion {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  isPinned: boolean;
  adminId?: number;
  localCommunityId?: number;
}
