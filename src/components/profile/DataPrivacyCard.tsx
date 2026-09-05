'use client';

import { toast } from 'sonner';
import { Download, KeyRound, Shield, Trash2 } from 'lucide-react';
import { useExportData } from '@/hooks/use-profile';
import { getErrorMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DataPrivacyCardProps {
  onChangePassword: () => void;
  onDelete: () => void;
}

export function DataPrivacyCard({ onChangePassword, onDelete }: DataPrivacyCardProps) {
  const exportData = useExportData();

  async function handleExport() {
    try {
      const data = await exportData.mutateAsync();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medimind-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not export your data.'));
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Data &amp; Privacy</p>
      <div className="divide-y divide-zinc-100">
        <div className="flex min-h-[56px] items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
              <Download className="h-[18px] w-[18px] text-zinc-600" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900">Export my health data</p>
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">Download everything as JSON</p>
            </div>
          </div>
          <Button size="sm" onClick={handleExport} loading={exportData.isPending} className="shrink-0">
            Export
          </Button>
        </div>

        <div className="flex min-h-[56px] items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
              <KeyRound className="h-[18px] w-[18px] text-zinc-600" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900">Change password</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onChangePassword} className="shrink-0">
            Change
          </Button>
        </div>

        <div className="flex min-h-[56px] items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
              <Shield className="h-[18px] w-[18px] text-zinc-600" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900">Two-factor authentication</p>
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">Not enabled</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast('Two-factor authentication is coming soon.')}
            className="shrink-0"
          >
            Enable
          </Button>
        </div>

        <div className="-mx-5 -mb-5 mt-2 rounded-b-2xl border-t border-red-100 bg-red-50/40 px-5 pb-5 pt-4 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6">
          <div className="flex min-h-[56px] items-center justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50">
                <Trash2 className="h-[18px] w-[18px] text-red-600" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-red-700">Delete all my data</p>
                <p className="mt-0.5 text-xs leading-relaxed text-red-700/70">
                  Permanent action · Cannot be undone
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={onDelete} className="shrink-0 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
