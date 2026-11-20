import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/components/layout/root-layout'
import { AuthLayout } from '@/components/layout/auth-layout'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Public Pages
import { HomePage } from '@/features/auth/components/home-page'
import { LoginPage } from '@/features/auth/components/login-page'
import { RegisterPage } from '@/features/auth/components/register-page'
import { NotFoundPage } from '@/components/ui/not-found-page'

// Core AgriTech Operational Screens
import { OperationalOverviewPage } from '@/features/dashboard/components/operational-overview-page'
import { CommodityCataloguePage } from '@/features/commodities/components/commodity-catalogue-page'
import { SupplyManagementPage } from '@/features/supply/components/supply-management-page'
import { DemandTendersPage } from '@/features/demand/components/demand-tenders-page'
import { CompatibilityMatchesPage } from '@/features/matching/components/compatibility-matches-page'
import { InquiriesCoordinationPage } from '@/features/inquiries/components/inquiries-coordination-page'

export function AppRouter() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Operational Dashboard Core Screens */}
      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<OperationalOverviewPage />} />
        <Route path="commodities" element={<CommodityCataloguePage />} />
        <Route path="supply" element={<SupplyManagementPage />} />
        <Route path="demand" element={<DemandTendersPage />} />
        <Route path="matches" element={<CompatibilityMatchesPage />} />
        <Route path="inquiries" element={<InquiriesCoordinationPage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
