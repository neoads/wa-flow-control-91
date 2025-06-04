
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Numeros } from "./components/Numeros";
import { Seguranca } from "./components/Seguranca";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/numeros" element={<Numeros />} />
            <Route path="/projetos" element={<div className="p-8 text-center text-gray-500">Módulo Projetos em construção</div>} />
            <Route path="/usuarios" element={<div className="p-8 text-center text-gray-500">Módulo Usuários em construção</div>} />
            <Route path="/seguranca" element={<Seguranca />} />
            <Route path="/aquecimento" element={<div className="p-8 text-center text-gray-500">Módulo Aquecimento em construção</div>} />
            <Route path="/links" element={<div className="p-8 text-center text-gray-500">Módulo Links de Grupos em construção</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
