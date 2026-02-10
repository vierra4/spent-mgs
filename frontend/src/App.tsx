import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
// import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { SpendsListPage } from "@/pages/SpendsListPage";
import { CreateSpendPage } from "@/pages/CreateSpendPage";
import { SpendDetailPage } from "@/pages/SpendDetailPage";
import { ApprovalsPage } from "@/pages/ApprovalsPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { PoliciesPage } from "@/pages/PoliciesPage";
import { AuditLogsPage } from "@/pages/AuditLogsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { Spinner } from "@/components/ui/spinner";
import Wrapper from "./Wrapper";

function App() {
  return (
   <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <Spinner size="lg" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/dashboard" element={<Wrapper><DashboardPage /></Wrapper>} />
          <Route path="/spends" element={<Wrapper><SpendsListPage /></Wrapper>} />
          <Route path="/spends/new" element={<Wrapper><CreateSpendPage /></Wrapper>} />
          <Route path="/spends/:id" element={<Wrapper><SpendDetailPage /></Wrapper>} />
          <Route path="/approvals" element={<Wrapper><ApprovalsPage /></Wrapper>} />
          <Route path="/notifications" element={<Wrapper><NotificationsPage /></Wrapper>} />
          <Route path="/policies" element={<Wrapper><PoliciesPage /></Wrapper>} />
          <Route path="/audit" element={<Wrapper><AuditLogsPage /></Wrapper>} />
          <Route path="/settings" element={<Wrapper><SettingsPage /></Wrapper>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'inherit',
          },
        }}
      />
</>
  );
}

export default App;
