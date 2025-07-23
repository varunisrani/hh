
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronUp, Bell, HelpCircle, ArrowLeft } from 'lucide-react';
import { useSelectedProject } from '@/hooks/useSelectedProject';

export const TopNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { selectedProject, clearProject } = useSelectedProject();

  const handleBackToProjects = () => {
    clearProject();
    navigate('/');
  };
  
  const tabs = [
    { name: 'Script', path: '/script' },
    { name: 'Summary', path: '/summary' },
    { name: 'Reports', path: '/reports' },
    { name: 'Analysis', path: '/analysis' },
    { name: 'Scheduling', path: '/scheduling' },
    { name: 'Call Sheets', path: '/callsheets' },
    { name: 'Budgeting', path: '/budgeting' }
  ];
  
  const isActiveTab = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="text-white text-xl font-bold">FILMUSTAGE</div>
          {selectedProject && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToProjects}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Projects
              </Button>
              <span className="text-gray-400">/</span>
              <span className="text-white font-medium">{selectedProject.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isActiveTab(tab.path)
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-gray-900">
            ✨ Upgrade
          </Button>
          <button className="text-gray-400 hover:text-white">
            <Bell size={20} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <HelpCircle size={20} />
          </button>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 text-white hover:text-gray-300"
            >
              <span>Hi, SoLo</span>
              <ChevronUp size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
