
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectLayout } from "@/components/layout/ProjectLayout";
import { MainApp } from "@/components/layout/MainApp";
import { CreateProjectPage } from "@/pages/CreateProjectPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ProjectLayout>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/script" element={<MainApp />} />
            <Route path="/summary" element={<MainApp />} />
            <Route path="/reports" element={<MainApp />} />
            <Route path="/analysis" element={<MainApp />} />
            <Route path="/scheduling" element={<MainApp />} />
            <Route path="/callsheets" element={<MainApp />} />
            <Route path="/budgeting" element={<MainApp />} />
            <Route path="/create-project" element={<CreateProjectPage />} />
          </Routes>
        </ProjectLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
