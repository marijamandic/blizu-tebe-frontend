export interface Announcement{
    id: number;
    title: string;
    description: string;
    existingPicture: string;
    publishedAt: Date;
    expirationDate: Date;
    isImportant: boolean;
    adminId?: number;
    localCommuntyId?: number;
}