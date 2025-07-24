import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, ArrowLeft, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectData } from '@/types';

// 📄 PDF ONLY: Only PDF files supported for project creation
console.log('📝 Script upload configured for PDF files only');

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
      // Only accept PDF files
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only. TXT files are not supported.",
          variant: "destructive"
        });
        return;
      }
      console.log('📄 PDF file selected:', file.name, '(', (file.size / 1024).toFixed(2), 'KB)');
      setScriptFile(file);
    }
  };

  // Store PDF file info for later processing by API
  const storePdfFileInfo = (file: File): string => {
    console.log('📄 Storing PDF file info:', file.name);
    console.log('📦 File size:', (file.size / 1024).toFixed(2), 'KB');
    
    // Return placeholder content indicating PDF needs to be processed
    return `PDF_FILE_UPLOADED: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nFile will be processed when accessing Script page.`;
  };

  const readFileContent = async (file: File): Promise<string> => {
    // Only PDF files are supported now
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Only PDF files are supported. Please upload a .pdf file.');
    }
    
    return storePdfFileInfo(file);
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

    try {
      console.log('📁 Processing PDF file:', scriptFile.name);
      setAnalysisStatus('Uploading PDF to analysis API...');
      
      // Send PDF to CJS API for analysis
      const formData = new FormData();
      formData.append('pdf', scriptFile);
      
      console.log('📄 Uploading PDF to CJS analysis API:', scriptFile.name);
      const response = await fetch('http://localhost:3001/api/analyze-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`PDF analysis failed: ${response.statusText}`);
      }

      const analysisResults = await response.json();
      console.log('✅ PDF analysis results:', analysisResults);
      
      if (!analysisResults.success || !analysisResults.data) {
        throw new Error(analysisResults.error || 'Analysis failed');
      }

      setAnalysisStatus('Creating project with analysis data...');
      
      const projectData: ProjectData = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        scriptContent: `PDF Analysis Complete: ${scriptFile.name}\n\nExtracted ${analysisResults.data.totalScenes} scenes, ${analysisResults.data.totalCharacters} characters, ${analysisResults.data.totalDialogues} dialogues.`,
        created: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        pdfFileName: scriptFile.name,
        pdfAnalysisResults: analysisResults // Store the analysis results
      };

      // Store project data locally
      console.log('💾 Storing project with analysis data locally');
      const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
      const updatedProjects = [...existingProjects, projectData];
      localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));

      // Set this project as selected
      selectProject(projectData);

      toast({
        title: "Project created & analyzed successfully!",
        description: `${formData.name} - Extracted ${analysisResults.data.totalScenes} scenes.`
      });

      // Set redirecting state
      setIsRedirecting(true);
      setAnalysisStatus('Analysis complete! Redirecting to script page...');

      // Navigate to script page immediately - scheduling and budget will be generated in background
      setTimeout(() => {
        navigate('/script');
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Error creating project",
        description: "Failed to process PDF file. Please ensure the file is a valid PDF script.",
        variant: "destructive"
      });
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
                      accept=".pdf"
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
                            Supported format: PDF files only
                          </p>
                        </div>
                      )}
                    </Label>
                  </div>
                </div>


                {/* Analysis Status */}
                {analysisStatus && (
                  <div className="flex items-center space-x-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Upload className="h-4 w-4 text-purple-600 animate-pulse" />
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
                        <Upload className="h-4 w-4 animate-pulse" />
                        <span>Redirecting...</span>
                      </>
                    ) : isUploading ? (
                      <>
                        <Upload className="h-4 w-4 animate-pulse" />
                        <span>Creating Project...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Create Project</span>
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