import { api } from './client';
import type { Hospital, Referral, SeverityParam } from '@/types';

export interface NearbyQuery {
  latitude: number;
  longitude: number;
  severity: SeverityParam;
  radius?: number;
}

/** GET /hospitals/nearby → up to 3 facilities ranked by distance. */
export async function getNearby(query: NearbyQuery): Promise<Hospital[]> {
  const res = await api.get<Hospital[]>('/hospitals/nearby', { params: query });
  return res.data;
}

export interface CreateReferralPayload {
  sessionId?: string;
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  severity: SeverityParam;
}

/** POST /hospitals/referrals → records that a user was referred to a facility. */
export async function createReferral(payload: CreateReferralPayload): Promise<Referral> {
  const res = await api.post<Referral>('/hospitals/referrals', payload);
  return res.data;
}

/** GET /hospitals/referrals → the current user's referral history. */
export async function listReferrals(): Promise<Referral[]> {
  const res = await api.get<Referral[]>('/hospitals/referrals');
  return res.data;
}
