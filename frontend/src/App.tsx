import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import SourcesPage from './pages/production/SourcesPage';
import TreatmentPlantsPage from './pages/production/TreatmentPlantsPage';
import StorageTanksPage from './pages/production/StorageTanksPage';
import GISPage from './pages/GISPage';
import DistributionPage from './pages/distribution/DistributionPage';
import GISNetworkPage from './pages/distribution/GISNetworkPage';
import SupplyOpsPage from './pages/distribution/SupplyOpsPage';
import LeakageNRWPage from './pages/distribution/LeakageNRWPage';
import PressureMonitoringPage from './pages/distribution/PressureMonitoringPage';
import ConsumersPage from './pages/consumers/ConsumersPage';
import NewConnectionPage from './pages/consumers/NewConnectionPage';
import SurveyPage from './pages/consumers/SurveyPage';
import ActivationPage from './pages/consumers/ActivationPage';
import MeteringPage from './pages/consumers/MeteringPage';
import BillingPaymentPage from './pages/consumers/BillingPaymentPage';
import ComplaintsPage from './pages/consumers/ComplaintsPage';
import DisconnectionPage from './pages/consumers/DisconnectionPage';
import AssetsPage from './pages/assets/AssetsPage';
import AssetInventoryPage from './pages/operations/AssetInventoryPage';
import PreventiveMaintenancePage from './pages/operations/PreventiveMaintenancePage';
import BreakdownMaintenancePage from './pages/operations/BreakdownMaintenancePage';
import SparePartsVendorPage from './pages/operations/SparePartsVendorPage';
import BillingPage from './pages/billing/BillingPage';
import ExpenditureTrackingPage from './pages/finance/ExpenditureTrackingPage';
import BudgetingCostRecoveryPage from './pages/finance/BudgetingCostRecoveryPage';
import FinancialReportingPage from './pages/finance/FinancialReportingPage';
import { Loader2 } from 'lucide-react';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              {/* Production */}
              <Route path="/dashboard/production/sources" element={<SourcesPage />} />
              <Route path="/dashboard/production/treatment-plants" element={<TreatmentPlantsPage />} />
              <Route path="/dashboard/production/storage-tanks" element={<StorageTanksPage />} />
              <Route path="/dashboard/production" element={<Navigate to="/dashboard/production/sources" replace />} />
              {/* GIS */}
              <Route path="/dashboard/gis" element={<GISPage />} />
              {/* Distribution */}
              <Route path="/dashboard/distribution" element={<Navigate to="/dashboard/distribution/gis-network" replace />} />
              <Route path="/dashboard/distribution/gis-network" element={<GISNetworkPage />} />
              <Route path="/dashboard/distribution/supply-ops" element={<SupplyOpsPage />} />
              <Route path="/dashboard/distribution/leakage-nrw" element={<LeakageNRWPage />} />
              <Route path="/dashboard/distribution/pressure-monitoring" element={<PressureMonitoringPage />} />
              {/* Legacy distribution routes (redirect) */}
              <Route path="/dashboard/distribution/reservoirs" element={<DistributionPage />} />
              <Route path="/dashboard/distribution/valves" element={<GISNetworkPage />} />
              <Route path="/dashboard/distribution/pipelines" element={<GISNetworkPage />} />
              {/* Consumer Management — full lifecycle */}
              <Route path="/dashboard/consumers" element={<ConsumersPage />} />
              <Route path="/dashboard/consumers/new-connection" element={<NewConnectionPage />} />
              <Route path="/dashboard/consumers/survey" element={<SurveyPage />} />
              <Route path="/dashboard/consumers/activation" element={<ActivationPage />} />
              <Route path="/dashboard/consumers/metering" element={<MeteringPage />} />
              <Route path="/dashboard/consumers/billing" element={<BillingPaymentPage />} />
              <Route path="/dashboard/consumers/complaints" element={<ComplaintsPage />} />
              <Route path="/dashboard/consumers/disconnection" element={<DisconnectionPage />} />
              {/* Operations & Asset Management */}
              <Route path="/dashboard/assets" element={<AssetsPage />} />
              <Route path="/dashboard/operations/inventory" element={<AssetInventoryPage />} />
              <Route path="/dashboard/operations/preventive" element={<PreventiveMaintenancePage />} />
              <Route path="/dashboard/operations/breakdown" element={<BreakdownMaintenancePage />} />
              <Route path="/dashboard/operations/spare-parts" element={<SparePartsVendorPage />} />
              {/* Financial Management */}
              <Route path="/dashboard/finance/revenue" element={<BillingPage />} />
              <Route path="/dashboard/finance/expenditure" element={<ExpenditureTrackingPage />} />
              <Route path="/dashboard/finance/budgeting" element={<BudgetingCostRecoveryPage />} />
              <Route path="/dashboard/finance/reports" element={<FinancialReportingPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
