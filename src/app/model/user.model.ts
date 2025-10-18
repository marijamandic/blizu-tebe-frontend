export interface User{
    id: number;
    username: string;
    password: string;
    name: string;
    surname: string;
    role: UserRole;
    dateOfBirth: Date;
    isVerified: boolean;
    localCommunity: number;
    profilePicture: string;
    rating: number;
}

export enum UserRole {
  Admin = 1,
  Member = 2
}