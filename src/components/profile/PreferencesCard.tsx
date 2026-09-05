'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Globe, Phone, Bell, Ruler, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/store';
import { useUpdateProfile } from '@/hooks/use-profile';
import { LANGUAGE_OPTIONS } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import type { PreferredLanguage } from '@/types';

export function PreferencesCard({ onEditContact }: { onEditContact: () => void }) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const [savingLang, setSavingLang] = useState(false);

  async function handleLanguageChange(value: PreferredLanguage) {
    setSavingLang(true);
    try {
      await updateProfile.mutateAsync({ preferredLanguage: value });
      toast.success('Language updated');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update language.'));
    } finally {
      setSavingLang(false);
    }
  }

  const hasContact = !!(user?.phoneNumber && user?.emergencyContactName && user?.emergencyContactPhone);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Preferences</p>
      <div className="divide-y divide-zinc-100">
        <Row icon={Globe} label="Preferred language">
          <Select
            value={user?.preferredLanguage ?? 'ENGLISH'}
            disabled={savingLang}
            onChange={(e) => handleLanguageChange(e.target.value as PreferredLanguage)}
            className="h-9 w-36"
          >
            {LANGUAGE_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </Select>
        </Row>

        <Row
          icon={Bell}
          label="Notifications"
          description="Daily vital reminders, trend alerts, AI responses"
        >
          <button
            role="switch"
            aria-checked={false}
            onClick={() => toast('Notification preferences are coming soon.')}
            className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-200 transition-colors"
          >
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
          </button>
        </Row>

        <Row icon={Ruler} label="Measurement units" description="mmHg · kg · mmol/L (metric only, for now)" />

        <button
          onClick={onEditContact}
          className="-mx-2 flex w-full items-start justify-between gap-3 rounded-lg px-2 py-4 text-left transition-colors hover:bg-zinc-50"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
              <Phone className="h-[18px] w-[18px] text-teal-600" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900">Phone &amp; emergency contact</p>
              <p className="mt-0.5 truncate text-xs leading-relaxed text-zinc-500">
                {hasContact
                  ? `${user!.emergencyContactName} · ${user!.emergencyContactPhone}`
                  : 'Not set — required to start a consultation'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[56px] items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
          <Icon className="h-[18px] w-[18px] text-teal-600" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900">{label}</p>
          {description && <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
