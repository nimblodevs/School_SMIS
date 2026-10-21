import { useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { authApi } from "../../../lib/authApi.js";
import { AuthLayout } from "../AuthLayout.jsx";
import { useAuthFeedback } from "../useAuthFeedback.js";

export function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  useAuthFeedback({ error });

  return (
    <AuthLayout>
      <div className="rounded-[1.75rem] border border-[#dfe8e0] bg-white p-6 shadow-[0_24px_60px_-38px_rgba(13,47,34,0.22)] sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]">
            Account recovery
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-deep sm:text-[2.2rem]">
            Reset your password.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756b]">
            Enter the email address linked to your account. We’ll use it to help
            you reset your password.
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const email = String(
              new FormData(event.currentTarget).get("email") || "",
            ).trim();
            setError("");
            setIsPending(true);
            void authApi
              .forgotPassword({ email })
              .then(() =>
                navigate(
                  `/auth/verify-otp?purpose=password_reset&email=${encodeURIComponent(email)}`,
                  {
                    state: {
                      authFeedback: {
                        type: "success",
                        message:
                          "If the account exists, a reset code has been sent.",
                      },
                    },
                  },
                ),
              )
              .catch((requestError) => setError(requestError.message))
              .finally(() => setIsPending(false));
          }}
        >
          <InputField
            id="email"
            label="Email address"
            type="email"
            icon={Mail}
            placeholder="you@school.edu"
            autoComplete="email"
            required
          />
          <Button
            type="submit"
            variant="auth"
            size="lg"
            fullWidth
            disabled={isPending}
          >
            {isPending ? "Sending code…" : "Send recovery instructions"}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </form>
      </div>
      <nav
        aria-label="Authentication navigation"
        className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
      >
        <Link
          to="/auth/login"
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          Back to sign in
        </Link>
        <Link
          to="/auth/verify-otp?purpose=password_reset"
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <KeyRound aria-hidden="true" className="size-4 shrink-0" />I have a
          reset code
        </Link>
      </nav>
    </AuthLayout>
  );
}
