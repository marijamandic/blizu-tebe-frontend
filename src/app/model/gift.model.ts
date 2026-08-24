export interface Gift {
  id: number;
  title: string;
  description: string;
  giftCategory: GiftCategory;
  postDate: Date;
  expireDate: Date;
  status: GiftStatus;
  userId: number;
  contact: string;
  attachment?: string;
}

export enum GiftCategory
{
    Clothing,
    Electronics,
    Books,
    Toys,
    Furniture,
    Household,
    Sports,
    Other
}

export enum GiftStatus
{
    Pending,
    Completed,
    Canceled,
    Expired
}