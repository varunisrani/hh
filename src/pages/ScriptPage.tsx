import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { Search, FileText, Share2, Download, Upload, Edit3, Save, RotateCcw, Eye, FileEdit, AlertCircle, Loader2, CheckCircle, Brain, BarChart3, Clock, Users, MapPin, DollarSign, AlertTriangle, Code, ChevronDown, ChevronRight, Copy, Download as DownloadIcon } from 'lucide-react';
import { ProjectData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { generateProductionScheduleWithAI, ScriptAnalysisInput } from '@/services/schedulingGeneratorService';
import { generateBasicBudgetWithAI } from '@/services/basicBudgetGeneratorService';
import { depthScriptAnalysisService, CoordinatorOutput } from '@/services/depthScriptAnalysisService';

console.log('📄 ScriptPage configured for PDF analysis with CJS API');

export const ScriptPage = () => {
  const { selectedProject, selectProject } = useSelectedProject();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'edit' | 'pdf' | 'depth'>('pdf');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScene, setSelectedScene] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Script editing state
  const [editedScript, setEditedScript] = useState<string>('');
  const [originalScript, setOriginalScript] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [linesPerPage] = useState(50);

  // PDF analysis state
  const [pdfAnalysisResults, setPdfAnalysisResults] = useState<any | null>(null);
  const [isPdfAnalyzing, setIsPdfAnalyzing] = useState(false);
  const [pdfAnalysisError, setPdfAnalysisError] = useState('');
  const [uploadedPdfName, setUploadedPdfName] = useState('');
  const [showRawResponse, setShowRawResponse] = useState(false);

  // Background processing state
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);
  const [backgroundProcessStatus, setBackgroundProcessStatus] = useState('');
  const [backgroundProcessComplete, setBackgroundProcessComplete] = useState(false);

  // Depth Analysis state
  const [depthAnalysisResults, setDepthAnalysisResults] = useState<CoordinatorOutput | null>(null);
  const [isDepthAnalyzing, setIsDepthAnalyzing] = useState(false);
  const [depthAnalysisError, setDepthAnalysisError] = useState('');
  const [depthAnalysisProgress, setDepthAnalysisProgress] = useState(0);
  const [currentDepthAgent, setCurrentDepthAgent] = useState('');
  const [showDepthResults, setShowDepthResults] = useState(false);
  
  // Raw JSON state for agent outputs
  const [rawAgentOutputs, setRawAgentOutputs] = useState<{
    eighthsAgent?: any;
    sceneBreakdownAgent?: any;
    departmentAgent?: any;
    coordinatorAgent?: any;
  }>({});
  const [expandedRawSections, setExpandedRawSections] = useState<{
    [key: string]: boolean;
  }>({});


  // PDF Analysis functions using CJS API
  const handlePdfUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    setIsPdfAnalyzing(true);
    setPdfAnalysisError('');
    setUploadedPdfName(file.name);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      console.log('📄 Uploading PDF to CJS analysis API:', file.name);
      
      const response = await fetch('http://localhost:3001/api/analyze-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`PDF analysis failed: ${response.statusText}`);
      }

      const results = await response.json();
      console.log('✅ PDF analysis results:', results);
      console.log('🎭 Characters array:', results.data?.characters);
      console.log('🎭 Characters length:', results.data?.characters?.length);
      
      if (results.success && results.data) {
        setPdfAnalysisResults(results);
        
        toast({
          title: "PDF Analysis Complete!",
          description: `Extracted ${results.data.totalScenes || 0} scenes, ${results.data.totalCharacters || 0} characters.`
        });
      } else {
        throw new Error(results.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('❌ PDF analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setPdfAnalysisError(errorMessage);
      toast({
        title: "PDF Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsPdfAnalyzing(false);
    }
  };

  const handlePdfUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = handlePdfUpload;
    input.click();
  };

  // Depth Analysis functions
  const handleDepthAnalysis = async () => {
    if (!selectedProject?.pdfAnalysisResults) {
      toast({
        title: "PDF Analysis Required",
        description: "Please upload and analyze a PDF script first.",
        variant: "destructive"
      });
      return;
    }

    // Check if Gemini API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add VITE_GEMINI_API_KEY to your .env file to use AI Depth Analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsDepthAnalyzing(true);
    setDepthAnalysisError('');
    setDepthAnalysisProgress(0);
    setCurrentDepthAgent('');

    console.log('🧠 Starting AI Depth Script Analysis...');
    console.log('📊 Project:', selectedProject.name);
    console.log('📊 Scenes available:', selectedProject.pdfAnalysisResults.data?.scenes?.length || 0);

    try {
      const result = await depthScriptAnalysisService.executeFullAnalysis(
        selectedProject.pdfAnalysisResults,
        selectedProject.id,
        (status: string, agent: string, progress: number) => {
          console.log(`🔄 ${agent}: ${status} (${progress}%)`);
          setDepthAnalysisProgress(progress);
          setCurrentDepthAgent(agent);
        },
        (agent: string, rawOutput: any, parsedOutput: any) => {
          console.log(`📄 ${agent}: Raw output captured`);
          setRawAgentOutputs(prev => ({
            ...prev,
            [agent]: {
              raw: rawOutput,
              parsed: parsedOutput,
              timestamp: new Date().toISOString()
            }
          }));
        }
      );

      console.log('✅ Depth analysis completed successfully');
      console.log('📊 Result structure:', Object.keys(result || {}));
      console.log('📊 Full result:', result);

      // Handle different possible result structures
      const totalScenes = result?.integratedProductionBreakdown?.projectOverview?.totalScenes || 
                         result?.projectOverview?.totalScenes || 
                         result?.sceneAnalysisSummary?.totalScenesProcessed || 
                         'unknown';
      
      const totalBudget = result?.integratedProductionBreakdown?.projectOverview?.totalEstimatedBudget || 
                         result?.projectOverview?.totalEstimatedBudget || 
                         result?.departmentBudgetSummary?.grandTotal || 
                         0;

      console.log('📊 Total scenes processed:', totalScenes);
      console.log('💰 Total estimated budget:', totalBudget);

      setDepthAnalysisResults(result);
      setShowDepthResults(true);

      // Save to localStorage
      const depthAnalysisKey = `depth_analysis_${selectedProject.id}`;
      localStorage.setItem(depthAnalysisKey, JSON.stringify(result));
      
      // Save raw outputs to localStorage  
      const rawOutputsKey = `raw_agent_outputs_${selectedProject.id}`;
      localStorage.setItem(rawOutputsKey, JSON.stringify(rawAgentOutputs));

      toast({
        title: "AI Depth Analysis Complete!",
        description: `Analysis completed with ${totalScenes} scenes${totalBudget > 0 ? ` and $${totalBudget.toLocaleString()} budget estimate` : ''}.`
      });

    } catch (error) {
      console.error('❌ Depth analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDepthAnalysisError(errorMessage);
      
      toast({
        title: "Depth Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDepthAnalyzing(false);
      setDepthAnalysisProgress(0);
      setCurrentDepthAgent('');
    }
  };

  // Load existing depth analysis results
  useEffect(() => {
    if (selectedProject?.id) {
      const depthAnalysisKey = `depth_analysis_${selectedProject.id}`;
      const existingDepthAnalysis = localStorage.getItem(depthAnalysisKey);
      
      if (existingDepthAnalysis) {
        try {
          const parsed = JSON.parse(existingDepthAnalysis);
          setDepthAnalysisResults(parsed);
          console.log('✅ Loaded existing depth analysis for project:', selectedProject.name);
        } catch (error) {
          console.error('❌ Failed to load existing depth analysis:', error);
        }
      }

      // Load existing raw outputs
      const rawOutputsKey = `raw_agent_outputs_${selectedProject.id}`;
      const existingRawOutputs = localStorage.getItem(rawOutputsKey);
      
      if (existingRawOutputs) {
        try {
          const parsed = JSON.parse(existingRawOutputs);
          setRawAgentOutputs(parsed);
          console.log('✅ Loaded existing raw outputs for project:', selectedProject.name);
        } catch (error) {
          console.error('❌ Failed to load existing raw outputs:', error);
        }
      }
    }
  }, [selectedProject?.id]);

  // Utility functions for raw JSON display
  const toggleRawSection = (sectionKey: string) => {
    setExpandedRawSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        description: "JSON data has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please select and copy manually.",
        variant: "destructive"
      });
    }
  };

  const downloadJSON = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started!",
      description: `${filename} has been downloaded.`,
    });
  };






  // Initialize script editing when switching to edit tab
  useEffect(() => {
    if (activeTab === 'edit') {
      // Use extracted PDF text if available, otherwise use project script content
      let scriptText = '';
      
      if (pdfAnalysisResults?.data) {
        // If we have PDF analysis results, create a formatted text from all scenes
        const scenes = pdfAnalysisResults.data.scenes || [];
        scriptText = scenes.map((scene: any, index: number) => {
          let sceneText = `SCENE ${index + 1}:\n`;
          sceneText += `${scene.Scene_Names || 'UNTITLED SCENE'}\n\n`;
          sceneText += `${scene.Contents || scene.Scene_action || ''}\n\n`;
          sceneText += '=' + '='.repeat(50) + '\n\n';
          return sceneText;
        }).join('');
      } else {
        // Use project script content as fallback
        scriptText = selectedProject?.scriptContent || '';
      }
      
      setEditedScript(scriptText);
      setOriginalScript(scriptText);
      setHasUnsavedChanges(false);
    }
  }, [activeTab, selectedProject?.scriptContent, pdfAnalysisResults]);

  // Handle script editing
  const handleScriptChange = (value: string) => {
    setEditedScript(value);
    setHasUnsavedChanges(value !== originalScript);
  };

  const saveScriptChanges = () => {
    if (!selectedProject) return;

    const updatedProject = { 
      ...selectedProject, 
      scriptContent: editedScript
    };
    
    const existingProjects = JSON.parse(localStorage.getItem('filmustage_projects') || '[]');
    const updatedProjects = existingProjects.map((p: ProjectData) => 
      p.id === selectedProject.id ? updatedProject : p
    );
    localStorage.setItem('filmustage_projects', JSON.stringify(updatedProjects));
    localStorage.setItem('selected_project', JSON.stringify(updatedProject));
    selectProject(updatedProject);

    setOriginalScript(editedScript);
    setHasUnsavedChanges(false);
    setIsEditMode(false);

    toast({
      title: "Script saved successfully!",
      description: "Your script changes have been saved. You may want to re-analyze the script."
    });
  };

  const discardScriptChanges = () => {
    setEditedScript(originalScript);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to exit edit mode?')) {
        discardScriptChanges();
      }
    } else {
      setIsEditMode(!isEditMode);
    }
  };


  // Auto-load PDF analysis results when project loads
  useEffect(() => {
    console.log('🔍 Checking for existing PDF analysis results...');
    if (selectedProject?.pdfAnalysisResults) {
      console.log('✅ Found existing PDF analysis results for project:', selectedProject.name);
      setPdfAnalysisResults(selectedProject.pdfAnalysisResults);
      setUploadedPdfName(selectedProject.pdfFileName || 'Unknown PDF');
      
      toast({
        title: "PDF Analysis Loaded",
        description: `Analysis data loaded for ${selectedProject.name}.`,
      });
    } else if (selectedProject?.pdfFileName) {
      console.log(`🔍 Project has PDF file but no analysis: ${selectedProject.pdfFileName}`);
      setUploadedPdfName(selectedProject.pdfFileName);
      
      toast({
        title: "PDF Analysis Required",
        description: `Upload ${selectedProject.pdfFileName} to extract and analyze the script content.`,
      });
    }
  }, [selectedProject]);

  // Transform PDF analysis results to scheduling service format
  const transformPdfAnalysisToSchedulingInput = (pdfResults: any): ScriptAnalysisInput | null => {
    console.log('🔄 TRANSFORM: Converting PDF analysis to scheduling input format...');
    console.log('📊 TRANSFORM: Original data structure:', Object.keys(pdfResults?.data || {}));
    
    if (!pdfResults?.data) {
      console.error('❌ TRANSFORM: No PDF analysis data found');
      return null;
    }

    const data = pdfResults.data;
    
    // Transform to ScriptAnalysisInput format
    const schedulingInput = {
      sceneBreakdownOutput: {
        projectId: selectedProject?.id || 'unknown',
        sceneAnalysisSummary: {
          totalScenesProcessed: data.totalScenes || 0,
          totalCharactersIdentified: data.totalCharacters || 0,
          totalLocationsIdentified: data.scenes?.length || 0, // Estimate from scenes
          totalPropsIdentified: 0, // Not available in PDF analysis
          averageSceneComplexity: 2.5 // Default moderate complexity
        },
        detailedSceneBreakdowns: (data.scenes || []).map((scene: any, index: number) => ({
          sceneNumber: index + 1,
          sceneHeader: scene.Scene_Header || `Scene ${index + 1}`,
          location: {
            type: scene.Location_Type || "INT",
            primaryLocation: scene.Location || "Unknown Location",
            timeOfDay: scene.Time_Of_Day || "DAY",
            complexityLevel: "moderate" as const
          },
          characters: {
            speaking: (scene.Scene_Characters || []).map((char: any) => ({
              name: typeof char === 'string' ? char : char.name || char,
              dialogueLines: 5, // Default estimate
              specialRequirements: []
            })),
            nonSpeaking: []
          },
          timeEstimates: {
            setupHours: 2,
            shootingHours: 8,
            wrapHours: 1,
            totalHours: 11
          },
          complexityScores: {
            technicalDifficulty: 2.5,
            castComplexity: (scene.Scene_Characters?.length || 1) * 0.5,
            locationChallenges: 2.0,
            overallComplexity: 2.5
          },
          departmentRequirements: {
            makeup: {
              standardMakeup: scene.Scene_Characters?.length || 1,
              estimatedApplicationTime: 30
            },
            wardrobe: {
              costumesNeeded: scene.Scene_Characters?.length || 1,
              quickChanges: 0,
              fittingTime: 15
            }
          }
        }))
      }
    };

    console.log('✅ TRANSFORM: Conversion completed');
    console.log('📊 TRANSFORM: Output scenes:', schedulingInput.sceneBreakdownOutput.detailedSceneBreakdowns.length);
    console.log('📊 TRANSFORM: Output characters:', schedulingInput.sceneBreakdownOutput.sceneAnalysisSummary.totalCharactersIdentified);
    
    return schedulingInput;
  };

  // Background workflow: Auto-generate scheduling and budget when script analysis is available
  useEffect(() => {
    const startBackgroundWorkflow = async () => {
      console.log('');
      console.log('🚀 ===== BACKGROUND WORKFLOW: CHECKING FOR AUTO-GENERATION =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('🔍 PROJECT:', selectedProject?.name || 'No project');
      console.log('🚀 ================================================================');
      console.log('');

      if (!selectedProject?.pdfAnalysisResults || !selectedProject.id) {
        console.log('⚠️ BACKGROUND: No script analysis or project ID available, skipping workflow');
        return;
      }

      console.log('✅ BACKGROUND: Script analysis found, checking for existing data...');

      // Check if scheduling already exists
      const schedulingKey = `production_schedule_${selectedProject.id}`;
      const existingScheduling = localStorage.getItem(schedulingKey);
      
      // Check if budget already exists
      const budgetKey = `basic_budget_${selectedProject.id}`;
      const existingBudget = localStorage.getItem(budgetKey);

      console.log('📊 BACKGROUND: Existing scheduling:', !!existingScheduling);
      console.log('💰 BACKGROUND: Existing budget:', !!existingBudget);

      if (existingScheduling && existingBudget) {
        console.log('✅ BACKGROUND: Both scheduling and budget exist, workflow complete');
        setBackgroundProcessStatus('Workflow already complete');
        setBackgroundProcessComplete(true);
        return;
      }

      // Start background scheduling generation if needed
      if (!existingScheduling) {
        console.log('🚀 BACKGROUND: Starting scheduling generation...');
        setIsGeneratingSchedule(true);
        setBackgroundProcessStatus('Generating production schedule in background...');

        try {
          // Transform PDF analysis to scheduling input format
          const schedulingInput = transformPdfAnalysisToSchedulingInput(selectedProject.pdfAnalysisResults);
          
          if (!schedulingInput) {
            console.error('❌ BACKGROUND: Failed to transform PDF analysis data');
            setIsGeneratingSchedule(false);
            setBackgroundProcessStatus('Data transformation failed');
            return;
          }

          const schedulingResult = await generateProductionScheduleWithAI(
            schedulingInput,
            selectedProject.id,
            (status) => {
              console.log('📅 BACKGROUND SCHEDULING:', status);
              setBackgroundProcessStatus(`Scheduling: ${status}`);
            }
          );

          if (schedulingResult.status === 'completed' && schedulingResult.result) {
            localStorage.setItem(schedulingKey, JSON.stringify(schedulingResult.result));
            console.log('✅ BACKGROUND: Scheduling completed and saved');
            setIsGeneratingSchedule(false);

            // Now start budget generation
            if (!existingBudget) {
              console.log('🚀 BACKGROUND: Starting budget generation...');
              setIsGeneratingBudget(true);
              setBackgroundProcessStatus('Generating basic budget in background...');

              try {
                const budgetResult = await generateBasicBudgetWithAI(
                  selectedProject.pdfAnalysisResults,
                  schedulingResult.result,
                  selectedProject.id,
                  (status) => {
                    console.log('💰 BACKGROUND BUDGET:', status);
                    setBackgroundProcessStatus(`Budget: ${status}`);
                  }
                );

                if (budgetResult.status === 'completed' && budgetResult.result) {
                  localStorage.setItem(budgetKey, JSON.stringify(budgetResult.result));
                  console.log('✅ BACKGROUND: Budget completed and saved');
                  setIsGeneratingBudget(false);
                  setBackgroundProcessStatus('Background workflow complete');
                  setBackgroundProcessComplete(true);

                  toast({
                    title: "Background processing complete!",
                    description: "Schedule and budget generated automatically while you review the script.",
                  });
                } else {
                  console.log('⚠️ BACKGROUND: Budget generation failed');
                  setIsGeneratingBudget(false);
                  setBackgroundProcessStatus('Budget generation failed');
                }
              } catch (budgetError) {
                console.error('❌ BACKGROUND: Budget generation error:', budgetError);
                setIsGeneratingBudget(false);
                setBackgroundProcessStatus('Budget generation error');
              }
            }
          } else {
            console.log('⚠️ BACKGROUND: Scheduling generation failed');
            setIsGeneratingSchedule(false);
            setBackgroundProcessStatus('Scheduling generation failed');
          }
        } catch (schedulingError) {
          console.error('❌ BACKGROUND: Scheduling generation error:', schedulingError);
          setIsGeneratingSchedule(false);
          setBackgroundProcessStatus('Scheduling generation error');
        }
      } else {
        // Scheduling exists, just check budget
        console.log('✅ BACKGROUND: Scheduling exists, checking budget...');
        if (!existingBudget) {
          console.log('🚀 BACKGROUND: Starting budget generation...');
          setIsGeneratingBudget(true);
          setBackgroundProcessStatus('Generating basic budget in background...');

          try {
            const storedScheduling = JSON.parse(existingScheduling);
            const budgetResult = await generateBasicBudgetWithAI(
              selectedProject.pdfAnalysisResults,
              storedScheduling,
              selectedProject.id,
              (status) => {
                console.log('💰 BACKGROUND BUDGET:', status);
                setBackgroundProcessStatus(`Budget: ${status}`);
              }
            );

            if (budgetResult.status === 'completed' && budgetResult.result) {
              localStorage.setItem(budgetKey, JSON.stringify(budgetResult.result));
              console.log('✅ BACKGROUND: Budget completed and saved');
              setIsGeneratingBudget(false);
              setBackgroundProcessStatus('Background workflow complete');
              setBackgroundProcessComplete(true);

              toast({
                title: "Background processing complete!",
                description: "Basic budget generated automatically while you review the script.",
              });
            } else {
              console.log('⚠️ BACKGROUND: Budget generation failed');
              setIsGeneratingBudget(false);
              setBackgroundProcessStatus('Budget generation failed');
            }
          } catch (budgetError) {
            console.error('❌ BACKGROUND: Budget generation error:', budgetError);
            setIsGeneratingBudget(false);
            setBackgroundProcessStatus('Budget generation error');
          }
        }
      }

      console.log('');
      console.log('🚀 ===== BACKGROUND WORKFLOW: PROCESS COMPLETE =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('🚀 ==================================================');
      console.log('');
    };

    // Only run once per project
    if (selectedProject?.pdfAnalysisResults && selectedProject.id) {
      startBackgroundWorkflow();
    }
  }, [selectedProject?.id, selectedProject?.pdfAnalysisResults]);
  
  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-4 w-4 text-orange-400" />
          <span className="text-orange-300 font-medium text-sm">PDF Script</span>
        </div>
        
        {/* Project Info */}
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="font-medium text-white text-sm">{selectedProject?.name || 'Project'}</div>
          {selectedProject?.pdfFileName && (
            <div className="text-xs text-gray-400 mt-1">PDF: {selectedProject.pdfFileName}</div>
          )}
          <div className="text-xs text-orange-400 mt-1">
            {pdfAnalysisResults?.data ? 'Analysis complete' : 'Ready for analysis'}
          </div>
        </div>
        
        {/* PDF Analysis Stats */}
        {pdfAnalysisResults?.data && (
          <div className="space-y-2">
            <div className="text-gray-400 text-xs uppercase font-medium">Analysis Stats</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Scenes:</span>
                <span className="text-white">{pdfAnalysisResults.data.totalScenes || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Characters:</span>
                <span className="text-white">{pdfAnalysisResults.data.totalCharacters || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Dialogues:</span>
                <span className="text-white">{pdfAnalysisResults.data.totalDialogues || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Depth Analysis Stats */}
        {depthAnalysisResults && (
          <div className="space-y-2">
            <div className="text-purple-400 text-xs uppercase font-medium">Depth Analysis</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Screen Time:</span>
                <span className="text-purple-300">
                  {depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.totalEstimatedScreenTime ||
                   depthAnalysisResults?.projectOverview?.totalEstimatedScreenTime || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Budget:</span>
                <span className="text-purple-300">
                  ${((depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.totalEstimatedBudget ||
                     depthAnalysisResults?.projectOverview?.totalEstimatedBudget ||
                     depthAnalysisResults?.departmentBudgetSummary?.grandTotal || 0) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Shoot Days:</span>
                <span className="text-purple-300">
                  {depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.estimatedShootingDays ||
                   depthAnalysisResults?.projectOverview?.estimatedShootingDays || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Crew Size:</span>
                <span className="text-purple-300">
                  {depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.crewSizeRecommendation ||
                   depthAnalysisResults?.projectOverview?.crewSizeRecommendation || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <div className="text-gray-400 text-xs uppercase font-medium">Quick Actions</div>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                activeTab === 'pdf' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              View PDF Analysis
            </button>
            <button
              onClick={() => setActiveTab('depth')}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                activeTab === 'depth' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="h-3 w-3" />
                <span>AI Depth Analysis</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                activeTab === 'edit' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Edit Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  const notesPanel = (
    <div className="p-4 bg-gray-950 border-l border-gray-800">
      <h3 className="text-white font-medium mb-4">Notes</h3>
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
              <div className="flex items-center mt-1 text-gray-400 text-sm">
                <FileText className="h-4 w-4 mr-1" />
                <span>PDF Script Analysis</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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

          {/* Background Process Indicator */}
          {(isGeneratingSchedule || isGeneratingBudget || backgroundProcessStatus) && (
            <div className="mb-6 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {(isGeneratingSchedule || isGeneratingBudget) && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  )}
                  {backgroundProcessComplete && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                  <div>
                    <div className="text-blue-200 text-sm font-medium">
                      {backgroundProcessComplete ? 'Background Processing Complete' : 'Background Processing'}
                    </div>
                    <div className="text-blue-300 text-xs mt-1">
                      {backgroundProcessStatus || 'Initializing background workflow...'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-blue-300">
                  {isGeneratingSchedule && <Badge variant="outline" className="border-orange-500 text-orange-400">Scheduling</Badge>}
                  {isGeneratingBudget && <Badge variant="outline" className="border-green-500 text-green-400">Budget</Badge>}
                  {backgroundProcessComplete && <Badge variant="outline" className="border-green-500 text-green-400">Complete</Badge>}
                </div>
              </div>
            </div>
          )}

          {/* Depth Analysis Process Indicator */}
          {isDepthAnalyzing && (
            <div className="mb-6 bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="h-4 w-4 animate-pulse text-purple-400" />
                  <div>
                    <div className="text-purple-200 text-sm font-medium">
                      AI Depth Script Analysis
                    </div>
                    <div className="text-purple-300 text-xs mt-1">
                      {currentDepthAgent || 'Initializing depth analysis pipeline...'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs text-purple-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-purple-900 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${depthAnalysisProgress}%` }}
                      />
                    </div>
                    <span>{depthAnalysisProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-800">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pdf'
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileEdit className="h-4 w-4" />
                    <span>PDF Script</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('depth')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'depth'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span>AI Depth Analysis</span>
                    {depthAnalysisResults && (
                      <Badge variant="outline" className="ml-1 text-xs border-purple-500 text-purple-400">
                        Ready
                      </Badge>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'edit'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileEdit className="h-4 w-4" />
                    <span>Edit Script</span>
                    {hasUnsavedChanges && (
                      <Badge variant="destructive" className="ml-1 text-xs">
                        Unsaved
                      </Badge>
                    )}
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}

      {/* Edit Script Tab */}
      {activeTab === 'edit' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Edit Script</h2>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleEditMode}
                className="border-blue-500 text-blue-400 bg-gray-900 hover:bg-gray-800"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                {isEditMode ? 'View Mode' : 'Edit Mode'}
              </Button>
              {hasUnsavedChanges && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={saveScriptChanges}
                    className="border-green-500 text-green-400 bg-gray-900 hover:bg-gray-800"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={discardScriptChanges}
                    className="border-red-500 text-red-400 bg-gray-900 hover:bg-gray-800"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                </>
              )}
            </div>
          </div>

          {(pdfAnalysisResults?.data || selectedProject?.scriptContent) ? (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Script Editor - {editedScript.length} characters
                </div>
                <div className="text-xs text-gray-500">
                  {isEditMode ? 'Edit Mode' : 'View Mode'}
                </div>
              </div>
              
              <Textarea
                value={editedScript}
                onChange={(e) => handleScriptChange(e.target.value)}
                disabled={!isEditMode}
                className="w-full h-96 bg-gray-900 text-white font-mono text-sm leading-relaxed border-gray-600 focus:border-blue-500"
                placeholder="Script content will appear here..."
              />
              
              {hasUnsavedChanges && (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center text-yellow-300 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    You have unsaved changes. Remember to save before switching tabs or re-analyzing.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Script Content</h3>
              <p className="text-gray-400 mb-4">No script content available for editing.</p>
              <Button onClick={handlePdfUploadClick} className="bg-orange-600 hover:bg-orange-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF for Analysis
              </Button>
            </div>
          )}
        </div>
      )}

      {/* PDF Script Tab */}
      {activeTab === 'pdf' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">PDF Script</h2>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handlePdfUploadClick}
                disabled={isPdfAnalyzing}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isPdfAnalyzing ? 'Extracting...' : 'Upload PDF Script'}
              </Button>
              {pdfAnalysisResults?.data && (
                <Button 
                  onClick={handleDepthAnalysis}
                  disabled={isDepthAnalyzing || !import.meta.env.VITE_GEMINI_API_KEY}
                  className={`text-white ${
                    !import.meta.env.VITE_GEMINI_API_KEY 
                      ? 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  title={!import.meta.env.VITE_GEMINI_API_KEY ? 'API key required for depth analysis' : ''}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  {isDepthAnalyzing ? 'Analyzing...' : 'AI Depth Analysis'}
                  {!import.meta.env.VITE_GEMINI_API_KEY && (
                    <AlertTriangle className="ml-2 h-3 w-3 text-red-300" />
                  )}
                </Button>
              )}
              {selectedProject?.pdfFileName && (
                <span className="text-gray-400 text-sm">
                  Current: {selectedProject.pdfFileName}
                </span>
              )}
            </div>
          </div>

          {pdfAnalysisError && (
            <div className="text-red-500 mb-4">
              Error: {pdfAnalysisError}
            </div>
          )}

          {pdfAnalysisResults && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Analysis Results for {uploadedPdfName}</h3>
              
              {/* Raw Response Display */}
              <div className="border border-gray-300 rounded-lg bg-white">
                <button
                  onClick={() => setShowRawResponse(!showRawResponse)}
                  className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-t-lg text-left font-semibold flex items-center justify-between text-gray-900"
                >
                  Raw API Response
                  <span className="text-blue-600 text-xl">{showRawResponse ? '−' : '+'}</span>
                </button>
                {showRawResponse && (
                  <div className="p-4 border-t border-gray-300 bg-white">
                    <pre className="bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap font-mono">
                      {JSON.stringify(pdfAnalysisResults, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Structured Analysis Display */}
              {pdfAnalysisResults.success && pdfAnalysisResults.data && (
                <div className="border border-gray-300 rounded-lg bg-white">
                  <div className="px-4 py-3 bg-blue-50 rounded-t-lg">
                    <h4 className="font-semibold text-blue-900">Script Analysis Summary</h4>
                  </div>
                  <div className="p-4 space-y-4 bg-white">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{pdfAnalysisResults.data.totalScenes || 0}</div>
                        <div className="text-sm text-gray-700 font-medium">Total Scenes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-700">{pdfAnalysisResults.data.scriptName || 'Unknown'}</div>
                        <div className="text-sm text-gray-700 font-medium">Script Name</div>
                      </div>
                    </div>

                    {/* Scenes Display */}
                    {pdfAnalysisResults.data.scenes && pdfAnalysisResults.data.scenes.length > 0 && (
                      <div>
                        <h5 className="text-lg font-semibold mb-3 text-gray-900">Scenes ({pdfAnalysisResults.data.scenes.length})</h5>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {pdfAnalysisResults.data.scenes.map((scene: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                              <div className="flex items-start justify-between mb-2">
                                <h6 className="font-semibold text-blue-700">Scene {index + 1}</h6>
                                <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded font-medium">
                                  {scene.Scene_Characters ? `${scene.Scene_Characters.length} characters` : 'No characters'}
                                </span>
                              </div>
                              
                              {/* Scene Name/Location */}
                              {scene.Scene_Names && (
                                <div className="mb-3">
                                  <div className="text-sm font-medium text-gray-800 mb-1">Location:</div>
                                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-sm text-gray-900">
                                    {scene.Scene_Names}
                                  </div>
                                </div>
                              )}

                              {/* Scene Content */}
                              {scene.Contents && (
                                <div className="mb-3">
                                  <div className="text-sm font-medium text-gray-800 mb-1">Scene Content:</div>
                                  <div className="bg-gray-50 border border-gray-200 p-3 rounded text-sm max-h-32 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-800">
                                      {scene.Contents.length > 500 ? `${scene.Contents.substring(0, 500)}...` : scene.Contents}
                                    </pre>
                                  </div>
                                  {scene.Contents.length > 500 && (
                                    <button 
                                      onClick={() => {
                                        const element = document.getElementById(`scene-${index}-full`);
                                        if (element) {
                                          element.style.display = element.style.display === 'none' ? 'block' : 'none';
                                        }
                                      }}
                                      className="mt-2 text-blue-700 hover:text-blue-900 text-sm underline font-medium"
                                    >
                                      Show Full Content
                                    </button>
                                  )}
                                  {scene.Contents.length > 500 && (
                                    <div id={`scene-${index}-full`} style={{display: 'none'}} className="mt-2 bg-gray-50 border border-gray-200 p-3 rounded text-sm">
                                      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-800">
                                        {scene.Contents}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}

                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AI Depth Analysis Tab */}
      {activeTab === 'depth' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">AI Depth Script Analysis</h2>
            <div className="flex items-center space-x-3">
              {!depthAnalysisResults && pdfAnalysisResults?.data && (
                <Button 
                  onClick={handleDepthAnalysis}
                  disabled={isDepthAnalyzing}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  {isDepthAnalyzing ? 'Analyzing...' : 'Start Depth Analysis'}
                </Button>
              )}
              {depthAnalysisResults && (
                <Button 
                  onClick={handleDepthAnalysis}
                  disabled={isDepthAnalyzing}
                  variant="outline"
                  className="border-purple-500 text-purple-400 bg-gray-900 hover:bg-gray-800"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  {isDepthAnalyzing ? 'Re-analyzing...' : 'Re-run Analysis'}
                </Button>
              )}
            </div>
          </div>

          {depthAnalysisError && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
              <div className="flex items-center text-red-300">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm">Error: {depthAnalysisError}</span>
              </div>
            </div>
          )}

          {!pdfAnalysisResults?.data && (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Brain className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">PDF Analysis Required</h3>
              <p className="text-gray-400 mb-4">Please upload and analyze a PDF script first to enable depth analysis.</p>
              <Button onClick={() => setActiveTab('pdf')} className="bg-orange-600 hover:bg-orange-700">
                <Upload className="mr-2 h-4 w-4" />
                Go to PDF Upload
              </Button>
            </div>
          )}

          {!depthAnalysisResults && pdfAnalysisResults?.data && !isDepthAnalyzing && (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              {!import.meta.env.VITE_GEMINI_API_KEY ? (
                <>
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">API Key Required</h3>
                  <p className="text-gray-400 mb-4">
                    To use AI Depth Analysis, you need to add your Gemini API key to the environment variables.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 mb-4 text-left">
                    <div className="text-sm text-gray-300 mb-2">Add to your <code className="bg-gray-700 px-2 py-1 rounded text-orange-300">.env</code> file:</div>
                    <code className="text-green-400 text-sm">VITE_GEMINI_API_KEY=your_gemini_api_key_here</code>
                  </div>
                  <p className="text-xs text-gray-500">
                    Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google AI Studio</a>
                  </p>
                </>
              ) : (
                <>
                  <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Ready for AI Depth Analysis</h3>
                  <p className="text-gray-400 mb-4">
                    Transform your script analysis with our comprehensive 4-agent AI pipeline:
                  </p>
                </>
              )}
              {import.meta.env.VITE_GEMINI_API_KEY && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-orange-400 mr-2" />
                        <span className="text-orange-300 font-medium">Eighths Agent</span>
                      </div>
                      <p className="text-gray-400 text-xs">Industry-standard scene timing analysis</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Users className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-blue-300 font-medium">Scene Breakdown</span>
                      </div>
                      <p className="text-gray-400 text-xs">Characters, props, locations extraction</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-green-300 font-medium">Department Agent</span>
                      </div>
                      <p className="text-gray-400 text-xs">Comprehensive budget calculations</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="h-4 w-4 text-purple-400 mr-2" />
                        <span className="text-purple-300 font-medium">Coordinator Agent</span>
                      </div>
                      <p className="text-gray-400 text-xs">Executive reporting & risk assessment</p>
                    </div>
                  </div>
                  <Button onClick={handleDepthAnalysis} className="bg-purple-600 hover:bg-purple-700">
                    <Brain className="mr-2 h-4 w-4" />
                    Start AI Depth Analysis
                  </Button>
                </>
              )}
            </div>
          )}

          {depthAnalysisResults && (
            <div className="space-y-6">
              {/* Always Show Raw JSON First - Priority Display */}
              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Code className="h-5 w-5 mr-2 text-red-400" />
                    🚨 Complete Raw JSON Output
                    <Badge variant="outline" className="ml-2 text-xs border-red-500 text-red-400">
                      ALWAYS VISIBLE
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-red-300 mb-4 font-medium">
                    ⚠️ This section always shows the complete raw JSON from depth analysis, even if there are structure errors above.
                  </div>
                  
                  {/* Always visible compact JSON preview */}
                  <div className="mb-4 bg-red-950 border border-red-600 rounded-lg p-3">
                    <div className="text-xs text-red-300 mb-2 font-medium">🔍 JSON Preview (Always Visible):</div>
                    <div className="bg-gray-900 border border-red-700 rounded p-3 max-h-32 overflow-auto">
                      <pre className="text-xs text-red-200 whitespace-pre-wrap font-mono leading-tight">
                        {JSON.stringify(depthAnalysisResults, null, 2).substring(0, 500)}...
                      </pre>
                    </div>
                    <div className="mt-2 text-xs text-red-400">
                      Full JSON available in expandable section below ↓
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-red-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleRawSection('priorityFullResults')}
                        className="w-full px-4 py-3 bg-red-900 hover:bg-red-800 text-left font-medium flex items-center justify-between transition-colors border-l-4 border-red-500"
                      >
                        <div className="flex items-center">
                          <Code className="h-4 w-4 mr-3 text-red-300" />
                          <span className="text-red-100">🔍 Complete Depth Analysis JSON</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(JSON.stringify(depthAnalysisResults, null, 2));
                            }}
                            className="p-1 hover:bg-red-700 rounded text-red-300 hover:text-red-200 transition-colors"
                            title="Copy Complete JSON"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadJSON(depthAnalysisResults, `emergency_depth_analysis_${Date.now()}.json`);
                            }}
                            className="p-1 hover:bg-red-700 rounded text-red-300 hover:text-red-200 transition-colors"
                            title="Download Complete JSON"
                          >
                            <DownloadIcon className="h-3 w-3" />
                          </button>
                          {expandedRawSections['priorityFullResults'] ? (
                            <ChevronDown className="h-4 w-4 text-red-300" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-red-300" />
                          )}
                        </div>
                      </button>
                      
                      {expandedRawSections['priorityFullResults'] && (
                        <div className="border-t border-red-700 p-4 bg-red-950">
                          <div className="bg-gray-900 border border-red-600 rounded-lg p-4 max-h-96 overflow-auto">
                            <pre className="text-xs text-red-200 whitespace-pre-wrap font-mono leading-relaxed">
                              {JSON.stringify(depthAnalysisResults, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Structured Display with Error Boundaries */}
              {(() => {
                try {
                  return (
                    <>
                      {/* Executive Summary */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                            Analysis Results Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-purple-400">
                                {(() => {
                                  try {
                                    return depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.totalScenes ||
                                           depthAnalysisResults?.projectOverview?.totalScenes ||
                                           depthAnalysisResults?.sceneAnalysisSummary?.totalScenesProcessed ||
                                           'N/A';
                                  } catch (error) {
                                    console.error('Error accessing totalScenes:', error);
                                    return 'Error';
                                  }
                                })()}
                              </div>
                              <div className="text-sm text-gray-400">Total Scenes</div>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-orange-400">
                                {(() => {
                                  try {
                                    return depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.totalEstimatedScreenTime ||
                                           depthAnalysisResults?.projectOverview?.totalEstimatedScreenTime ||
                                           'N/A';
                                  } catch (error) {
                                    console.error('Error accessing screen time:', error);
                                    return 'Error';
                                  }
                                })()}
                              </div>
                              <div className="text-sm text-gray-400">Screen Time</div>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-green-400">
                                {(() => {
                                  try {
                                    const budget = depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.totalEstimatedBudget ||
                                                  depthAnalysisResults?.projectOverview?.totalEstimatedBudget ||
                                                  depthAnalysisResults?.departmentBudgetSummary?.grandTotal ||
                                                  0;
                                    return `$${(budget || 0).toLocaleString()}`;
                                  } catch (error) {
                                    console.error('Error accessing budget:', error);
                                    return '$Error';
                                  }
                                })()}
                              </div>
                              <div className="text-sm text-gray-400">Estimated Budget</div>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-blue-400">
                                {(() => {
                                  try {
                                    return depthAnalysisResults?.integratedProductionBreakdown?.projectOverview?.estimatedShootingDays ||
                                           depthAnalysisResults?.projectOverview?.estimatedShootingDays ||
                                           'N/A';
                                  } catch (error) {
                                    console.error('Error accessing shooting days:', error);
                                    return 'Error';
                                  }
                                })()}
                              </div>
                              <div className="text-sm text-gray-400">Shooting Days</div>
                            </div>
                          </div>
                          
                          {/* Show structure info for debugging */}
                          <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                            <div className="text-sm text-gray-400 mb-2">Analysis Structure Available:</div>
                            <div className="text-xs text-gray-500 space-y-1">
                              {Object.keys(depthAnalysisResults || {}).map(key => (
                                <div key={key}>• {key}</div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  );
                } catch (error) {
                  console.error('Error rendering executive summary:', error);
                  return (
                    <Card className="bg-red-900/20 border-red-600/30">
                      <CardHeader>
                        <CardTitle className="text-red-300 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Structure Display Error
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-red-200 text-sm">
                          Error displaying structured data: {error.message}
                        </div>
                        <div className="text-red-300 text-xs mt-2">
                          Raw JSON is still available in the sections above and below.
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              })()}

              {/* Department Budget Breakdown */}
              {(() => {
                try {
                  return (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                          Department Budget Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {(() => {
                            try {
                              const departmentData = depthAnalysisResults?.integratedProductionBreakdown?.departmentBudgetSummary ||
                                                   depthAnalysisResults?.departmentBudgetSummary ||
                                                   {};
                              
                              return Object.entries(departmentData)
                                .filter(([key]) => key !== 'grandTotal' && key !== 'budgetByPhase')
                                .map(([department, amount]) => (
                                  <div key={department} className="bg-gray-900 rounded-lg p-3">
                                    <div className="text-sm text-gray-400 capitalize mb-1">
                                      {department.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className="text-lg font-semibold text-white">
                                      ${(amount as number || 0).toLocaleString()}
                                    </div>
                                  </div>
                                ));
                            } catch (error) {
                              console.error('Error rendering department budget data:', error);
                              return (
                                <div className="col-span-full bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                                  <div className="text-red-300 text-sm">Error displaying budget data: {error.message}</div>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                } catch (error) {
                  console.error('Error rendering department budget section:', error);
                  return (
                    <Card className="bg-red-900/20 border-red-600/30">
                      <CardHeader>
                        <CardTitle className="text-red-300 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Department Budget Error
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-red-200 text-sm">Error: {error.message}</div>
                      </CardContent>
                    </Card>
                  );
                }
              })()}

              {/* Timing Analysis */}
              {(() => {
                try {
                  return (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-orange-400" />
                          Timing Analysis Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          try {
                            const timingData = depthAnalysisResults?.integratedProductionBreakdown?.timingAnalysisSummary ||
                                             depthAnalysisResults?.timingAnalysisSummary ||
                                             {};
                            
                            if (!timingData || Object.keys(timingData).length === 0) {
                              return (
                                <div className="bg-gray-900 rounded-lg p-4 text-center">
                                  <div className="text-gray-400">Timing analysis data not available in current structure</div>
                                </div>
                              );
                            }
                            
                            return (
                              <>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div className="bg-gray-900 rounded-lg p-4 text-center">
                                    <div className="text-lg font-bold text-orange-400">
                                      {timingData?.shortestScene?.screenTime || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Shortest Scene ({timingData?.shortestScene?.sceneNumber || 'N/A'})
                                    </div>
                                  </div>
                                  <div className="bg-gray-900 rounded-lg p-4 text-center">
                                    <div className="text-lg font-bold text-orange-400">
                                      {timingData?.averageSceneLength || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-400">Average Scene</div>
                                  </div>
                                  <div className="bg-gray-900 rounded-lg p-4 text-center">
                                    <div className="text-lg font-bold text-orange-400">
                                      {timingData?.longestScene?.screenTime || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Longest Scene ({timingData?.longestScene?.sceneNumber || 'N/A'})
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-4">
                                  <div className="text-sm text-gray-400 mb-2">Scene Complexity Distribution</div>
                                  <div className="flex space-x-4">
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                                      <span className="text-sm text-gray-300">
                                        Simple: {timingData?.complexityDistribution?.simpleScenes || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                                      <span className="text-sm text-gray-300">
                                        Standard: {timingData?.complexityDistribution?.standardScenes || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                                      <span className="text-sm text-gray-300">
                                        Complex: {timingData?.complexityDistribution?.complexScenes || 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          } catch (error) {
                            console.error('Error rendering timing analysis data:', error);
                            return (
                              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                                <div className="text-red-300 text-sm">Error displaying timing data: {error.message}</div>
                              </div>
                            );
                          }
                        })()}
                      </CardContent>
                    </Card>
                  );
                } catch (error) {
                  console.error('Error rendering timing analysis section:', error);
                  return (
                    <Card className="bg-red-900/20 border-red-600/30">
                      <CardHeader>
                        <CardTitle className="text-red-300 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Timing Analysis Error
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-red-200 text-sm">Error: {error.message}</div>
                      </CardContent>
                    </Card>
                  );
                }
              })()}

              {/* Risk Assessment */}
              {(() => {
                const risks = depthAnalysisResults?.riskAssessmentAndRecommendations?.identifiedRisks ||
                             depthAnalysisResults?.identifiedRisks ||
                             [];
                
                if (risks.length > 0) {
                  return (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                          Risk Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {risks.slice(0, 5).map((risk, index) => (
                            <div key={index} className="bg-gray-900 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-2 ${
                                    risk.impact === 'high' ? 'bg-red-500' : 
                                    risk.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></div>
                                  <span className="text-white font-medium capitalize">{risk.category || 'Unknown'} Risk</span>
                                </div>
                                <Badge variant="outline" className={`text-xs ${
                                  risk.probability === 'high' ? 'border-red-500 text-red-400' :
                                  risk.probability === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                  'border-green-500 text-green-400'
                                }`}>
                                  {risk.probability || 'unknown'} probability
                                </Badge>
                              </div>
                              <p className="text-gray-300 text-sm mb-2">{risk.description || 'No description available'}</p>
                              <p className="text-gray-400 text-xs"><strong>Mitigation:</strong> {risk.mitigation || 'No mitigation specified'}</p>
                              {(risk.contingencyCost || 0) > 0 && (
                                <p className="text-orange-400 text-xs mt-1">
                                  <strong>Contingency Cost:</strong> ${(risk.contingencyCost || 0).toLocaleString()}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
                return null;
              })()}

              {/* Performance Metrics */}
              {(() => {
                try {
                  return (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                          Analysis Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-900 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-green-400">
                              {(() => {
                                try {
                                  return depthAnalysisResults?.workflowExecutionSummary?.overallSuccessRate ||
                                         depthAnalysisResults?.overallSuccessRate || 'N/A';
                                } catch (error) {
                                  return 'Error';
                                }
                              })()}
                            </div>
                            <div className="text-sm text-gray-400">Success Rate</div>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-blue-400">
                              {(() => {
                                try {
                                  return depthAnalysisResults?.workflowExecutionSummary?.agentsCoordinated ||
                                         depthAnalysisResults?.agentsCoordinated || '4';
                                } catch (error) {
                                  return 'Error';
                                }
                              })()}
                            </div>
                            <div className="text-sm text-gray-400">Agents</div>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-purple-400">
                              {(() => {
                                try {
                                  return Math.round((depthAnalysisResults?.workflowExecutionSummary?.totalProcessingTimeMs ||
                                                   depthAnalysisResults?.totalProcessingTimeMs || 0) / 1000) + 's';
                                } catch (error) {
                                  return 'Error';
                                }
                              })()}
                            </div>
                            <div className="text-sm text-gray-400">Processing Time</div>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-orange-400">
                              {(() => {
                                try {
                                  return depthAnalysisResults?.qualityControlReport?.overallConfidenceScore ||
                                         depthAnalysisResults?.overallConfidenceScore || 'N/A';
                                } catch (error) {
                                  return 'Error';
                                }
                              })()}
                            </div>
                            <div className="text-sm text-gray-400">Confidence</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                } catch (error) {
                  console.error('Error rendering performance metrics section:', error);
                  return (
                    <Card className="bg-red-900/20 border-red-600/30">
                      <CardHeader>
                        <CardTitle className="text-red-300 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Performance Metrics Error
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-red-200 text-sm">Error: {error.message}</div>
                      </CardContent>
                    </Card>
                  );
                }
              })()}

              {/* Complete Raw Analysis Output */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Code className="h-5 w-5 mr-2 text-red-400" />
                    Complete Analysis JSON Output
                    <Badge variant="outline" className="ml-2 text-xs border-red-500 text-red-400">
                      Always Available
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-400 mb-4">
                    Complete raw JSON output from the depth analysis. This is always shown regardless of structure parsing issues.
                  </div>
                  
                  <div className="space-y-4">
                    {/* Full Depth Analysis Results */}
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleRawSection('fullResults')}
                        className="w-full px-4 py-3 bg-gray-900 hover:bg-gray-850 text-left font-medium flex items-center justify-between transition-colors border-l-4 border-red-500"
                      >
                        <div className="flex items-center">
                          <Code className="h-4 w-4 mr-3 text-red-400" />
                          <span className="text-white">Complete Depth Analysis Results</span>
                          <Badge variant="outline" className="ml-2 text-xs border-red-500 text-red-400">
                            JSON
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(JSON.stringify(depthAnalysisResults, null, 2));
                            }}
                            className="p-1 hover:bg-gray-700 rounded text-red-400 hover:text-red-300 transition-colors"
                            title="Copy Complete JSON"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadJSON(depthAnalysisResults, `complete_depth_analysis_${selectedProject?.name || 'project'}.json`);
                            }}
                            className="p-1 hover:bg-gray-700 rounded text-red-400 hover:text-red-300 transition-colors"
                            title="Download Complete JSON"
                          >
                            <DownloadIcon className="h-3 w-3" />
                          </button>
                          {expandedRawSections['fullResults'] ? (
                            <ChevronDown className="h-4 w-4 text-red-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      </button>
                      
                      {expandedRawSections['fullResults'] && (
                        <div className="border-t border-gray-700">
                          <div className="p-4 bg-gray-950">
                            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-h-96 overflow-auto">
                              <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono leading-relaxed">
                                {JSON.stringify(depthAnalysisResults, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pipeline Execution Order & Raw JSON Outputs */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Code className="h-5 w-5 mr-2 text-cyan-400" />
                    🔄 Pipeline Execution Order & Raw JSON Outputs
                    <Badge variant="outline" className="ml-2 text-xs border-cyan-500 text-cyan-400">
                      Processing Sequence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-sm text-cyan-300 mb-4 font-medium">
                    📋 4-Agent Pipeline Execution Order: Coordinator → Eighths → Scene Breakdown → Department
                  </div>
                  
                  {/* Pipeline Flow Visualization */}
                  <div className="bg-gray-900 rounded-lg p-4 mb-6">
                    <div className="text-sm text-gray-300 mb-3 font-medium">Pipeline Execution Flow:</div>
                    
                    {/* Current Running Agent Indicator */}
                    {isDepthAnalyzing && currentDepthAgent && (
                      <div className="mb-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-center">
                        <span className="text-blue-200 text-sm">🔄 Currently Running: </span>
                        <span className="text-blue-100 font-bold">{currentDepthAgent}</span>
                        <span className="text-blue-300 text-sm ml-2">({depthAnalysisProgress}%)</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-xs overflow-x-auto">
                      <div className="flex items-center bg-purple-900/30 border border-purple-500 rounded px-3 py-2 min-w-fit">
                        <BarChart3 className="h-3 w-3 mr-2 text-purple-400" />
                        <span className="text-purple-300 font-medium">1. Coordinator</span>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="flex items-center bg-orange-900/30 border border-orange-500 rounded px-3 py-2 min-w-fit">
                        <Clock className="h-3 w-3 mr-2 text-orange-400" />
                        <span className="text-orange-300 font-medium">2. Eighths</span>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="flex items-center bg-blue-900/30 border border-blue-500 rounded px-3 py-2 min-w-fit">
                        <Users className="h-3 w-3 mr-2 text-blue-400" />
                        <span className="text-blue-300 font-medium">3. Scene Breakdown</span>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="flex items-center bg-green-900/30 border border-green-500 rounded px-3 py-2 min-w-fit">
                        <DollarSign className="h-3 w-3 mr-2 text-green-400" />
                        <span className="text-green-300 font-medium">4. Department</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Individual Agent Outputs in Processing Order */}
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      Individual agent raw JSON outputs shown in processing order. Each agent builds upon the previous agent's output.
                    </div>
                    
                    {/* Agent Outputs in Correct Order */}
                    {[
                      { key: 'coordinatorAgent', name: '🎯 Step 1: Coordinator Agent', icon: BarChart3, color: 'purple', description: 'Initial project coordination and planning' },
                      { key: 'eighthsAgent', name: '⏱️ Step 2: Eighths Agent', icon: Clock, color: 'orange', description: 'Industry-standard scene timing analysis' },
                      { key: 'sceneBreakdownAgent', name: '🎬 Step 3: Scene Breakdown Agent', icon: Users, color: 'blue', description: 'Character, prop, and location extraction' },
                      { key: 'departmentAgent', name: '💰 Step 4: Department Agent', icon: DollarSign, color: 'green', description: 'Comprehensive budget calculations' }
                    ].map(({ key, name, icon: Icon, color, description }, index) => {
                      const agentData = rawAgentOutputs[key];
                      const isExpanded = expandedRawSections[key];
                      
                      return (
                        <div key={key} className={`border border-${color}-600/30 rounded-lg overflow-hidden ${agentData ? 'bg-gray-900/50' : 'bg-gray-900/20'}`}>
                          <button
                            onClick={() => toggleRawSection(key)}
                            className={`w-full px-4 py-3 ${agentData ? `bg-${color}-900/20 hover:bg-${color}-900/30` : 'bg-gray-900 cursor-not-allowed'} text-left font-medium flex items-center justify-between transition-colors border-l-4 border-${color}-500`}
                            disabled={!agentData}
                          >
                            <div className="flex items-center">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-${color}-900/50 border border-${color}-500 mr-3`}>
                                <span className="text-xs font-bold text-white">{index + 1}</span>
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <Icon className={`h-4 w-4 mr-2 text-${color}-400`} />
                                  <span className="text-white font-medium">{name}</span>
                                  {agentData && (
                                    <Badge variant="outline" className={`ml-2 text-xs border-${color}-500 text-${color}-400`}>
                                      ✅ {new Date(agentData.timestamp).toLocaleTimeString()}
                                    </Badge>
                                  )}
                                  {!agentData && (
                                    <Badge variant="outline" className="ml-2 text-xs border-gray-500 text-gray-400">
                                      ⏳ Pending
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{description}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {agentData && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(agentData.raw);
                                    }}
                                    className={`p-1 hover:bg-${color}-700 rounded text-${color}-400 hover:text-${color}-300 transition-colors`}
                                    title="Copy Raw JSON"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadJSON(agentData.parsed, `step${index + 1}_${key}_output.json`);
                                    }}
                                    className={`p-1 hover:bg-${color}-700 rounded text-${color}-400 hover:text-${color}-300 transition-colors`}
                                    title="Download JSON"
                                  >
                                    <DownloadIcon className="h-3 w-3" />
                                  </button>
                                  {isExpanded ? (
                                    <ChevronDown className={`h-4 w-4 text-${color}-400`} />
                                  ) : (
                                    <ChevronRight className={`h-4 w-4 text-${color}-400`} />
                                  )}
                                </>
                              )}
                              {!agentData && (
                                <div className="text-gray-500 text-xs">No data available</div>
                              )}
                            </div>
                          </button>
                          
                          {agentData && isExpanded && (
                            <div className={`border-t border-${color}-600/30`}>
                              <div className="p-4 bg-gray-950">
                                <div className="space-y-4">
                                  {/* Processing Info */}
                                  <div className={`bg-${color}-950/50 border border-${color}-600/30 rounded-lg p-3`}>
                                    <div className="text-xs text-gray-300 space-y-1">
                                      <div><strong>Execution Order:</strong> Step {index + 1} of 4</div>
                                      <div><strong>Agent:</strong> {name.replace(/^.*?: /, '')}</div>
                                      <div><strong>Timestamp:</strong> {new Date(agentData.timestamp).toLocaleString()}</div>
                                      <div><strong>Purpose:</strong> {description}</div>
                                    </div>
                                  </div>
                                  
                                  {/* Parsed Output */}
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="text-sm font-medium text-gray-300">📊 Parsed Output (Structured JSON)</div>
                                      <button
                                        onClick={() => copyToClipboard(JSON.stringify(agentData.parsed, null, 2))}
                                        className="text-xs text-gray-400 hover:text-gray-200 underline"
                                      >
                                        Copy Parsed
                                      </button>
                                    </div>
                                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-h-96 overflow-auto">
                                      <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                                        {JSON.stringify(agentData.parsed, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                  
                                  {/* Raw Response */}
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="text-sm font-medium text-gray-300">🤖 Raw Gemini AI Response</div>
                                      <button
                                        onClick={() => copyToClipboard(agentData.raw)}
                                        className="text-xs text-gray-400 hover:text-gray-200 underline"
                                      >
                                        Copy Raw
                                      </button>
                                    </div>
                                    <div className={`bg-gray-800 border border-${color}-600/30 rounded-lg p-4 max-h-96 overflow-auto`}>
                                      <pre className={`text-xs text-${color}-300 whitespace-pre-wrap font-mono leading-relaxed`}>
                                        {agentData.raw}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Bulk Actions */}
                  {Object.keys(rawAgentOutputs).length > 0 && (
                    <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-600/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-cyan-200">🔄 Pipeline Bulk Actions</div>
                          <div className="text-xs text-cyan-400 mt-1">
                            Download or copy all agent outputs in processing order
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(JSON.stringify(rawAgentOutputs, null, 2))}
                            className="border-cyan-500 text-cyan-400 bg-gray-800 hover:bg-gray-700"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy All Pipeline
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadJSON(rawAgentOutputs, `complete_pipeline_${selectedProject?.name || 'project'}_${Date.now()}.json`)}
                            className="border-cyan-500 text-cyan-400 bg-gray-800 hover:bg-gray-700"
                          >
                            <DownloadIcon className="h-3 w-3 mr-1" />
                            Download Pipeline
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </MainLayout>
  );
};
