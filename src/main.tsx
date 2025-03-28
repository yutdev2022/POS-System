import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";

// Import pages
import Dashboard from "./pages";
import POS from "./pages/pos";
import Products from "./pages/products";
import Transactions from "./pages/transactions";
import Settings from "./pages/settings";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Admin from "./pages/admin";
import { useStore } from "./lib/store";

const queryClient = new QueryClient();

// Auth guard component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin guard component
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useStore();
  
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Guest guard component (for login/signup pages)
const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useStore();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
            <Route path="/signup" element={<GuestGuard><Signup /></GuestGuard>} />
            
            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/pos" element={<AuthGuard><POS /></AuthGuard>} />
            <Route path="/products" element={<AuthGuard><Products /></AuthGuard>} />
            <Route path="/transactions" element={<AuthGuard><Transactions /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);