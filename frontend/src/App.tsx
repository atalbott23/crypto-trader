import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Assets from "./pages/Assets";
import Performance from "./pages/Performance";
import Connect from "./pages/Connect";
import AutoTrading from "./pages/AutoTrading";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public route - Landing page */}
                <Route path="/" element={<Layout><Landing /></Layout>} />
                
                {/* Profile page - auth handled within the component */}
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout><Index /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/assets" element={
                  <ProtectedRoute>
                    <Layout><Assets /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/performance" element={
                  <ProtectedRoute>
                    <Layout><Performance /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/connect" element={
                  <ProtectedRoute>
                    <Layout><Connect /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/auto-trading" element={
                  <ProtectedRoute>
                    <Layout><AutoTrading /></Layout>
                  </ProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </TooltipProvider>
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
