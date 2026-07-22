import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppDataProvider } from "./context/AppDataContext";
import { Layout } from "./components/Layout";
import OverviewPage from "./pages/OverviewPage";
import VehicleSearchPage from "./pages/VehicleSearchPage";
import AlertsPage from "./pages/AlertsPage";
import InvestigationsPage from "./pages/InvestigationsPage";
import InvestigationDetailPage from "./pages/InvestigationDetailPage";
import InsightsAuditPage from "./pages/InsightsAuditPage";
import UsersRolesPage from "./pages/UsersRolesPage";
import OrgSettingsPage from "./pages/OrgSettingsPage";
import SharingPage from "./pages/SharingPage";

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<OverviewPage />} />
            <Route path="search" element={<VehicleSearchPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="investigations" element={<InvestigationsPage />} />
            <Route path="investigations/:id" element={<InvestigationDetailPage />} />
            <Route path="audit" element={<InsightsAuditPage />} />
            <Route path="users" element={<UsersRolesPage />} />
            <Route path="settings" element={<OrgSettingsPage />} />
            <Route path="sharing" element={<SharingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}

export default App;
