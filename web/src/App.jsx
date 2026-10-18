import { Navigate, Route, Routes } from 'react-router-dom';
import {
  ChangePasswordPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResendOtpPage,
  ResetPasswordPage,
  VerifyOtpPage,
} from './feature/auth/index.js';
import { SchoolOnboardingPage } from './feature/school/SchoolOnboardingPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage.jsx';
import { SchoolProfilePage } from './pages/SchoolProfilePage.jsx';
import { SchoolDirectoryPage } from './pages/SchoolDirectoryPage.jsx';
import { UserProfilePage } from './pages/UserProfilePage.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { AuthShell } from './components/Auth/AuthShell.jsx';
import { RequireAuth } from './components/Auth/RequireAuth.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthShell />}>
        <Route path="/auth">
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="change-password" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
          <Route path="resend-otp" element={<ResendOtpPage />} />
        </Route>
      </Route>
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route path="/overview" element={<DashboardOverviewPage />} />
        <Route path="/school/profile" element={<SchoolProfilePage />} />
        <Route path="/school/directory" element={<SchoolDirectoryPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/onboarding" element={<SchoolOnboardingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
