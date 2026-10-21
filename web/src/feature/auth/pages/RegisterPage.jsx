import { useState } from "react";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { authApi } from "../../../lib/authApi.js";
import { AuthLayout } from "../AuthLayout.jsx";
import { useAuthFeedback } from "../useAuthFeedback.js";

export function RegisterPage() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  useAuthFeedback({ error });

  return (
    <AuthLayout>
      <div className="rounded-[1.75rem] border border-[#dfe8e0] bg-white p-6 shadow-[0_24px_60px_-38px_rgba(13,47,34,0.22)] sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]">
            Get started
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-deep sm:text-[2.2rem]">
            Create your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756b]">
            Set up your administrator account to get your school started.
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setError("");
            setIsPending(true);
            void authApi
              .register({
                fullName: String(formData.get("fullName") || "").trim(),
                email: String(formData.get("email") || "").trim(),
                password: String(formData.get("password") || ""),
              })
              .then(({ data }) =>
                navigate(
                  `/auth/verify-otp?purpose=email_verification&email=${encodeURIComponent(data.email)}`,
                  {
                    replace: true,
                    state: {
                      authFeedback: {
                        type: "success",
                        message:
                          "Your account was created. Enter the code sent to your email.",
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
            maxLength={128}
            hint="Use at least 10 characters."
            required
          />
          <Button
            type="submit"
            variant="auth"
            size="lg"
            fullWidth
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Create account"}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </form>
      </div>
      <p className="mt-6 text-center text-xs leading-5 text-muted">
        Already have an account?
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          to="/auth/login"
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
