import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { InputField } from '../../../components/ui/InputField.jsx';
import { AuthLayout } from '../../../components/Auth/AuthLayout.jsx';
import { FormMessage } from '../../../components/ui/FormMessage.jsx';
import { authApi } from '../../../lib/authApi.js';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isPending, setIsPending] = useState(false);
  const email = searchParams.get('email') || '';

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Choose a new password"
      description="Enter the one-time code and choose a strong password for your account."
      footer={
        <>
          Need a new code?{' '}
          <Link
            className="font-semibold text-accent hover:text-accent-dark hover:underline"
            to={`/auth/resend-otp?purpose=password_reset${email ? `&email=${encodeURIComponent(email)}` : ''}`}
          >
            Resend OTP
          </Link>
          <span className="mx-2 text-line">|</span>
          <Link className="font-semibold text-accent hover:text-accent-dark hover:underline" to="/auth/login">
            Back to sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          if (data.get('password') !== data.get('confirmPassword')) {
            setError('The passwords do not match. Please check both fields.');
            return;
          }
          setError('');
          setNotice('');
          setIsPending(true);
          void authApi.resetPassword({
            email: String(data.get('email') || email).trim(),
            code: String(data.get('code') || ''),
            password: String(data.get('password') || ''),
          })
            .then((result) => setNotice(result.message))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setIsPending(false));
        }}
      >
        <FormMessage message={error} />
        <InputField
          id="email"
          label="Email address"
          type="email"
          icon={Mail}
          defaultValue={email}
          placeholder="you@school.edu"
          autoComplete="email"
          required
        />
        <InputField
          id="code"
          label="One-time password"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter 6-digit code"
          pattern="[0-9]{6}"
          minLength={6}
          maxLength={6}
          required
        />
        <InputField
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 10 characters"
          minLength={10}
          hint="Use at least 10 characters."
          required
        />
        <InputField
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password again"
          minLength={10}
          hint="Use at least 10 characters."
          required
        />
        <Button type="submit" variant="auth" size="lg" fullWidth disabled={isPending || Boolean(notice)}>
          {isPending ? 'Updating password…' : 'Reset password'}
          <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
        {notice ? <p role="status" className="rounded-xl border border-mint-strong bg-mint-soft px-4 py-3 text-sm leading-5 text-deep">{notice}</p> : null}
      </form>
    </AuthLayout>
  );
}
