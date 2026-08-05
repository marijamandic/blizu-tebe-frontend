export enum HelpCategory {
  OldPeopleHelp,
  HouseKeeping,
  PetCare,
  SmallRepairs,
  StudyHelp,
  ThingsExchange,
  PhysicalWork,
  Socializing
}

export enum HelpStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Canceled = 'Canceled',
  Expired = 'Expired'
}

export enum HelpType {
  Asking = 'Asking',
  Offering = 'Offering'
}

export interface HelpRequest {
  id: number;
  title: string;
  description: string;
  category: HelpCategory;
  postDate: Date;
  expireDate: Date;
  status: HelpStatus;
  userId: number;
  contact: string;
  helpType: HelpType;
  attachment?: string;
}