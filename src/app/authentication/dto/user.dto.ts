/**
 * User DTO from backend /auth/me endpoint
 * Matches the exact structure returned by the API
 */
export interface IUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
  passwordHash: string;
  avatar: string | null;
  isActive: boolean;
  role: 'admin' | 'user';
  provider: string | null;
  providerId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lastActiveAt: string | null; // ISO date string
}

/**
 * Auth Me Response DTO
 * Wraps the user DTO in the standard API response format
 */
export interface IAuthMeResponseDto {
  statusCode: number;
  message: string;
  timestamp: string; // ISO date string
  data: IUserDto;
}
