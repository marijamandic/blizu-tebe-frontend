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
  Donation = 'Donacija',
  Volunteering = 'Volontiranje',
  Transport = 'Transport'
}

