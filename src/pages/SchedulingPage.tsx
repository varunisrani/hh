import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateProductionScheduleWithAI, ProductionScheduleOutput, ScriptAnalysisInput } from '@/services/schedulingGeneratorService';
import DepthSchedulingAnalysisService, { DepthSchedulingResult, SchedulingScenario, TierProgress } from '@/services/depthSchedulingAnalysisService';
import { Plus, Share2, Download, Calendar, Clock, Users, DollarSign, AlertTriangle, MapPin, Wand2, Brain, CheckCircle, Loader2, Wrench, BarChart3, Zap, Edit3, Save, X, RotateCcw, Code, Copy, ChevronDown, ChevronRight, ChevronUp, Target, TrendingUp, Shield, DollarSign as Cost } from 'lucide-react';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Global scheduling service lock to prevent multiple simultaneous AI calls
const SCHEDULING_LOCK_KEY = 'scheduling_ai_service_running';
const SCHEDULING_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes timeout
const AUTO_GENERATION_ATTEMPTED_KEY = 'scheduling_auto_generation_attempted'; // Track auto-generation attempts

// Check if scheduling service is currently running globally
const isSchedulingServiceRunning = () => {
  const lockData = localStorage.getItem(SCHEDULING_LOCK_KEY);
  if (!lockData) return false;
  
  try {
    const { timestamp } = JSON.parse(lockData);
    const now = Date.now();
    
    // Check if lock has expired (timeout protection)
    if (now - timestamp > SCHEDULING_LOCK_TIMEOUT) {
      localStorage.removeItem(SCHEDULING_LOCK_KEY);
      return false;
    }
    
    return true;
  } catch {
    localStorage.removeItem(SCHEDULING_LOCK_KEY);
    return false;
  }
};

// Set global scheduling service lock
const setSchedulingServiceLock = (projectId: string) => {
  const lockData = {
    projectId,
    timestamp: Date.now()
  };
  localStorage.setItem(SCHEDULING_LOCK_KEY, JSON.stringify(lockData));
  console.log('🔒 Scheduling AI service lock set for project:', projectId);
};

// Remove global scheduling service lock
const removeSchedulingServiceLock = () => {
  localStorage.removeItem(SCHEDULING_LOCK_KEY);
  console.log('🔓 Scheduling AI service lock removed');
};

// Check if auto-generation has been attempted for this project
const hasAutoGenerationBeenAttempted = (projectId: string) => {
  const attemptedProjects = JSON.parse(localStorage.getItem(AUTO_GENERATION_ATTEMPTED_KEY) || '[]');
  return attemptedProjects.includes(projectId);
};

// Mark auto-generation as attempted for this project
const markAutoGenerationAttempted = (projectId: string) => {
  const attemptedProjects = JSON.parse(localStorage.getItem(AUTO_GENERATION_ATTEMPTED_KEY) || '[]');
  if (!attemptedProjects.includes(projectId)) {
    attemptedProjects.push(projectId);
    localStorage.setItem(AUTO_GENERATION_ATTEMPTED_KEY, JSON.stringify(attemptedProjects));
    console.log('🚀 Auto-generation marked as attempted for project:', projectId);
  }
};

export const SchedulingPage = () => {
  const { selectedProject } = useSelectedProject();
  const { toast } = useToast();
  
  const [activeView, setActiveView] = useState<'overview' | 'schedule' | 'cast' | 'locations' | 'equipment' | 'conflicts' | 'optimization' | 'depth-analysis'>('overview');
  const [productionSchedule, setProductionSchedule] = useState<ProductionScheduleOutput | null>(null);
  const [originalSchedule, setOriginalSchedule] = useState<ProductionScheduleOutput | null>(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingScene, setEditingScene] = useState<{dayIndex: number, sceneIndex: number} | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [scheduleVersions, setScheduleVersions] = useState<{timestamp: string, schedule: ProductionScheduleOutput}[]>([]);
  const [hasAttemptedAutoGeneration, setHasAttemptedAutoGeneration] = useState(false);
  
  // AI Depth Scheduling Analysis State
  const [isDepthAnalysisRunning, setIsDepthAnalysisRunning] = useState(false);
  const [depthAnalysisResult, setDepthAnalysisResult] = useState<DepthSchedulingResult | null>(null);
  const [depthAnalysisError, setDepthAnalysisError] = useState('');
  const [depthAnalysisProgress, setDepthAnalysisProgress] = useState('');
  const [currentTier, setCurrentTier] = useState<number>(0);
  const [tierProgress, setTierProgress] = useState<TierProgress[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('schedule-optimized');
  const [showRawJSON, setShowRawJSON] = useState(false);
  const [expandedRawSections, setExpandedRawSections] = useState<{[key: string]: boolean}>({});

  // Load existing schedule from localStorage and reset auto-generation flag on project change
  useEffect(() => {
    // Reset auto-generation attempt flag when project changes
    setHasAttemptedAutoGeneration(false);
    
    if (selectedProject?.id) {
      const savedSchedule = localStorage.getItem(`schedule_${selectedProject.id}`);
      if (savedSchedule) {
        try {
          const parsedSchedule = JSON.parse(savedSchedule);
          console.log('✅ Loading existing schedule for project:', selectedProject.name);
          setProductionSchedule(parsedSchedule);
          setOriginalSchedule(JSON.parse(JSON.stringify(parsedSchedule)));
          
          toast({
            title: "Schedule Loaded",
            description: "Using existing production schedule for this project."
          });
        } catch (error) {
          console.error('❌ Error loading saved schedule:', error);
        }
      } else {
        // Clear schedule state if no saved schedule for this project
        setProductionSchedule(null);
        setOriginalSchedule(null);
      }
      
      // Update local state based on global tracking
      const autoGenerationAttempted = hasAutoGenerationBeenAttempted(selectedProject.id);
      setHasAttemptedAutoGeneration(autoGenerationAttempted);
    }
  }, [selectedProject?.id]);

  // Check if we have PDF analysis data available
  const hasScriptAnalysis = selectedProject?.pdfAnalysisResults?.data?.scenes;
  
  // Debug logging
  console.log('📅 SchedulingPage Debug:', {
    selectedProject: selectedProject?.name,
    projectId: selectedProject?.id,
    hasPdfResults: !!selectedProject?.pdfAnalysisResults,
    hasScenes: !!selectedProject?.pdfAnalysisResults?.data?.scenes,
    sceneCount: selectedProject?.pdfAnalysisResults?.data?.totalScenes,
    hasProductionSchedule: !!productionSchedule,
    hasAttemptedAutoGeneration,
    autoGenerationAttemptedGlobally: selectedProject?.id ? hasAutoGenerationBeenAttempted(selectedProject.id) : false,
    isSchedulingServiceRunning: isSchedulingServiceRunning()
  });
  
  // Convert PDF analysis data to format expected by scheduling service
  const scriptAnalysis = selectedProject?.pdfAnalysisResults?.data ? {
    sceneBreakdownOutput: {
      detailedSceneBreakdowns: selectedProject.pdfAnalysisResults.data.scenes.map((scene: any, index: number) => ({
        sceneNumber: index + 1,
        sceneHeader: scene.Scene_Names || `Scene ${index + 1}`,
        sceneContent: scene.Contents || scene.Scene_action || '',
        characters: scene.Scene_Characters || [],
        location: {
          type: scene.Scene_Names?.includes('INT') ? 'INT' : 'EXT',
          primaryLocation: scene.Scene_Names || 'Unknown Location',
          timeOfDay: scene.Scene_Names?.includes('DAY') ? 'DAY' : scene.Scene_Names?.includes('NIGHT') ? 'NIGHT' : 'UNKNOWN'
        }
      })),
      sceneAnalysisSummary: {
        totalScenesProcessed: selectedProject.pdfAnalysisResults.data.totalScenes,
        totalCharactersIdentified: selectedProject.pdfAnalysisResults.data.totalCharacters,
        averageSceneComplexity: 3
      }
    }
  } : null;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save original schedule when first generated
  useEffect(() => {
    if (productionSchedule && !originalSchedule) {
      setOriginalSchedule(JSON.parse(JSON.stringify(productionSchedule)));
    }
  }, [productionSchedule, originalSchedule]);

  // Editing functions
  const toggleEditMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to exit edit mode?')) {
        setIsEditMode(false);
        setHasUnsavedChanges(false);
        setEditingScene(null);
      }
    } else {
      setIsEditMode(!isEditMode);
      setEditingScene(null);
    }
  };

  const saveChanges = () => {
    // Save to localStorage
    const scheduleKey = `filmustage_schedule_${selectedProject?.id}`;
    localStorage.setItem(scheduleKey, JSON.stringify(productionSchedule));
    
    // Save version to history
    const newVersion = {
      timestamp: new Date().toISOString(),
      schedule: JSON.parse(JSON.stringify(productionSchedule))
    };
    const updatedVersions = [...scheduleVersions, newVersion];
    setScheduleVersions(updatedVersions);
    
    // Save versions to localStorage
    const versionsKey = `filmustage_schedule_versions_${selectedProject?.id}`;
    localStorage.setItem(versionsKey, JSON.stringify(updatedVersions));
    
    setOriginalSchedule(JSON.parse(JSON.stringify(productionSchedule)));
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    setEditingScene(null);
    toast({
      title: "Changes saved",
      description: "Your schedule modifications have been saved successfully."
    });
  };

  // Load saved schedule from localStorage on component mount
  useEffect(() => {
    if (selectedProject?.id && productionSchedule) {
      const scheduleKey = `filmustage_schedule_${selectedProject.id}`;
      const savedSchedule = localStorage.getItem(scheduleKey);
      if (savedSchedule) {
        try {
          const parsedSchedule = JSON.parse(savedSchedule);
          setProductionSchedule(parsedSchedule);
          setOriginalSchedule(JSON.parse(JSON.stringify(parsedSchedule)));
        } catch (error) {
          console.error('Error loading saved schedule:', error);
        }
      }
    }
  }, [selectedProject?.id]);

  const exportSchedule = () => {
    if (!productionSchedule) return;
    
    const dataStr = JSON.stringify(productionSchedule, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${selectedProject?.name || 'production'}-schedule.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Schedule exported",
      description: "Your production schedule has been downloaded as JSON."
    });
  };

  const discardChanges = () => {
    if (originalSchedule) {
      setProductionSchedule(JSON.parse(JSON.stringify(originalSchedule)));
      setHasUnsavedChanges(false);
      setIsEditMode(false);
      setEditingScene(null);
      toast({
        title: "Changes discarded",
        description: "Your schedule has been reset to the original version."
      });
    }
  };

  // Save schedule changes to localStorage
  const saveScheduleToStorage = (schedule: ProductionScheduleOutput) => {
    if (selectedProject?.id) {
      localStorage.setItem(`schedule_${selectedProject.id}`, JSON.stringify(schedule));
      console.log('💾 Schedule changes saved to localStorage');
    }
  };

  const updateScheduleField = (path: string[], value: any) => {
    if (!productionSchedule) return;
    
    const newSchedule = JSON.parse(JSON.stringify(productionSchedule));
    let current = newSchedule;
    
    // Navigate to the field
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    // Update the field
    current[path[path.length - 1]] = value;
    
    setProductionSchedule(newSchedule);
    saveScheduleToStorage(newSchedule);
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id && productionSchedule) {
      const [dayIndex, sceneIndex] = active.id.split('-').map(Number);
      const [overDayIndex, overSceneIndex] = over.id.split('-').map(Number);
      
      const newSchedule = JSON.parse(JSON.stringify(productionSchedule));
      
      if (dayIndex === overDayIndex) {
        // Reordering within same day
        const scenes = newSchedule.dailySchedule[dayIndex].scenes;
        const reorderedScenes = arrayMove(scenes, sceneIndex, overSceneIndex);
        newSchedule.dailySchedule[dayIndex].scenes = reorderedScenes;
      } else {
        // Moving between days
        const sourceScenes = newSchedule.dailySchedule[dayIndex].scenes;
        const targetScenes = newSchedule.dailySchedule[overDayIndex].scenes;
        
        const movedScene = sourceScenes[sceneIndex];
        sourceScenes.splice(sceneIndex, 1);
        targetScenes.splice(overSceneIndex, 0, movedScene);
      }
      
      setProductionSchedule(newSchedule);
      saveScheduleToStorage(newSchedule);
      setHasUnsavedChanges(true);
    }
  };

  // Auto-generate schedule when script analysis is available (only once per project)
  useEffect(() => {
    if (hasScriptAnalysis && !productionSchedule && !isGeneratingSchedule && selectedProject?.id) {
      // Check if schedule already exists
      const existingSchedule = localStorage.getItem(`schedule_${selectedProject.id}`);
      
      // Check if auto-generation has already been attempted for this project
      const autoGenerationAttempted = hasAutoGenerationBeenAttempted(selectedProject.id);
      
      if (!existingSchedule && !autoGenerationAttempted) {
        console.log('🎬 Auto-generating schedule for new project (first time only)');
        markAutoGenerationAttempted(selectedProject.id);
        handleGenerateSchedule();
      } else if (autoGenerationAttempted && !existingSchedule) {
        console.log('ℹ️ Auto-generation already attempted for this project, skipping');
      }
    }
  }, [hasScriptAnalysis, selectedProject?.id]);

  // Cleanup: Remove scheduling lock when component unmounts or project changes
  useEffect(() => {
    return () => {
      // Only remove lock if this component set it
      const lockData = localStorage.getItem(SCHEDULING_LOCK_KEY);
      if (lockData && selectedProject?.id) {
        try {
          const { projectId } = JSON.parse(lockData);
          if (projectId === selectedProject.id) {
            removeSchedulingServiceLock();
          }
        } catch {
          // If parsing fails, remove the lock anyway
          removeSchedulingServiceLock();
        }
      }
    };
  }, [selectedProject?.id]);

  const handleGenerateSchedule = async (forceRegenerate = false) => {
    if (!hasScriptAnalysis) {
      toast({
        title: "No PDF analysis available",
        description: "Please upload and analyze a PDF script first before generating a schedule.",
        variant: "destructive"
      });
      return;
    }

    // Check if another scheduling AI service is already running globally
    if (isSchedulingServiceRunning()) {
      toast({
        title: "Scheduling service busy",
        description: "Another scheduling AI service is currently running. Please wait and try again.",
        variant: "destructive"
      });
      return;
    }

    // Check if schedule already exists and we're not forcing regeneration
    if (!forceRegenerate && selectedProject?.id) {
      const existingSchedule = localStorage.getItem(`schedule_${selectedProject.id}`);
      if (existingSchedule) {
        console.log('✅ Schedule already exists for this project, skipping AI service call');
        return;
      }
    }

    // Set global lock before starting AI service
    if (selectedProject?.id) {
      setSchedulingServiceLock(selectedProject.id);
    }

    setIsGeneratingSchedule(true);
    setScheduleError('');
    setAnalysisStatus('Analyzing script data for scheduling...');

    try {
      console.log('🎬 Generating production schedule from script analysis');
      
      const result = await generateProductionScheduleWithAI(
        scriptAnalysis,
        selectedProject.id,
        (status) => {
          console.log('Schedule generation progress:', status);
          setAnalysisStatus(status);
        }
      );

      if (result.status === 'completed' && result.result) {
        setProductionSchedule(result.result);
        setOriginalSchedule(JSON.parse(JSON.stringify(result.result)));
        
        // Save schedule to localStorage to avoid regenerating
        if (selectedProject?.id) {
          localStorage.setItem(`schedule_${selectedProject.id}`, JSON.stringify(result.result));
          console.log('💾 Schedule saved to localStorage for project:', selectedProject.name);
        }

        // Note: Background budget generation is now handled by ScriptPage
        
        toast({
          title: "Production schedule generated!",
          description: `${result.result.scheduleOverview.totalShootDays} day shooting schedule created with budget estimate.`
        });
        
        // Mark auto-generation as attempted if this was an auto-generation
        if (selectedProject?.id && !hasAttemptedAutoGeneration) {
          markAutoGenerationAttempted(selectedProject.id);
          setHasAttemptedAutoGeneration(true);
        }
      } else {
        throw new Error(result.error || 'Schedule generation failed');
      }

    } catch (error) {
      console.error('❌ Schedule generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setScheduleError(errorMessage);
      toast({
        title: "Schedule generation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      // Always remove the global lock when AI service completes
      removeSchedulingServiceLock();
      setIsGeneratingSchedule(false);
      setAnalysisStatus('');
    }
  };

  // AI Depth Scheduling Analysis Handler
  const handleDepthSchedulingAnalysis = async () => {
    if (!selectedProject || !hasScriptAnalysis) {
      toast({
        title: "Script analysis required",
        description: "Please ensure your project has script analysis data before running depth scheduling analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsDepthAnalysisRunning(true);
    setDepthAnalysisError('');
    setDepthAnalysisProgress('');
    setCurrentTier(0);
    setTierProgress([]);
    
    try {
      const depthService = new DepthSchedulingAnalysisService();
      
      const result = await depthService.executeFullSchedulingAnalysis(
        selectedProject,
        (message, agent, progress, tier) => {
          setDepthAnalysisProgress(message);
          if (tier) setCurrentTier(tier);
          console.log(`🎬 Depth Scheduling [${agent}]: ${message}`);
        },
        (tierResult) => {
          setTierProgress(prev => {
            const updated = [...prev];
            const index = updated.findIndex(t => t.tierNumber === tierResult.tierNumber);
            if (index >= 0) {
              updated[index] = tierResult;
            } else {
              updated.push(tierResult);
            }
            return updated;
          });
        }
      );
      
      setDepthAnalysisResult(result);
      setSelectedScenario(result.recommendedScenario);
      
      // Save result to localStorage
      localStorage.setItem(`depth_scheduling_${selectedProject.id}`, JSON.stringify(result));
      
      toast({
        title: "AI Depth Scheduling Analysis Complete!",
        description: `Generated ${result.scenarios.length} optimized scheduling scenarios with detailed trade-off analysis.`
      });
      
      // Auto-switch to depth analysis view
      setActiveView('depth-analysis');
      
    } catch (error) {
      console.error('❌ Depth Scheduling Analysis Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDepthAnalysisError(errorMessage);
      toast({
        title: "Depth scheduling analysis failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDepthAnalysisRunning(false);
      setDepthAnalysisProgress('');
    }
  };

  // Load existing depth analysis result
  useEffect(() => {
    if (selectedProject?.id) {
      const savedResult = localStorage.getItem(`depth_scheduling_${selectedProject.id}`);
      if (savedResult) {
        try {
          const result = JSON.parse(savedResult);
          setDepthAnalysisResult(result);
          setSelectedScenario(result.recommendedScenario || 'schedule-optimized');
        } catch (error) {
          console.error('Error loading saved depth analysis:', error);
        }
      } else {
        setDepthAnalysisResult(null);
      }
    }
  }, [selectedProject?.id]);

  // Helper functions for raw JSON display
  const toggleRawSection = (section: string) => {
    setExpandedRawSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Raw JSON data has been copied to your clipboard."
    });
  };

  // Format currency for scenarios
  const formatScenarioCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Sortable Scene Component
  const SortableScene = ({ scene, dayIndex, sceneIndex, isEditMode }: { 
    scene: any, 
    dayIndex: number, 
    sceneIndex: number, 
    isEditMode: boolean 
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: `${dayIndex}-${sceneIndex}` });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(isEditMode ? listeners : {})}
        className={`flex items-center justify-between bg-gray-700 rounded p-2 ${
          isEditMode ? 'cursor-move hover:bg-gray-600' : ''
        } ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex items-center space-x-3">
          {isEditMode && (
            <div className="text-gray-400 cursor-grab">⋮⋮</div>
          )}
          <div>
            {isEditMode ? (
              <Input
                value={`Scene ${scene.sceneNumber}`}
                onChange={(e) => {
                  const newSceneNumber = parseInt(e.target.value.replace('Scene ', ''));
                  if (!isNaN(newSceneNumber)) {
                    updateScheduleField(['dailySchedule', dayIndex, 'scenes', sceneIndex, 'sceneNumber'], newSceneNumber);
                  }
                }}
                className="w-24 h-6 text-sm bg-gray-800 border-gray-600 text-white"
              />
            ) : (
              <span className="text-white">Scene {scene.sceneNumber}</span>
            )}
            <span className="text-gray-400 ml-2">
              {isEditMode ? (
                <Input
                  value={scene.duration}
                  onChange={(e) => updateScheduleField(['dailySchedule', dayIndex, 'scenes', sceneIndex, 'duration'], parseFloat(e.target.value))}
                  className="w-16 h-6 text-sm bg-gray-800 border-gray-600 text-gray-400"
                />
              ) : (
                `(${scene.duration}h)`
              )}
            </span>
          </div>
        </div>
        <div className="text-gray-300 text-sm">
          {isEditMode ? (
            <div className="flex space-x-2">
              <Input
                value={scene.startTime}
                onChange={(e) => updateScheduleField(['dailySchedule', dayIndex, 'scenes', sceneIndex, 'startTime'], e.target.value)}
                className="w-16 h-6 text-sm bg-gray-800 border-gray-600 text-gray-300"
              />
              <span>-</span>
              <Input
                value={scene.endTime}
                onChange={(e) => updateScheduleField(['dailySchedule', dayIndex, 'scenes', sceneIndex, 'endTime'], e.target.value)}
                className="w-16 h-6 text-sm bg-gray-800 border-gray-600 text-gray-300"
              />
            </div>
          ) : (
            <span>{scene.startTime} - {scene.endTime}</span>
          )}
        </div>
      </div>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-4 w-4 text-purple-400" />
          <span className="text-purple-300 font-medium text-sm">Production Scheduling</span>
        </div>
        
        {/* View Navigation */}
        <div className="space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: Calendar },
            { id: 'schedule', label: 'Daily Schedule', icon: Clock },
            { id: 'cast', label: 'Cast Schedule', icon: Users },
            { id: 'locations', label: 'Locations', icon: MapPin },
            { id: 'equipment', label: 'Equipment', icon: Wrench },
            { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle },
            { id: 'optimization', label: 'Optimization', icon: BarChart3 },
            { id: 'depth-analysis', label: 'AI Depth Analysis', icon: Brain },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors ${
                activeView === id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      {productionSchedule && (
        <div className="space-y-3">
          <div className="text-gray-400 text-xs uppercase font-medium">Quick Stats</div>
          <div className="space-y-2">
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-400">Total Shoot Days</div>
              <div className="text-lg font-bold text-white">{productionSchedule.scheduleOverview.totalShootDays}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-400">Budget Range</div>
              <div className="text-sm font-medium text-green-400">
                {formatCurrency(productionSchedule.scheduleOverview.estimatedBudgetRange.low)} - {formatCurrency(productionSchedule.scheduleOverview.estimatedBudgetRange.high)}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-400">Crew Size</div>
              <div className="text-lg font-bold text-white">{productionSchedule.scheduleOverview.recommendedCrewSize}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <MainLayout sidebar={sidebar}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Production Scheduling</h1>
              <div className="flex items-center mt-1">
                {isSchedulingServiceRunning() && !isGeneratingSchedule ? (
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    <span>Scheduling AI service busy (another project)</span>
                  </div>
                ) : productionSchedule ? (
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Schedule Generated</span>
                    <span className="ml-2 text-gray-500">•</span>
                    <span className="ml-2 text-gray-400">{productionSchedule.scheduleOverview.totalShootDays} days</span>
                  </div>
                ) : hasScriptAnalysis ? (
                  <div className="flex items-center text-purple-400 text-sm">
                    <Brain className="h-4 w-4 mr-1" />
                    <span>Ready for Schedule Generation</span>
                  </div>
                ) : (
                  <div className="flex items-center text-orange-400 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Script analysis required first</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasScriptAnalysis && (
                <>
                  <Button 
                    onClick={() => handleGenerateSchedule(!!productionSchedule)}
                    disabled={isGeneratingSchedule || isSchedulingServiceRunning()}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    {isGeneratingSchedule ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : isSchedulingServiceRunning() ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Service Busy
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {productionSchedule ? 'Regenerate Schedule' : 'Generate Schedule'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleDepthSchedulingAnalysis}
                    disabled={isDepthAnalysisRunning || isGeneratingSchedule}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    {isDepthAnalysisRunning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        AI Depth Scheduling Analysis
                      </>
                    )}
                  </Button>
                </>
              )}
              
              {productionSchedule && (
                <>
                  {!isEditMode ? (
                    <Button 
                      onClick={toggleEditMode}
                      variant="outline" 
                      size="sm" 
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Schedule
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={saveChanges}
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!hasUnsavedChanges}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button 
                        onClick={discardChanges}
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        disabled={!hasUnsavedChanges}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                      <Button 
                        onClick={toggleEditMode}
                        variant="outline" 
                        size="sm" 
                        className="border-gray-500 text-gray-500 hover:bg-gray-50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                Share Project
                <Share2 className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={exportSchedule}
                disabled={!productionSchedule}
                variant="default" 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Edit Mode Indicator */}
          {isEditMode && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Edit3 className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-blue-300 font-medium">Edit Mode Active</div>
                    <div className="text-blue-400 text-sm">
                      {hasUnsavedChanges ? 'You have unsaved changes' : 'Make changes to the schedule below'}
                    </div>
                  </div>
                </div>
                {hasUnsavedChanges && (
                  <Badge variant="destructive" className="bg-orange-600">
                    Unsaved Changes
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Analysis Status */}
          {analysisStatus && (
            <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
                <div>
                  <div className="text-purple-300 font-medium">AI Schedule Generation in Progress</div>
                  <div className="text-purple-400 text-sm">{analysisStatus}</div>
                </div>
              </div>
            </div>
          )}

          {/* Depth Analysis Progress */}
          {depthAnalysisProgress && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-blue-400 animate-pulse" />
                <div className="flex-1">
                  <div className="text-blue-300 font-medium">AI Depth Scheduling Analysis - Tier {currentTier}</div>
                  <div className="text-blue-400 text-sm">{depthAnalysisProgress}</div>
                  
                  {/* Tier Progress Display */}
                  {tierProgress.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {tierProgress.map((tier) => (
                        <div key={tier.tierNumber} className="flex items-center justify-between bg-blue-800/30 rounded px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              tier.status === 'completed' ? 'bg-green-400' :
                              tier.status === 'running' ? 'bg-blue-400 animate-pulse' :
                              tier.status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-blue-200 text-sm">Tier {tier.tierNumber}: {tier.tierName}</span>
                          </div>
                          <div className="text-blue-300 text-sm">
                            {tier.agents.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Depth Analysis Error */}
          {depthAnalysisError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-red-300 font-medium">Depth Scheduling Analysis Failed</div>
                  <div className="text-red-400 text-sm">{depthAnalysisError}</div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {scheduleError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-red-300 font-medium">Schedule Generation Failed</div>
                  <div className="text-red-400 text-sm">{scheduleError}</div>
                </div>
              </div>
            </div>
          )}

          {/* No Script Analysis State */}
          {!hasScriptAnalysis && (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">PDF Analysis Required</h3>
              <p className="text-gray-400 mb-6">
                To generate a production schedule, please upload and analyze a PDF script first. The analysis results from your project creation will be used automatically.
              </p>
              <Button 
                onClick={() => window.location.href = '/script'}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Go to Script Page
              </Button>
            </div>
          )}

          {/* Main Content */}
          {productionSchedule && (
            <div className="space-y-6">
              {activeView === 'overview' && (
                <div className="space-y-6">
                  {/* Production Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Total Shoot Days</p>
                            <p className="text-2xl font-bold text-white">{productionSchedule.scheduleOverview.totalShootDays}</p>
                          </div>
                          <Calendar className="h-8 w-8 text-purple-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Budget Range</p>
                            <p className="text-lg font-bold text-green-400">
                              {formatCurrency(productionSchedule.scheduleOverview.estimatedBudgetRange.low)}-{formatCurrency(productionSchedule.scheduleOverview.estimatedBudgetRange.high)}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-green-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Crew Size</p>
                            <p className="text-2xl font-bold text-white">{productionSchedule.scheduleOverview.recommendedCrewSize}</p>
                          </div>
                          <Users className="h-8 w-8 text-blue-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Complex Scenes</p>
                            <p className="text-2xl font-bold text-white">{productionSchedule.complexScenes.length}</p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-orange-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Production Timeline */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Production Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">{productionSchedule.scheduleOverview.productionTimeline.prepDays}</div>
                          <div className="text-gray-400 text-sm">Prep Days</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{productionSchedule.scheduleOverview.productionTimeline.shootDays}</div>
                          <div className="text-gray-400 text-sm">Shoot Days</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-purple-400">{productionSchedule.scheduleOverview.productionTimeline.wrapDays}</div>
                          <div className="text-gray-400 text-sm">Wrap Days</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Complex Scenes Alert */}
                  {productionSchedule.complexScenes.length > 0 && (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
                          High Priority Scenes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {productionSchedule.complexScenes.slice(0, 5).map((scene, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                              <div>
                                <div className="text-white font-medium">Scene {scene.sceneNumber}</div>
                                <div className="text-gray-400 text-sm">{scene.reason}</div>
                                <div className="text-gray-300 text-sm mt-1">{scene.recommendation}</div>
                              </div>
                              <Badge variant={scene.priority === 'high' ? 'destructive' : scene.priority === 'medium' ? 'default' : 'secondary'}>
                                {scene.priority}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Budget Breakdown */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        Budget Breakdown
                        {isEditMode && (
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            Editable
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(productionSchedule.budgetBreakdown).map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-gray-400 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                            {isEditMode && category !== 'total' ? (
                              <Input
                                value={amount}
                                onChange={(e) => {
                                  const newAmount = parseFloat(e.target.value) || 0;
                                  updateScheduleField(['budgetBreakdown', category], newAmount);
                                  // Recalculate total
                                  const budget = productionSchedule.budgetBreakdown;
                                  const total = Object.entries(budget)
                                    .filter(([key]) => key !== 'total')
                                    .reduce((sum, [key, val]) => {
                                      return sum + (key === category ? newAmount : val);
                                    }, 0);
                                  updateScheduleField(['budgetBreakdown', 'total'], total);
                                }}
                                className="w-28 h-8 text-sm bg-gray-800 border-gray-600 text-white text-right"
                              />
                            ) : (
                              <span className={`font-medium ${category === 'total' ? 'text-green-400 text-lg' : 'text-white'}`}>
                                {formatCurrency(amount)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeView === 'schedule' && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Daily Shooting Schedule
                      {isEditMode && (
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          Drag scenes to reorder
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="space-y-4">
                        {productionSchedule.dailySchedule.map((day, dayIndex) => (
                          <div key={dayIndex} className="border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-white">Day {day.day}</h3>
                                <div className="flex items-center space-x-2">
                                  {isEditMode ? (
                                    <Select
                                      value={day.location}
                                      onValueChange={(value) => updateScheduleField(['dailySchedule', dayIndex, 'location'], value)}
                                    >
                                      <SelectTrigger className="w-40 h-6 text-sm bg-gray-800 border-gray-600 text-gray-400">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {productionSchedule.locationSchedule.map((loc, i) => (
                                          <SelectItem key={i} value={loc.location}>{loc.location}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <p className="text-gray-400 text-sm">{day.location}</p>
                                  )}
                                  <span className="text-gray-400 text-sm">• {day.scenes.length} scenes</span>
                                </div>
                              </div>
                              <div className="text-right">
                                {isEditMode ? (
                                  <div className="space-y-1">
                                    <Input
                                      value={day.estimatedCost}
                                      onChange={(e) => updateScheduleField(['dailySchedule', dayIndex, 'estimatedCost'], parseFloat(e.target.value))}
                                      className="w-24 h-6 text-sm bg-gray-800 border-gray-600 text-white text-right"
                                    />
                                    <Input
                                      value={day.crewSize}
                                      onChange={(e) => updateScheduleField(['dailySchedule', dayIndex, 'crewSize'], parseInt(e.target.value))}
                                      className="w-24 h-6 text-sm bg-gray-800 border-gray-600 text-gray-400 text-right"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <div className="text-white font-medium">{formatCurrency(day.estimatedCost)}</div>
                                    <div className="text-gray-400 text-sm">{day.crewSize} crew</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <SortableContext 
                              items={day.scenes.map((_, i) => `${dayIndex}-${i}`)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-2">
                                {day.scenes.map((scene, sceneIndex) => (
                                  <SortableScene
                                    key={`${dayIndex}-${sceneIndex}`}
                                    scene={scene}
                                    dayIndex={dayIndex}
                                    sceneIndex={sceneIndex}
                                    isEditMode={isEditMode}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                            
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <div className="text-gray-400 text-sm">
                                <span className="font-medium">Cast needed:</span>{' '}
                                {isEditMode ? (
                                  <Input
                                    value={day.castNeeded.join(', ')}
                                    onChange={(e) => updateScheduleField(['dailySchedule', dayIndex, 'castNeeded'], e.target.value.split(', '))}
                                    className="inline-block w-64 h-6 text-sm bg-gray-800 border-gray-600 text-gray-400 ml-1"
                                  />
                                ) : (
                                  day.castNeeded.join(', ')
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DndContext>
                  </CardContent>
                </Card>
              )}

              {activeView === 'cast' && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Cast Schedule (Day Out of Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productionSchedule.castSchedule.map((cast, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              {isEditMode ? (
                                <Input
                                  value={cast.characterName}
                                  onChange={(e) => updateScheduleField(['castSchedule', index, 'characterName'], e.target.value)}
                                  className="text-lg font-semibold bg-gray-800 border-gray-600 text-white"
                                />
                              ) : (
                                <h3 className="text-lg font-semibold text-white">{cast.characterName}</h3>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">{cast.totalDays} days</div>
                              {isEditMode ? (
                                <Input
                                  value={cast.estimatedCost}
                                  onChange={(e) => updateScheduleField(['castSchedule', index, 'estimatedCost'], parseFloat(e.target.value))}
                                  className="w-24 h-6 text-sm bg-gray-800 border-gray-600 text-gray-400 text-right"
                                />
                              ) : (
                                <div className="text-gray-400 text-sm">{formatCurrency(cast.estimatedCost)}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {Array.from({ length: productionSchedule.scheduleOverview.totalShootDays }, (_, dayIndex) => {
                              const dayNum = dayIndex + 1;
                              const isWorkDay = cast.workDays.includes(dayNum);
                              return (
                                <div
                                  key={dayNum}
                                  onClick={() => {
                                    if (isEditMode) {
                                      const newWorkDays = isWorkDay 
                                        ? cast.workDays.filter(d => d !== dayNum)
                                        : [...cast.workDays, dayNum].sort((a, b) => a - b);
                                      updateScheduleField(['castSchedule', index, 'workDays'], newWorkDays);
                                      updateScheduleField(['castSchedule', index, 'totalDays'], newWorkDays.length);
                                    }
                                  }}
                                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-colors ${
                                    isWorkDay 
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-gray-700 text-gray-400'
                                  } ${isEditMode ? 'cursor-pointer hover:opacity-80' : ''}`}
                                >
                                  {dayNum}
                                </div>
                              );
                            })}
                          </div>
                          {isEditMode && (
                            <div className="mt-2 text-xs text-blue-400">
                              Click days to toggle work schedule
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeView === 'locations' && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Location Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productionSchedule.locationSchedule.map((location, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">{location.location}</h3>
                            <div className="text-right">
                              <div className="text-white font-medium">{formatCurrency(location.estimatedCost)}</div>
                              <div className="text-gray-400 text-sm">{location.scenes.length} scenes</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-gray-400 text-sm font-medium mb-1">Scenes</div>
                              <div className="text-white">{location.scenes.join(', ')}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm font-medium mb-1">Shoot Days</div>
                              <div className="text-white">{location.days.join(', ')}</div>
                            </div>
                          </div>
                          
                          {location.setupRequirements.length > 0 && (
                            <div>
                              <div className="text-gray-400 text-sm font-medium mb-1">Setup Requirements</div>
                              <div className="text-gray-300 text-sm">{location.setupRequirements.join(', ')}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeView === 'equipment' && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wrench className="h-5 w-5 text-blue-400 mr-2" />
                      Equipment Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productionSchedule.equipmentSchedule?.map((equipment, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">{equipment.equipmentType}</h3>
                            <div className="text-right">
                              <div className="text-white font-medium">{formatCurrency(equipment.rentalCost)}</div>
                              <div className="text-gray-400 text-sm">{equipment.setupTime}min setup</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-gray-400 text-sm font-medium mb-1">Scenes</div>
                              <div className="text-white">{equipment.scenes.join(', ')}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm font-medium mb-1">Days</div>
                              <div className="text-white">{equipment.days.join(', ')}</div>
                            </div>
                          </div>
                          
                          {equipment.conflicts.length > 0 && (
                            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                              <div className="text-red-300 font-medium text-sm mb-1">Conflicts</div>
                              <div className="text-red-400 text-sm">{equipment.conflicts.join(', ')}</div>
                            </div>
                          )}
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-400">
                          <Wrench className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                          <p>Equipment schedule data not available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeView === 'conflicts' && (
                <div className="space-y-6">
                  {/* Cast Conflicts */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="h-5 w-5 text-orange-400 mr-2" />
                        Cast Conflicts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {productionSchedule.conflictAnalysis?.castConflicts?.map((conflict, index) => (
                          <div key={index} className="border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white font-medium">{conflict.characterName}</h3>
                              <Badge variant={conflict.severity === 'high' ? 'destructive' : conflict.severity === 'medium' ? 'default' : 'secondary'}>
                                {conflict.severity}
                              </Badge>
                            </div>
                            <div className="text-gray-400 text-sm mb-2">
                              Conflict days: {conflict.conflictDays.join(', ')}
                            </div>
                            <div className="text-gray-300 text-sm">{conflict.resolution}</div>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-green-400">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No cast conflicts detected</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Equipment Conflicts */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Wrench className="h-5 w-5 text-red-400 mr-2" />
                        Equipment Conflicts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {productionSchedule.conflictAnalysis?.equipmentConflicts?.map((conflict, index) => (
                          <div key={index} className="border border-gray-700 rounded-lg p-4">
                            <h3 className="text-white font-medium mb-2">{conflict.equipmentType}</h3>
                            <div className="text-gray-400 text-sm mb-1">
                              Conflict days: {conflict.conflictDays.join(', ')}
                            </div>
                            <div className="text-gray-400 text-sm mb-2">
                              Affected scenes: {conflict.affectedScenes.join(', ')}
                            </div>
                            <div className="text-gray-300 text-sm">{conflict.resolution}</div>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-green-400">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No equipment conflicts detected</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Conflicts */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MapPin className="h-5 w-5 text-yellow-400 mr-2" />
                        Location Conflicts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {productionSchedule.conflictAnalysis?.locationConflicts?.map((conflict, index) => (
                          <div key={index} className="border border-gray-700 rounded-lg p-4">
                            <h3 className="text-white font-medium mb-2">{conflict.location}</h3>
                            <div className="text-gray-400 text-sm mb-1">
                              Conflict days: {conflict.conflictDays.join(', ')}
                            </div>
                            <div className="text-gray-400 text-sm mb-2">{conflict.issue}</div>
                            <div className="text-gray-300 text-sm">{conflict.resolution}</div>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-green-400">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No location conflicts detected</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeView === 'optimization' && (
                <div className="space-y-6">
                  {/* Optimization Metrics */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BarChart3 className="h-5 w-5 text-green-400 mr-2" />
                        Schedule Optimization Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {productionSchedule.optimizationMetrics?.locationEfficiency || 0}%
                          </div>
                          <div className="text-gray-400 text-sm">Location Efficiency</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {productionSchedule.optimizationMetrics?.castUtilization || 0}%
                          </div>
                          <div className="text-gray-400 text-sm">Cast Utilization</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {productionSchedule.optimizationMetrics?.equipmentUtilization || 0}%
                          </div>
                          <div className="text-gray-400 text-sm">Equipment Utilization</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {productionSchedule.optimizationMetrics?.overallEfficiency || 0}%
                          </div>
                          <div className="text-gray-400 text-sm">Overall Efficiency</div>
                        </div>
                      </div>
                      
                      {productionSchedule.optimizationMetrics?.estimatedSavings && (
                        <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Zap className="h-6 w-6 text-green-400" />
                            <div>
                              <div className="text-green-300 font-medium">Estimated Cost Savings</div>
                              <div className="text-green-400 text-sm">
                                {formatCurrency(productionSchedule.optimizationMetrics.estimatedSavings)} saved vs basic schedule
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Department Workload Analysis */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Department Workload Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Makeup Department */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center">
                            <div className="w-3 h-3 bg-pink-400 rounded-full mr-2"></div>
                            Makeup Department
                          </h3>
                          <div className="space-y-2">
                            {productionSchedule.departmentWorkload?.makeup?.map((day, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-3">
                                <div className="flex items-center space-x-4">
                                  <span className="text-white font-medium">Day {day.day}</span>
                                  <Badge variant={day.complexity === 'extreme' ? 'destructive' : day.complexity === 'complex' ? 'default' : 'secondary'}>
                                    {day.complexity}
                                  </Badge>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-white">{day.artistsNeeded} artists • {day.setupHours}h setup</div>
                                  {day.specialRequirements.length > 0 && (
                                    <div className="text-gray-400">{day.specialRequirements.join(', ')}</div>
                                  )}
                                </div>
                              </div>
                            )) || (
                              <div className="text-gray-400 text-sm">No makeup workload data available</div>
                            )}
                          </div>
                        </div>

                        {/* Wardrobe Department */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center">
                            <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                            Wardrobe Department
                          </h3>
                          <div className="space-y-2">
                            {productionSchedule.departmentWorkload?.wardrobe?.map((day, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-3">
                                <div>
                                  <span className="text-white font-medium">Day {day.day}</span>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-white">{day.costumesNeeded} costumes • {day.quickChanges} quick changes</div>
                                  <div className="text-gray-400">{day.fittingTime}min fitting time</div>
                                  {day.specialRequirements.length > 0 && (
                                    <div className="text-gray-400">{day.specialRequirements.join(', ')}</div>
                                  )}
                                </div>
                              </div>
                            )) || (
                              <div className="text-gray-400 text-sm">No wardrobe workload data available</div>
                            )}
                          </div>
                        </div>

                        {/* Props Department */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                            Props Department
                          </h3>
                          <div className="space-y-2">
                            {productionSchedule.departmentWorkload?.props?.map((day, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-3">
                                <div>
                                  <span className="text-white font-medium">Day {day.day}</span>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-white">{day.propsNeeded.length} props • {day.setupTime}min setup</div>
                                  <div className="text-gray-400">{day.propsNeeded.slice(0, 3).join(', ')}{day.propsNeeded.length > 3 ? '...' : ''}</div>
                                  {day.specialHandling.length > 0 && (
                                    <div className="text-orange-400">Special: {day.specialHandling.join(', ')}</div>
                                  )}
                                </div>
                              </div>
                            )) || (
                              <div className="text-gray-400 text-sm">No props workload data available</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeView === 'depth-analysis' && (
                <div className="space-y-6">
                  {depthAnalysisResult ? (
                    <>
                      {/* Scenario Selection */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Brain className="h-5 w-5 text-blue-400 mr-2" />
                            AI Depth Scheduling Analysis - 4 Optimized Scenarios
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {depthAnalysisResult.scenarios.map((scenario) => (
                              <button
                                key={scenario.scenarioType}
                                onClick={() => setSelectedScenario(scenario.scenarioType)}
                                className={`p-4 rounded-lg border transition-all ${
                                  selectedScenario === scenario.scenarioType
                                    ? 'border-blue-500 bg-blue-900/30'
                                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {scenario.scenarioType === 'baseline' && <Calendar className="h-4 w-4 text-gray-400" />}
                                    {scenario.scenarioType === 'schedule-optimized' && <Target className="h-4 w-4 text-green-400" />}
                                    {scenario.scenarioType === 'cost-optimized' && <Cost className="h-4 w-4 text-yellow-400" />}
                                    {scenario.scenarioType === 'risk-mitigated' && <Shield className="h-4 w-4 text-purple-400" />}
                                    <span className="text-white font-medium text-sm">{scenario.scenarioName}</span>
                                  </div>
                                  {depthAnalysisResult.recommendedScenario === scenario.scenarioType && (
                                    <Badge className="bg-green-600 text-white text-xs">Recommended</Badge>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400 space-y-1">
                                  <div>{scenario.scheduleSummary.totalShootDays} days</div>
                                  <div>{formatScenarioCurrency(scenario.scheduleSummary.estimatedBudget)}</div>
                                  <div className="flex items-center space-x-2">
                                    <span>Risk: {scenario.scheduleSummary.riskScore}/10</span>
                                    <span>•</span>
                                    <span>Compliance: {scenario.scheduleSummary.complianceScore}/10</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Selected Scenario Details */}
                          {depthAnalysisResult.scenarios.find(s => s.scenarioType === selectedScenario) && (
                            <div className="border border-gray-600 rounded-lg p-6">
                              {(() => {
                                const scenario = depthAnalysisResult.scenarios.find(s => s.scenarioType === selectedScenario)!;
                                return (
                                  <div>
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-xl font-bold text-white">{scenario.scenarioName}</h3>
                                      <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                          <div className="text-2xl font-bold text-green-400">
                                            {formatScenarioCurrency(scenario.scheduleSummary.estimatedBudget)}
                                          </div>
                                          <div className="text-sm text-gray-400">{scenario.scheduleSummary.totalShootDays} shoot days</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Scenario Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-400">{scenario.resourceUtilization.castUtilization}%</div>
                                        <div className="text-gray-400 text-sm">Cast Utilization</div>
                                      </div>
                                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-400">{scenario.resourceUtilization.equipmentUptime}%</div>
                                        <div className="text-gray-400 text-sm">Equipment Uptime</div>
                                      </div>
                                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-400">{scenario.scheduleSummary.riskScore}/10</div>
                                        <div className="text-gray-400 text-sm">Risk Score</div>
                                      </div>
                                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-400">{scenario.scheduleSummary.complianceScore}/10</div>
                                        <div className="text-gray-400 text-sm">Compliance</div>
                                      </div>
                                    </div>

                                    {/* Daily Schedule Preview */}
                                    <div className="mb-6">
                                      <h4 className="text-lg font-semibold text-white mb-3">Daily Schedule (First 5 Days)</h4>
                                      <div className="space-y-2">
                                        {scenario.dailySchedules.slice(0, 5).map((day, index) => (
                                          <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-3">
                                            <div className="flex items-center space-x-4">
                                              <span className="text-white font-medium">Day {day.day}</span>
                                              <span className="text-gray-400 text-sm">{day.date}</span>
                                              <span className="text-gray-400 text-sm">{day.location}</span>
                                            </div>
                                            <div className="text-right text-sm">
                                              <div className="text-white">{day.callTime} - {day.wrapTime}</div>
                                              <div className="text-gray-400">{day.scenes.length} scenes • {day.totalHours}h</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div className="mb-6">
                                      <h4 className="text-lg font-semibold text-white mb-3">Cost Breakdown</h4>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-700 rounded p-3">
                                          <div className="text-gray-400 text-sm">Direct Costs</div>
                                          <div className="text-white font-medium">{formatScenarioCurrency(scenario.costBreakdown.directCosts)}</div>
                                        </div>
                                        <div className="bg-gray-700 rounded p-3">
                                          <div className="text-gray-400 text-sm">Overtime</div>
                                          <div className="text-white font-medium">{formatScenarioCurrency(scenario.costBreakdown.overtimeCosts)}</div>
                                        </div>
                                        <div className="bg-gray-700 rounded p-3">
                                          <div className="text-gray-400 text-sm">Contingency</div>
                                          <div className="text-white font-medium">{formatScenarioCurrency(scenario.costBreakdown.contingency)}</div>
                                        </div>
                                        <div className="bg-gray-700 rounded p-3">
                                          <div className="text-gray-400 text-sm">Cost/Day</div>
                                          <div className="text-white font-medium">{formatScenarioCurrency(scenario.costBreakdown.costPerDay)}</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Compliance Report */}
                                    <div>
                                      <h4 className="text-lg font-semibold text-white mb-3">Union Compliance Report</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-700 rounded p-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">BECTU Compliance</span>
                                            <span className="text-white font-medium">{scenario.complianceReport.unionCompliance.bectu}/10</span>
                                          </div>
                                        </div>
                                        <div className="bg-gray-700 rounded p-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">IATSE Compliance</span>
                                            <span className="text-white font-medium">{scenario.complianceReport.unionCompliance.iatse}/10</span>
                                          </div>
                                        </div>
                                        <div className="bg-gray-700 rounded p-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">SAG-AFTRA Compliance</span>
                                            <span className="text-white font-medium">{scenario.complianceReport.unionCompliance.sagAftra}/10</span>
                                          </div>
                                        </div>
                                      </div>
                                      {scenario.complianceReport.hardViolations > 0 && (
                                        <div className="mt-3 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                          <div className="text-red-300 font-medium text-sm">
                                            {scenario.complianceReport.hardViolations} Hard Violations • 
                                            Penalty: {formatScenarioCurrency(scenario.complianceReport.penaltyEstimate)}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Scenario Comparison */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                            Scenario Trade-off Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-600">
                                  <th className="text-left py-2 text-gray-400">Factor</th>
                                  <th className="text-center py-2 text-gray-400">Baseline</th>
                                  <th className="text-center py-2 text-green-400">Schedule-Optimized</th>
                                  <th className="text-center py-2 text-yellow-400">Cost-Optimized</th>
                                  <th className="text-center py-2 text-purple-400">Risk-Mitigated</th>
                                </tr>
                              </thead>
                              <tbody className="space-y-2">
                                <tr className="border-b border-gray-700">
                                  <td className="py-2 text-white">Total Days</td>
                                  {depthAnalysisResult.scenarios.map((scenario) => (
                                    <td key={scenario.scenarioType} className="text-center py-2 text-white">
                                      {scenario.scheduleSummary.totalShootDays}
                                    </td>
                                  ))}
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="py-2 text-white">Budget</td>
                                  {depthAnalysisResult.scenarios.map((scenario) => (
                                    <td key={scenario.scenarioType} className="text-center py-2 text-white text-xs">
                                      {formatScenarioCurrency(scenario.scheduleSummary.estimatedBudget)}
                                    </td>
                                  ))}
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="py-2 text-white">Risk Score</td>
                                  {depthAnalysisResult.scenarios.map((scenario) => (
                                    <td key={scenario.scenarioType} className="text-center py-2 text-white">
                                      {scenario.scheduleSummary.riskScore}/10
                                    </td>
                                  ))}
                                </tr>
                                <tr>
                                  <td className="py-2 text-white">Cast Utilization</td>
                                  {depthAnalysisResult.scenarios.map((scenario) => (
                                    <td key={scenario.scenarioType} className="text-center py-2 text-white">
                                      {scenario.resourceUtilization.castUtilization}%
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Raw JSON Output */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center justify-between">
                            <div className="flex items-center">
                              <Code className="h-5 w-5 text-green-400 mr-2" />
                              Raw Agent JSON Output
                            </div>
                            <Button
                              onClick={() => setShowRawJSON(!showRawJSON)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-400 hover:text-white"
                            >
                              {showRawJSON ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              {showRawJSON ? 'Hide' : 'Show'} Raw JSON
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        {showRawJSON && (
                          <CardContent>
                            <div className="space-y-4">
                              {Object.entries(depthAnalysisResult.rawAgentOutputs).map(([agentName, rawOutput]) => (
                                <div key={agentName} className="border border-gray-600 rounded-lg">
                                  <div
                                    className="flex items-center justify-between p-3 cursor-pointer bg-gray-700 rounded-t-lg"
                                    onClick={() => toggleRawSection(agentName)}
                                  >
                                    <div className="flex items-center space-x-2">
                                      {expandedRawSections[agentName] ? (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                      )}
                                      <span className="text-white font-medium capitalize">
                                        {agentName.replace('Raw', '').replace(/([A-Z])/g, ' $1').trim()} Agent
                                      </span>
                                    </div>
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(rawOutput);
                                      }}
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-white"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {expandedRawSections[agentName] && (
                                    <div className="p-3 bg-gray-900 rounded-b-lg">
                                      <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-96">
                                        {rawOutput}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </>
                  ) : (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-8 text-center">
                        <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Depth Analysis Available</h3>
                        <p className="text-gray-400 mb-6">
                          Run the AI Depth Scheduling Analysis to generate 4 optimized scheduling scenarios with detailed trade-off analysis.
                        </p>
                        <Button 
                          onClick={handleDepthSchedulingAnalysis}
                          disabled={isDepthAnalysisRunning || !hasScriptAnalysis}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isDepthAnalysisRunning ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="mr-2 h-4 w-4" />
                              Start AI Depth Scheduling Analysis
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
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