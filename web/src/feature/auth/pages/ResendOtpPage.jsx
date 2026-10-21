import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { authApi } from "../../../lib/authApi.js";
import { AuthLayout } from "../AuthLayout.jsx";
import { useAuthFeedback } from "../useAuthFeedback.js";

export function ResendOtpPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "email_verification";
  useAuthFeedback({ error, success: notice });

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
              ? "Resend password reset code"
              : "Request a new verification code"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756b]">
            Enter your email address and, if the account is eligible, we’ll send
            a fresh{" "}
            {purpose === "password_reset" ? "password reset" : "verification"}{" "}
            code.
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const requestedEmail = String(
              new FormData(event.currentTarget).get("email") || "",
            ).trim();
            setError("");
            setNotice("");
            setIsPending(true);
            void authApi
              .resendCode({ email: requestedEmail, purpose })
              .then((result) => {
                if (purpose === "password_reset") {
                  navigate(
                    `/auth/verify-otp?purpose=password_reset&email=${encodeURIComponent(requestedEmail)}`,
                    {
                      replace: true,
                      state: {
                        authFeedback: {
                          type: "success",
                          message:
                            "If the account exists, a new reset code has been sent.",
                        },
                      },
                    },
                  );
                  return;
                }
                setNotice(result.message);
              })
              .catch((requestError) => setError(requestError.message))
              .finally(() => setIsPending(false));
          }}
        >
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
          <Button
            type="submit"
            variant="auth"
            size="lg"
            fullWidth
            disabled={isPending}
          >
            {isPending
              ? "Sending code…"
              : purpose === "password_reset"
                ? "Resend reset code"
                : "Resend verification code"}
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
          to={`/auth/verify-otp?purpose=${purpose}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          Back to code entry
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
