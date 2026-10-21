import { Navigate, Route, Routes } from 'react-router-dom';
import {
  ChangePasswordPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResendOtpPage,
  ResetPasswordPage,
  VerifyOtpPage,
  VerifyLoginOtpPage,
} from './feature/auth/index.js';
import { SchoolOnboardingPage } from './feature/school/SchoolOnboardingPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage.jsx';
import { SchoolProfilePage } from './pages/SchoolProfilePage.jsx';
import { SchoolDirectoryPage } from './pages/SchoolDirectoryPage.jsx';
import { UserProfilePage } from './pages/UserProfilePage.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { Footer } from './components/layout/footer.jsx';
import { Navbar } from './components/layout/navbar.jsx';
import { RequireAuth } from './components/Auth/RequireAuth.jsx';

function OnboardingShell() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col bg-page">
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <SchoolOnboardingPage />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth">
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="verify-login-otp" element={<VerifyLoginOtpPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="change-password" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
        <Route path="resend-otp" element={<ResendOtpPage />} />
      </Route>
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <OnboardingShell />
          </RequireAuth>
        }
      />
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route path="/overview" element={<DashboardOverviewPage />} />
        <Route path="/school/profile" element={<SchoolProfilePage />} />
        <Route path="/school/directory" element={<SchoolDirectoryPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
