import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { InputField } from '../../../components/ui/InputField.jsx';
import { AuthLayout } from '../../../components/Auth/AuthLayout.jsx';
import { FormMessage } from '../../../components/ui/FormMessage.jsx';
import { authApi } from '../../../lib/authApi.js';

export function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const purpose = searchParams.get('purpose') || 'email_verification';

  return (
    <AuthLayout
      eyebrow="Email verification"
      title="Verify your email"
      description="Enter the six-digit one-time code sent to your email address."
      footer={
        <>
          Didn’t receive a code?{' '}
          <Link
            className="font-semibold text-accent hover:text-accent-dark hover:underline"
            to={`/auth/resend-otp?purpose=${purpose}${email ? `&email=${encodeURIComponent(email)}` : ''}`}
          >
            Resend OTP
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const code = String(formData.get('code') || '');
          const submittedEmail = String(formData.get('email') || '').trim();
          setError('');
          setIsPending(true);
          void authApi.verifyEmail({ email: submittedEmail, code })
            .then(() => navigate(`/auth/login?email=${encodeURIComponent(submittedEmail)}`, { replace: true }))
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
        <Button type="submit" variant="auth" size="lg" fullWidth disabled={isPending}>
          {isPending ? 'Verifying…' : 'Verify code'}
          <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </form>
    </AuthLayout>
  );
}
