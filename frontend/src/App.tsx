import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppDataProvider } from "./context/AppDataContext";
import { Layout } from "./components/Layout";
import OverviewPage from "./pages/OverviewPage";
import VehicleSearchPage from "./pages/VehicleSearchPage";
import VehicleMapPage from "./pages/VehicleMapPage";
import PersonPage from "./pages/PersonPage";
import AlertsPage from "./pages/AlertsPage";
import InvestigationsPage from "./pages/InvestigationsPage";
import InvestigationDetailPage from "./pages/InvestigationDetailPage";
import InsightsAuditPage from "./pages/InsightsAuditPage";
import UsersRolesPage from "./pages/UsersRolesPage";
import OrgSettingsPage from "./pages/OrgSettingsPage";
import SharingPage from "./pages/SharingPage";
import DemoIndexPage from "./pages/demos/DemoIndexPage";
import TravelHistoryPage from "./pages/demos/TravelHistoryPage";
import FalseMatchPage from "./pages/demos/FalseMatchPage";
import NetworkExpansionPage from "./pages/demos/NetworkExpansionPage";
import WatchlistAbusePage from "./pages/demos/WatchlistAbusePage";
import SensitiveLocationPage from "./pages/demos/SensitiveLocationPage";
import AppearanceSearchPage from "./pages/demos/AppearanceSearchPage";
import OwnerVsDriverPage from "./pages/demos/OwnerVsDriverPage";
import DeletionLoopholePage from "./pages/demos/DeletionLoopholePage";
import AuditBlindSpotPage from "./pages/demos/AuditBlindSpotPage";
import CapabilityCreepPage from "./pages/demos/CapabilityCreepPage";
import DarkDataSearchPage from "./pages/demos/DarkDataSearchPage";

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<OverviewPage />} />
            <Route path="search" element={<VehicleSearchPage />} />
            <Route path="map/:recordId" element={<VehicleMapPage />} />
            <Route path="person/:personId" element={<PersonPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="investigations" element={<InvestigationsPage />} />
            <Route path="investigations/:id" element={<InvestigationDetailPage />} />
            <Route path="audit" element={<InsightsAuditPage />} />
            <Route path="users" element={<UsersRolesPage />} />
            <Route path="settings" element={<OrgSettingsPage />} />
            <Route path="sharing" element={<SharingPage />} />

            <Route path="demos" element={<DemoIndexPage />} />
            <Route path="demos/travel-history" element={<TravelHistoryPage />} />
            <Route path="demos/false-match" element={<FalseMatchPage />} />
            <Route path="demos/network-expansion" element={<NetworkExpansionPage />} />
            <Route path="demos/watchlist-abuse" element={<WatchlistAbusePage />} />
            <Route path="demos/sensitive-location" element={<SensitiveLocationPage />} />
            <Route path="demos/appearance-search" element={<AppearanceSearchPage />} />
            <Route path="demos/owner-vs-driver" element={<OwnerVsDriverPage />} />
            <Route path="demos/deletion-loophole" element={<DeletionLoopholePage />} />
            <Route path="demos/audit-blind-spot" element={<AuditBlindSpotPage />} />
            <Route path="demos/capability-creep" element={<CapabilityCreepPage />} />
            <Route path="demos/dark-data-search" element={<DarkDataSearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}

export default App;
