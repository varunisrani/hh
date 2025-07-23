
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  notes?: ReactNode;
}

export const MainLayout = ({ children, sidebar, notes }: MainLayoutProps) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      {sidebar && (
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          {sidebar}
        </div>
      )}
      
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {children}
      </div>
      
      {notes && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          {notes}
        </div>
      )}
    </div>
  );
};
