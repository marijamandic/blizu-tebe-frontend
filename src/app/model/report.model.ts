export interface Report{
    id: number;
    description: string;
    timestamp: Date;
    status: ReportStatus;
    reporterId: number;
    postType: PostType;
    postId: number;
}

export enum ReportStatus
{
    Pending,
    Rejected,
    Accepted
}

export enum PostType
{
    HelpRequest,
    Gift
}