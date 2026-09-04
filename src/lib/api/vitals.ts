import { api } from './client';
import type { Vital, VitalLatestEntry, VitalParameter, VitalTrends } from '@/types';

export interface CreateVitalPayload {
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  bloodGlucose?: number;
  weight?: number;
}

/** POST /vitals → the created Vital. Send any non-empty subset. */
export async function createVital(payload: CreateVitalPayload): Promise<Vital> {
  const res = await api.post<Vital>('/vitals', payload);
  return res.data;
}

export interface ListVitalsQuery {
  from?: string;
  to?: string;
  limit?: number;
  parameter?: VitalParameter;
}

/** GET /vitals → array of readings (newest first). */
export async function listVitals(query: ListVitalsQuery = {}): Promise<Vital[]> {
  const res = await api.get<Vital[]>('/vitals', { params: query });
  return res.data;
}

/** GET /vitals/latest → ARRAY, one entry per parameter. */
export async function getLatest(): Promise<VitalLatestEntry[]> {
  const res = await api.get<VitalLatestEntry[]>('/vitals/latest');
  return res.data;
}

/** GET /vitals/trends?parameter=<snake_case>&days=. */
export async function getTrends(parameter: VitalParameter, days = 7): Promise<VitalTrends> {
  const res = await api.get<VitalTrends>('/vitals/trends', { params: { parameter, days } });
  return res.data;
}

/** PATCH /vitals/:id → updated Vital. */
export async function updateVital(id: string, payload: CreateVitalPayload): Promise<Vital> {
  const res = await api.patch<Vital>(`/vitals/${id}`, payload);
  return res.data;
}

/** DELETE /vitals/:id. */
export async function deleteVital(id: string): Promise<void> {
  await api.delete(`/vitals/${id}`);
}
