import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { InputField } from "../../../components/ui/InputField.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { maskEmail } from "../../../lib/maskEmail.js";
import { useAuth } from "../../../lib/useAuth.js";
import { AuthLayout } from "../AuthLayout.jsx";
import { useAuthFeedback } from "../useAuthFeedback.js";

export function VerifyLoginOtpPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const completeLogin = useAuth((state) => state.completeLogin);
  const resendLoginOtp = useAuth((state) => state.resendLoginOtp);
  const email = searchParams.get("email") || "";
  const maskedEmail = maskEmail(email);
  useAuthFeedback({ error, success: notice });

  return (
    <AuthLayout>
      <div className="rounded-[1.75rem] border border-[#dfe8e0] bg-white p-6 shadow-[0_24px_60px_-38px_rgba(13,47,34,0.22)] sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]">
            Secure sign in
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-deep sm:text-[2.2rem]">
            Check your email.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756b]">
            {maskedEmail ? (
              <>
                Enter the six-digit login code sent to{" "}
                <strong className="font-semibold text-deep">
                  {maskedEmail}
                </strong>
                .
              </>
            ) : (
              "Enter the six-digit login code sent to your email address."
            )}
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const otp = String(formData.get("otp") || "").trim();
            const challengeToken = window.sessionStorage.getItem(
              "schoolSmisLoginChallenge",
            );
            if (!challengeToken) {
              setError(
                "Your login challenge has expired. Sign in again to request a new code.",
              );
              return;
            }
            setError("");
            setIsPending(true);
            void completeLogin({ challengeToken, otp })
              .then((user) => {
                window.sessionStorage.removeItem("schoolSmisLoginChallenge");
                const destination =
                  user.role === "ADMIN" && !user.schoolId
                    ? "/onboarding"
                    : location.state?.from?.pathname || "/overview";
                navigate(destination, {
                  replace: true,
                  state: {
                    authFeedback: {
                      type: "success",
                      message: "You are signed in successfully.",
                    },
                  },
                });
              })
              .catch((verificationError) => setError(verificationError.message))
              .finally(() => setIsPending(false));
          }}
        >
          <InputField
            id="otp"
            label="Login code"
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
            {isPending ? "Verifying…" : "Verify and sign in"}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            disabled={isResending || isPending}
            onClick={() => {
              const challengeToken = window.sessionStorage.getItem(
                "schoolSmisLoginChallenge",
              );
              if (!challengeToken) {
                setError(
                  "Your login challenge has expired. Sign in again to request a new code.",
                );
                return;
              }
              setError("");
              setNotice("");
              setIsResending(true);
              void resendLoginOtp(challengeToken)
                .then((result) => {
                  window.sessionStorage.setItem(
                    "schoolSmisLoginChallenge",
                    result.challengeToken,
                  );
                  setNotice("A new login code has been sent to your email.");
                })
                .catch((resendError) => setError(resendError.message))
                .finally(() => setIsResending(false));
            }}
          >
            <RotateCw
              aria-hidden="true"
              className={`size-4 ${isResending ? "animate-spin" : ""}`}
            />
            {isResending ? "Sending new code…" : "Resend code"}
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
          Return to sign in
        </Link>
      </nav>
    </AuthLayout>
  );
}
