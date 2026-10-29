import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Layout from "./components/layout/Layout";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyzePage from "./pages/AnalyzePage";
import AnalysisDetailsPage from "./pages/AnalysisDetailsPage";
import AnalysesHistoryPage from "./pages/AnalysesHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import SkillSwapPage from "./pages/SkillSwapPage";
import SkillSwapCreatePage from "./pages/SkillSwapCreatePage";
import SkillSwapPostDetailsPage from "./pages/SkillSwapPostDetailsPage";
import SkillSwapMessagesPage from "./pages/SkillSwapMessagesPage";
import SkillSwapActivityPage from "./pages/SkillSwapActivityPage";
import CorporatePortalPage from "./pages/CorporatePortalPage";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-foreground tracking-tight">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested page could not be found or has been relocated.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Corporate Company Assessment & Hiring Portal */}
      <Route path="/corporate" element={<CorporatePortalPage />} />


      {/* Authenticated Workspace Shell */}
      <Route path="/app" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="analyses" element={<AnalysesHistoryPage />} />
        <Route path="analyses/:id" element={<AnalysisDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="skillswap" element={<SkillSwapPage />} />
        <Route path="skillswap/create" element={<SkillSwapCreatePage />} />
        <Route path="skillswap/posts/:id" element={<SkillSwapPostDetailsPage />} />
        <Route path="skillswap/messages" element={<SkillSwapMessagesPage />} />
        <Route path="skillswap/my-activity" element={<SkillSwapActivityPage />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default AppRoutes;
