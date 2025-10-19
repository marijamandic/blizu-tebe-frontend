export interface User{
    id: number;
    username: string;
    password: string;
    name: string;
    surname: string;
    role: UserRole;
    dateOfBirth: Date;
    isVerified: boolean;
    localCommunityId: number;
    profilePicture: string;
    rating: number;
}

export enum UserRole {
  Admin = 0,
  Member = 1
}