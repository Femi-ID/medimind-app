'use client';

import { useRef, useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  sending?: boolean;
  disabledReason?: string;
}

export function ChatComposer({ onSend, disabled, sending, disabledReason }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || disabled || sending) return;
    onSend(text);
    setValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  }

  if (disabled) {
    return (
      <div className="shrink-0 bg-zinc-50 p-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-2 opacity-70">
            <div className="flex items-end gap-2">
              <div className="flex min-h-[52px] flex-1 items-center px-2 py-3 text-sm text-zinc-400">
                {disabledReason ?? 'Composer disabled'}
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-300">
                <ArrowUp className="h-5 w-5 text-white" />
              </span>
            </div>
          </div>
          <p className="mt-2 px-1 text-xs text-zinc-400">
            MediMind offers preliminary guidance, not a diagnosis. Always confirm with a professional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 bg-zinc-50 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-zinc-300 bg-white p-2 transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
          <div className="flex items-end gap-2">
            <label htmlFor="composer" className="sr-only">
              Describe how you&apos;re feeling
            </label>
            <textarea
              id="composer"
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe how you're feeling. If it's an emergency, call your local emergency line."
              className="max-h-[200px] min-h-[52px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
            />
            <button
              onClick={submit}
              disabled={!value.trim() || sending}
              aria-label="Send message"
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                !value.trim() || sending ? 'bg-zinc-300' : 'bg-teal-600 hover:bg-teal-700',
              )}
            >
              {sending ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-xs text-zinc-500">
            MediMind offers preliminary guidance, not a diagnosis. Always confirm with a professional.
          </p>
          <p className="hidden text-xs text-zinc-400 sm:block">
            <kbd className="font-sans">⌘/Ctrl + Enter</kbd> to send
          </p>
        </div>
      </div>
    </div>
  );
}
