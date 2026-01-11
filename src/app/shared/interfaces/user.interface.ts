export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role?: 'admin' | 'user';
  isActive?: boolean;
  avatar?: string;
}
