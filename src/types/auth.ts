/**
 * Authentication DTOs - Request/Response types
 * Aligned with backend API contracts
 */

export type AuthenticationRequestDTO = {
  email: string;
  password: string;
};

export type AuthenticationResponseDTO = {
  id: number;
  email: string;
  role: 'USER';
  accessToken: string;
};

export type RegisterRequestDTO = {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
};

export type RegisterResponseDTO = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'USER';
  active: boolean;
  tierPoint: number;
};

export type VerifyRequestDTO = {
  token: string;
};

export type VerifyResponseDTO = {
  valid: boolean;
  email?: string;
  role?: 'USER';
};

export type ProfileUpdateRequestDTO = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  tierPoint?: number;
};

export type ProfileUpdateResponseDTO = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password : string;
  role: 'USER';
  active: boolean;
  tierPoint: number;
};

export type   GetProfileResponseDTO = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password : string;
  role: 'USER';
  active: boolean;
  tierPoint: number;
  tier?: {
    name: string;
    code: string;
    requiredPoints: number;
  };
  joinDate?: string;
};

export type ChangePasswordRequestDTO = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export type ChangePasswordResponseDTO = {
  success: boolean;
  message: string;
};

export type ApiErrorResponse<T>
 = {
  data: T;
  message: string;
  status: 'SUCCESS' | 'ERROR' | 'FAILURE';
  timestamp?: string;
};


export type User = {
  id?: number;
  name?: string;
  email: string;
  role: 'USER';
  phoneNumber?: string;
  active?: boolean;
  tierPoint?: number;
  tier?: {
    name: string;
    code: string;
    requiredPoints: number;
  };
  password ?: string;
  accessToken: string;
};
