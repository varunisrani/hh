
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { mockScenes } from '@/data/mockData';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { Search, FileText, Share2, Download, Brain, AlertCircle, CheckCircle, RefreshCw, Upload } from 'lucide-react';
import { ScriptAnalysisOutput, analyzeScriptAnalysisWithAI } from '@/services/scriptAnalysisService';
import { ProjectData } from '@/types';
import { useToast } from '@/hooks/use-toast';

// 📝 SIMPLIFIED: Only TXT files supported - no PDF.js needed for ScriptPage
console.log('📝 ScriptPage configured for TXT files only');

export const ScriptPage = () => {
  const { selectedProject, selectProject } = useSelectedProject();
  const { toast } = useToast();
  const [selectedScene, setSelectedScene] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');
  const [sceneContent, setSceneContent] = useState(mockScenes[0].content);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<ScriptAnalysisOutput | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isReUploading, setIsReUploading] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [aiAnalysisRawResponse, setAiAnalysisRawResponse] = useState<string>('');

  // Safe accessor for AI analysis data
  const getAnalysisData = (path: string, defaultValue: any = 'N/A') => {
    console.log('🔍 getAnalysisData called:', path, 'aiAnalysis:', aiAnalysis);
    try {
      const keys = path.split('.');
      let current: any = aiAnalysis;
      for (const key of keys) {
        current = current?.[key];
        if (current === undefined || current === null) {
          console.log('❌ Path not found:', path, 'at key:', key, 'returning default:', defaultValue);
          return defaultValue;
        }
      }
      console.log('✅ Found value:', current);
      return current;
    } catch (error) {
      console.warn('Error accessing analysis data:', path, error);
      return defaultValue;
    }
  };

  // Sample data for testing JSON view
  // Clear failed analysis and force fresh retry
  const clearFailedAnalysis = () => {
    if (selectedProject) {
      const updatedProject = {
        ...selectedProject,
        aiAnalysis: {
          status: 'idle' as const,
          timestamp: new Date().toISOString()
        }
      };
      
      // Update localStorage
      const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
      const updatedProjects = existingProjects.map((p: any) => 
        p.id === selectedProject.id ? updatedProject : p
      );
      localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));
      localStorage.setItem('selected_project', JSON.stringify(updatedProject));
      selectProject(updatedProject);
      
      toast({
        title: "Analysis cleared",
        description: "Ready for fresh analysis. Click 'Retry AI Analysis' now."
      });
    }
  };

  const loadSampleData = () => {
    const sampleData = {
      "sceneBreakdownOutput": {
        "projectId": "sample-test-project",
        "processingTimestamp": "2024-07-23T13:00:00Z",
        "sceneAnalysisSummary": {
          "totalScenesProcessed": 1,
          "totalCharactersIdentified": 3,
          "totalLocationsIdentified": 1,
          "totalPropsIdentified": 7,
          "averageSceneComplexity": 3
        },
        "detailedSceneBreakdowns": [
          {
            "sceneNumber": 1,
            "sceneHeader": "INT. LIVING ROOM - DAY",
            "pageCount": 1,
            "estimatedScreenTime": "01:15",
            "characters": {
              "speaking": [
                {
                  "name": "SARAH",
                  "dialogueLines": 4,
                  "firstAppearance": true,
                  "specialRequirements": ["Determined demeanor", "Emotional performance"]
                },
                {
                  "name": "JOHN",
                  "dialogueLines": 4,
                  "firstAppearance": true,
                  "specialRequirements": ["Weathered appearance", "Hands shake"]
                }
              ],
              "nonSpeaking": [],
              "background": []
            },
            "location": {
              "type": "INT",
              "primaryLocation": "LIVING ROOM",
              "secondaryLocation": "Kitchen area",
              "timeOfDay": "DAY",
              "weatherConditions": "N/A (Interior)",
              "complexityLevel": "simple"
            },
            "productionElements": {
              "props": [
                {
                  "item": "Manila folder",
                  "category": "hero",
                  "department": "Props",
                  "specialRequirements": ["Thick with documents"]
                },
                {
                  "item": "Coffee mug",
                  "category": "interactive",
                  "department": "Props",
                  "specialRequirements": []
                }
              ],
              "vehicles": [],
              "animals": [],
              "specialEffects": [
                {
                  "type": "practical",
                  "description": "Tear effect for Sarah",
                  "complexity": "simple",
                  "safetyRequirements": []
                }
              ]
            },
            "departmentRequirements": {
              "makeup": {
                "standardMakeup": 2,
                "specialEffectsMakeup": ["Weathered look for John"],
                "prosthetics": [],
                "estimatedApplicationTime": 45
              },
              "wardrobe": {
                "standardCostumes": 2,
                "periodCostumes": [],
                "specialtyItems": [],
                "quickChanges": 0
              },
              "artDepartment": {
                "setConstruction": [],
                "setDecoration": ["Living room furniture", "Family photos"],
                "locationModifications": []
              }
            },
            "complexityScores": {
              "technicalDifficulty": 2,
              "castComplexity": 3,
              "locationChallenges": 2,
              "overallComplexity": 2
            },
            "timeEstimates": {
              "setupHours": 1.5,
              "shootingHours": 2.0,
              "wrapHours": 0.5,
              "totalHours": 4.0
            },
            "specialConsiderations": ["Emotional scene requires multiple takes"],
            "continuityNotes": ["Track position of manila folder"]
          }
        ],
        "productionSummary": {
          "totalUniqueCharacters": 2,
          "totalUniqueLocations": 1,
          "totalProps": 2,
          "specialEffectsScenes": 1,
          "highComplexityScenes": [],
          "departmentAlerts": {
            "makeup": ["Special weathered look required"],
            "wardrobe": [],
            "artDepartment": ["Family photos needed"],
            "specialEffects": ["Simple tear effect"]
          }
        },
        "qualityControlChecks": {
          "sceneCompleteness": "PASS",
          "elementValidation": "PASS",
          "continuityConsistency": "PASS",
          "industryStandardCompliance": "PASS",
          "confidenceScore": "95%"
        }
      }
    };
    setAiAnalysis(sampleData as any);
    toast({
      title: "Sample data loaded!",
      description: "You can now test the JSON view and visual display."
    });
  };


  // Listen for AI analysis completion
  useEffect(() => {
    const handleAnalysisComplete = (event: CustomEvent) => {
      if (event.detail.projectId === selectedProject?.id) {
        console.log('AI Analysis completed for current project');
        setAnalysisStatus('');
        
        // Update project data from localStorage
        const updatedProject = JSON.parse(localStorage.getItem('selected_project') || '{}');
        if (updatedProject.aiAnalysis?.result) {
          console.log('✅ Setting AI analysis result:', updatedProject.aiAnalysis.result);
          setAiAnalysis(updatedProject.aiAnalysis.result);
        }
        
        // Set raw response if available
        if (updatedProject.aiAnalysis?.rawResponse) {
          console.log('✅ Setting AI analysis raw response');
          setAiAnalysisRawResponse(updatedProject.aiAnalysis.rawResponse);
        }
      }
    };

    const handleAnalysisError = (event: CustomEvent) => {
      if (event.detail.projectId === selectedProject?.id) {
        console.log('AI Analysis failed for current project');
        setAnalysisStatus('');
        
        // Set raw response if available even on error
        const updatedProject = JSON.parse(localStorage.getItem('selected_project') || '{}');
        if (updatedProject.aiAnalysis?.rawResponse) {
          console.log('✅ Setting AI analysis raw response (error case)');
          setAiAnalysisRawResponse(updatedProject.aiAnalysis.rawResponse);
        }
      }
    };

    window.addEventListener('projectAnalysisComplete', handleAnalysisComplete as EventListener);
    window.addEventListener('projectAnalysisError', handleAnalysisError as EventListener);

    return () => {
      window.removeEventListener('projectAnalysisComplete', handleAnalysisComplete as EventListener);
      window.removeEventListener('projectAnalysisError', handleAnalysisError as EventListener);
    };
  }, [selectedProject?.id]);

  // Load AI analysis if available
  useEffect(() => {
    console.log('📊 Loading AI analysis data:', selectedProject?.aiAnalysis);
    console.log('📝 Full selected project:', selectedProject);
    
    if (selectedProject?.aiAnalysis?.result) {
      console.log('✅ AI analysis result found:', selectedProject.aiAnalysis.result);
      setAiAnalysis(selectedProject.aiAnalysis.result);
    } else {
      console.log('❌ No AI analysis result found');
      console.log('🔍 AI Analysis Status:', selectedProject?.aiAnalysis?.status);
      console.log('🔍 AI Analysis Error:', selectedProject?.aiAnalysis?.error);
      setAiAnalysis(null);
    }
    
    // Load raw response if available (for both success and error cases)
    if (selectedProject?.aiAnalysis?.rawResponse) {
      console.log('✅ AI analysis raw response found');
      setAiAnalysisRawResponse(selectedProject.aiAnalysis.rawResponse);
    } else {
      console.log('❌ No AI analysis raw response found');
      setAiAnalysisRawResponse('');
    }
    
    if (selectedProject?.aiAnalysis?.status === 'processing') {
      setAnalysisStatus('AI is analyzing your script...');
    } else if (selectedProject?.aiAnalysis?.status === 'error') {
      setAnalysisStatus('');
      console.log('🔄 Previous AI analysis failed, ready for re-analysis');
      console.log('🔍 Error details:', selectedProject.aiAnalysis.error);
    } else {
      setAnalysisStatus('');
    }
  }, [selectedProject]);

  // Re-analyze function
  const handleReanalyze = async () => {
    if (!selectedProject || !selectedProject.scriptContent) {
      toast({
        title: "No script to analyze",
        description: "Please ensure a project with script content is selected.",
        variant: "destructive"
      });
      return;
    }

    setIsReanalyzing(true);
    setAnalysisStatus('Re-analyzing script with AI...');

    try {
      console.log('🔄 Starting re-analysis for project:', selectedProject.name);
      console.log('📝 Script content preview:', selectedProject.scriptContent.substring(0, 200) + '...');
      console.log('📝 Script length:', selectedProject.scriptContent.length, 'characters');
      
      const analysisResult = await analyzeScriptAnalysisWithAI(
        selectedProject.scriptContent,
        selectedProject.id,
        (status) => {
          console.log('Re-analysis progress:', status);
          setAnalysisStatus(status);
        }
      );
      
      console.log('🎉 Analysis result received:', analysisResult);

      // Update project with new analysis results
      const updatedProject = {
        ...selectedProject,
        aiAnalysis: analysisResult
      };

      // Update in localStorage
      const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
      const updatedProjects = existingProjects.map((p: ProjectData) => 
        p.id === selectedProject.id ? updatedProject : p
      );
      localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));
      localStorage.setItem('selected_project', JSON.stringify(updatedProject));

      // Update local state
      selectProject(updatedProject);

      if (analysisResult.status === 'completed' && analysisResult.result) {
        setAiAnalysis(analysisResult.result);
        toast({
          title: "Re-analysis completed!",
          description: "Script has been re-analyzed with updated AI insights."
        });
      }

      // Set raw response regardless of success/failure
      if (analysisResult.rawResponse) {
        setAiAnalysisRawResponse(analysisResult.rawResponse);
      }

      setAnalysisStatus('');

    } catch (error) {
      console.error('❌ Re-analysis failed:', error);
      console.error('🔍 Error details:', error.message || error);
      console.error('🔍 Error stack:', error.stack);
      toast({
        title: "Re-analysis failed",
        description: `Error: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      setAnalysisStatus('');
    } finally {
      setIsReanalyzing(false);
    }
  };

  // Simple TXT file reader for re-upload functionality
  const readTxtFile = async (file: File): Promise<string> => {
    console.log('📄 Reading TXT file for re-upload:', file.name);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('✅ TXT file loaded successfully. Characters:', content.length);
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
    // Only TXT files are supported
    if (file.type !== 'text/plain' && !file.name.toLowerCase().endsWith('.txt')) {
      throw new Error('Only TXT files are supported. Please upload a .txt file.');
    }
    
    return await readTxtFile(file);
  };

  // Re-upload script function (TXT files only)
  const handleReUploadScript = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsReUploading(true);
      setAnalysisStatus('Reading new TXT script file...');

      try {
        console.log('📁 Re-processing TXT file:', file.name);
        const scriptContent = await readFileContent(file);
        console.log('📝 TXT content loaded:', scriptContent.length, 'characters');
        
        // Validation: Make sure we have actual text content
        if (scriptContent.length < 50) {
          throw new Error('Script content is too short. Please ensure the TXT file contains script text.');
        }
        
        console.log('✅ TXT content validated. First 200 characters:');
        console.log(scriptContent.substring(0, 200) + '...');

        // Update the project with new script content and reset AI analysis
        if (selectedProject) {
          const updatedProject = { 
            ...selectedProject, 
            scriptContent,
            aiAnalysis: {
              status: 'idle' as const,
              timestamp: new Date().toISOString()
            }
          };
          
          console.log('💾 Updating project with new TXT script content (localStorage only)');
          const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
          const updatedProjects = existingProjects.map((p: ProjectData) => 
            p.id === selectedProject.id ? updatedProject : p
          );
          localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));
          localStorage.setItem('selected_project', JSON.stringify(updatedProject));
          selectProject(updatedProject);

          toast({
            title: "TXT script re-uploaded successfully!",
            description: `Loaded ${scriptContent.length} characters from ${file.name}. You can now re-analyze.`
          });
        }
        setAnalysisStatus('');
      } catch (error) {
        toast({
          title: "TXT re-upload failed",
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: "destructive"
        });
        setAnalysisStatus('');
      } finally {
        setIsReUploading(false);
      }
    };
    input.click();
  };
  
  // Check if we have AI analysis or should use mock data
  const isUsingAI = aiAnalysis !== null;
  const hasAIData = aiAnalysis && aiAnalysis.sceneBreakdownOutput && aiAnalysis.sceneBreakdownOutput.detailedSceneBreakdowns;
  
  console.log('🎬 Script page render [BUILD_' + Date.now() + ']:', { isUsingAI, hasAIData, aiAnalysis });
  
  // For now, since AI returns single scene analysis, we'll show that or fallback to mock
  const currentScene = hasAIData ? null : mockScenes.find(scene => scene.id === selectedScene);
  
  const filteredScenes = hasAIData 
    ? [] // AI analysis is single scene, no filtering needed
    : mockScenes.filter(scene =>
        scene.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scene.number.includes(searchTerm)
      );

  const handleSceneChange = (sceneId: number) => {
    setSelectedScene(sceneId);
    
    if (isUsingAI && aiAnalysis && aiAnalysis.sceneBreakdownOutput?.detailedSceneBreakdowns?.[0]) {
      // For AI analysis, we show the first scene data
      setSceneContent(getAnalysisData('sceneBreakdownOutput.detailedSceneBreakdowns.0.sceneHeader', ''));
    } else {
      const scene = mockScenes.find(s => s.id === sceneId);
      if (scene) {
        setSceneContent(scene.content);
      }
    }
  };
  
  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800">
      {hasAIData ? (
        // AI Analysis Sidebar - Legacy Format
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 font-medium text-sm">AI Scene Analysis</span>
          </div>
          
          {/* Project Summary */}
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="font-medium text-white text-sm">Scene Breakdown Complete</div>
            <div className="text-xs text-gray-400 mt-1">{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalScenesProcessed', 0)} scenes processed</div>
            <div className="text-xs text-purple-400 mt-1">{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalCharactersIdentified', 0)} characters identified</div>
          </div>
          
          {/* Scene List */}
          <div className="space-y-2">
            <div className="text-gray-400 text-xs uppercase font-medium">Scenes</div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {(getAnalysisData('sceneBreakdownOutput.detailedSceneBreakdowns', []) || []).map((scene, index) => (
                <div key={index} className="bg-gray-800 rounded p-2">
                  <div className="font-medium text-white text-sm">Scene {scene?.sceneNumber || index + 1}</div>
                  <div className="text-xs text-gray-400">{scene?.sceneHeader || 'N/A'}</div>
                  <div className="text-xs text-purple-400 mt-1">{scene?.location?.primaryLocation || 'N/A'}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Project Summary Stats */}
          <div className="space-y-2">
            <div className="text-gray-400 text-xs uppercase font-medium">Project Stats</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Characters:</span>
                <span className="text-white">{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalCharactersIdentified', 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Locations:</span>
                <span className="text-white">{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalLocationsIdentified', 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Props:</span>
                <span className="text-white">{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalPropsIdentified', 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Avg Complexity:</span>
                <span className="text-white">{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.averageSceneComplexity', 0).toFixed ? getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.averageSceneComplexity', 0).toFixed(1) : getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.averageSceneComplexity', 0)}/10</span>
              </div>
            </div>
          </div>
          
          {/* Quality Control */}
          <div className="space-y-2">
            <div className="text-gray-400 text-xs uppercase font-medium">Quality Control</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Completeness:</span>
                <span className={`text-xs font-medium ${
                  aiAnalysis?.sceneBreakdownOutput?.qualityControlChecks?.sceneCompleteness === 'PASS' 
                    ? 'text-green-400' : 'text-red-400'
                }`}>
                  {aiAnalysis?.sceneBreakdownOutput?.qualityControlChecks?.sceneCompleteness || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Validation:</span>
                <span className={`text-xs font-medium ${
                  aiAnalysis?.sceneBreakdownOutput?.qualityControlChecks?.elementValidation === 'PASS' 
                    ? 'text-green-400' : 'text-red-400'
                }`}>
                  {aiAnalysis?.sceneBreakdownOutput?.qualityControlChecks?.elementValidation || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Confidence:</span>
                <span className="text-purple-400 font-medium">{aiAnalysis?.sceneBreakdownOutput?.qualityControlChecks?.confidenceScore || 'N/A'}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Fallback to mock scenes
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search scenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div className="space-y-2">
            {filteredScenes.map((scene: any) => (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(scene.id)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  selectedScene === scene.id 
                    ? 'bg-yellow-500 text-gray-900 font-medium' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="font-medium">{scene.number}. {scene.header}</div>
                <div className="text-xs opacity-75 mt-1">{scene.pageFrame}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8">
      </div>
    </div>
  );
  
  const notesPanel = (
    <div className="p-4 bg-gray-950 border-l border-gray-800">
      <h3 className="text-white font-medium mb-4">Notes: Scene {selectedScene}</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter scene notes..."
        className="w-full h-40 p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
      />
      <div className="mt-4 flex space-x-2">
        <Button size="sm" variant="outline" className="text-gray-900 border-gray-300 bg-white hover:bg-gray-100">
          Save
        </Button>
        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800" onClick={() => setNotes('')}>
          Clear
        </Button>
      </div>
    </div>
  );
  
  return (
    <MainLayout sidebar={sidebar} notes={notesPanel}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedProject?.name || 'Project Script'}</h1>
              {hasAIData ? (
                <div className="flex items-center mt-1 text-purple-400 text-sm">
                  <Brain className="h-4 w-4 mr-1" />
                  <span>AI Scene Analysis Complete</span>
                  <span className="ml-2 text-gray-500">•</span>
                  <span className="ml-2 text-gray-400">{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalScenesProcessed', 0)} scenes processed</span>
                </div>
              ) : selectedProject?.aiAnalysis?.status === 'error' ? (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>AI Analysis Failed - Click "Retry AI Analysis" to try again</span>
                </div>
              ) : (
                <div className="flex items-center mt-1 text-gray-400 text-sm">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Mock Data (Upload TXT script for AI analysis)</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {selectedProject && selectedProject.scriptContent && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReanalyze}
                  disabled={isReanalyzing || analysisStatus !== ''}
                  className={`${
                    selectedProject.aiAnalysis?.status === 'error' 
                      ? 'border-red-500 text-red-400 bg-gray-900 hover:bg-gray-800' 
                      : 'border-orange-500 text-orange-400 bg-gray-900 hover:bg-gray-800'
                  } disabled:opacity-50`}
                >
                  {isReanalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Re-analyzing...
                    </>
                  ) : selectedProject.aiAnalysis?.status === 'error' ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry AI Analysis
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Re-analyze Script
                    </>
                  )}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReUploadScript}
                disabled={isReUploading || analysisStatus !== ''}
                className="border-green-500 text-green-400 bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
              >
                {isReUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading TXT...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New TXT Script
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowJsonView(!showJsonView)}
                disabled={!hasAIData && !aiAnalysisRawResponse}
                className={`border-purple-500 text-purple-400 bg-gray-900 hover:bg-gray-800 ${(!hasAIData && !aiAnalysisRawResponse) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {showJsonView ? 'Visual View' : (aiAnalysisRawResponse && !hasAIData ? 'Raw Response' : 'JSON View')}
              </Button>
              {!hasAIData && selectedProject?.aiAnalysis?.status === 'error' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFailedAnalysis}
                  className="border-red-500 text-red-400 bg-gray-900 hover:bg-gray-800"
                >
                  Clear Failed Analysis
                </Button>
              )}
              {!hasAIData && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadSampleData}
                  className="border-green-500 text-green-400 bg-gray-900 hover:bg-gray-800"
                >
                  Load Sample Data
                </Button>
              )}
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                Share Project
                <Share2 className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          

          {/* AI Processing Status */}
          {analysisStatus && (
            <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
                <div>
                  <div className="text-purple-300 font-medium">AI Scene Analysis in Progress</div>
                  <div className="text-purple-400 text-sm">{analysisStatus}</div>
                </div>
              </div>
            </div>
          )}

          {/* Failed AI Analysis - Raw Response Display */}
          {!hasAIData && aiAnalysisRawResponse && selectedProject?.aiAnalysis?.status === 'error' && showJsonView && (
            <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Failed AI Analysis - Raw Gemini Response</h2>
                  <div className="text-red-400 text-sm mt-1">
                    Analysis failed, but here's the raw response from Gemini for debugging
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Error Response</span>
                </div>
              </div>
              <div className="bg-black rounded p-4 overflow-auto max-h-96">
                <pre className="text-red-400 text-xs whitespace-pre-wrap">
                  {aiAnalysisRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                This is the raw response from Gemini AI. The response may contain parsing errors or unexpected format issues.
              </div>
              <div className="mt-2 text-xs text-red-400">
                Error: {selectedProject?.aiAnalysis?.error || 'Unknown analysis error'}
              </div>
            </div>
          )}

          {/* Successful AI Analysis - Raw Response Display (when in JSON view) */}
          {hasAIData && showJsonView && aiAnalysisRawResponse && (
            <div className="mb-6 bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Raw Gemini API Response</h2>
                <div className="flex items-center space-x-2 text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Success Response</span>
                </div>
              </div>
              <div className="bg-black rounded p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-xs whitespace-pre-wrap">
                  {aiAnalysisRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                This is the raw JSON response from the Gemini API before parsing into the structured format shown below.
              </div>
            </div>
          )}
          
          {hasAIData && !showJsonView && (
            // AI Analysis Display - Legacy Format
            <div className="space-y-6">
              {/* Project Summary Header */}
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Script Analysis Complete</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <span>{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalScenesProcessed', 0)} scenes</span>
                      <span>•</span>
                      <span>{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalCharactersIdentified', 0)} characters</span>
                      <span>•</span>
                      <span>{getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalLocationsIdentified', 0)} locations</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300">
                    <Brain className="h-5 w-5" />
                    <span className="text-sm">AI Analysis</span>
                  </div>
                </div>
                
                <div className="text-gray-300 leading-relaxed">
                  Complete scene breakdown analysis with detailed production elements for all {getAnalysisData('sceneBreakdownOutput.sceneAnalysisSummary.totalScenesProcessed', 0)} scenes.
                </div>
              </div>

              {/* Scene Details Grid */}
              <div className="space-y-4">
                {(getAnalysisData('sceneBreakdownOutput.detailedSceneBreakdowns', []) || []).map((scene, sceneIndex) => (
                  <div key={sceneIndex} className="bg-gray-800 rounded-lg p-6">
                    {/* Scene Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Scene {scene.sceneNumber}</h3>
                        <div className="text-sm text-gray-400">{scene.sceneHeader}</div>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>{scene.location?.type || 'N/A'} {scene.location?.primaryLocation || 'N/A'}</span>
                          <span>•</span>
                          <span>{scene.location?.timeOfDay || 'N/A'}</span>
                          <span>•</span>
                          <span>{scene.estimatedScreenTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-purple-400 font-medium">Overall Complexity</div>
                        <div className="text-2xl font-bold text-white">{scene.complexityScores?.overallComplexity || 0}/10</div>
                      </div>
                    </div>

                    {/* Scene Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Characters */}
                      <div className="bg-gray-700 rounded p-4">
                        <h4 className="text-sm font-medium text-blue-300 mb-2">Characters</h4>
                        <div className="space-y-2">
                          {(scene.characters?.speaking || []).map((char, index) => (
                            <div key={index} className="bg-gray-600 rounded p-2">
                              <div className="text-xs">
                                <span className="text-white font-medium">{char.name}</span>
                                <span className="text-gray-400 ml-2">({char.dialogueLines} lines)</span>
                                {char.firstAppearance && (
                                  <span className="ml-2 px-1 bg-blue-500/20 text-blue-300 rounded text-xs">First</span>
                                )}
                              </div>
                              {char.specialRequirements.length > 0 && (
                                <div className="text-xs text-gray-300 mt-1">
                                  <span className="text-yellow-400">Requirements:</span> {char.specialRequirements.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                          {(scene.characters?.nonSpeaking || []).map((char, index) => (
                            <div key={index} className="bg-gray-600 rounded p-2">
                              <div className="text-xs text-gray-300">
                                {char.description} ({char.count})
                              </div>
                              {char.specialRequirements.length > 0 && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {char.specialRequirements.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                          {(scene.characters?.background || []).map((char, index) => (
                            <div key={index} className="text-xs text-gray-400">
                              {char.description} (~{char.estimatedCount})
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Props & Elements */}
                      <div className="bg-gray-700 rounded p-4">
                        <h4 className="text-sm font-medium text-orange-300 mb-2">Props & Elements</h4>
                        <div className="space-y-2">
                          {(scene.productionElements?.props || []).map((prop, index) => (
                            <div key={index} className="bg-gray-600 rounded p-2">
                              <div className="text-xs">
                                <span className="text-white">{prop.item}</span>
                                <span className={`ml-2 px-1 rounded text-xs ${
                                  prop.category === 'hero' ? 'bg-yellow-500/20 text-yellow-300' :
                                  prop.category === 'interactive' ? 'bg-green-500/20 text-green-300' :
                                  prop.category === 'set' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {prop.category}
                                </span>
                                <span className="text-gray-400 ml-2">({prop.department})</span>
                              </div>
                              {prop.specialRequirements.length > 0 && (
                                <div className="text-xs text-gray-300 mt-1">
                                  {prop.specialRequirements.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                          {(scene.productionElements?.vehicles || []).map((vehicle, index) => (
                            <div key={index} className="bg-gray-600 rounded p-2">
                              <div className="text-xs text-cyan-300">
                                {vehicle.type} ({vehicle.usage})
                              </div>
                              {vehicle.specialRequirements.length > 0 && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {vehicle.specialRequirements.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                          {(scene.productionElements?.specialEffects || []).map((fx, index) => (
                            <div key={index} className="bg-red-500/10 border border-red-500/30 rounded p-2">
                              <div className="text-xs text-red-300">
                                <span className="font-medium">{fx.type.toUpperCase()}</span>: {fx.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Complexity: {fx.complexity}
                              </div>
                              {fx.safetyRequirements.length > 0 && (
                                <div className="text-xs text-red-400 mt-1">
                                  Safety: {fx.safetyRequirements.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Time & Complexity */}
                      <div className="bg-gray-700 rounded p-4">
                        <h4 className="text-sm font-medium text-purple-300 mb-2">Time & Complexity</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Setup:</span>
                            <span className="text-white">{scene.timeEstimates?.setupHours || 0}h</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Shooting:</span>
                            <span className="text-white">{scene.timeEstimates?.shootingHours || 0}h</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Wrap:</span>
                            <span className="text-white">{scene.timeEstimates?.wrapHours || 0}h</span>
                          </div>
                          <div className="border-t border-gray-600 pt-2 mt-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-purple-300">Total:</span>
                              <span className="text-purple-400">{scene.timeEstimates?.totalHours || 0}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Department Requirements */}
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <h4 className="text-sm font-medium text-cyan-300 mb-3">Department Requirements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Makeup */}
                        <div className="bg-gray-600 rounded p-3">
                          <div className="text-xs font-medium text-pink-300 mb-2">Makeup & Hair</div>
                          <div className="space-y-1">
                            <div className="text-xs">
                              <span className="text-gray-400">Standard:</span>
                              <span className="text-white ml-1">{scene.departmentRequirements?.makeup?.standardMakeup || 0} people</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-400">Time:</span>
                              <span className="text-white ml-1">{scene.departmentRequirements?.makeup?.estimatedApplicationTime || 0} min</span>
                            </div>
                            {scene.departmentRequirements?.makeup?.specialEffectsMakeup?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-400">Special FX:</span>
                                <div className="text-gray-300 mt-1">{scene.departmentRequirements.makeup.specialEffectsMakeup.join(', ')}</div>
                              </div>
                            )}
                            {scene.departmentRequirements?.makeup?.prosthetics?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-400">Prosthetics:</span>
                                <div className="text-gray-300 mt-1">{scene.departmentRequirements.makeup.prosthetics.join(', ')}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Wardrobe */}
                        <div className="bg-gray-600 rounded p-3">
                          <div className="text-xs font-medium text-green-300 mb-2">Wardrobe</div>
                          <div className="space-y-1">
                            <div className="text-xs">
                              <span className="text-gray-400">Standard:</span>
                              <span className="text-white ml-1">{scene.departmentRequirements?.wardrobe?.standardCostumes || 0}</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-400">Quick Changes:</span>
                              <span className="text-white ml-1">{scene.departmentRequirements?.wardrobe?.quickChanges || 0}</span>
                            </div>
                            {scene.departmentRequirements?.wardrobe?.periodCostumes?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-400">Period:</span>
                                <div className="text-gray-300 mt-1">{scene.departmentRequirements.wardrobe.periodCostumes.join(', ')}</div>
                              </div>
                            )}
                            {scene.departmentRequirements?.wardrobe?.specialtyItems?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-400">Specialty:</span>
                                <div className="text-gray-300 mt-1">{scene.departmentRequirements.wardrobe.specialtyItems.join(', ')}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Art Department */}
                        <div className="bg-gray-600 rounded p-3">
                          <div className="text-xs font-medium text-orange-300 mb-2">Art Department</div>
                          <div className="space-y-1">
                            {scene.departmentRequirements?.artDepartment?.setConstruction?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-400">Construction:</span>
                                <div className="text-gray-300 mt-1">{scene.departmentRequirements.artDepartment.setConstruction.join(', ')}</div>
                              </div>
                            )}
                            {scene.departmentRequirements?.artDepartment?.setDecoration?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-400">Decoration:</span>
                                <div className="text-gray-300 mt-1">{scene.departmentRequirements.artDepartment.setDecoration.join(', ')}</div>
                              </div>
                            )}
                            {scene.departmentRequirements?.artDepartment?.locationModifications?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-400">Modifications:</span>
                                <div className="text-gray-300 mt-1">{scene.departmentRequirements.artDepartment.locationModifications.join(', ')}</div>
                              </div>
                            )}
                            {(!scene.departmentRequirements?.artDepartment?.setConstruction?.length && 
                              !scene.departmentRequirements?.artDepartment?.setDecoration?.length && 
                              !scene.departmentRequirements?.artDepartment?.locationModifications?.length) && (
                              <div className="text-xs text-gray-400">No special requirements</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Considerations & Continuity */}
                    {((scene.specialConsiderations?.length || 0) > 0 || (scene.continuityNotes?.length || 0) > 0) && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(scene.specialConsiderations?.length || 0) > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-yellow-300 mb-2">Special Considerations</h4>
                              <div className="space-y-1">
                                {(scene.specialConsiderations || []).map((consideration, index) => (
                                  <div key={index} className="text-xs text-gray-300 bg-yellow-500/10 rounded p-2">
                                    • {consideration}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {(scene.continuityNotes?.length || 0) > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-blue-300 mb-2">Continuity Notes</h4>
                              <div className="space-y-1">
                                {(scene.continuityNotes || []).map((note, index) => (
                                  <div key={index} className="text-xs text-gray-300 bg-blue-500/10 rounded p-2">
                                    • {note}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Production Summary */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></div>
                  Production Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{getAnalysisData('sceneBreakdownOutput.productionSummary.totalUniqueCharacters', 0)}</div>
                    <div className="text-sm text-gray-400">Unique Characters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{getAnalysisData('sceneBreakdownOutput.productionSummary.totalUniqueLocations', 0)}</div>
                    <div className="text-sm text-gray-400">Unique Locations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{getAnalysisData('sceneBreakdownOutput.productionSummary.totalProps', 0)}</div>
                    <div className="text-sm text-gray-400">Total Props</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{getAnalysisData('sceneBreakdownOutput.productionSummary.specialEffectsScenes', 0)}</div>
                    <div className="text-sm text-gray-400">Special Effects Scenes</div>
                  </div>
                </div>
                
                {getAnalysisData('sceneBreakdownOutput.productionSummary.highComplexityScenes', []).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <h4 className="text-sm font-medium text-red-300 mb-2">High Complexity Scenes</h4>
                    <div className="text-sm text-gray-300">
                      Scenes: {getAnalysisData('sceneBreakdownOutput.productionSummary.highComplexityScenes', []).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!hasAIData && (
            // Fallback Mock Display
            <div className="bg-yellow-50 rounded-lg p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <select
                  value={currentScene?.pageFrame || ''}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>{currentScene?.pageFrame}</option>
                  <option>2/8</option>
                  <option>3/8</option>
                </select>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-gray-900 border-gray-300 bg-white hover:bg-gray-100">
                    Break
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-900 border-gray-300 bg-white hover:bg-gray-100">
                    Merge
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h2 className="font-bold text-lg text-gray-900 mb-2">
                    {currentScene?.header}
                  </h2>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <textarea
                    value={sceneContent}
                    onChange={(e) => setSceneContent(e.target.value)}
                    className="w-full h-40 p-4 text-gray-700 leading-relaxed text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent resize-none"
                    placeholder="Scene content..."
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {currentScene?.breakdown.cast.map((cast, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {cast}
                    </span>
                  ))}
                  {currentScene?.breakdown.props.map((prop, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {prop}
                    </span>
                  ))}
                  {currentScene?.breakdown.locationDetails.map((location, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
