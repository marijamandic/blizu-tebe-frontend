export interface CommunityRequest {
  id: number;
  title: string;
  description: string;
  picture?: string;
  createdAt: Date;
  fulfilled: boolean;
  requestType: RequestType;
  adminId?: number;
  localCommunityId?: number;
}

export enum RequestType {
  Donation = 0,
  Volunteering = 1,
  Transport = 2
}

