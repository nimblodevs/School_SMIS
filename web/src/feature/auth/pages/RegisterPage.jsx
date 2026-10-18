import { useState } from 'react';
import { ArrowRight, Mail, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { InputField } from '../../../components/ui/InputField.jsx';
import { AuthLayout } from '../../../components/Auth/AuthLayout.jsx';
import { FormMessage } from '../../../components/ui/FormMessage.jsx';
import { authApi } from '../../../lib/authApi.js';

export function RegisterPage() {
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      description="Set up your administrator account to get your school started."
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-semibold text-accent hover:text-accent-dark hover:underline" to="/auth/login">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setError('');
          setIsPending(true);
          void authApi.register({
            fullName: String(formData.get('fullName') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            password: String(formData.get('password') || ''),
          })
            .then(({ data }) => navigate(
              `/auth/verify-otp?purpose=email_verification&email=${encodeURIComponent(data.email)}`,
              { replace: true },
            ))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setIsPending(false));
        }}
      >
        <FormMessage message={error} />
        <InputField
          id="fullName"
          label="Full name"
          icon={UserRound}
          placeholder="Your name"
          autoComplete="name"
          required
        />
        <InputField
          id="email"
          label="School email address"
          type="email"
          icon={Mail}
          placeholder="you@school.edu"
          autoComplete="email"
          required
        />
        <InputField
          id="password"
          label="Create password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={10}
          hint="Use at least 10 characters."
          required
        />
        <Button type="submit" variant="auth" size="lg" fullWidth disabled={isPending}>
          {isPending ? 'Creating account…' : 'Create account'}
          <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </form>
    </AuthLayout>
  );
}
