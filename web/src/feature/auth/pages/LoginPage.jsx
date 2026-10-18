import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { InputField } from '../../../components/ui/InputField.jsx';
import { AuthLayout } from '../../../components/Auth/AuthLayout.jsx';
import { FormMessage } from '../../../components/ui/FormMessage.jsx';
import { useAuth } from '../../../lib/useAuth.js';

export function LoginPage() {
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const initialEmail = searchParams.get('email') || '';

  return (
    <AuthLayout
      eyebrow="School operations, in one place"
      title="Welcome back."
      description="Sign in to continue to your school workspace."
      footer={
        <>
          New to School SMIS?{' '}
          <Link className="font-semibold text-accent hover:text-accent-dark hover:underline" to="/auth/register">
            Create an account
          </Link>
          <span className="mx-2 text-line">|</span>
          <Link className="font-semibold text-accent hover:text-accent-dark hover:underline" to="/auth/change-password">
            Change password
          </Link>
        </>
      }
      formCard
      centeredHeader
      brandDetails
      showBackLink={false}
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const email = String(data.get('email') || '').trim();
          setError('');
          setIsPending(true);
          void login({
            email,
            password: String(data.get('password') || ''),
          })
            .then(() => navigate(location.state?.from?.pathname || '/overview', { replace: true }))
            .catch((loginError) => {
              if (loginError.code === 'EMAIL_NOT_VERIFIED') {
                navigate(`/auth/verify-otp?purpose=email_verification&email=${encodeURIComponent(email)}`);
                return;
              }
              setError(loginError.message);
            })
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
          defaultValue={initialEmail}
          required
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />
        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-sm font-bold text-accent transition hover:text-accent-dark hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          variant="auth"
          size="lg"
          fullWidth
          disabled={isPending}
        >
          {isPending ? 'Signing in…' : 'Continue'}
          <ArrowRight aria-hidden="true" className="size-5" />
        </Button>
      </form>
    </AuthLayout>
  );
}
