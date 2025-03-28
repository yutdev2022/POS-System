import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";

// Import pages
import Dashboard from "./pages";
import POS from "./pages/pos";
import Products from "./pages/products";
import Transactions from "./pages/transactions";
import Settings from "./pages/settings";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/products" element={<Products />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);