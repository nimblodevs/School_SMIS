import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { authApi } from "../../../lib/authApi.js";
import { maskEmail } from "../../../lib/maskEmail.js";
import { AuthLayout } from "../AuthLayout.jsx";
import { useAuthFeedback } from "../useAuthFeedback.js";

export function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "email_verification";
  const maskedEmail = maskEmail(email);
  useAuthFeedback({ error });

  return (
    <AuthLayout>
      <div className="rounded-[1.75rem] border border-[#dfe8e0] bg-white p-6 shadow-[0_24px_60px_-38px_rgba(13,47,34,0.22)] sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]">
            {purpose === "password_reset"
              ? "Account recovery"
              : "Email verification"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-deep sm:text-[2.2rem]">
            {purpose === "password_reset"
              ? "Verify your reset code"
              : "Verify your email"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756b]">
            {maskedEmail
              ? `Enter the six-digit ${purpose === "password_reset" ? "reset code" : "one-time code"} sent to ${maskedEmail}.`
              : `Enter the six-digit ${purpose === "password_reset" ? "reset code" : "one-time code"} sent to your email address.`}
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const code = String(formData.get("code") || "");
            const submittedEmail = String(
              formData.get("email") || email,
            ).trim();
            if (!submittedEmail) {
              setError(
                "Your verification session is missing an email address. Return to sign in or registration and try again.",
              );
              return;
            }
            setError("");
            setIsPending(true);
            const verification =
              purpose === "password_reset"
                ? authApi
                    .verifyOtp({ email: submittedEmail, otp: code })
                    .then(() =>
                      navigate(
                        `/auth/reset-password?email=${encodeURIComponent(submittedEmail)}`,
                        {
                          replace: true,
                          state: {
                            resetOtp: code,
                            authFeedback: {
                              type: "success",
                              message:
                                "Reset code verified. Choose a new password.",
                            },
                          },
                        },
                      ),
                    )
                : authApi
                    .verifyEmail({ email: submittedEmail, code })
                    .then(() =>
                      navigate(
                        `/auth/login?email=${encodeURIComponent(submittedEmail)}`,
                        {
                          replace: true,
                          state: {
                            authFeedback: {
                              type: "success",
                              message: "Email verified. You can now sign in.",
                            },
                          },
                        },
                      ),
                    );
            void verification
              .catch((requestError) => setError(requestError.message))
              .finally(() => setIsPending(false));
          }}
        >
          {purpose === "password_reset" && !email ? (
            <InputField
              id="email"
              label="Email address"
              type="email"
              icon={Mail}
              autoComplete="email"
              required
            />
          ) : null}
          <InputField
            id="code"
            label={
              purpose === "password_reset"
                ? "Password reset code"
                : "One-time password"
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter 6-digit code"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            required
          />
          <Button
            type="submit"
            variant="auth"
            size="lg"
            fullWidth
            disabled={isPending}
          >
            {isPending
              ? "Verifying…"
              : purpose === "password_reset"
                ? "Continue"
                : "Verify code"}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </form>
      </div>
      <p className="mt-6 text-center text-xs leading-5 text-muted">
        Didn’t receive a code?
      </p>
      <nav
        aria-label="Authentication navigation"
        className="mt-3 flex flex-wrap items-center justify-center gap-2.5"
      >
        <Link
          to={`/auth/resend-otp?purpose=${purpose}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Mail aria-hidden="true" className="size-4 shrink-0" />
          Resend code
        </Link>
        <Link
          to="/auth/login"
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          Back to sign in
        </Link>
      </nav>
    </AuthLayout>
  );
}
