export interface Notification{
    id: number;
    description: string;
    notificationType: NotificationType;
    userId: number;
    timestamp: Date;
    isRead: boolean;
    relatedObjectId: number;
    relatedObjectType: RelatedObjectType
}

export enum NotificationType{
    NewMessage,
    NewReport,
    ReportAccepted,
    ReportRejected,
    HelpRequestMatched
}

export enum RelatedObjectType
{
    Message,
    Gift,
    HelpRequest
}