import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { InputField } from '../../../components/ui/InputField.jsx';
import { AuthLayout } from '../../../components/Auth/AuthLayout.jsx';
import { FormMessage } from '../../../components/ui/FormMessage.jsx';
import { authApi } from '../../../lib/authApi.js';

export function ResendOtpPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isPending, setIsPending] = useState(false);
  const email = searchParams.get('email') || '';
  const purpose = searchParams.get('purpose') || 'email_verification';

  return (
    <AuthLayout
      eyebrow="Email verification"
      title="Request a new code"
      description="Enter your email address and we’ll send you a fresh one-time password."
      footer={
        <Link
          className="inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-dark hover:underline"
          to={purpose === 'password_reset'
            ? `/auth/reset-password${email ? `?email=${encodeURIComponent(email)}` : ''}`
            : `/auth/verify-otp?purpose=email_verification${email ? `&email=${encodeURIComponent(email)}` : ''}`}
        >
          <ArrowLeft className="size-4" />
          {purpose === 'password_reset' ? 'Back to password reset' : 'Back to verification'}
        </Link>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const requestedEmail = String(new FormData(event.currentTarget).get('email') || '').trim();
          setError('');
          setNotice('');
          setIsPending(true);
          void authApi.resendCode({ email: requestedEmail, purpose })
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
        <Button type="submit" variant="auth" size="lg" fullWidth disabled={isPending}>
          {isPending ? 'Sending code…' : 'Resend OTP'}
          <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
        {notice ? <p role="status" className="rounded-xl border border-mint-strong bg-mint-soft px-4 py-3 text-sm leading-5 text-deep">{notice}</p> : null}
      </form>
    </AuthLayout>
  );
}
