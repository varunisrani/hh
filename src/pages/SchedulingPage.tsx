
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { mockProject } from '@/data/mockData';
import { Plus, Share2, Download, Calendar, Clock, BookOpen, Settings, ArrowUpDown, Wand2, FileText, Loader2 } from 'lucide-react';
import { analyzeSchedulingWithAI, SchedulingCoordinatorOutput } from '@/services/schedulingService';
import { analyzeComplianceWithAI, ComplianceConstraintsOutput } from '@/services/complianceService';
import { analyzeResourceWithAI, ResourceLogisticsOutput } from '@/services/resourceService';
import { analyzeOptimizationWithAI, OptimizationScenarioOutput } from '@/services/optimizationService';
import { useSelectedProject } from '@/hooks/useSelectedProject';

export const SchedulingPage = () => {
  console.log('🖥️ SCHEDULING PAGE: Component rendering/re-rendering at', new Date().toISOString());
  
  const [activeTab, setActiveTab] = useState('scriptyard');
  const [jsonInput, setJsonInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SchedulingCoordinatorOutput | null>(null);
  const [analysisError, setAnalysisError] = useState('');
  // AI Yard 1 - Compliance & Constraints state
  const [jsonInputCompliance, setJsonInputCompliance] = useState('');
  const [isAnalyzingCompliance, setIsAnalyzingCompliance] = useState(false);
  const [complianceResult, setComplianceResult] = useState<ComplianceConstraintsOutput | null>(null);
  const [complianceError, setComplianceError] = useState('');
  
  // AI Yard 2 - Resource Logistics state
  const [jsonInputResource, setJsonInputResource] = useState('');
  const [isAnalyzingResource, setIsAnalyzingResource] = useState(false);
  const [resourceResult, setResourceResult] = useState<ResourceLogisticsOutput | null>(null);
  const [resourceError, setResourceError] = useState('');
  
  // AI Yard 3 - Optimization & Scenario state
  const [jsonInputOptimization, setJsonInputOptimization] = useState('');
  const [isAnalyzingOptimization, setIsAnalyzingOptimization] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationScenarioOutput | null>(null);
  const [optimizationError, setOptimizationError] = useState('');
  const { selectedProject } = useSelectedProject();
  
  console.log('📊 PAGE STATE:');
  console.log('  - Active tab:', activeTab);
  console.log('  - JSON input length:', jsonInput.length, 'characters');
  console.log('  - Is analyzing:', isAnalyzing);
  console.log('  - Has analysis result:', !!analysisResult);
  console.log('  - Has analysis error:', !!analysisError);
  console.log('  - Compliance JSON input length:', jsonInputCompliance.length, 'characters');
  console.log('  - Is analyzing compliance:', isAnalyzingCompliance);
  console.log('  - Has compliance result:', !!complianceResult);
  console.log('  - Has compliance error:', !!complianceError);
  console.log('  - Resource JSON input length:', jsonInputResource.length, 'characters');
  console.log('  - Is analyzing resource:', isAnalyzingResource);
  console.log('  - Has resource result:', !!resourceResult);
  console.log('  - Has resource error:', !!resourceError);
  console.log('  - Optimization JSON input length:', jsonInputOptimization.length, 'characters');
  console.log('  - Is analyzing optimization:', isAnalyzingOptimization);
  console.log('  - Has optimization result:', !!optimizationResult);
  console.log('  - Has optimization error:', !!optimizationError);
  console.log('  - Selected project:', selectedProject?.id || 'None');
  
  // Component lifecycle logging
  useEffect(() => {
    console.log('🎬 SCHEDULING PAGE: Component mounted');
    console.log('📋 SCHEDULING PAGE: Initial state set');
    
    return () => {
      console.log('🎬 SCHEDULING PAGE: Component unmounting');
    };
  }, []);
  
  // Track analysis result changes
  useEffect(() => {
    if (analysisResult) {
      console.log('📊 SCHEDULING PAGE: Analysis result updated in state');
      console.log('📋 SCHEDULING PAGE: Result project ID:', analysisResult.coordinatorOutput?.projectId);
    } else {
      console.log('📊 SCHEDULING PAGE: Analysis result cleared from state');
    }
  }, [analysisResult]);
  
  // Track error changes
  useEffect(() => {
    if (analysisError) {
      console.error('❌ SCHEDULING PAGE: Analysis error updated in state:', analysisError);
    } else {
      console.log('✅ SCHEDULING PAGE: Analysis error cleared from state');
    }
  }, [analysisError]);
  
  // Track analyzing state changes
  useEffect(() => {
    console.log('🔄 SCHEDULING PAGE: Analyzing state changed to:', isAnalyzing);
  }, [isAnalyzing]);
  
  // Tab change handler with logging
  const handleTabChange = (newTab: string) => {
    console.log('🔄 PAGE: Tab change requested from', activeTab, 'to', newTab);
    if (newTab === activeTab) {
      console.log('⚠️ PAGE: Tab change ignored - same tab');
      return;
    }
    setActiveTab(newTab);
    console.log('✅ PAGE: Tab changed successfully to', newTab);
    
    // Log specific tab behaviors
    if (newTab === 'aiyard') {
      console.log('🤖 PAGE: AI Yard activated - Scheduling coordination features available');
    } else if (newTab === 'aiyard1') {
      console.log('⚖️ PAGE: AI Yard 1 activated - Compliance & constraints features available');
    } else if (newTab === 'aiyard2') {
      console.log('🏗️ PAGE: AI Yard 2 activated - Resource logistics features available');
    } else if (newTab === 'aiyard3') {
      console.log('⚡ PAGE: AI Yard 3 activated - Optimization & scenario features available');
    } else if (newTab === 'scriptyard') {
      console.log('📝 PAGE: Script Yard activated - scene table view');
    } else if (newTab === 'boneyard') {
      console.log('🦴 PAGE: Bone Yard activated - problem scenes view');
    }
  };

  const handleComplianceAnalysis = async () => {
    console.log('');
    console.log('⚖️ ===== SCHEDULING PAGE: COMPLIANCE ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: SchedulingPage - AI Yard 1');
    console.log('⚖️ ==========================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating compliance input...');
    console.log('📊 PAGE: Compliance JSON input length:', jsonInputCompliance.length, 'characters');
    console.log('📊 PAGE: Compliance JSON input trimmed length:', jsonInputCompliance.trim().length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputCompliance.trim()) {
      console.error('❌ PAGE: Compliance validation failed - empty JSON input');
      setComplianceError('Please enter JSON data for compliance analysis');
      return;
    }
    console.log('✅ PAGE: Compliance input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting compliance analysis process...');
    console.log('🔄 PAGE: Setting compliance analysis state...');
    
    setIsAnalyzingCompliance(true);
    setComplianceError('');
    setComplianceResult(null);
    
    console.log('📊 PAGE: Compliance state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for compliance:', projectId);
      console.log('📋 PAGE: Project name:', selectedProject?.name || 'Unknown project');
      
      console.log('');
      console.log('🔄 PAGE: Calling analyzeComplianceWithAI()...');
      console.log('📤 PAGE: Sending compliance JSON input of', jsonInputCompliance.length, 'characters');
      
      const result = await analyzeComplianceWithAI(
        jsonInputCompliance,
        projectId,
        (status) => {
          console.log('📢 PAGE: Compliance progress callback received:', status);
        }
      );

      console.log('');
      console.log('📥 PAGE: Compliance analysis result received');
      console.log('📊 PAGE: Compliance result status:', result.status);
      console.log('📊 PAGE: Compliance result has data:', !!result.result);
      console.log('📊 PAGE: Compliance result has error:', !!result.error);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Compliance analysis completed successfully');
        console.log('📊 PAGE: Setting compliance analysis result to state...');
        
        // Log some key metrics from the result
        try {
          const output = result.result.complianceConstraintsOutput;
          console.log('📋 PAGE: Compliance result summary:');
          console.log('  - Request ID:', output.requestId);
          console.log('  - Compliance status:', output.complianceStatus);
          console.log('  - Hard constraints:', output.hardConstraints?.length);
          console.log('  - Soft constraints:', output.softConstraints?.length);
          console.log('  - Risk assessments:', output.riskAssessment?.length);
          console.log('  - Recommendations:', output.complianceRecommendations?.length);
        } catch (logError) {
          console.log('⚠️ PAGE: Could not log compliance result summary:', logError.message);
        }
        
        setComplianceResult(result.result);
        console.log('✅ PAGE: Compliance analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Compliance analysis failed');
        console.error('🔍 PAGE: Compliance error message:', result.error || 'Analysis failed');
        setComplianceError(result.error || 'Compliance analysis failed');
        console.log('🔄 PAGE: Compliance error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE COMPLIANCE ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleComplianceAnalysis:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic compliance error message...');
      setComplianceError('Failed to analyze compliance data');
      console.log('💥 ===================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Compliance analysis process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isAnalyzingCompliance to false...');
      setIsAnalyzingCompliance(false);
      console.log('✅ PAGE: Compliance analysis state cleanup completed');
      console.log('');
      console.log('⚖️ ===== SCHEDULING PAGE: COMPLIANCE ANALYSIS FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('⚖️ ========================================================');
      console.log('');
    }
  };

  const handleResourceAnalysis = async () => {
    console.log('');
    console.log('🏗️ ===== SCHEDULING PAGE: RESOURCE ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: SchedulingPage - AI Yard 2');
    console.log('🏗️ ========================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating resource input...');
    console.log('📊 PAGE: Resource JSON input length:', jsonInputResource.length, 'characters');
    console.log('📊 PAGE: Resource JSON input trimmed length:', jsonInputResource.trim().length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputResource.trim()) {
      console.error('❌ PAGE: Resource validation failed - empty JSON input');
      setResourceError('Please enter JSON data for resource analysis');
      return;
    }
    console.log('✅ PAGE: Resource input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting resource analysis process...');
    console.log('🔄 PAGE: Setting resource analysis state...');
    
    setIsAnalyzingResource(true);
    setResourceError('');
    setResourceResult(null);
    
    console.log('📊 PAGE: Resource state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for resource:', projectId);
      console.log('📋 PAGE: Project name:', selectedProject?.name || 'Unknown project');
      
      console.log('');
      console.log('🔄 PAGE: Calling analyzeResourceWithAI()...');
      console.log('📤 PAGE: Sending resource JSON input of', jsonInputResource.length, 'characters');
      
      const result = await analyzeResourceWithAI(
        jsonInputResource,
        projectId,
        (status) => {
          console.log('📢 PAGE: Resource progress callback received:', status);
        }
      );

      console.log('');
      console.log('📥 PAGE: Resource analysis result received');
      console.log('📊 PAGE: Resource result status:', result.status);
      console.log('📊 PAGE: Resource result has data:', !!result.result);
      console.log('📊 PAGE: Resource result has error:', !!result.error);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Resource analysis completed successfully');
        console.log('📊 PAGE: Setting resource analysis result to state...');
        
        // Log some key metrics from the result
        try {
          const output = result.result.resourceLogisticsOutput;
          console.log('📋 PAGE: Resource result summary:');
          console.log('  - Project ID:', output.projectId);
          console.log('  - Total cast members:', output.castResourceAnalysis?.totalCastMembers);
          console.log('  - Total crew size:', output.crewResourceAnalysis?.totalCrewSize);
          console.log('  - Department count:', output.crewResourceAnalysis?.departments?.length);
          console.log('  - Location count:', output.locationLogistics?.locationBreakdown?.length);
        } catch (logError) {
          console.log('⚠️ PAGE: Could not log resource result summary:', logError.message);
        }
        
        setResourceResult(result.result);
        console.log('✅ PAGE: Resource analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Resource analysis failed');
        console.error('🔍 PAGE: Resource error message:', result.error || 'Analysis failed');
        setResourceError(result.error || 'Resource analysis failed');
        console.log('🔄 PAGE: Resource error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE RESOURCE ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleResourceAnalysis:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic resource error message...');
      setResourceError('Failed to analyze resource data');
      console.log('💥 ==================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Resource analysis process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isAnalyzingResource to false...');
      setIsAnalyzingResource(false);
      console.log('✅ PAGE: Resource analysis state cleanup completed');
      console.log('');
      console.log('🏗️ ===== SCHEDULING PAGE: RESOURCE ANALYSIS FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('🏗️ ======================================================');
      console.log('');
    }
  };

  const handleOptimizationAnalysis = async () => {
    console.log('');
    console.log('⚡ ===== SCHEDULING PAGE: OPTIMIZATION ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: SchedulingPage - AI Yard 3');
    console.log('⚡ =============================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating optimization input...');
    console.log('📊 PAGE: Optimization JSON input length:', jsonInputOptimization.length, 'characters');
    console.log('📊 PAGE: Optimization JSON input trimmed length:', jsonInputOptimization.trim().length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputOptimization.trim()) {
      console.error('❌ PAGE: Optimization validation failed - empty JSON input');
      setOptimizationError('Please enter JSON data for optimization analysis');
      return;
    }
    console.log('✅ PAGE: Optimization input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting optimization analysis process...');
    console.log('🔄 PAGE: Setting optimization analysis state...');
    
    setIsAnalyzingOptimization(true);
    setOptimizationError('');
    setOptimizationResult(null);
    
    console.log('📊 PAGE: Optimization state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for optimization:', projectId);
      console.log('📋 PAGE: Project name:', selectedProject?.name || 'Unknown project');
      
      console.log('');
      console.log('🔄 PAGE: Calling analyzeOptimizationWithAI()...');
      console.log('📤 PAGE: Sending optimization JSON input of', jsonInputOptimization.length, 'characters');
      
      const result = await analyzeOptimizationWithAI(
        jsonInputOptimization,
        projectId,
        (status) => {
          console.log('📢 PAGE: Optimization progress callback received:', status);
        }
      );

      console.log('');
      console.log('📥 PAGE: Optimization analysis result received');
      console.log('📊 PAGE: Optimization result status:', result.status);
      console.log('📊 PAGE: Optimization result has data:', !!result.result);
      console.log('📊 PAGE: Optimization result has error:', !!result.error);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Optimization analysis completed successfully');
        console.log('📊 PAGE: Setting optimization analysis result to state...');
        
        // Log some key metrics from the result
        try {
          const output = result.result.optimizationScenarioOutput;
          console.log('📋 PAGE: Optimization result summary:');
          console.log('  - Project ID:', output.projectId);
          console.log('  - Scenario count:', output.optimizedScheduleScenarios?.length);
          console.log('  - Recommended scenario:', output.scenarioComparison?.recommendedScenario);
          console.log('  - Primary objective:', output.optimizationParameters?.primaryObjective);
        } catch (logError) {
          console.log('⚠️ PAGE: Could not log optimization result summary:', logError.message);
        }
        
        setOptimizationResult(result.result);
        console.log('✅ PAGE: Optimization analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Optimization analysis failed');
        console.error('🔍 PAGE: Optimization error message:', result.error || 'Analysis failed');
        setOptimizationError(result.error || 'Optimization analysis failed');
        console.log('🔄 PAGE: Optimization error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE OPTIMIZATION ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleOptimizationAnalysis:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic optimization error message...');
      setOptimizationError('Failed to analyze optimization data');
      console.log('💥 ======================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Optimization analysis process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isAnalyzingOptimization to false...');
      setIsAnalyzingOptimization(false);
      console.log('✅ PAGE: Optimization analysis state cleanup completed');
      console.log('');
      console.log('⚡ ===== SCHEDULING PAGE: OPTIMIZATION ANALYSIS FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('⚡ ===========================================================');
      console.log('');
    }
  };
  
  const scriptScenes = [
    { 
      id: 1, 
      scene: 'EXT. A SAVANNAH STREET - DAY (1981)', 
      description: 'A feather floats through the air. The falling feather.',
      castId: '',
      pages: '1 4/8',
      unit: 'Assign Unit',
      estimation: '1.5',
      location: 'Assign Location'
    },
    { 
      id: 13, 
      scene: 'EXT. GUMP BOARDING HOUSE - DAY', 
      description: 'A cab driver closes the trunk of the car as two woman walk t...',
      castId: '',
      pages: '2/8',
      unit: 'Assign Unit',
      estimation: '0',
      location: 'Assign Location'
    },
    { 
      id: 2, 
      scene: 'INT. COUNTRY DOCTOR\'S OFFICE - GREENBOW, ALABAMA - DAY', 
      description: '(1951) A little boy closes his eyes tightly. It is young For...',
      castId: '',
      pages: '5/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 3, 
      scene: 'EXT. GREENBOW, ALABAMA', 
      description: 'Mrs. Gump and young Forrest walk across the street. Forrest ...',
      castId: '',
      pages: '1/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 4, 
      scene: 'EXT. RURAL ALABAMA', 
      description: 'A black and white photo of General Nathan Bedford Forrest ...',
      castId: '',
      pages: '3/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 5, 
      scene: 'EXT. GREENBOW', 
      description: 'Mrs. Gump and Forrest walk across the street.',
      castId: '',
      pages: '7/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 6, 
      scene: 'EXT. OAK ALLEY/THE GUMP BOARDING HOUSE', 
      description: 'Mrs. Gump and Forrest walk along a dirt road. A row of mailb...',
      castId: '',
      pages: '6/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 7, 
      scene: 'INT. ELEMENTARY SCHOOL / PRINCIPAL\'S OFFICE - DAY', 
      description: 'PRINCIPAL',
      castId: '',
      pages: '2/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 8, 
      scene: 'INT. HALLWAY', 
      description: 'Forrest sits outside the principal\'s office and waits.',
      castId: '',
      pages: '6/8',
      unit: 'Assign Unit',
      estimation: '0',
      location: 'Assign Location'
    }
  ];
  
  const boneyardItems = [
    { id: 1, scene: '9', description: 'Interior coffee shop scene', reason: 'Location not available', priority: 'High' },
    { id: 2, scene: '12', description: 'Car chase sequence', reason: 'Stunt coordinator unavailable', priority: 'Medium' },
    { id: 3, scene: '15', description: 'Rooftop dialogue', reason: 'Weather dependent', priority: 'Low' },
    { id: 4, scene: '18', description: 'Restaurant dinner scene', reason: 'Cast scheduling conflict', priority: 'High' }
  ];

  const handleSchedulingAnalysis = async () => {
    console.log('');
    console.log('🎬 ===== SCHEDULING PAGE: ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: SchedulingPage');
    console.log('🎬 ==============================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating input...');
    console.log('📊 PAGE: JSON input length:', jsonInput.length, 'characters');
    console.log('📊 PAGE: JSON input trimmed length:', jsonInput.trim().length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInput.trim()) {
      console.error('❌ PAGE: Validation failed - empty JSON input');
      setAnalysisError('Please enter JSON data for analysis');
      return;
    }
    console.log('✅ PAGE: Input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting analysis process...');
    console.log('🔄 PAGE: Setting analysis state...');
    
    setIsAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);
    
    console.log('📊 PAGE: State updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID:', projectId);
      console.log('📋 PAGE: Project name:', selectedProject?.name || 'Unknown project');
      
      console.log('');
      console.log('🔄 PAGE: Calling analyzeSchedulingWithAI()...');
      console.log('📤 PAGE: Sending JSON input of', jsonInput.length, 'characters');
      
      const result = await analyzeSchedulingWithAI(
        jsonInput,
        projectId,
        (status) => {
          console.log('📢 PAGE: Progress callback received:', status);
        }
      );

      console.log('');
      console.log('📥 PAGE: Analysis result received');
      console.log('📊 PAGE: Result status:', result.status);
      console.log('📊 PAGE: Result has data:', !!result.result);
      console.log('📊 PAGE: Result has error:', !!result.error);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Analysis completed successfully');
        console.log('📊 PAGE: Setting analysis result to state...');
        
        // Log some key metrics from the result
        try {
          const output = result.result.coordinatorOutput;
          console.log('📋 PAGE: Result summary:');
          console.log('  - Project ID:', output.projectId);
          console.log('  - Total scenes:', output.comprehensiveProjectModel?.totalScenes);
          console.log('  - Complexity score:', output.comprehensiveProjectModel?.complexityScore);
          console.log('  - Risk factors:', output.comprehensiveProjectModel?.riskFactors?.length || 0);
          console.log('  - Agent packets:', Object.keys(output.agentDataPackets || {}).length);
        } catch (logError) {
          console.log('⚠️ PAGE: Could not log result summary:', logError.message);
        }
        
        setAnalysisResult(result.result);
        console.log('✅ PAGE: Analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Analysis failed');
        console.error('🔍 PAGE: Error message:', result.error || 'Analysis failed');
        setAnalysisError(result.error || 'Analysis failed');
        console.log('🔄 PAGE: Error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleSchedulingAnalysis:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic error message...');
      setAnalysisError('Failed to analyze scheduling data');
      console.log('💥 ========================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Analysis process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isAnalyzing to false...');
      setIsAnalyzing(false);
      console.log('✅ PAGE: Analysis state cleanup completed');
      console.log('');
      console.log('🎬 ===== SCHEDULING PAGE: ANALYSIS FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('🎬 =============================================');
      console.log('');
    }
  };
  
  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => handleTabChange('scriptyard')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'scriptyard' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Scriptyard
          </button>
          <button
            onClick={() => handleTabChange('boneyard')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'boneyard' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Boneyard
          </button>
          <button
            onClick={() => handleTabChange('aiyard')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'aiyard' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Yard
          </button>
          <button
            onClick={() => handleTabChange('aiyard1')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'aiyard1' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Yard 1
          </button>
          <button
            onClick={() => handleTabChange('aiyard2')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'aiyard2' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Yard 2
          </button>
          <button
            onClick={() => handleTabChange('aiyard3')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'aiyard3' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Yard 3
          </button>
        </div>
      </div>
      
      {activeTab === 'boneyard' && (
        <div className="space-y-2">
          {boneyardItems.map((item) => (
            <div key={item.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-medium">Scene {item.scene}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.priority === 'High' ? 'bg-red-600 text-white' :
                  item.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                  'bg-green-600 text-white'
                }`}>
                  {item.priority}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-1">{item.description}</div>
              <div className="text-xs text-gray-500">{item.reason}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <MainLayout sidebar={sidebar}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Demo: Forrest Gump</h1>
          </div>

          {/* JSON Input Section - Only show when AI Yard tab is active */}
          {activeTab === 'aiyard' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Scheduling Coordination Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for scheduling analysis:
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"scenes": [], "cast": [], "locations": [], "requirements": {}}'
                  className="w-full h-40 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
              </div>
              
              {analysisError && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800">
                  {analysisError}
                </div>
              )}
              
              <Button 
                onClick={handleSchedulingAnalysis}
                disabled={isAnalyzing || !jsonInput.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Scheduling
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* AI Yard 1 JSON Input Section - Only show when AI Yard 1 tab is active */}
          {activeTab === 'aiyard1' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Compliance & Constraints Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for compliance & constraints analysis:
                </label>
                <textarea
                  value={jsonInputCompliance}
                  onChange={(e) => setJsonInputCompliance(e.target.value)}
                  placeholder='{"cast": [], "crew": [], "scenes": [], "locations": [], "requirements": {}}'
                  className="w-full h-40 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
              </div>
              
              {complianceError && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800">
                  {complianceError}
                </div>
              )}
              
              <Button 
                onClick={handleComplianceAnalysis}
                disabled={isAnalyzingCompliance || !jsonInputCompliance.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingCompliance ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Compliance
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - AI Yard 2 - Resource Logistics */}
          {activeTab === 'aiyard2' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Resource Logistics Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for resource logistics analysis:
                </label>
                <textarea
                  value={jsonInputResource}
                  onChange={(e) => setJsonInputResource(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {resourceError && (
                <div className="text-red-400 text-sm">{resourceError}</div>
              )}
              <Button 
                onClick={handleResourceAnalysis}
                disabled={isAnalyzingResource}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingResource ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resource Logistics...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Resource Logistics
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - AI Yard 3 - Optimization & Scenario */}
          {activeTab === 'aiyard3' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Optimization & Scenario Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for optimization & scenario analysis:
                </label>
                <textarea
                  value={jsonInputOptimization}
                  onChange={(e) => setJsonInputOptimization(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {optimizationError && (
                <div className="text-red-400 text-sm">{optimizationError}</div>
              )}
              <Button 
                onClick={handleOptimizationAnalysis}
                disabled={isAnalyzingOptimization}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingOptimization ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Optimization...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Optimization
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* Analysis Result Section - Only show when AI Yard tab is active */}
          {activeTab === 'aiyard' && analysisResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Scheduling Coordination Output
              </h2>
              <div className="space-y-6">
                {/* Project Model Summary */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Project Model</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Scenes:</span>
                      <span className="text-white ml-2">{analysisResult.coordinatorOutput.comprehensiveProjectModel.totalScenes}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Pages:</span>
                      <span className="text-white ml-2">{analysisResult.coordinatorOutput.comprehensiveProjectModel.totalPages}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Estimated Days:</span>
                      <span className="text-white ml-2">{analysisResult.coordinatorOutput.comprehensiveProjectModel.totalEstimatedDays}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Complexity:</span>
                      <span className="text-white ml-2">{analysisResult.coordinatorOutput.comprehensiveProjectModel.complexityScore}/10</span>
                    </div>
                  </div>
                  {analysisResult.coordinatorOutput.comprehensiveProjectModel.riskFactors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Risk Factors:</h4>
                      <div className="space-y-1">
                        {analysisResult.coordinatorOutput.comprehensiveProjectModel.riskFactors.map((risk, index) => (
                          <div key={index} className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-800">
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Agent Data Packets */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Agent Coordination</h3>
                  <div className="space-y-4">
                    {Object.entries(analysisResult.coordinatorOutput.agentDataPackets).map(([key, agent]) => (
                      <div key={key} className="bg-gray-700 p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-white">{agent.agentName}</h4>
                          <span className="text-xs px-2 py-1 bg-purple-600 text-white rounded">{agent.priority}</span>
                        </div>
                        <p className="text-xs text-gray-300">{agent.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Sequence */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Execution Protocol</h3>
                  <div className="space-y-3">
                    {analysisResult.coordinatorOutput.coordinationProtocol.executionSequence.map((phase, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded">
                        <h4 className="text-sm font-medium text-white mb-1">{phase.phase}</h4>
                        <p className="text-xs text-gray-300 mb-2">{phase.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {phase.agents.map((agent, agentIndex) => (
                            <span key={agentIndex} className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
                              {agent}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Actions */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Next Actions</h3>
                  <div className="space-y-2">
                    {analysisResult.coordinatorOutput.nextActions.map((action, index) => (
                      <div key={index} className="text-sm text-gray-300 flex items-start">
                        <span className="text-purple-400 mr-2">{index + 1}.</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw JSON Output */}
                <details className="bg-gray-800 p-4 rounded-lg">
                  <summary className="text-sm font-medium text-white cursor-pointer hover:text-purple-400">
                    View Raw JSON Output
                  </summary>
                  <pre className="mt-3 text-xs text-gray-300 overflow-auto max-h-96 bg-gray-900 p-3 rounded border">
                    {JSON.stringify(analysisResult, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}

          {/* AI Yard 1 Compliance Results Section - Only show when AI Yard 1 tab is active */}
          {activeTab === 'aiyard1' && complianceResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Compliance & Constraints Output
              </h2>
              <div className="space-y-6">
                {/* Compliance Status Summary */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Compliance Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Request ID:</span>
                      <span className="text-white ml-2">{complianceResult.complianceConstraintsOutput.requestId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        complianceResult.complianceConstraintsOutput.complianceStatus === 'FULLY_COMPLIANT' 
                          ? 'bg-green-600 text-white' 
                          : complianceResult.complianceConstraintsOutput.complianceStatus === 'CONDITIONALLY_COMPLIANT'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {complianceResult.complianceConstraintsOutput.complianceStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-white ml-2">{Math.round(complianceResult.complianceConstraintsOutput.confidence * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Processing Time:</span>
                      <span className="text-white ml-2">{complianceResult.complianceConstraintsOutput.processingTime}s</span>
                    </div>
                  </div>
                </div>

                {/* Hard Constraints */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Hard Constraints ({complianceResult.complianceConstraintsOutput.hardConstraints.length})</h3>
                  <div className="space-y-3">
                    {complianceResult.complianceConstraintsOutput.hardConstraints.slice(0, 5).map((constraint, index) => (
                      <div key={index} className="bg-red-900/20 p-3 rounded border border-red-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-white">{constraint.constraintId}</h4>
                          <span className="text-xs px-2 py-1 bg-red-600 text-white rounded">{constraint.type}</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-1">{constraint.description}</p>
                        <p className="text-xs text-red-400">Violation: {constraint.violation}</p>
                      </div>
                    ))}
                    {complianceResult.complianceConstraintsOutput.hardConstraints.length > 5 && (
                      <div className="text-gray-500 text-xs">+{complianceResult.complianceConstraintsOutput.hardConstraints.length - 5} more constraints</div>
                    )}
                  </div>
                </div>

                {/* Soft Constraints */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Soft Constraints ({complianceResult.complianceConstraintsOutput.softConstraints.length})</h3>
                  <div className="space-y-3">
                    {complianceResult.complianceConstraintsOutput.softConstraints.slice(0, 4).map((constraint, index) => (
                      <div key={index} className="bg-yellow-900/20 p-3 rounded border border-yellow-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-white">{constraint.constraintId}</h4>
                          <span className="text-xs px-2 py-1 bg-yellow-600 text-white rounded">{constraint.flexibility}</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-1">{constraint.description}</p>
                        <p className="text-xs text-yellow-400">Penalty: {constraint.penalty}</p>
                      </div>
                    ))}
                    {complianceResult.complianceConstraintsOutput.softConstraints.length > 4 && (
                      <div className="text-gray-500 text-xs">+{complianceResult.complianceConstraintsOutput.softConstraints.length - 4} more constraints</div>
                    )}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Risk Assessment ({complianceResult.complianceConstraintsOutput.riskAssessment.length})</h3>
                  <div className="space-y-3">
                    {complianceResult.complianceConstraintsOutput.riskAssessment.slice(0, 4).map((risk, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-white">{risk.riskId}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              risk.severity === 'HIGH' ? 'bg-red-600 text-white' :
                              risk.severity === 'MEDIUM' ? 'bg-yellow-600 text-white' :
                              'bg-green-600 text-white'
                            }`}>
                              {risk.severity}
                            </span>
                            <span className="text-xs text-gray-400">{Math.round(risk.probability * 100)}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 mb-1">{risk.description}</p>
                        <p className="text-xs text-blue-400">Mitigation: {risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Recommendations */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Recommendations ({complianceResult.complianceConstraintsOutput.complianceRecommendations.length})</h3>
                  <div className="space-y-2">
                    {complianceResult.complianceConstraintsOutput.complianceRecommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-gray-300 flex items-start">
                        <span className={`text-xs px-2 py-1 rounded mr-3 mt-0.5 ${
                          rec.priority === 'HIGH' ? 'bg-red-600 text-white' :
                          rec.priority === 'MEDIUM' ? 'bg-yellow-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {rec.priority}
                        </span>
                        <div>
                          <div className="font-medium">{rec.recommendation}</div>
                          <div className="text-xs text-gray-500">Impact: {rec.impactIfIgnored}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw JSON Output */}
                <details className="bg-gray-800 p-4 rounded-lg">
                  <summary className="text-sm font-medium text-white cursor-pointer hover:text-purple-400">
                    View Raw JSON Output
                  </summary>
                  <pre className="mt-3 text-xs text-gray-300 overflow-auto max-h-96 bg-gray-900 p-3 rounded border">
                    {JSON.stringify(complianceResult, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder="Enter your scheduling request. Example: Scenes with cars and animals first, then stunt scenes. Sort nights first, then outdoor days."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
                <Wand2 className="mr-2 h-4 w-4" />
                AI Sort (1 of 1)
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTabChange('scriptyard')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === 'scriptyard' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Scriptyard
                </button>
                <button
                  onClick={() => handleTabChange('boneyard')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === 'boneyard' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Boneyard
                </button>
                <button
                  onClick={() => handleTabChange('aiyard')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === 'aiyard' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  AI Yard
                </button>
                <button
                  onClick={() => handleTabChange('aiyard1')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === 'aiyard1' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  AI Yard 1
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 bg-gray-800 hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 bg-gray-800 hover:bg-gray-700">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort Items
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 bg-gray-800 hover:bg-gray-700">
                <Calendar className="mr-2 h-4 w-4" />
                Auto Day Breaks
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-black bg-white hover:bg-gray-100">
                Share Project
                <Share2 className="ml-2 h-4 w-4" />
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          {activeTab === 'scriptyard' && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium w-16">#</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Set</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-32">Cast ID</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-24">Pages</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-32">Unit</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-32">Estimation, h</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Shooting Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scriptScenes.map((scene, index) => (
                      <tr key={scene.id} className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-850' : 'bg-gray-900'
                      }`}>
                        <td className="p-4 text-white font-medium">{scene.id}</td>
                        <td className="p-4">
                          <div className="text-white font-medium text-sm mb-1">{scene.scene}</div>
                          <div className="text-gray-400 text-xs">{scene.description}</div>
                        </td>
                        <td className="p-4 text-gray-400">{scene.castId}</td>
                        <td className="p-4">
                          <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm">
                            <option>{scene.pages}</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button className="text-gray-400 hover:text-white text-sm">
                            {scene.unit}
                          </button>
                        </td>
                        <td className="p-4">
                          <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm w-16">
                            <option>{scene.estimation}</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button className="text-gray-400 hover:text-white text-sm">
                            {scene.location}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resource Logistics Results Section - AI Yard 2 */}
          {activeTab === 'aiyard2' && resourceResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Resource Logistics Output
              </h2>
              <div className="space-y-6">
                {/* Cast Resource Analysis */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Cast Resource Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Cast:</span>
                      <span className="text-white ml-2">{resourceResult.resourceLogisticsOutput.castResourceAnalysis.totalCastMembers}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Principal Actors:</span>
                      <span className="text-white ml-2">{resourceResult.resourceLogisticsOutput.castResourceAnalysis.principalActors}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Day Players:</span>
                      <span className="text-white ml-2">{resourceResult.resourceLogisticsOutput.castResourceAnalysis.dayPlayers}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Work Days:</span>
                      <span className="text-white ml-2">{resourceResult.resourceLogisticsOutput.castResourceAnalysis.totalWorkDays}</span>
                    </div>
                  </div>
                </div>

                {/* Crew Resource Analysis */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Crew Resource Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-400">Total Crew Size:</span>
                      <span className="text-white ml-2">{resourceResult.resourceLogisticsOutput.crewResourceAnalysis.totalCrewSize}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Departments:</span>
                      <span className="text-white ml-2">{resourceResult.resourceLogisticsOutput.crewResourceAnalysis.departments.length}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {resourceResult.resourceLogisticsOutput.crewResourceAnalysis.departments.map((dept, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{dept.departmentName}</span>
                          <span className="text-gray-300 text-sm">Crew: {dept.crewSize}</span>
                        </div>
                        <div className="text-gray-400 text-sm">HOD: {dept.headOfDepartment}</div>
                        <div className="text-gray-400 text-sm">Budget: ${dept.budgetAllocation.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Summary */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Budget Resource Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Cast Costs:</span>
                      <span className="text-white ml-2">${resourceResult.resourceLogisticsOutput.budgetResourceSummary.castCosts.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Crew Costs:</span>
                      <span className="text-white ml-2">${resourceResult.resourceLogisticsOutput.budgetResourceSummary.crewCosts.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Equipment Costs:</span>
                      <span className="text-white ml-2">${resourceResult.resourceLogisticsOutput.budgetResourceSummary.equipmentCosts.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Location Costs:</span>
                      <span className="text-white ml-2">${resourceResult.resourceLogisticsOutput.budgetResourceSummary.locationCosts.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Recommended Actions</h3>
                  <div className="space-y-2">
                    {resourceResult.resourceLogisticsOutput.recommendedActions.map((action, index) => (
                      <div key={index} className="text-gray-300 text-sm">
                        • {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optimization & Scenario Results Section - AI Yard 3 */}
          {activeTab === 'aiyard3' && optimizationResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Optimization & Scenario Output
              </h2>
              <div className="space-y-6">
                {/* Optimization Parameters */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Optimization Parameters</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Primary Objective:</span>
                      <span className="text-white ml-2">{optimizationResult.optimizationScenarioOutput.optimizationParameters.primaryObjective}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cost Weight:</span>
                      <span className="text-white ml-2">{optimizationResult.optimizationScenarioOutput.optimizationParameters.weightingFactors.costWeight}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Time Weight:</span>
                      <span className="text-white ml-2">{optimizationResult.optimizationScenarioOutput.optimizationParameters.weightingFactors.timeWeight}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Quality Weight:</span>
                      <span className="text-white ml-2">{optimizationResult.optimizationScenarioOutput.optimizationParameters.weightingFactors.qualityWeight}</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Scenario */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Recommended Scenario</h3>
                  <div className="text-purple-400 font-medium text-lg mb-2">
                    {optimizationResult.optimizationScenarioOutput.scenarioComparison.recommendedScenario}
                  </div>
                </div>

                {/* Optimization Scenarios */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Schedule Scenarios</h3>
                  <div className="space-y-4">
                    {optimizationResult.optimizationScenarioOutput.optimizedScheduleScenarios.map((scenario, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{scenario.scenarioName}</span>
                          <span className="text-green-400">Score: {scenario.optimizationScore.toFixed(1)}</span>
                        </div>
                        <div className="text-gray-300 text-sm mb-2">{scenario.description}</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Shoot Days:</span>
                            <span className="text-white ml-1">{scenario.scheduleBreakdown.totalShootDays}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Prep Days:</span>
                            <span className="text-white ml-1">{scenario.scheduleBreakdown.prepDays}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Risk:</span>
                            <span className="text-white ml-1">{scenario.riskAssessment}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Budget:</span>
                            <span className="text-white ml-1">${scenario.costProjections.totalBudgetProjection.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Implementation Guidance */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Implementation Guidance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Phase One Actions</h4>
                      <div className="space-y-1">
                        {optimizationResult.optimizationScenarioOutput.implementationGuidance.phaseOneActions.map((action, index) => (
                          <div key={index} className="text-gray-400 text-sm">• {action}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Phase Two Actions</h4>
                      <div className="space-y-1">
                        {optimizationResult.optimizationScenarioOutput.implementationGuidance.phaseTwoActions.map((action, index) => (
                          <div key={index} className="text-gray-400 text-sm">• {action}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Next Steps</h3>
                  <div className="space-y-2">
                    {optimizationResult.optimizationScenarioOutput.nextSteps.map((step, index) => (
                      <div key={index} className="text-gray-300 text-sm">
                        • {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'boneyard' && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Boneyard Items</h3>
              <div className="space-y-3">
                {boneyardItems.map((item) => (
                  <div key={item.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Scene {item.scene}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'High' ? 'bg-red-600 text-white' :
                        item.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">{item.description}</div>
                    <div className="text-sm text-gray-500">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'aiyard' && !analysisResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">AI Yard</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No AI Analysis Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate scheduling coordination data.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'aiyard1' && !complianceResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">AI Yard 1 - Compliance & Constraints</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Compliance Analysis Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate compliance & constraints analysis.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'aiyard2' && !resourceResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">AI Yard 2 - Resource Logistics</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Resource Analysis Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate resource logistics analysis.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'aiyard3' && !optimizationResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">AI Yard 3 - Optimization & Scenario</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Optimization Analysis Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate optimization & scenario analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
