import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ProjectListPage } from '@/pages/ProjectListPage';
import { ScriptPage } from '@/pages/ScriptPage';
import { SummaryPage } from '@/pages/SummaryPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { SchedulingPage } from '@/pages/SchedulingPage';
import { CallSheetsPage } from '@/pages/CallSheetsPage';
import { BudgetingPage } from '@/pages/BudgetingPage';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import NotFound from '@/pages/NotFound';

export const MainApp = () => {
  const { selectedProject, isLoading } = useSelectedProject();
  const location = useLocation();

  console.log('MainApp render:', { 
    pathname: location.pathname, 
    selectedProject: selectedProject?.name, 
    isLoading 
  });

  // Show loading state while checking for selected project
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If on root path (/), always show project list (no project needed)
  if (location.pathname === '/') {
    console.log('Showing ProjectListPage because on root path');
    return <ProjectListPage />;
  }

  // For all other routes, check if project is selected
  if (!selectedProject) {
    // If no project selected but trying to access project routes, show project list
    console.log('Showing ProjectListPage because no project selected');
    return <ProjectListPage />;
  }

  console.log('Showing app page for:', location.pathname);

  // If project is selected and on a main app route, show the appropriate page
  switch (location.pathname) {
    case '/script':
      return <ScriptPage />;
    case '/summary':
      return <SummaryPage />;
    case '/reports':
      return <ReportsPage />;
    case '/analysis':
      return <AnalysisPage />;
    case '/scheduling':
      return <SchedulingPage />;
    case '/callsheets':
      return <CallSheetsPage />;
    case '/budgeting':
      return <BudgetingPage />;
    default:
      return <NotFound />;
  }
};