import { api } from './client';
import type { Gender, PreferredLanguage, User } from '@/types';

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender?: Gender;
}

/** POST /users/create → public user (NO tokens; caller then logs in). */
export async function createUser(payload: CreateUserPayload): Promise<User> {
  const res = await api.post<User>('/users/create', payload);
  return res.data;
}

/** GET /users/profile → the current user. */
export async function getProfile(): Promise<User> {
  const res = await api.get<User>('/users/profile');
  return res.data;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: Gender;
  preferredLanguage?: PreferredLanguage;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

/** PATCH /users/me → updated user. */
export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const res = await api.patch<User>('/users/me', payload);
  return res.data;
}

/** POST /users/me/change-password → 204. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.post('/users/me/change-password', { currentPassword, newPassword });
}

/** DELETE /users/me → 204 (soft delete). Body carries the password. */
export async function deleteAccount(password: string): Promise<void> {
  await api.delete('/users/me', { data: { password } });
}

/** GET /users/me/export → full JSON dump (returned as an object to download). */
export async function exportData(): Promise<unknown> {
  const res = await api.get('/users/me/export');
  return res.data;
}
