import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { Search, FileText, Share2, Download, Upload, Edit3, Save, RotateCcw, Eye, FileEdit, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { ProjectData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { generateProductionScheduleWithAI, ScriptAnalysisInput } from '@/services/schedulingGeneratorService';
import { generateBasicBudgetWithAI } from '@/services/basicBudgetGeneratorService';

console.log('📄 ScriptPage configured for PDF analysis with CJS API');

export const ScriptPage = () => {
  const { selectedProject, selectProject } = useSelectedProject();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'edit' | 'pdf'>('pdf');
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
        </div>
      </div>
    </MainLayout>
  );
};
