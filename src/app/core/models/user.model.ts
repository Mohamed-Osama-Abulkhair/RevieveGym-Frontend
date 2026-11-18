export enum UserRole {
  Admin = 'admin',
  Coach = 'coach',
  Receptionist = 'receptionist',
  Member = 'member',
}

export interface IUser {
  _id: string;
  memberCode?: string;
  displayName: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  role: UserRole;
  gender: 'male' | 'female';
  birthDate?: string;
  healthNotes?: string;
  image?: {
    id: string;
    url: string;
  };
  active: boolean;
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  message: string;
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
