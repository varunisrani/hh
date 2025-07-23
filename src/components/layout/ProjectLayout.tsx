import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  scriptContent: string;
  created: string;
}

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  const location = useLocation();

  // Hide navigation on project list and create project pages
  const hideNavigation = location.pathname === '/' || 
                         location.pathname === '/create-project';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideNavigation && <TopNavigation />}
      {children}
    </div>
  );
};