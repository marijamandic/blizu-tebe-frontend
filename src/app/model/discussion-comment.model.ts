export interface DiscussionComment {
  id: number;
  text: string;
  commentedAt: Date;
  userId: number;
  discussionId: number;
}
