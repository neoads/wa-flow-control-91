
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Numeros } from "./components/Numeros";
import { Seguranca } from "./components/Seguranca";
import { Usuarios } from "./components/Usuarios";
import { Projetos } from "./components/Projetos";
import { Aquecimento } from "./components/Aquecimento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/numeros" element={<Numeros />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/seguranca" element={<Seguranca />} />
            <Route path="/aquecimento" element={<Aquecimento />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
