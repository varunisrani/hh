import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, ArrowLeft, FileText, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeScriptWithAI } from '@/services/geminiService';
import { ProjectData } from '@/types';

// 📄 SIMPLIFIED: Only TXT files supported - no PDF processing needed
console.log('📝 Script upload configured for TXT files only - no PDF.js dependencies');

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectProject } = useSelectedProject();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Only accept TXT files
      if (file.type !== 'text/plain' && !file.name.toLowerCase().endsWith('.txt')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a TXT file only. PDF files are not supported.",
          variant: "destructive"
        });
        return;
      }
      console.log('📄 TXT file selected:', file.name, '(', (file.size / 1024).toFixed(2), 'KB)');
      setScriptFile(file);
    }
  };

  // Simple TXT file reader - no PDF processing needed
  const readTxtFile = async (file: File): Promise<string> => {
    console.log('📄 Reading TXT file:', file.name);
    console.log('📦 File size:', (file.size / 1024).toFixed(2), 'KB');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('✅ TXT file loaded successfully. Characters:', content.length);
        console.log('📝 Content preview (first 200 chars):', content.substring(0, 200) + '...');
        resolve(content);
      };
      
      reader.onerror = (error) => {
        console.error('❌ Error reading TXT file:', error);
        reject(new Error('Failed to read TXT file'));
      };
      
      reader.readAsText(file, 'utf-8');
    });
  };

  const readFileContent = async (file: File): Promise<string> => {
    // Only TXT files are supported now
    if (file.type !== 'text/plain' && !file.name.toLowerCase().endsWith('.txt')) {
      throw new Error('Only TXT files are supported. Please upload a .txt file.');
    }
    
    return await readTxtFile(file);
  };

  // Background AI analysis function
  const analyzeScriptInBackground = async (projectData: ProjectData, scriptContent: string) => {
    try {
      console.log('Starting background AI analysis for project:', projectData.name);
      
      const analysisResult = await analyzeScriptWithAI(
        scriptContent, 
        projectData.id,
        (status) => {
          console.log('AI Analysis progress:', status);
          setAnalysisStatus(status);
        }
      );

      // Update project with analysis results
      const updatedProjectData = {
        ...projectData,
        aiAnalysis: analysisResult
      };

      // Update in localStorage
      const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
      const updatedProjects = existingProjects.map((p: ProjectData) => 
        p.id === projectData.id ? updatedProjectData : p
      );
      localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));

      // Update selected project
      localStorage.setItem('selected_project', JSON.stringify(updatedProjectData));

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('projectAnalysisComplete', {
        detail: { projectId: projectData.id, analysis: analysisResult }
      }));

      console.log('AI analysis completed successfully');

    } catch (error) {
      console.error('Background AI analysis failed:', error);
      
      // Update project with error status
      const errorResult = {
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Analysis failed',
        timestamp: new Date().toISOString()
      };

      const updatedProjectData = {
        ...projectData,
        aiAnalysis: errorResult
      };

      // Update in localStorage
      const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
      const updatedProjects = existingProjects.map((p: ProjectData) => 
        p.id === projectData.id ? updatedProjectData : p
      );
      localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));

      // Update selected project
      localStorage.setItem('selected_project', JSON.stringify(updatedProjectData));

      // Trigger error event
      window.dispatchEvent(new CustomEvent('projectAnalysisError', {
        detail: { projectId: projectData.id, error: errorResult.error }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name.",
        variant: "destructive"
      });
      return;
    }

    if (!scriptFile) {
      toast({
        title: "Script file required",
        description: "Please upload a script file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setAnalysisStatus('Reading TXT script file...');

    try {
      console.log('📁 Processing TXT file:', scriptFile.name);
      const scriptContent = await readFileContent(scriptFile);
      console.log('📝 TXT content loaded:', scriptContent.length, 'characters');
      
      // Validation: Make sure we have actual text content
      if (scriptContent.length < 50) {
        throw new Error('Script content is too short. Please ensure the TXT file contains script text.');
      }
      
      console.log('✅ TXT content validated. First 200 characters:');
      console.log(scriptContent.substring(0, 200) + '...');
      
      const projectData: ProjectData = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        scriptContent, // STORED LOCALLY ONLY - never uploaded to cloud storage
        created: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        aiAnalysis: {
          status: 'processing',
          timestamp: new Date().toISOString()
        }
      };

      // IMPORTANT: Script content is stored ONLY in browser's localStorage
      // It is NEVER uploaded to any cloud storage or database
      // Only AI analysis requests include script content temporarily for processing
      console.log('💾 Storing project data LOCALLY ONLY (no cloud storage)');
      const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
      const updatedProjects = [...existingProjects, projectData];
      localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));

      // Set this project as selected
      selectProject(projectData);

      toast({
        title: "Project created successfully!",
        description: `${formData.name} has been created. Starting AI analysis...`
      });

      // Set redirecting state
      setIsRedirecting(true);
      setAnalysisStatus('Starting AI scene breakdown analysis...');

      // Start AI analysis in the background
      analyzeScriptInBackground(projectData, scriptContent);

      // Navigate to script page immediately
      setTimeout(() => {
        navigate('/script');
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Error creating project",
        description: "Failed to read TXT file. Please ensure the file contains readable script text.",
        variant: "destructive"
      });
      setAnalysisStatus('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold">Create New Project</h1>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-medium">
                    Project Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter project name..."
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white font-medium">
                    Project Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 min-h-[100px]"
                    rows={4}
                  />
                </div>

                {/* Script Upload */}
                <div className="space-y-2">
                  <Label htmlFor="script" className="text-white font-medium">
                    Upload Script *
                  </Label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                    <input
                      id="script"
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Label htmlFor="script" className="cursor-pointer">
                      {scriptFile ? (
                        <div className="space-y-2">
                          <FileText className="h-12 w-12 mx-auto text-purple-500" />
                          <p className="text-white font-medium">{scriptFile.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(scriptFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-purple-400 text-sm">Click to change file</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="text-white font-medium">Upload Script File</p>
                          <p className="text-gray-400 text-sm">
                            Drag and drop or click to browse
                          </p>
                          <p className="text-gray-500 text-xs">
                            Supported format: TXT files only
                          </p>
                        </div>
                      )}
                    </Label>
                  </div>
                </div>

                {/* Analysis Status */}
                {analysisStatus && (
                  <div className="flex items-center space-x-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
                    <span className="text-purple-700 text-sm">{analysisStatus}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading || isRedirecting}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
                  >
                    {isRedirecting ? (
                      <>
                        <Brain className="h-4 w-4 animate-pulse" />
                        <span>Starting AI Analysis...</span>
                      </>
                    ) : isUploading ? (
                      <>
                        <Upload className="h-4 w-4 animate-pulse" />
                        <span>Creating Project...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        <span>Create Project & Analyze</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};