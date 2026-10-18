import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { InputField } from '../../../components/ui/InputField.jsx';
import { AuthLayout } from '../../../components/Auth/AuthLayout.jsx';
import { FormMessage } from '../../../components/ui/FormMessage.jsx';
import { authApi } from '../../../lib/authApi.js';

export function ChangePasswordPage() {
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  return (
    <AuthLayout
      eyebrow="Account security"
      title="Change your password"
      description="For your security, enter your current password and choose a new one."
      footer={
        <Link className="inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-dark hover:underline" to="/overview">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          if (data.get('password') !== data.get('confirmPassword')) {
            setError('The new passwords do not match. Please check both fields.');
            return;
          }
          setError('');
          setIsPending(true);
          void authApi.changePassword({
            currentPassword: String(data.get('currentPassword') || ''),
            newPassword: String(data.get('password') || ''),
          })
            .then(() => navigate('/overview', { replace: true }))
            .catch((requestError) => setError(requestError.message))
            .finally(() => setIsPending(false));
        }}
      >
        <FormMessage message={error} />
        <InputField
          id="currentPassword"
          label="Current password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter current password"
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
        <Button type="submit" variant="auth" size="lg" fullWidth disabled={isPending}>
          {isPending ? 'Updating password…' : 'Update password'}
          <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </form>
    </AuthLayout>
  );
}
