import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  scriptContent: string;
  created: string;
}

export const ProjectListPage = () => {
  const navigate = useNavigate();
  const { selectProject } = useSelectedProject();
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
    setProjects(storedProjects);
  }, []);

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));
  };

  const handleSelectProject = (project: ProjectData) => {
    selectProject(project);
    // Navigate to the script page (main app) after selecting project
    navigate('/script');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Project List</h1>
            <Button
              onClick={() => navigate('/create-project')}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Project ({projects.length} of 1)</span>
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-24 h-24 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-12 w-12 text-gray-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Create your first project to get started</p>
            <Button
              onClick={() => navigate('/create-project')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer relative group"
                onClick={() => handleSelectProject(project)}
              >
                <div className="absolute top-3 right-3 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                      >
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardContent className="p-0">
                  {/* Project Image/Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <Badge className="bg-green-500 text-white text-xs">
                        demo
                      </Badge>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-lg mb-2 truncate">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description || "Explore our features using the free demo script - no credit card is required - or jump right in by uploading your own. Click Create Project to start."}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{project.created}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};