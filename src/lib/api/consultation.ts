import { api } from './client';
import type {
  ChatSessionDetail,
  ChatSessionSummary,
  ListSessionsResponse,
  SendMessageResponse,
} from '@/types';

/** POST /consultations/sessions → new empty session. */
export async function createSession(title?: string): Promise<ChatSessionSummary> {
  const res = await api.post<ChatSessionSummary>('/consultations/sessions', { title });
  return res.data;
}

/** GET /consultations/sessions?limit&offset → { sessions, total }. */
export async function listSessions(limit = 20, offset = 0): Promise<ListSessionsResponse> {
  const res = await api.get<ListSessionsResponse>('/consultations/sessions', {
    params: { limit, offset },
  });
  return res.data;
}

/** GET /consultations/sessions/:id → session with full message history. */
export async function getSession(id: string): Promise<ChatSessionDetail> {
  const res = await api.get<ChatSessionDetail>(`/consultations/sessions/${id}`);
  return res.data;
}

/** PATCH /consultations/sessions/:id → renamed session. */
export async function renameSession(id: string, title: string): Promise<ChatSessionSummary> {
  const res = await api.patch<ChatSessionSummary>(`/consultations/sessions/${id}`, { title });
  return res.data;
}

/** DELETE /consultations/sessions/:id → 204. */
export async function deleteSession(id: string): Promise<void> {
  await api.delete(`/consultations/sessions/${id}`);
}

export interface SendMessagePayload {
  content: string;
  sessionId?: string; // omit to start a new session
  language?: string; // send "en" for MVP
  lat?: number;
  lng?: number;
}

/** POST /consultations/messages → full triage envelope. */
export async function sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
  const res = await api.post<SendMessageResponse>('/consultations/messages', {
    language: 'en',
    ...payload,
  });
  return res.data;
}
