import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "../../../components/ui/Button.jsx";
import { InputField } from "../../../components/ui/InputField.jsx";
import { useAuth } from "../../../lib/useAuth.js";
import { AuthLayout } from "../AuthLayout.jsx";
import { useAuthFeedback } from "../useAuthFeedback.js";

export function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const login = useAuth((state) => state.login);
  const initialEmail = searchParams.get("email") || "";
  useAuthFeedback({ error });

  return (
    <AuthLayout>
      <div className="rounded-[1.75rem] border border-[#dfe8e0] p-6 sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]">
            School operations, in one place
          </p>
          <h1 className="mt-3 text-3xl font-semibold font-serif leading-tight tracking-[-0.04em] text-deep sm:text-[2.2rem]">
            Welcome back.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756b]">
            Sign in to continue to your school workspace.
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const email = String(data.get("email") || "").trim();
            setError("");
            setIsPending(true);
            void login({
              email,
              password: String(data.get("password") || ""),
            })
              .then((result) => {
                window.sessionStorage.setItem(
                  "schoolSmisLoginChallenge",
                  result.data.challengeToken,
                );
                navigate(
                  `/auth/verify-login-otp?email=${encodeURIComponent(email)}`,
                  {
                    replace: true,
                    state: {
                      from: location.state?.from,
                      authFeedback: {
                        type: "success",
                        message:
                          "Credentials verified. Check your email for the login code.",
                      },
                    },
                  },
                );
              })
              .catch((loginError) => {
                if (loginError.code === "EMAIL_NOT_VERIFIED") {
                  navigate(
                    `/auth/verify-otp?purpose=email_verification&email=${encodeURIComponent(email)}`,
                  );
                  return;
                }
                setError(loginError.message);
              })
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
            defaultValue={initialEmail}
            required
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            maxLength={128}
            required
          />
          <div className="flex justify-center">
            <Link
              to="/auth/forgot-password"
              className="inline-flex min-h-8 items-center justify-center rounded-md px-1 py-1 text-xs font-semibold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
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
            {isPending ? "Signing in…" : "Continue"}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Button>
        </form>
      </div>
      <p className="mt-6 text-center text-xs leading-5 text-muted">
        New to School SMIS?
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          to="/auth/register"
          className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-1 py-1 text-xs font-bold text-accent transition hover:text-accent-dark hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
}
