'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PanelLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth/store';
import { useSession, useSendMessage, consultationKeys } from '@/hooks/use-consultation';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getErrorMessage, getErrorStatus, getErrorCode } from '@/lib/utils';
import { SEVERITY_TO_PARAM } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { SessionList } from '@/components/consultation/SessionList';
import { VitalsContextStrip } from '@/components/consultation/VitalsContextStrip';
import { ChatComposer } from '@/components/consultation/ChatComposer';
import { ChatMessageBubble, TypingIndicator } from '@/components/consultation/ChatMessage';
import { TriageBanner } from '@/components/consultation/TriageBanner';
import { EmergencyCard } from '@/components/consultation/EmergencyCard';
import type { ChatMessage, ChatSessionDetail, SendMessageResponse } from '@/types';

export default function ConsultationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const geo = useGeolocation();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileSessionsOpen, setMobileSessionsOpen] = useState(false);
  // Optimistic user message shown immediately while awaiting the reply.
  const [pendingUserText, setPendingUserText] = useState<string | null>(null);
  // The latest reply envelope, used to drive triage/emergency UI.
  const [lastResult, setLastResult] = useState<SendMessageResponse | null>(null);

  const { data: session, isLoading: sessionLoading } = useSession(activeId);
  const sendMessage = useSendMessage();
  const threadRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] = session?.messages ?? [];
  const isEmergency = lastResult?.isEmergency || lastResult?.triage === 'EMERGENCY';

  // Auto-scroll to the newest content whenever the thread changes.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, pendingUserText, sendMessage.isPending, lastResult]);

  // Reset transient state when switching sessions.
  function selectSession(id: string) {
    setActiveId(id);
    setLastResult(null);
    setPendingUserText(null);
    setMobileSessionsOpen(false);
  }

  function startNew() {
    setActiveId(null);
    setLastResult(null);
    setPendingUserText(null);
    setMobileSessionsOpen(false);
  }

  async function handleSend(text: string) {
    setPendingUserText(text);
    setLastResult(null);
    try {
      const result = await sendMessage.mutateAsync({
        content: text,
        sessionId: activeId ?? undefined,
        // Coordinates are only sent if we already have a cached fix (never
        // prompts here — the backend also fetches hospitals on HIGH severity).
        lat: geo.coords?.lat,
        lng: geo.coords?.lng,
      });

      // Seed the session cache with both new messages so the reply appears
      // instantly (the hook also invalidates to reconcile with the server).
      queryClient.setQueryData<ChatSessionDetail>(
        consultationKeys.session(result.sessionId),
        (old) => {
          const base: ChatSessionDetail =
            old ?? {
              id: result.sessionId,
              userId: user?.id ?? '',
              title: '',
              createdAt: result.userMessage.createdAt,
              updatedAt: result.assistantMessage.createdAt,
              messages: [],
            };
          return {
            ...base,
            updatedAt: result.assistantMessage.createdAt,
            messages: [...base.messages, result.userMessage, result.assistantMessage],
          };
        },
      );

      setLastResult(result);
      setPendingUserText(null);
      // A brand-new session returns its id — adopt it so history loads.
      if (result.isNewSession || !activeId) {
        setActiveId(result.sessionId);
      }
    } catch (err) {
      const status = getErrorStatus(err);
      const code = getErrorCode(err);
      if (status === 429) {
        toast.error("You've reached the message limit for now. Please try again a little later.");
      } else if (status === 403 && code === 'PROFILE_INCOMPLETE') {
        toast.error('Please complete your profile before starting a consultation.');
        router.push('/profile?reason=consultation');
      } else {
        toast.error(getErrorMessage(err, 'Could not send that message.'));
      }
      // Roll back the optimistic bubble on failure.
      setPendingUserText(null);
    }
  }

  async function goToHospitals() {
    // Pass along severity (and the session, for referral tracking) so the
    // hospitals page can pre-filter and log which consultation prompted it.
    const severity = lastResult ? SEVERITY_TO_PARAM[lastResult.severity] : 'moderate';
    const params = new URLSearchParams({ severity });
    if (activeId) params.set('sessionId', activeId);
    router.push(`/hospitals?${params.toString()}`);
  }

  // Once real messages include our pending text, drop the optimistic copy.
  const showPending =
    pendingUserText != null &&
    !messages.some((m) => m.role === 'USER' && m.content === pendingUserText);

  const headerTitle = useMemo(() => {
    if (session?.title) return session.title;
    if (activeId) return 'Consultation';
    return 'New consultation';
  }, [session?.title, activeId]);

  const isEmpty = !activeId && !showPending && !sendMessage.isPending;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden md:h-screen">
      <SessionList
        activeId={activeId}
        onSelect={selectSession}
        onNew={startNew}
        onDeletedActive={startNew}
        mobileOpen={mobileSessionsOpen}
        onCloseMobile={() => setMobileSessionsOpen(false)}
      />

      {/* Chat column */}
      <main className="flex h-full min-w-0 flex-1 flex-col bg-zinc-50">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open consultations"
              onClick={() => setMobileSessionsOpen(true)}
              className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 lg:hidden"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <h1 className="truncate text-lg font-semibold tracking-tight text-zinc-900">{headerTitle}</h1>
            {activeId && (
              <span className="hidden shrink-0 items-center gap-1 rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                Session active
              </span>
            )}
          </div>
        </header>

        <VitalsContextStrip />

        {/* Thread */}
        <div ref={threadRef} className="scrollbar-thin flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {isEmpty ? (
              <WelcomeState firstName={user?.firstName} />
            ) : sessionLoading && activeId ? (
              <div className="flex justify-center py-10">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-teal-600" />
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <ChatMessageBubble key={m.id} message={m} />
                ))}

                {showPending && (
                  <div className="flex flex-col items-end">
                    <div className="max-w-xl whitespace-pre-wrap rounded-2xl bg-teal-600 px-4 py-3 text-sm leading-relaxed text-white opacity-80">
                      {pendingUserText}
                    </div>
                  </div>
                )}

                {sendMessage.isPending && <TypingIndicator />}

                {/* Emergency replaces normal guidance */}
                {isEmergency && !sendMessage.isPending && (
                  <EmergencyCard onFindHospital={goToHospitals} />
                )}

                {/* Non-emergency triage call-to-action */}
                {lastResult && !isEmergency && !sendMessage.isPending && (
                  <TriageBanner result={lastResult} onFindClinic={goToHospitals} />
                )}
              </>
            )}
          </div>
        </div>

        <ChatComposer
          onSend={handleSend}
          sending={sendMessage.isPending}
          disabled={isEmergency}
          disabledReason="For your safety, the composer is paused during a possible emergency. Please seek immediate care."
        />
      </main>
    </div>
  );
}

function WelcomeState({ firstName }: { firstName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100">
        <Sparkles className="h-6 w-6 text-teal-600" />
      </span>
      <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-zinc-900">
        {firstName ? `Hello, ${firstName}` : 'Hello'}
      </h2>
      <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-zinc-600">
        Describe how you&apos;re feeling and MediMind will offer preliminary guidance — informed by
        your recent vitals. It isn&apos;t a diagnosis, and for anything that feels like an emergency,
        please call your local emergency line right away.
      </p>
    </div>
  );
}
