import { PostType } from "./report.model";

export interface Chat{
    id: number
    user1Id: number;
    user2Id: number;
    postId: number;
    postType: PostType
}