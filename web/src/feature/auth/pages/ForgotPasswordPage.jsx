import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { InputField } from '../../../components/ui/InputField.jsx';
import { AuthLayout } from '../../../components/Auth/AuthLayout.jsx';
import { FormMessage } from '../../../components/ui/FormMessage.jsx';
import { authApi } from '../../../lib/authApi.js';

export function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password?"
      description="Enter the email address linked to your account. We’ll use it to help you reset your password."
      footer={
        <>
          <Link className="inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-dark hover:underline" to="/auth/login">
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
          <span className="mx-2 text-line">|</span>
          <Link className="font-semibold text-accent hover:text-accent-dark hover:underline" to="/auth/reset-password">
            Already have a reset code?
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const email = String(new FormData(event.currentTarget).get('email') || '').trim();
          setError('');
          setIsPending(true);
          void authApi.forgotPassword({ email })
            .then(() => navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`))
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
          placeholder="you@school.edu"
          autoComplete="email"
          required
        />
        <Button type="submit" variant="auth" size="lg" fullWidth disabled={isPending}>
          {isPending ? 'Sending code…' : 'Send recovery instructions'}
          <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </form>
    </AuthLayout>
  );
}
