'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/lib/auth/store';
import { usersApi, authApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from '@/lib/validators/auth';

/* --------------------------------------------------------- shared pieces */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

function FormAlert({ message }: { message: string }) {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

/** Input with a leading lucide icon. */
const IconInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { icon: LucideIcon; invalid?: boolean }
>(({ icon: Icon, className, invalid, ...props }, ref) => (
  <div className="relative">
    <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
    <Input ref={ref} invalid={invalid} className={`pl-10 h-11 ${className ?? ''}`} {...props} />
  </div>
));
IconInput.displayName = 'IconInput';

/** Password input: lock icon + show/hide toggle. */
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        invalid={invalid}
        className={`pl-10 pr-11 h-11 ${className ?? ''}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

function AuthTabs({ active }: { active: 'signin' | 'register' }) {
  const base = 'relative pb-3 text-center text-sm font-medium transition-colors';
  return (
    <div className="mt-8 grid grid-cols-2 border-b border-zinc-200">
      <Link href="/login" className={`${base} ${active === 'signin' ? 'text-teal-700' : 'text-zinc-500 hover:text-zinc-800'}`}>
        Sign in
        {active === 'signin' && <span className="absolute -bottom-px left-0 h-0.5 w-full bg-teal-600" />}
      </Link>
      <Link href="/register" className={`${base} ${active === 'register' ? 'text-teal-700' : 'text-zinc-500 hover:text-zinc-800'}`}>
        Register
        {active === 'register' && <span className="absolute -bottom-px left-0 h-0.5 w-full bg-teal-600" />}
      </Link>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = authApi.googleLoginUrl();
      }}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1C3.3 21.3 7.3 24 12 24z" />
        <path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4-3.1z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
      </svg>
      {label}
    </button>
  );
}

function TrustLine() {
  return (
    <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
      <ShieldCheck className="h-3.5 w-3.5" />
      Protected by JWT and TLS 1.3
    </p>
  );
}

/* --------------------------------------------------------------- Sign in */

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(values: LoginValues) {
    setSubmitError(null);
    try {
      await signIn(values.email, values.password);
      toast.success('Signed in');
      router.replace('/dashboard');
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Email or password isn't right. Try again."));
    }
  }

  return (
    <>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900">Welcome back</h1>
      <p className="mt-2 text-sm text-zinc-600">Sign in to continue.</p>
      <AuthTabs active="signin" />

      <form className="mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        {submitError && <FormAlert message={submitError} />}

        <div className="mb-4">
          <Label htmlFor="email" className="mb-1.5">Email address</Label>
          <IconInput
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="chinedu.okafor@gmail.com"
            icon={Mail}
            invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="mb-4">
          <Label htmlFor="password" className="mb-1.5">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={!!errors.password}
            {...register('password')}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <Checkbox {...register('rememberMe')} />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => toast('Password reset is coming soon.')}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>

        <Divider />
        <GoogleButton label="Sign in with Google" />

        <p className="mt-6 text-center text-sm text-zinc-600">
          New here?{' '}
          <Link href="/register" className="font-medium text-teal-600 hover:text-teal-700">
            Create an account
          </Link>
        </p>
        <TrustLine />
      </form>
    </>
  );
}

/* -------------------------------------------------------------- Register */

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: '' | 'MALE' | 'FEMALE' | 'OTHER';
  age: string;
  agreeToTerms: boolean;
};

function PasswordStrength({ value }: { value: string }) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  if (value.length && value.length < 8) score = Math.min(score, 1);

  const colors = ['bg-red-500', 'bg-amber-500', 'bg-amber-500', 'bg-emerald-500'];
  const labels = ['Too weak', 'Weak', 'Good', 'Strong'];
  const help = !value
    ? '8+ characters, at least one number.'
    : `${labels[Math.max(0, score - 1)]} · 8+ characters, at least one number.`;
  const helpColor = !value
    ? 'text-zinc-500'
    : score >= 3
      ? 'text-emerald-600'
      : score === 2
        ? 'text-amber-600'
        : 'text-red-600';

  return (
    <div className="mt-2">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-zinc-200'}`}
          />
        ))}
      </div>
      <p className={`mt-1.5 text-xs ${helpColor}`}>{help}</p>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues, unknown, RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: '',
      age: '',
      agreeToTerms: false,
    },
  });

  const passwordValue = watch('password');

  async function onSubmit(values: RegisterValues) {
    setSubmitError(null);
    try {
      await usersApi.createUser({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        gender: values.gender,
      });

      // Signup returns no tokens — log in with the same credentials.
      await signIn(values.email, values.password);

      // Age isn't accepted by /users/create; apply it now (best-effort).
      if (values.age != null) {
        try {
          const updated = await usersApi.updateProfile({ age: values.age });
          setUser(updated);
        } catch {
          /* non-fatal — user can set age on the profile page */
        }
      }

      setDone(true);
      toast.success('Account created');
      router.replace('/dashboard');
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Could not create your account. Please try again.'));
    }
  }

  return (
    <>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-zinc-600">Takes less than a minute.</p>
      <AuthTabs active="register" />

      {done && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-sm">Account created. Taking you to MediMind…</p>
        </div>
      )}

      <form className="mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        {submitError && <FormAlert message={submitError} />}

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="mb-1.5">First name</Label>
            <IconInput id="firstName" placeholder="Aisha" icon={User} invalid={!!errors.firstName} {...register('firstName')} />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="lastName" className="mb-1.5">Last name</Label>
            <Input id="lastName" className="h-11" placeholder="Bello" invalid={!!errors.lastName} {...register('lastName')} />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="reg-email" className="mb-1.5">Email address</Label>
          <IconInput id="reg-email" type="email" autoComplete="email" placeholder="chinedu.okafor@gmail.com" icon={Mail} invalid={!!errors.email} {...register('email')} />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="mb-4">
          <Label htmlFor="reg-password" className="mb-1.5">Password</Label>
          <PasswordInput id="reg-password" autoComplete="new-password" placeholder="••••••••" invalid={!!errors.password} {...register('password')} />
          {errors.password ? (
            <FieldError message={errors.password.message} />
          ) : (
            <PasswordStrength value={passwordValue ?? ''} />
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="mb-1.5">
              Age <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Input id="age" type="number" min={1} max={120} className="h-11" placeholder="34" invalid={!!errors.age} {...register('age')} />
            <FieldError message={errors.age?.message} />
          </div>
          <div>
            <Label htmlFor="gender" className="mb-1.5">
              Gender <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Select id="gender" className="h-11" defaultValue="" {...register('gender')}>
              <option value="" disabled hidden>Select</option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
              <option value="OTHER">Prefer not to say</option>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-zinc-600">
            <Checkbox className="mt-0.5 shrink-0" {...register('agreeToTerms')} />
            <span>
              I agree to the{' '}
              <Link href="#" className="font-medium text-teal-600 hover:text-teal-700">Terms</Link> and{' '}
              <Link href="#" className="font-medium text-teal-600 hover:text-teal-700">Privacy Policy</Link>.
            </span>
          </label>
          <FieldError message={errors.agreeToTerms?.message} />
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? 'Creating your account…' : 'Create account'}
        </Button>

        <Divider />
        <GoogleButton label="Sign up with Google" />

        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">Sign in</Link>
        </p>
        <TrustLine />
      </form>
    </>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-zinc-200" />
      <span className="text-xs text-zinc-500">or</span>
      <span className="h-px flex-1 bg-zinc-200" />
    </div>
  );
}
