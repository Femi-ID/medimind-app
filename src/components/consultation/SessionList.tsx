'use client';

import { useState } from 'react';
import { Plus, Search, Trash2, MessageCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn, formatRelative, getErrorMessage } from '@/lib/utils';
import { useSessions, useDeleteSession } from '@/hooks/use-consultation';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ChatSessionSummary } from '@/types';

interface SessionListProps {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDeletedActive: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function SessionList({
  activeId,
  onSelect,
  onNew,
  onDeletedActive,
  mobileOpen,
  onCloseMobile,
}: SessionListProps) {
  const { data, isLoading } = useSessions();
  const deleteSession = useDeleteSession();
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<ChatSessionSummary | null>(null);

  const sessions = (data?.sessions ?? []).filter((s) =>
    query ? (s.title ?? '').toLowerCase().includes(query.toLowerCase()) : true,
  );

  async function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    try {
      await deleteSession.mutateAsync(id);
      toast.success('Consultation deleted');
      if (id === activeId) onDeletedActive();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete that consultation.'));
    } finally {
      setPendingDelete(null);
    }
  }

  const listBody = (
    <>
      <div className="border-b border-zinc-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Consultations</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onNew}
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-teal-600 px-3 text-xs font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
            <button
              onClick={onCloseMobile}
              aria-label="Close consultations"
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search consultations…"
            aria-label="Search consultations"
            className="h-9 w-full rounded-lg border border-zinc-300 pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {isLoading ? (
          [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
        ) : sessions.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-3 text-sm font-medium text-zinc-700">
              {query ? 'No matches' : 'No consultations yet'}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {query ? 'Try a different search.' : 'Start one by describing how you feel.'}
            </p>
          </div>
        ) : (
          sessions.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={cn(
                  'group block w-full rounded-lg p-3 text-left transition-colors',
                  active ? 'bg-zinc-800' : 'hover:bg-zinc-100',
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      active ? 'bg-zinc-700' : 'bg-zinc-100',
                    )}
                  >
                    <MessageCircle className={cn('h-4 w-4', active ? 'text-teal-300' : 'text-zinc-500')} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn('line-clamp-1 text-sm font-medium', active ? 'text-white' : 'text-zinc-900')}>
                        {s.title || 'New consultation'}
                      </p>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete(s);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            setPendingDelete(s);
                          }
                        }}
                        aria-label="Delete consultation"
                        className={cn(
                          'shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100',
                          active ? 'text-zinc-400 hover:text-red-300' : 'text-zinc-400 hover:text-red-600',
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </span>
                    </div>
                    {s.lastMessage?.content && (
                      <p className={cn('mt-0.5 line-clamp-1 text-xs', active ? 'text-zinc-300' : 'text-zinc-500')}>
                        {s.lastMessage.content}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={cn('text-xs', active ? 'text-zinc-400' : 'text-zinc-400')}>
                        {formatRelative(s.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop rail */}
      <section className="hidden h-screen w-72 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
        {listBody}
      </section>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-zinc-900/40" onClick={onCloseMobile} aria-hidden />
          <section className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl">
            {listBody}
          </section>
        </div>
      )}

      <Dialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete this consultation?"
        description="This permanently removes the conversation and its messages. This can't be undone."
      >
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1" loading={deleteSession.isPending} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
}
