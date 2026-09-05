'use client';

import { cn, formatTime } from '@/lib/utils';
import { SEVERITY_CONFIG } from '@/lib/constants';
import type { ChatMessage as ChatMessageType } from '@/types';
import { MessageContent } from './MessageContent';

function AssistantAvatar() {
  return (
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2 12h4l2.5-6 4 12L15 9l1.5 3H22" />
      </svg>
    </span>
  );
}

export function ChatMessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'USER';

  if (isUser) {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-xl whitespace-pre-wrap rounded-2xl bg-teal-600 px-4 py-3 text-sm leading-relaxed text-white">
          {message.content}
        </div>
        <p className="mt-1 text-right text-xs text-zinc-400">{formatTime(message.createdAt)}</p>
      </div>
    );
  }

  const severity = message.severity ? SEVERITY_CONFIG[message.severity] : null;

  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar />
      <div className="min-w-0">
        <div className="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5">
          <MessageContent content={message.content} />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-xs text-zinc-400">{formatTime(message.createdAt)}</p>
          {severity && message.severity !== 'LOW' && (
            <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', severity.badge)}>
              {severity.label} severity
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar />
      <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
