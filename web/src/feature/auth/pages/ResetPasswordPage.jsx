import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "../../../components/ui/Button.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { authApi } from "../../../lib/authApi.js";
import { maskEmail } from "../../../lib/maskEmail.js";
import { AuthLayout } from "../AuthLayout.jsx";
import { useAuthFeedback } from "../useAuthFeedback.js";
import { getPasswordRequirements } from "../passwordRequirements.js";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const maskedEmail = maskEmail(email);
  const otp = location.state?.resetOtp;
  useAuthFeedback({ error });
  const passwordRequirements = getPasswordRequirements(password);

  if (!email || !otp) {
    return (
      <Navigate
        to={
          email
            ? `/auth/verify-otp?purpose=password_reset&email=${encodeURIComponent(email)}`
            : "/auth/forgot-password"
        }
        replace
      />
    );
  }

  return (
    <AuthLayout>
      <div className="rounded-[1.75rem] border border-[#dfe8e0] bg-white p-6 shadow-[0_24px_60px_-38px_rgba(13,47,34,0.22)] sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]">
            Account recovery
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-deep sm:text-[2.2rem]">
            Choose a new password
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756b]">
            Choose a new password for{" "}
            <span className="font-semibold text-deep">
              {maskedEmail || "your account"}
            </span>
            .
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            if (data.get("password") !== data.get("confirmPassword")) {
              setError("The passwords do not match. Please check both fields.");
              return;
            }
            setError("");
            setIsPending(true);
            void authApi
              .resetPassword({
                email,
                otp,
                newPassword: String(data.get("password") || ""),
              })
              .then(() =>
                navigate(`/auth/login?email=${encodeURIComponent(email)}`, {
                  replace: true,
                  state: {
                    authFeedback: {
                      type: "success",
                      message:
                        "Your password has been reset. Sign in with your new password.",
                    },
                  },
                }),
              )
              .catch((requestError) => setError(requestError.message))
              .finally(() => setIsPending(false));
          }}
        >
          <InputField
            id="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 12 characters"
            minLength={12}
            maxLength={128}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {password ? (
            <ul
              aria-label="Password requirements"
              aria-live="polite"
              className="-mt-3 grid gap-2 px-1 text-xs sm:grid-cols-2"
            >
              {passwordRequirements
                .filter(({ met }) => met)
                .map(({ label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 font-medium text-success"
                  >
                    <Check aria-hidden="true" className="size-3.5 shrink-0" />
                    {label}
                  </li>
                ))}
            </ul>
          ) : null}
          <InputField
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your new password again"
            minLength={12}
            onPaste={(event) => event.preventDefault()}
            onDrop={(event) => event.preventDefault()}
            required
          />
          <Button
            type="submit"
            variant="auth"
            size="lg"
            fullWidth
            disabled={isPending}
          >
            {isPending ? "Updating password…" : "Reset password"}
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
          to={`/auth/resend-otp?purpose=password_reset${email ? `&email=${encodeURIComponent(email)}` : ""}`}
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Mail aria-hidden="true" className="size-4 shrink-0" />
          Request a new code
        </Link>
        <Link
          to="/auth/login"
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          Back to sign in
        </Link>
      </nav>
    </AuthLayout>
  );
}
