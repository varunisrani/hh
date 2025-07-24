
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { mockBudgetData, mockProject } from '@/data/mockData';
import { Plus, Share2, Download, Settings, Search, FileText, Loader2, Wand2, Brain, BarChart3, Clock, Users, MapPin, DollarSign, AlertTriangle, Code, CheckCircle, RotateCcw, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { analyzeBudgetCoordinatorWithAI, BudgetCoordinatorOutput } from '@/services/budgetCoordinatorService';
import { analyzeLaborCostWithAI, LaborCostOutput } from '@/services/laborCostService';
import { analyzeEquipmentPricingWithAI, EquipmentPricingOutput } from '@/services/equipmentPricingService';
import { analyzeLocationCostWithAI, LocationCostOutput } from '@/services/locationCostService';
import { analyzeScheduleOptimizerWithAI, ScheduleOptimizerOutput } from '@/services/scheduleOptimizerService';
import { analyzeInsuranceCalculatorWithAI, InsuranceCalculatorOutput } from '@/services/insuranceCalculatorService';
import { analyzePostProductionEstimatorWithAI, PostProductionEstimatorOutput } from '@/services/postProductionEstimatorService';
import { analyzeTaxIncentiveAnalyzerWithAI, TaxIncentiveAnalyzerOutput } from '@/services/taxIncentiveAnalyzerService';
import { analyzeBudgetAggregatorWithAI, BudgetAggregatorOutput } from '@/services/budgetAggregatorService';
import { analyzeCashFlowProjectorWithAI, CashFlowProjectorOutput } from '@/services/cashFlowProjectorService';
import { generateBasicBudgetWithAI, BasicBudgetOutput } from '@/services/basicBudgetGeneratorService';
import { analyzeBudgetMasterWithAI, ComprehensiveBudgetMasterOutput } from '@/services/aiBudgetMasterService';
import { useSelectedProject } from '@/hooks/useSelectedProject';

export const BudgetingPage = () => {
  console.log('💰 BUDGETING PAGE: Component rendering/re-rendering at', new Date().toISOString());
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basicBudget');
  const [budgetData, setBudgetData] = useState(mockBudgetData);
  const [showFringes, setShowFringes] = useState(false);
  const [fringeSearch, setFringeSearch] = useState('');
  
  // Budget 1 - Budget Coordinator state
  const [jsonInputBudgetCoordinator, setJsonInputBudgetCoordinator] = useState('');
  const [isAnalyzingBudgetCoordinator, setIsAnalyzingBudgetCoordinator] = useState(false);
  const [budgetCoordinatorResult, setBudgetCoordinatorResult] = useState<BudgetCoordinatorOutput | null>(null);
  const [budgetCoordinatorError, setBudgetCoordinatorError] = useState('');
  
  // Budget 2 - Labor Cost Calculator state
  const [jsonInputLaborCost, setJsonInputLaborCost] = useState('');
  const [isAnalyzingLaborCost, setIsAnalyzingLaborCost] = useState(false);
  const [laborCostResult, setLaborCostResult] = useState<LaborCostOutput | null>(null);
  const [laborCostError, setLaborCostError] = useState('');
  const [laborCostRawResponse, setLaborCostRawResponse] = useState<string>('');

  // Budget 3 - Equipment Pricing Engine state
  const [jsonInputEquipmentPricing, setJsonInputEquipmentPricing] = useState('');
  const [isAnalyzingEquipmentPricing, setIsAnalyzingEquipmentPricing] = useState(false);
  const [equipmentPricingResult, setEquipmentPricingResult] = useState<EquipmentPricingOutput | null>(null);
  const [equipmentPricingError, setEquipmentPricingError] = useState('');
  const [equipmentPricingRawResponse, setEquipmentPricingRawResponse] = useState<string>('');

  // Budget 4 - Location Cost Estimator state
  const [jsonInputLocationCost, setJsonInputLocationCost] = useState('');
  const [isAnalyzingLocationCost, setIsAnalyzingLocationCost] = useState(false);
  const [locationCostResult, setLocationCostResult] = useState<LocationCostOutput | null>(null);
  const [locationCostError, setLocationCostError] = useState('');
  const [locationCostRawResponse, setLocationCostRawResponse] = useState<string>('');

  // Budget 5 - Schedule Optimizer state
  const [jsonInputScheduleOptimizer, setJsonInputScheduleOptimizer] = useState('');
  const [isAnalyzingScheduleOptimizer, setIsAnalyzingScheduleOptimizer] = useState(false);
  const [scheduleOptimizerResult, setScheduleOptimizerResult] = useState<ScheduleOptimizerOutput | null>(null);
  const [scheduleOptimizerError, setScheduleOptimizerError] = useState('');
  const [scheduleOptimizerRawResponse, setScheduleOptimizerRawResponse] = useState<string>('');

  // Budget 6 - Insurance Calculator state
  const [jsonInputInsuranceCalculator, setJsonInputInsuranceCalculator] = useState('');
  const [isAnalyzingInsuranceCalculator, setIsAnalyzingInsuranceCalculator] = useState(false);
  const [insuranceCalculatorResult, setInsuranceCalculatorResult] = useState<InsuranceCalculatorOutput | null>(null);
  const [insuranceCalculatorError, setInsuranceCalculatorError] = useState('');
  const [insuranceCalculatorRawResponse, setInsuranceCalculatorRawResponse] = useState<string>('');

  // Budget 7 - Post-Production Estimator state
  const [jsonInputPostProductionEstimator, setJsonInputPostProductionEstimator] = useState('');
  const [isAnalyzingPostProductionEstimator, setIsAnalyzingPostProductionEstimator] = useState(false);
  const [postProductionEstimatorResult, setPostProductionEstimatorResult] = useState<PostProductionEstimatorOutput | null>(null);
  const [postProductionEstimatorError, setPostProductionEstimatorError] = useState('');
  const [postProductionEstimatorRawResponse, setPostProductionEstimatorRawResponse] = useState<string>('');

  // Budget 8 - Tax Incentive Analyzer state
  const [jsonInputTaxIncentiveAnalyzer, setJsonInputTaxIncentiveAnalyzer] = useState('');
  const [isAnalyzingTaxIncentiveAnalyzer, setIsAnalyzingTaxIncentiveAnalyzer] = useState(false);
  const [taxIncentiveAnalyzerResult, setTaxIncentiveAnalyzerResult] = useState<TaxIncentiveAnalyzerOutput | null>(null);
  const [taxIncentiveAnalyzerError, setTaxIncentiveAnalyzerError] = useState('');
  const [taxIncentiveAnalyzerRawResponse, setTaxIncentiveAnalyzerRawResponse] = useState<string>('');

  // Budget 9 - Budget Aggregator state
  const [jsonInputBudgetAggregator, setJsonInputBudgetAggregator] = useState('');
  const [isAnalyzingBudgetAggregator, setIsAnalyzingBudgetAggregator] = useState(false);
  const [budgetAggregatorResult, setBudgetAggregatorResult] = useState<BudgetAggregatorOutput | null>(null);
  const [budgetAggregatorError, setBudgetAggregatorError] = useState('');
  const [budgetAggregatorRawResponse, setBudgetAggregatorRawResponse] = useState<string>('');

  // Budget 10 - Cash Flow Projector state
  const [jsonInputCashFlowProjector, setJsonInputCashFlowProjector] = useState('');
  const [isAnalyzingCashFlowProjector, setIsAnalyzingCashFlowProjector] = useState(false);
  const [cashFlowProjectorResult, setCashFlowProjectorResult] = useState<CashFlowProjectorOutput | null>(null);
  const [cashFlowProjectorError, setCashFlowProjectorError] = useState('');
  const [cashFlowProjectorRawResponse, setCashFlowProjectorRawResponse] = useState<string>('');

  // Basic Budget Generator state
  const [isGeneratingBasicBudget, setIsGeneratingBasicBudget] = useState(false);
  const [basicBudgetResult, setBasicBudgetResult] = useState<BasicBudgetOutput | null>(null);
  const [basicBudgetError, setBasicBudgetError] = useState('');

  // AI Budget Master Analysis state - MATCHING SCRIPT ANALYSIS PATTERN
  const [isAnalyzingBudgetMaster, setIsAnalyzingBudgetMaster] = useState(false);
  const [budgetMasterResult, setBudgetMasterResult] = useState<ComprehensiveBudgetMasterOutput | null>(null);
  const [budgetMasterError, setBudgetMasterError] = useState('');
  const [budgetMasterRawResponse, setBudgetMasterRawResponse] = useState<string>('');
  const [budgetMasterProgress, setBudgetMasterProgress] = useState('');
  
  // Individual Agent Raw JSON state - MATCHING SCHEDULING PAGE PATTERN
  const [rawAgentOutputs, setRawAgentOutputs] = useState<{
    [tierKey: string]: {
      [serviceName: string]: any;
    };
  }>({});
  const [expandedRawSections, setExpandedRawSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showRawJSON, setShowRawJSON] = useState(false);
  
  const { selectedProject } = useSelectedProject();

  // Load basic budget results from localStorage on component mount and project change
  useEffect(() => {
    console.log('');
    console.log('💾 ===== BASIC BUDGET: LOADING FROM LOCALSTORAGE =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🔍 CHECKING PROJECT:', selectedProject?.id || 'No project');
    console.log('💾 ====================================================');
    console.log('');
    
    if (selectedProject?.id) {
      try {
        const storageKey = `basic_budget_${selectedProject.id}`;
        console.log('🔑 PAGE: Using storage key:', storageKey);
        
        const storedBudgetData = localStorage.getItem(storageKey);
        console.log('📦 PAGE: Stored data exists:', !!storedBudgetData);
        console.log('📏 PAGE: Stored data length:', storedBudgetData?.length || 0, 'characters');
        
        if (storedBudgetData) {
          const parsedBudget = JSON.parse(storedBudgetData);
          console.log('✅ PAGE: Successfully parsed stored budget data');
          console.log('📊 PAGE: Budget total from storage:', parsedBudget?.basicBudgetOutput?.budgetSummary?.totalBudget || 'N/A');
          
          setBasicBudgetResult(parsedBudget);
          console.log('✅ PAGE: Basic budget result loaded from localStorage');
        } else {
          console.log('📝 PAGE: No stored budget data found - clearing current result');
          setBasicBudgetResult(null);
        }
        
        // Always clear error when project changes
        setBasicBudgetError('');
        console.log('🧹 PAGE: Cleared any existing budget errors');
        
      } catch (error) {
        console.error('❌ PAGE: Error loading basic budget from localStorage:', error);
        console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
        console.error('🔍 PAGE: Error message:', error?.message || 'No message');
        
        // Clear corrupted data and reset state
        const storageKey = `basic_budget_${selectedProject.id}`;
        localStorage.removeItem(storageKey);
        setBasicBudgetResult(null);
        setBasicBudgetError('');
        console.log('🧹 PAGE: Cleared corrupted budget data from localStorage');
      }
    } else {
      console.log('📝 PAGE: No project selected - clearing budget result');
      setBasicBudgetResult(null);
      setBasicBudgetError('');
    }
    
    console.log('');
    console.log('💾 ===== BASIC BUDGET: LOCALSTORAGE LOAD COMPLETE =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('📊 FINAL STATE: Has result:', !!basicBudgetResult);
    console.log('📊 FINAL STATE: Has error:', !!basicBudgetError);
    console.log('💾 =====================================================');
    console.log('');
  }, [selectedProject?.id]);

  // Load AI Budget Master results from localStorage - MATCHING SCRIPT ANALYSIS PATTERN
  useEffect(() => {
    console.log('');
    console.log('💾 ===== AI BUDGET MASTER: LOADING FROM LOCALSTORAGE =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🔍 CHECKING PROJECT:', selectedProject?.id || 'No project');
    console.log('💾 =======================================================');
    console.log('');
    
    if (selectedProject?.id) {
      try {
        const storageKey = `ai_budget_master_${selectedProject.id}`;
        console.log('🔑 PAGE: Using storage key:', storageKey);
        
        const storedBudgetMasterData = localStorage.getItem(storageKey);
        console.log('📦 PAGE: Stored master data exists:', !!storedBudgetMasterData);
        console.log('📏 PAGE: Stored master data length:', storedBudgetMasterData?.length || 0, 'characters');
        
        if (storedBudgetMasterData) {
          const parsedBudgetMaster = JSON.parse(storedBudgetMasterData);
          console.log('✅ PAGE: Successfully parsed stored budget master data');
          console.log('📊 PAGE: Total budget from storage:', parsedBudgetMaster?.budgetMasterAnalysis?.budgetExecutiveSummary?.totalBudget || 'N/A');
          console.log('📊 PAGE: Tiers processed from storage:', parsedBudgetMaster?.budgetMasterAnalysis?.masterBudgetSummary?.totalTiersProcessed || 'N/A');
          
          setBudgetMasterResult(parsedBudgetMaster);
          console.log('✅ PAGE: Budget master result loaded from localStorage');
        } else {
          console.log('📝 PAGE: No stored budget master data found - clearing current result');
          setBudgetMasterResult(null);
        }
        
        // Always clear error and progress when project changes
        setBudgetMasterError('');
        setBudgetMasterProgress('');
        setBudgetMasterRawResponse('');
        setRawAgentOutputs({});
        setExpandedRawSections({});
        setShowRawJSON(false);
        console.log('🧹 PAGE: Cleared any existing budget master errors and progress');
        
      } catch (error) {
        console.error('❌ PAGE: Error loading AI budget master from localStorage:', error);
        console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
        console.error('🔍 PAGE: Error message:', error?.message || 'No message');
        
        // Clear corrupted data and reset state
        const storageKey = `ai_budget_master_${selectedProject.id}`;
        localStorage.removeItem(storageKey);
        setBudgetMasterResult(null);
        setBudgetMasterError('');
        setBudgetMasterProgress('');
        setBudgetMasterRawResponse('');
        console.log('🧹 PAGE: Cleared corrupted budget master data from localStorage');
      }
    } else {
      console.log('📝 PAGE: No project selected - clearing budget master result');
      setBudgetMasterResult(null);
      setBudgetMasterError('');
      setBudgetMasterProgress('');
      setBudgetMasterRawResponse('');
      setRawAgentOutputs({});
      setExpandedRawSections({});
      setShowRawJSON(false);
    }
    
    console.log('');
    console.log('💾 ===== AI BUDGET MASTER: LOCALSTORAGE LOAD COMPLETE =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('📊 FINAL STATE: Has master result:', !!budgetMasterResult);
    console.log('📊 FINAL STATE: Has master error:', !!budgetMasterError);
    console.log('💾 ==========================================================');
    console.log('');
  }, [selectedProject?.id]);
  
  console.log('📊 BUDGET PAGE STATE:');
  console.log('  - Active tab:', activeTab);
  console.log('  - Budget coordinator JSON input length:', jsonInputBudgetCoordinator.length, 'characters');
  console.log('  - Is analyzing budget coordinator:', isAnalyzingBudgetCoordinator);
  console.log('  - Has budget coordinator result:', !!budgetCoordinatorResult);
  console.log('  - Has budget coordinator error:', !!budgetCoordinatorError);
  console.log('  - Labor cost JSON input length:', jsonInputLaborCost.length, 'characters');
  console.log('  - Is analyzing labor cost:', isAnalyzingLaborCost);
  console.log('  - Has labor cost result:', !!laborCostResult);
  console.log('  - Has labor cost error:', !!laborCostError);
  console.log('  - AI Budget Master: Is analyzing:', isAnalyzingBudgetMaster);
  console.log('  - AI Budget Master: Has result:', !!budgetMasterResult);
  console.log('  - AI Budget Master: Has error:', !!budgetMasterError);
  console.log('  - AI Budget Master: Progress:', budgetMasterProgress || 'None');
  console.log('  - Selected project:', selectedProject?.id || 'None');
  
  // Utility functions for Raw JSON handling - MATCHING SCHEDULING PAGE PATTERN
  const toggleRawSection = (sectionKey: string) => {
    setExpandedRawSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('📋 Raw JSON copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy to clipboard:', error);
    }
  };

  // Tab change handler with logging
  const handleTabChange = (newTab: string) => {
    console.log('🔄 BUDGET PAGE: Tab change requested from', activeTab, 'to', newTab);
    if (newTab === activeTab) {
      console.log('⚠️ BUDGET PAGE: Tab change ignored - same tab');
      return;
    }
    setActiveTab(newTab);
    console.log('✅ BUDGET PAGE: Tab changed successfully to', newTab);
    
    // Log specific tab behaviors
    if (newTab === 'budget1') {
      console.log('💰 BUDGET PAGE: Budget 1 activated - Budget coordinator features available');
    } else if (newTab === 'budget2') {
      console.log('👷 BUDGET PAGE: Budget 2 activated - Labor cost calculator features available');
    } else if (newTab === 'budget3') {
      console.log('🎬 BUDGET PAGE: Budget 3 activated - Equipment pricing engine features available');
    } else if (newTab.startsWith('budget')) {
      const budgetNum = newTab.replace('budget', '');
      console.log(`📊 BUDGET PAGE: Budget ${budgetNum} activated - Service ready for implementation`);
    } else if (newTab === 'budgetTable') {
      console.log('📊 BUDGET PAGE: Budget Table activated - traditional budget view');
    }
  };

  const handleBudgetCoordinatorAnalysis = async () => {
    console.log('');
    console.log('💰 ===== BUDGETING PAGE: BUDGET COORDINATOR ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 1');
    console.log('💰 ================================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating budget coordinator input...');
    console.log('📊 PAGE: Budget coordinator JSON input length:', jsonInputBudgetCoordinator.length, 'characters');
    console.log('📊 PAGE: Budget coordinator JSON input trimmed length:', jsonInputBudgetCoordinator.trim().length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputBudgetCoordinator.trim()) {
      console.error('❌ PAGE: Budget coordinator validation failed - empty JSON input');
      setBudgetCoordinatorError('Please enter JSON data for budget coordinator analysis');
      return;
    }
    console.log('✅ PAGE: Budget coordinator input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting budget coordinator analysis process...');
    console.log('🔄 PAGE: Setting budget coordinator analysis state...');
    
    setIsAnalyzingBudgetCoordinator(true);
    setBudgetCoordinatorError('');
    setBudgetCoordinatorResult(null);
    
    console.log('📊 PAGE: Budget coordinator state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for budget coordinator:', projectId);
      console.log('📋 PAGE: Project name:', selectedProject?.name || 'Unknown project');
      
      console.log('');
      console.log('🔄 PAGE: Calling analyzeBudgetCoordinatorWithAI()...');
      console.log('📤 PAGE: Sending budget coordinator JSON input of', jsonInputBudgetCoordinator.length, 'characters');
      
      const result = await analyzeBudgetCoordinatorWithAI(
        jsonInputBudgetCoordinator,
        projectId,
        (status) => {
          console.log('📢 PAGE: Budget coordinator progress callback received:', status);
        }
      );

      console.log('');
      console.log('📥 PAGE: Budget coordinator analysis result received');
      console.log('📊 PAGE: Budget coordinator result status:', result.status);
      console.log('📊 PAGE: Budget coordinator result has data:', !!result.result);
      console.log('📊 PAGE: Budget coordinator result has error:', !!result.error);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Budget coordinator analysis completed successfully');
        console.log('📊 PAGE: Setting budget coordinator analysis result to state...');
        
        // Log some key metrics from the result
        try {
          const output = result.result.budgetCoordinatorOutput;
          console.log('📋 PAGE: Budget coordinator result summary:');
          console.log('  - Project ID:', output.projectId);
          console.log('  - Intake status:', output.systemStatusReport?.intakeStatus);
          console.log('  - Validation status:', output.systemStatusReport?.validationStatus);
          console.log('  - Data completeness:', output.systemStatusReport?.dataCompleteness, '%');
          console.log('  - Model data packets count:', Object.keys(output.modelDataPackets || {}).length);
        } catch (logError) {
          console.log('⚠️ PAGE: Could not log budget coordinator result summary:', logError.message);
        }
        
        setBudgetCoordinatorResult(result.result);
        console.log('✅ PAGE: Budget coordinator analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Budget coordinator analysis failed');
        console.error('🔍 PAGE: Budget coordinator error message:', result.error || 'Analysis failed');
        setBudgetCoordinatorError(result.error || 'Budget coordinator analysis failed');
        console.log('🔄 PAGE: Budget coordinator error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE BUDGET COORDINATOR ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleBudgetCoordinatorAnalysis:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic budget coordinator error message...');
      setBudgetCoordinatorError('Failed to analyze budget coordinator data');
      console.log('💥 ============================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Budget coordinator analysis process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isAnalyzingBudgetCoordinator to false...');
      setIsAnalyzingBudgetCoordinator(false);
      console.log('✅ PAGE: Budget coordinator analysis state cleanup completed');
      console.log('');
      console.log('💰 ===== BUDGETING PAGE: BUDGET COORDINATOR ANALYSIS FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('💰 ===============================================================');
      console.log('');
    }
  };

  const handleLaborCostAnalysis = async () => {
    console.log('');
    console.log('👷 ===== BUDGETING PAGE: LABOR COST ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 2');
    console.log('👷 =======================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating labor cost input...');
    console.log('📊 PAGE: Labor cost JSON input length:', jsonInputLaborCost.length, 'characters');
    console.log('📊 PAGE: Labor cost JSON input trimmed length:', jsonInputLaborCost.trim().length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputLaborCost.trim()) {
      console.error('❌ PAGE: Labor cost validation failed - empty JSON input');
      setLaborCostError('Please enter JSON data for labor cost analysis');
      return;
    }
    console.log('✅ PAGE: Labor cost input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting labor cost analysis process...');
    console.log('🔄 PAGE: Setting labor cost analysis state...');
    
    setIsAnalyzingLaborCost(true);
    setLaborCostError('');
    setLaborCostResult(null);
    setLaborCostRawResponse('');
    
    console.log('📊 PAGE: Labor cost state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for labor cost:', projectId);
      console.log('📋 PAGE: Project name:', selectedProject?.name || 'Unknown project');
      
      console.log('');
      console.log('🔄 PAGE: Calling analyzeLaborCostWithAI()...');
      console.log('📤 PAGE: Sending labor cost JSON input of', jsonInputLaborCost.length, 'characters');
      
      const result = await analyzeLaborCostWithAI(
        jsonInputLaborCost,
        projectId,
        (status) => {
          console.log('📢 PAGE: Labor cost progress callback received:', status);
        }
      );

      console.log('');
      console.log('📥 PAGE: Labor cost analysis result received');
      console.log('📊 PAGE: Labor cost result status:', result.status);
      console.log('📊 PAGE: Labor cost result has data:', !!result.result);
      console.log('📊 PAGE: Labor cost result has error:', !!result.error);

      // Always set the raw response if available
      if (result.rawResponse) {
        console.log('📄 PAGE: Setting raw response for display');
        setLaborCostRawResponse(result.rawResponse);
      }

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Labor cost analysis completed successfully');
        console.log('📊 PAGE: Setting labor cost analysis result to state...');
        
        // Log some key metrics from the result
        try {
          const output = result.result.laborModelOutput;
          console.log('📋 PAGE: Labor cost result summary:');
          console.log('  - Processing status:', output.processingLog?.overallProcessingStatus);
          console.log('  - Cast total:', output.cast?.castTotal);
          console.log('  - Crew total:', output.crew?.crewTotal);
          console.log('  - Labor grand total:', output.summary?.laborGrandTotal);
        } catch (logError) {
          console.log('⚠️ PAGE: Could not log labor cost result summary:', logError.message);
        }
        
        setLaborCostResult(result.result);
        console.log('✅ PAGE: Labor cost analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Labor cost analysis failed');
        console.error('🔍 PAGE: Labor cost error message:', result.error || 'Analysis failed');
        setLaborCostError(result.error || 'Labor cost analysis failed');
        console.log('🔄 PAGE: Labor cost error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE LABOR COST ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleLaborCostAnalysis:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic labor cost error message...');
      setLaborCostError('Failed to analyze labor cost data');
      console.log('💥 ===================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Labor cost analysis process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isAnalyzingLaborCost to false...');
      setIsAnalyzingLaborCost(false);
      console.log('✅ PAGE: Labor cost analysis state cleanup completed');
      console.log('');
      console.log('👷 ===== BUDGETING PAGE: LABOR COST ANALYSIS FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('👷 ======================================================');
      console.log('');
    }
  };

  const handleEquipmentPricingAnalysis = async () => {
    console.log('');
    console.log('🎬 ===== BUDGETING PAGE: EQUIPMENT PRICING ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 3');
    console.log('🎬 ===============================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating equipment pricing input...');
    console.log('📊 PAGE: Equipment pricing JSON input length:', jsonInputEquipmentPricing.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputEquipmentPricing.trim()) {
      console.error('❌ PAGE: Equipment pricing validation failed - empty JSON input');
      setEquipmentPricingError('Please enter JSON data for equipment pricing analysis');
      return;
    }
    console.log('✅ PAGE: Equipment pricing input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting equipment pricing analysis process...');
    
    setIsAnalyzingEquipmentPricing(true);
    setEquipmentPricingError('');
    setEquipmentPricingResult(null);
    setEquipmentPricingRawResponse('');
    
    console.log('📊 PAGE: Equipment pricing state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for equipment pricing:', projectId);
      
      console.log('🔄 PAGE: Calling analyzeEquipmentPricingWithAI()...');
      const result = await analyzeEquipmentPricingWithAI(
        jsonInputEquipmentPricing,
        projectId,
        (status) => {
          console.log('📢 PAGE: Equipment pricing progress callback received:', status);
        }
      );

      console.log('📥 PAGE: Equipment pricing analysis result received');
      console.log('📊 PAGE: Equipment pricing result status:', result.status);

      // Always set the raw response if available
      if (result.rawResponse) {
        console.log('📄 PAGE: Setting raw response for display');
        setEquipmentPricingRawResponse(result.rawResponse);
      }

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Equipment pricing analysis completed successfully');
        setEquipmentPricingResult(result.result);
        console.log('✅ PAGE: Equipment pricing analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Equipment pricing analysis failed');
        setEquipmentPricingError(result.error || 'Equipment pricing analysis failed');
        console.log('🔄 PAGE: Equipment pricing error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE EQUIPMENT PRICING ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleEquipmentPricingAnalysis:', error);
      setEquipmentPricingError('Failed to analyze equipment pricing data');
      console.log('💥 ==============================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Equipment pricing analysis process completed, cleaning up...');
      setIsAnalyzingEquipmentPricing(false);
      console.log('✅ PAGE: Equipment pricing analysis state cleanup completed');
      console.log('');
      console.log('🎬 ===== BUDGETING PAGE: EQUIPMENT PRICING ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  const handleLocationCostAnalysis = async () => {
    console.log('');
    console.log('🏢 ===== BUDGETING PAGE: LOCATION COST ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 4');
    console.log('🏢 ==============================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating location cost input...');
    console.log('📊 PAGE: Location cost JSON input length:', jsonInputLocationCost.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputLocationCost.trim()) {
      console.error('❌ PAGE: Location cost validation failed - empty JSON input');
      setLocationCostError('Please enter JSON data for location cost analysis');
      return;
    }
    console.log('✅ PAGE: Location cost input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting location cost analysis process...');
    
    setIsAnalyzingLocationCost(true);
    setLocationCostError('');
    setLocationCostResult(null);
    setLocationCostRawResponse('');
    
    console.log('📊 PAGE: Location cost state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for location cost:', projectId);
      
      console.log('🔄 PAGE: Calling analyzeLocationCostWithAI()...');
      const result = await analyzeLocationCostWithAI(
        jsonInputLocationCost,
        projectId,
        (status) => {
          console.log('📢 PAGE: Location cost progress callback received:', status);
        }
      );

      console.log('📥 PAGE: Location cost analysis result received');
      console.log('📊 PAGE: Location cost result status:', result.status);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Location cost analysis completed successfully');
        setLocationCostResult(result.result);
        setLocationCostRawResponse(result.rawResponse || '');
        console.log('✅ PAGE: Location cost analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Location cost analysis failed');
        setLocationCostError(result.error || 'Location cost analysis failed');
        setLocationCostRawResponse(result.rawResponse || '');
        console.log('🔄 PAGE: Location cost error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE LOCATION COST ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleLocationCostAnalysis:', error);
      setLocationCostError('Failed to analyze location cost data');
      console.log('💥 =========================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Location cost analysis process completed, cleaning up...');
      setIsAnalyzingLocationCost(false);
      console.log('✅ PAGE: Location cost analysis state cleanup completed');
      console.log('');
      console.log('🏢 ===== BUDGETING PAGE: LOCATION COST ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  const handleScheduleOptimizerAnalysis = async () => {
    console.log('');
    console.log('📅 ===== BUDGETING PAGE: SCHEDULE OPTIMIZER ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 5');
    console.log('📅 ================================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating schedule optimizer input...');
    console.log('📊 PAGE: Schedule optimizer JSON input length:', jsonInputScheduleOptimizer.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputScheduleOptimizer.trim()) {
      console.error('❌ PAGE: Schedule optimizer validation failed - empty JSON input');
      setScheduleOptimizerError('Please enter JSON data for schedule optimizer analysis');
      return;
    }
    console.log('✅ PAGE: Schedule optimizer input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting schedule optimizer analysis process...');
    
    setIsAnalyzingScheduleOptimizer(true);
    setScheduleOptimizerError('');
    setScheduleOptimizerResult(null);
    setScheduleOptimizerRawResponse('');
    
    console.log('📊 PAGE: Schedule optimizer state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for schedule optimizer:', projectId);
      
      console.log('🔄 PAGE: Calling analyzeScheduleOptimizerWithAI()...');
      const result = await analyzeScheduleOptimizerWithAI(
        jsonInputScheduleOptimizer,
        projectId,
        (status) => {
          console.log('📢 PAGE: Schedule optimizer progress callback received:', status);
        }
      );

      console.log('📥 PAGE: Schedule optimizer analysis result received');
      console.log('📊 PAGE: Schedule optimizer result status:', result.status);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Schedule optimizer analysis completed successfully');
        setScheduleOptimizerResult(result.result);
        setScheduleOptimizerRawResponse(result.rawResponse || '');
        console.log('✅ PAGE: Schedule optimizer analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Schedule optimizer analysis failed');
        setScheduleOptimizerError(result.error || 'Schedule optimizer analysis failed');
        setScheduleOptimizerRawResponse(result.rawResponse || '');
        console.log('🔄 PAGE: Schedule optimizer error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE SCHEDULE OPTIMIZER ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleScheduleOptimizerAnalysis:', error);
      setScheduleOptimizerError('Failed to analyze schedule optimizer data');
      console.log('💥 ==============================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Schedule optimizer analysis process completed, cleaning up...');
      setIsAnalyzingScheduleOptimizer(false);
      console.log('✅ PAGE: Schedule optimizer analysis state cleanup completed');
      console.log('');
      console.log('📅 ===== BUDGETING PAGE: SCHEDULE OPTIMIZER ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  const handleInsuranceCalculatorAnalysis = async () => {
    console.log('');
    console.log('🛡️ ===== BUDGETING PAGE: INSURANCE CALCULATOR ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 6');
    console.log('🛡️ ===================================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating insurance calculator input...');
    console.log('📊 PAGE: Insurance calculator JSON input length:', jsonInputInsuranceCalculator.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputInsuranceCalculator.trim()) {
      console.error('❌ PAGE: Insurance calculator validation failed - empty JSON input');
      setInsuranceCalculatorError('Please enter JSON data for insurance calculator analysis');
      return;
    }
    console.log('✅ PAGE: Insurance calculator input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting insurance calculator analysis process...');
    
    setIsAnalyzingInsuranceCalculator(true);
    setInsuranceCalculatorError('');
    setInsuranceCalculatorResult(null);
    setInsuranceCalculatorRawResponse('');
    
    console.log('📊 PAGE: Insurance calculator state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for insurance calculator:', projectId);
      
      console.log('🔄 PAGE: Calling analyzeInsuranceCalculatorWithAI()...');
      const result = await analyzeInsuranceCalculatorWithAI(
        jsonInputInsuranceCalculator,
        projectId,
        (status) => {
          console.log('📢 PAGE: Insurance calculator progress callback received:', status);
        }
      );

      console.log('📥 PAGE: Insurance calculator analysis result received');
      console.log('📊 PAGE: Insurance calculator result status:', result.status);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Insurance calculator analysis completed successfully');
        setInsuranceCalculatorResult(result.result);
        setInsuranceCalculatorRawResponse(result.rawResponse || '');
        console.log('✅ PAGE: Insurance calculator analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Insurance calculator analysis failed');
        setInsuranceCalculatorError(result.error || 'Insurance calculator analysis failed');
        setInsuranceCalculatorRawResponse(result.rawResponse || '');
        console.log('🔄 PAGE: Insurance calculator error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE INSURANCE CALCULATOR ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleInsuranceCalculatorAnalysis:', error);
      setInsuranceCalculatorError('Failed to analyze insurance calculator data');
      console.log('💥 ===============================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Insurance calculator analysis process completed, cleaning up...');
      setIsAnalyzingInsuranceCalculator(false);
      console.log('✅ PAGE: Insurance calculator analysis state cleanup completed');
      console.log('');
      console.log('🛡️ ===== BUDGETING PAGE: INSURANCE CALCULATOR ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  const handlePostProductionEstimatorAnalysis = async () => {
    console.log('');
    console.log('🎬 ===== BUDGETING PAGE: POST-PRODUCTION ESTIMATOR ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 7');
    console.log('🎬 ==========================================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating post-production estimator input...');
    console.log('📊 PAGE: Post-production estimator JSON input length:', jsonInputPostProductionEstimator.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputPostProductionEstimator.trim()) {
      console.error('❌ PAGE: Post-production estimator validation failed - empty JSON input');
      setPostProductionEstimatorError('Please enter JSON data for post-production estimator analysis');
      return;
    }
    console.log('✅ PAGE: Post-production estimator input validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting post-production estimator analysis process...');
    
    setIsAnalyzingPostProductionEstimator(true);
    setPostProductionEstimatorError('');
    setPostProductionEstimatorResult(null);
    setPostProductionEstimatorRawResponse('');
    
    console.log('📊 PAGE: Post-production estimator state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for post-production estimator:', projectId);
      
      console.log('🔄 PAGE: Calling analyzePostProductionEstimatorWithAI()...');
      const result = await analyzePostProductionEstimatorWithAI(
        jsonInputPostProductionEstimator,
        projectId,
        (status) => {
          console.log('📢 PAGE: Post-production estimator progress callback received:', status);
        }
      );

      console.log('📥 PAGE: Post-production estimator analysis result received');
      console.log('📊 PAGE: Post-production estimator result status:', result.status);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Post-production estimator analysis completed successfully');
        setPostProductionEstimatorResult(result.result);
        setPostProductionEstimatorRawResponse(result.rawResponse || '');
        console.log('✅ PAGE: Post-production estimator analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Post-production estimator analysis failed');
        setPostProductionEstimatorError(result.error || 'Post-production estimator analysis failed');
        setPostProductionEstimatorRawResponse(result.rawResponse || '');
        console.log('🔄 PAGE: Post-production estimator error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE POST-PRODUCTION ESTIMATOR ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handlePostProductionEstimatorAnalysis:', error);
      setPostProductionEstimatorError('Failed to analyze post-production estimator data');
      console.log('💥 ===================================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Post-production estimator analysis process completed, cleaning up...');
      setIsAnalyzingPostProductionEstimator(false);
      console.log('✅ PAGE: Post-production estimator analysis state cleanup completed');
      console.log('');
      console.log('🎬 ===== BUDGETING PAGE: POST-PRODUCTION ESTIMATOR ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  const handleTaxIncentiveAnalyzerAnalysis = async () => {
    console.log('');
    console.log('💰 ===== BUDGETING PAGE: TAX INCENTIVE ANALYZER ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 8');
    console.log('💰 ========================================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating tax incentive analyzer input...');
    console.log('📊 PAGE: Tax incentive analyzer JSON input length:', jsonInputTaxIncentiveAnalyzer.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputTaxIncentiveAnalyzer.trim()) {
      console.error('❌ PAGE: Tax incentive analyzer validation failed - empty JSON input');
      setTaxIncentiveAnalyzerError('Please enter JSON data for tax incentive analyzer analysis');
      return;
    }
    console.log('✅ PAGE: Tax incentive analyzer input validation passed');
    console.log('');
    console.log('🚀 PAGE: Starting tax incentive analyzer analysis process...');
    
    setIsAnalyzingTaxIncentiveAnalyzer(true);
    setTaxIncentiveAnalyzerError('');
    setTaxIncentiveAnalyzerResult(null);
    setTaxIncentiveAnalyzerRawResponse('');
    
    console.log('📊 PAGE: Tax incentive analyzer state updated - isAnalyzing: true, error cleared, result cleared');
    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for tax incentive analyzer:', projectId);
      
      console.log('🔄 PAGE: Calling analyzeTaxIncentiveAnalyzerWithAI()...');
      const result = await analyzeTaxIncentiveAnalyzerWithAI(
        jsonInputTaxIncentiveAnalyzer,
        projectId,
        (status) => {
          console.log('📢 PAGE: Tax incentive analyzer progress callback received:', status);
        }
      );
      console.log('📥 PAGE: Tax incentive analyzer analysis result received');
      console.log('📊 PAGE: Tax incentive analyzer result status:', result.status);
      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Tax incentive analyzer analysis completed successfully');
        setTaxIncentiveAnalyzerResult(result.result);
        setTaxIncentiveAnalyzerRawResponse(result.rawResponse || '');
        console.log('✅ PAGE: Tax incentive analyzer analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Tax incentive analyzer analysis failed');
        setTaxIncentiveAnalyzerError(result.error || 'Tax incentive analyzer analysis failed');
        setTaxIncentiveAnalyzerRawResponse(result.rawResponse || '');
      }
    } catch (error) {
      console.error('❌ PAGE: Unexpected error in handleTaxIncentiveAnalyzerAnalysis:', error);
      setTaxIncentiveAnalyzerError('Failed to analyze tax incentive analyzer data');
      console.log('💥 ===================================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Tax incentive analyzer analysis process completed, cleaning up...');
      setIsAnalyzingTaxIncentiveAnalyzer(false);
      console.log('✅ PAGE: Tax incentive analyzer analysis state cleanup completed');
      console.log('');
      console.log('💰 ===== BUDGETING PAGE: TAX INCENTIVE ANALYZER ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  const handleBudgetAggregatorAnalysis = async () => {
    console.log('');
    console.log('📊 ===== BUDGETING PAGE: BUDGET AGGREGATOR ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 9');
    console.log('📊 ===================================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating budget aggregator input...');
    console.log('📊 PAGE: Budget aggregator JSON input length:', jsonInputBudgetAggregator.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputBudgetAggregator.trim()) {
      console.error('❌ PAGE: Budget aggregator validation failed - empty JSON input');
      setBudgetAggregatorError('Please enter JSON data for budget aggregator analysis');
      return;
    }
    console.log('✅ PAGE: Budget aggregator input validation passed');
    console.log('');
    console.log('🚀 PAGE: Starting budget aggregator analysis process...');
    
    setIsAnalyzingBudgetAggregator(true);
    setBudgetAggregatorError('');
    setBudgetAggregatorResult(null);
    setBudgetAggregatorRawResponse('');
    
    console.log('📊 PAGE: Budget aggregator state updated - isAnalyzing: true, error cleared, result cleared');
    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for budget aggregator:', projectId);
      
      console.log('🔄 PAGE: Calling analyzeBudgetAggregatorWithAI()...');
      const result = await analyzeBudgetAggregatorWithAI(
        jsonInputBudgetAggregator,
        projectId,
        (status) => {
          console.log('📢 PAGE: Budget aggregator progress callback received:', status);
        }
      );
      console.log('📥 PAGE: Budget aggregator analysis result received');
      console.log('📊 PAGE: Budget aggregator result status:', result.status);
      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Budget aggregator analysis completed successfully');
        setBudgetAggregatorResult(result.result);
        setBudgetAggregatorRawResponse(result.rawResponse || '');
        console.log('✅ PAGE: Budget aggregator analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Budget aggregator analysis failed');
        setBudgetAggregatorError(result.error || 'Budget aggregator analysis failed');
        setBudgetAggregatorRawResponse(result.rawResponse || '');
      }
    } catch (error) {
      console.error('❌ PAGE: Unexpected error in handleBudgetAggregatorAnalysis:', error);
      setBudgetAggregatorError('Failed to analyze budget aggregator data');
      console.log('💥 ===================================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Budget aggregator analysis process completed, cleaning up...');
      setIsAnalyzingBudgetAggregator(false);
      console.log('✅ PAGE: Budget aggregator analysis state cleanup completed');
      console.log('');
      console.log('📊 ===== BUDGETING PAGE: BUDGET AGGREGATOR ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  const handleCashFlowProjectorAnalysis = async () => {
    console.log('');
    console.log('💰 ===== BUDGETING PAGE: CASH FLOW PROJECTOR ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Budget 10');
    console.log('💰 ====================================================================');
    console.log('');
    
    console.log('🔍 PAGE: Validating cash flow projector input...');
    console.log('📊 PAGE: Cash flow projector JSON input length:', jsonInputCashFlowProjector.length, 'characters');
    console.log('📊 PAGE: Selected project:', selectedProject?.id || 'No project selected');
    
    if (!jsonInputCashFlowProjector.trim()) {
      console.error('❌ PAGE: Cash flow projector validation failed - empty JSON input');
      setCashFlowProjectorError('Please enter JSON data for cash flow projector analysis');
      return;
    }
    console.log('✅ PAGE: Cash flow projector input validation passed');
    console.log('');
    console.log('🚀 PAGE: Starting cash flow projector analysis process...');
    
    setIsAnalyzingCashFlowProjector(true);
    setCashFlowProjectorError('');
    setCashFlowProjectorResult(null);
    setCashFlowProjectorRawResponse('');
    
    console.log('📊 PAGE: Cash flow projector state updated - isAnalyzing: true, error cleared, result cleared');
    try {
      const projectId = selectedProject?.id || 'unknown_project';
      console.log('📋 PAGE: Using project ID for cash flow projector:', projectId);
      
      console.log('🔄 PAGE: Calling analyzeCashFlowProjectorWithAI()...');
      const result = await analyzeCashFlowProjectorWithAI(
        jsonInputCashFlowProjector,
        projectId,
        (status) => {
          console.log('📢 PAGE: Cash flow projector progress callback received:', status);
        }
      );
      console.log('📥 PAGE: Cash flow projector analysis result received');
      console.log('📊 PAGE: Cash flow projector result status:', result.status);
      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Cash flow projector analysis completed successfully');
        setCashFlowProjectorResult(result.result);
        setCashFlowProjectorRawResponse(result.rawResponse || '');
        console.log('✅ PAGE: Cash flow projector analysis result set to state successfully');
      } else {
        console.error('❌ PAGE: Cash flow projector analysis failed');
        setCashFlowProjectorError(result.error || 'Cash flow projector analysis failed');
        setCashFlowProjectorRawResponse(result.rawResponse || '');
      }
    } catch (error) {
      console.error('❌ PAGE: Unexpected error in handleCashFlowProjectorAnalysis:', error);
      setCashFlowProjectorError('Failed to analyze cash flow projector data');
      console.log('💥 ===================================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Cash flow projector analysis process completed, cleaning up...');
      setIsAnalyzingCashFlowProjector(false);
      console.log('✅ PAGE: Cash flow projector analysis state cleanup completed');
      console.log('');
      console.log('💰 ===== BUDGETING PAGE: CASH FLOW PROJECTOR ANALYSIS FINISHED =====');
      console.log('');
    }
  };

  // Basic Budget Generator Handler
  const handleBasicBudgetGeneration = async () => {
    console.log('');
    console.log('💰 ===== BUDGETING PAGE: BASIC BUDGET GENERATION INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - Basic Budget Generator');
    console.log('💰 ===============================================================');
    console.log('');
    
    if (!selectedProject) {
      console.error('❌ PAGE: No project selected');
      setBasicBudgetError('No project selected');
      return;
    }

    console.log('🔍 PAGE: Validating project data...');
    console.log('📊 PAGE: Selected project ID:', selectedProject.id);
    console.log('📊 PAGE: Selected project name:', selectedProject.name);
    console.log('📊 PAGE: Has PDF analysis results:', !!selectedProject.pdfAnalysisResults);

    if (!selectedProject.pdfAnalysisResults) {
      console.error('❌ PAGE: No script analysis results available');
      setBasicBudgetError('Script analysis results required. Please analyze your script first.');
      return;
    }

    console.log('✅ PAGE: Project validation passed');

    console.log('');
    console.log('🚀 PAGE: Starting basic budget generation process...');
    console.log('🔄 PAGE: Setting basic budget generation state...');
    
    setIsGeneratingBasicBudget(true);
    setBasicBudgetError('');
    setBasicBudgetResult(null);
    
    console.log('📊 PAGE: Basic budget state updated - isGenerating: true, error cleared, result cleared');

    try {
      // Get scheduling data from localStorage if available
      let schedulingData = null;
      try {
        const storedSchedule = localStorage.getItem(`production_schedule_${selectedProject.id}`);
        if (storedSchedule) {
          schedulingData = JSON.parse(storedSchedule);
          console.log('📅 PAGE: Found stored scheduling data for project');
        }
      } catch (error) {
        console.log('⚠️ PAGE: No scheduling data found, using basic estimates');
      }

      // If no scheduling data, create basic scheduling info from script data
      if (!schedulingData) {
        const scriptData = selectedProject.pdfAnalysisResults.data;
        schedulingData = {
          scheduleOverview: {
            projectId: selectedProject.id,
            totalShootDays: Math.max(10, Math.ceil(scriptData.totalScenes * 0.5)), // Estimate based on scenes
            estimatedBudgetRange: { low: 100000, high: 500000 },
            recommendedCrewSize: 25
          },
          dailySchedule: [],
          castSchedule: [],
          locationSchedule: []
        };
        console.log('📅 PAGE: Created basic scheduling estimates from script data');
      }

      const projectId = selectedProject.id;
      console.log('📋 PAGE: Using project ID for basic budget:', projectId);
      console.log('📋 PAGE: Project name:', selectedProject.name);
      
      console.log('');
      console.log('🔄 PAGE: Calling generateBasicBudgetWithAI()...');
      console.log('📤 PAGE: Sending script and scheduling data for analysis');
      
      const result = await generateBasicBudgetWithAI(
        selectedProject.pdfAnalysisResults,
        schedulingData,
        projectId,
        (status) => {
          console.log('📢 PAGE: Basic budget progress callback received:', status);
        }
      );

      console.log('');
      console.log('📥 PAGE: Basic budget generation result received');
      console.log('📊 PAGE: Basic budget result status:', result.status);
      console.log('📊 PAGE: Basic budget result has data:', !!result.result);
      console.log('📊 PAGE: Basic budget result has error:', !!result.error);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: Basic budget generation completed successfully');
        
        try {
          const budgetOutput = result.result.basicBudgetOutput;
          console.log('📊 PAGE: Generated budget total:', budgetOutput?.budgetSummary?.totalBudget || 'N/A');
          console.log('📊 PAGE: Budget categories count:', Object.keys(budgetOutput?.budgetCategories || {}).length);
        } catch (logError) {
          console.log('⚠️ PAGE: Could not log basic budget result summary:', logError.message);
        }
        
        setBasicBudgetResult(result.result);
        console.log('✅ PAGE: Basic budget generation result set to state successfully');

        // Save to localStorage
        try {
          const storageKey = `basic_budget_${selectedProject.id}`;
          const budgetDataToStore = JSON.stringify(result.result);
          localStorage.setItem(storageKey, budgetDataToStore);
          
          console.log('💾 PAGE: Basic budget result saved to localStorage');
          console.log('🔑 PAGE: Storage key used:', storageKey);
          console.log('📏 PAGE: Data size saved:', budgetDataToStore.length, 'characters');
        } catch (storageError) {
          console.error('❌ PAGE: Failed to save basic budget to localStorage:', storageError);
          console.error('🔍 PAGE: Storage error type:', storageError?.name || 'Unknown');
          console.error('🔍 PAGE: Storage error message:', storageError?.message || 'No message');
          // Continue without failing the entire operation
        }
      } else {
        console.error('❌ PAGE: Basic budget generation failed');
        console.error('🔍 PAGE: Basic budget error message:', result.error || 'Generation failed');
        setBasicBudgetError(result.error || 'Basic budget generation failed');
        console.log('🔄 PAGE: Basic budget error set to state');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE BASIC BUDGET ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleBasicBudgetGeneration:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic basic budget error message...');
      setBasicBudgetError('Failed to generate basic budget');
      console.log('💥 ======================================================');
    } finally {
      console.log('');
      console.log('🏁 PAGE: Basic budget generation process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isGeneratingBasicBudget to false...');
      setIsGeneratingBasicBudget(false);
      console.log('✅ PAGE: Basic budget generation state cleanup completed');
      console.log('');
      console.log('💰 ===== BUDGETING PAGE: BASIC BUDGET GENERATION FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('💰 ===============================================================');
      console.log('');
    }
  };

  // AI Budget Master Analysis Handler - MATCHING SCRIPT ANALYSIS PATTERN
  const handleAIBudgetMasterAnalysis = async () => {
    console.log('');
    console.log('🎬 ===== BUDGETING PAGE: AI BUDGET MASTER ANALYSIS INITIATED =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🖥️ COMPONENT: BudgetingPage - AI Budget Master Service');
    console.log('🎬 ===============================================================');
    console.log('');
    
    if (!selectedProject) {
      console.error('❌ PAGE: No project selected');
      setBudgetMasterError('No project selected');
      return;
    }

    console.log('🔍 PAGE: Validating project data for master analysis...');
    console.log('📊 PAGE: Selected project ID:', selectedProject.id);
    console.log('📊 PAGE: Selected project name:', selectedProject.name);
    console.log('📊 PAGE: Has script analysis results:', !!selectedProject.aiAnalysis);
    console.log('📊 PAGE: Has PDF analysis results:', !!selectedProject.pdfAnalysisResults);

    if (!selectedProject.aiAnalysis && !selectedProject.pdfAnalysisResults) {
      console.error('❌ PAGE: No script analysis results available');
      setBudgetMasterError('Script analysis results required. Please analyze your script first.');
      return;
    }

    console.log('✅ PAGE: Project validation passed for master analysis');

    console.log('');
    console.log('🚀 PAGE: Starting AI Budget Master Analysis process...');
    console.log('🔄 PAGE: Setting master analysis state...');
    
    setIsAnalyzingBudgetMaster(true);
    setBudgetMasterError('');
    setBudgetMasterResult(null);
    setBudgetMasterProgress('Initializing comprehensive budget analysis...');
    setBudgetMasterRawResponse('');
    setRawAgentOutputs({});
    setExpandedRawSections({});
    setShowRawJSON(false);
    
    console.log('📊 PAGE: Master analysis state updated - isAnalyzing: true, error cleared, result cleared');

    try {
      // Get script data from project
      const scriptData = selectedProject.aiAnalysis || selectedProject.pdfAnalysisResults;
      
      // Get scheduling data from localStorage if available
      let schedulingData = null;
      try {
        const storedSchedule = localStorage.getItem(`production_schedule_${selectedProject.id}`);
        if (storedSchedule) {
          schedulingData = JSON.parse(storedSchedule);
          console.log('📅 PAGE: Found stored scheduling data for project');
        } else {
          // Create basic scheduling data from script analysis
          schedulingData = {
            totalShootDays: scriptData?.sceneBreakdownOutput?.sceneAnalysisSummary?.totalScenesProcessed || 10,
            averageSceneComplexity: scriptData?.sceneBreakdownOutput?.sceneAnalysisSummary?.averageSceneComplexity || 5,
            totalCharacters: scriptData?.sceneBreakdownOutput?.sceneAnalysisSummary?.totalCharactersIdentified || 5,
            totalLocations: scriptData?.sceneBreakdownOutput?.sceneAnalysisSummary?.totalLocationsIdentified || 3
          };
          console.log('📊 PAGE: Created basic scheduling data from script analysis');
        }
      } catch (error) {
        console.log('⚠️ PAGE: Creating fallback scheduling data');
        schedulingData = {
          totalShootDays: 10,
          averageSceneComplexity: 5,
          totalCharacters: 5,
          totalLocations: 3
        };
      }

      console.log('');
      console.log('🔄 PAGE: Calling AI Budget Master Service...');
      console.log('📊 PAGE: Script data size:', JSON.stringify(scriptData).length, 'characters');
      console.log('📊 PAGE: Scheduling data size:', JSON.stringify(schedulingData).length, 'characters');
      
      const result = await analyzeBudgetMasterWithAI(
        scriptData,
        schedulingData,
        selectedProject.id,
        (progress) => {
          console.log('📢 PAGE: Progress update received:', progress);
          setBudgetMasterProgress(progress);
        },
        (tierKey, serviceName, rawOutput) => {
          console.log('📢 PAGE: Raw agent update received:', tierKey, serviceName);
          setRawAgentOutputs(prev => ({
            ...prev,
            [tierKey]: {
              ...prev[tierKey],
              [serviceName]: rawOutput
            }
          }));
        }
      );

      console.log('');
      console.log('📥 PAGE: AI Budget Master Service response received');
      console.log('📊 PAGE: Response status:', result.status);
      console.log('📊 PAGE: Has result:', !!result.result);
      console.log('📊 PAGE: Has error:', !!result.error);
      console.log('📊 PAGE: Has raw response:', !!result.rawResponse);

      if (result.status === 'completed' && result.result) {
        console.log('✅ PAGE: AI Budget Master analysis completed successfully');
        
        setBudgetMasterResult(result.result);
        setBudgetMasterRawResponse(result.rawResponse || '');
        setBudgetMasterProgress('AI Budget Master analysis completed successfully!');
        
        console.log('📊 PAGE: Master analysis result set to state');
        console.log('📊 PAGE: Total budget from result:', result.result.budgetMasterAnalysis?.budgetExecutiveSummary?.totalBudget || 'N/A');
        console.log('📊 PAGE: Tiers processed:', result.result.budgetMasterAnalysis?.masterBudgetSummary?.totalTiersProcessed || 'N/A');

        // Save to localStorage - MATCHING SCRIPT ANALYSIS PATTERN
        try {
          const storageKey = `ai_budget_master_${selectedProject.id}`;
          const budgetMasterDataToStore = JSON.stringify(result.result);
          localStorage.setItem(storageKey, budgetMasterDataToStore);
          
          console.log('💾 PAGE: AI Budget Master result saved to localStorage');
          console.log('🔑 PAGE: Storage key used:', storageKey);
          console.log('📏 PAGE: Data size saved:', budgetMasterDataToStore.length, 'characters');
        } catch (storageError) {
          console.error('❌ PAGE: Failed to save AI Budget Master to localStorage:', storageError);
          console.error('🔍 PAGE: Storage error type:', storageError?.name || 'Unknown');
          console.error('🔍 PAGE: Storage error message:', storageError?.message || 'No message');
          // Continue without failing the entire operation
        }

        // Dispatch completion event - MATCHING SCRIPT ANALYSIS PATTERN
        window.dispatchEvent(new CustomEvent('budgetMasterAnalysisComplete', {
          detail: { 
            projectId: selectedProject.id, 
            result: result.result,
            timestamp: new Date().toISOString()
          }
        }));
        console.log('📡 PAGE: budgetMasterAnalysisComplete event dispatched');

      } else {
        console.error('❌ PAGE: AI Budget Master analysis failed');
        console.error('🔍 PAGE: Master analysis error message:', result.error || 'Analysis failed');
        setBudgetMasterError(result.error || 'AI Budget Master analysis failed');
        setBudgetMasterRawResponse(result.rawResponse || '');
        setBudgetMasterProgress('');
        console.log('🔄 PAGE: Master analysis error set to state');

        // Dispatch error event - MATCHING SCRIPT ANALYSIS PATTERN
        window.dispatchEvent(new CustomEvent('budgetMasterAnalysisError', {
          detail: { 
            projectId: selectedProject.id, 
            error: result.error || 'Analysis failed',
            timestamp: new Date().toISOString()
          }
        }));
        console.log('📡 PAGE: budgetMasterAnalysisError event dispatched');
      }
    } catch (error) {
      console.log('');
      console.log('💥 ========== PAGE MASTER BUDGET ERROR OCCURRED ==========');
      console.error('❌ PAGE: Unexpected error in handleAIBudgetMasterAnalysis:', error);
      console.error('🔍 PAGE: Error type:', error?.name || 'Unknown');
      console.error('🔍 PAGE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 PAGE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 PAGE: Setting generic master analysis error message...');
      setBudgetMasterError('Failed to complete AI Budget Master analysis');
      setBudgetMasterProgress('');
      console.log('💥 ========================================================');
      
      // Dispatch error event
      window.dispatchEvent(new CustomEvent('budgetMasterAnalysisError', {
        detail: { 
          projectId: selectedProject.id, 
          error: 'Unexpected error occurred',
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      console.log('');
      console.log('🏁 PAGE: AI Budget Master Analysis process completed, cleaning up...');
      console.log('🔄 PAGE: Setting isAnalyzingBudgetMaster to false...');
      setIsAnalyzingBudgetMaster(false);
      console.log('✅ PAGE: Master analysis state cleanup completed');
      console.log('');
      console.log('🎬 ===== BUDGETING PAGE: AI BUDGET MASTER ANALYSIS FINISHED =====');
      console.log('📅 TIMESTAMP:', new Date().toISOString());
      console.log('🎬 ===============================================================');
      console.log('');
    }
  };

  // Clear AI Budget Master data function
  const clearBudgetMasterData = () => {
    console.log('');
    console.log('🧹 ===== AI BUDGET MASTER: CLEARING DATA =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🔍 PROJECT:', selectedProject?.id || 'No project');
    console.log('🧹 ==========================================');
    console.log('');
    
    if (selectedProject?.id) {
      try {
        const storageKey = `ai_budget_master_${selectedProject.id}`;
        localStorage.removeItem(storageKey);
        console.log('💾 CLEARED: Removed master data from localStorage with key:', storageKey);
      } catch (error) {
        console.error('❌ CLEAR ERROR: Failed to remove master data from localStorage:', error);
      }
    }
    
    setBudgetMasterResult(null);
    setBudgetMasterError('');
    setBudgetMasterProgress('');
    setBudgetMasterRawResponse('');
    setRawAgentOutputs({});
    setExpandedRawSections({});
    setShowRawJSON(false);
    console.log('🧹 CLEARED: All AI Budget Master state variables reset');
    
    console.log('');
    console.log('🧹 ===== AI BUDGET MASTER: DATA CLEARING COMPLETE =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🧹 =================================================');
    console.log('');
  };

  // Clear basic budget data function
  const clearBasicBudgetData = () => {
    console.log('');
    console.log('🧹 ===== BASIC BUDGET: CLEARING DATA =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🔍 PROJECT:', selectedProject?.id || 'No project');
    console.log('🧹 ========================================');
    console.log('');
    
    if (selectedProject?.id) {
      try {
        const storageKey = `basic_budget_${selectedProject.id}`;
        console.log('🔑 PAGE: Clearing storage key:', storageKey);
        
        // Remove from localStorage
        localStorage.removeItem(storageKey);
        console.log('💾 PAGE: Removed budget data from localStorage');
        
        // Clear state
        setBasicBudgetResult(null);
        setBasicBudgetError('');
        console.log('🧹 PAGE: Cleared budget state');
        
        console.log('✅ PAGE: Basic budget data cleared successfully');
      } catch (error) {
        console.error('❌ PAGE: Error clearing basic budget data:', error);
        // Still clear state even if localStorage fails
        setBasicBudgetResult(null);
        setBasicBudgetError('');
      }
    }
    
    console.log('');
    console.log('🧹 ===== BASIC BUDGET: CLEAR COMPLETE =====');
    console.log('');
  };
  
  const fringesData = [
    { id: 1, title: 'DGA', type: 'Perc', amount: 22.00 },
    { id: 2, title: 'SAG', type: 'Perc', amount: 21.00 },
    { id: 3, title: 'IATSE', type: 'Perc', amount: 28.00 },
    { id: 4, title: 'WGA', type: 'Perc', amount: 16.25 }
  ];

  const filteredFringes = fringesData.filter(fringe =>
    fringe.title.toLowerCase().includes(fringeSearch.toLowerCase())
  );
  
  const getBadgeVariant = (tagType: string) => {
    switch (tagType) {
      case 'Cast': return 'cast';
      case 'Extras': return 'location';
      case 'Greenery': return 'set';
      case 'Visual FX': return 'vehicles';
      default: return 'default';
    }
  };
  
  const updateEstimate = (id: number, value: number) => {
    setBudgetData(budgetData.map(item => 
      item.id === id ? { ...item, estimate: value } : item
    ));
  };
  
  const updateFringes = (id: number, value: number) => {
    setBudgetData(budgetData.map(item => 
      item.id === id ? { ...item, fringes: value } : item
    ));
  };

  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => handleTabChange('basicBudget')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'basicBudget' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Basic Budget ✨
          </button>
          <button
            onClick={() => handleTabChange('aiMasterBudget')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'aiMasterBudget' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎬 AI Master Budget
          </button>
          <button
            onClick={() => handleTabChange('budgetTable')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'budgetTable' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Budget Table
          </button>
          <button
            onClick={() => handleTabChange('budget1')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'budget1' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Budget 1
          </button>
          <button
            onClick={() => handleTabChange('budget2')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'budget2' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Budget 2
          </button>
          <button
            onClick={() => handleTabChange('budget3')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'budget3' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Budget 3
          </button>
          {[4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              onClick={() => handleTabChange(`budget${num}`)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === `budget${num}` 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Budget {num}
            </button>
          ))}
        </div>
      </div>
      
      {showFringes && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Fringes</h3>
            <Button size="sm" variant="outline" onClick={() => setShowFringes(false)} className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
              Back
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fringe..."
              value={fringeSearch}
              onChange={(e) => setFringeSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div className="space-y-3">
            {filteredFringes.map((fringe) => (
              <div key={fringe.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between text-white text-sm">
                  <div>
                    <div className="font-medium">{fringe.title}</div>
                    <div className="text-gray-400 text-xs">{fringe.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{fringe.amount}</div>
                    <Button size="sm" variant="outline" className="mt-1 text-xs border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <MainLayout sidebar={sidebar}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">{mockProject.name}</h1>
            <div className="flex items-center space-x-3">
              <Button variant="default" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                Generate AI Budget ✨
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                Create Category
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100" onClick={() => setShowFringes(true)}>
                Fringes
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                <Settings className="mr-2 h-4 w-4" />
              </Button>
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

          {/* Basic Budget Generator Section */}
          {activeTab === 'basicBudget' && (
            <div className="mb-8 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6 border border-green-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Wand2 className="mr-2 h-5 w-5 text-green-400" />
                Basic Budget Generator
              </h2>
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-green-800/20 rounded-lg p-4 border border-green-600/30">
                  <p className="text-green-100 text-sm leading-relaxed">
                    Generate essential budget estimates automatically using your script analysis and scheduling data. 
                    This creates industry-standard budget categories with realistic cost estimates based on your project's requirements.
                  </p>
                  
                  {/* Status Indicator */}
                  {basicBudgetResult && (
                    <div className="mt-3 flex items-center text-green-300 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Budget data loaded from previous session
                    </div>
                  )}
                </div>

                {/* Generate/Clear Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    onClick={handleBasicBudgetGeneration}
                    disabled={isGeneratingBasicBudget || !selectedProject?.pdfAnalysisResults}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
                  >
                    {isGeneratingBasicBudget ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Budget...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        {basicBudgetResult ? 'Regenerate Budget' : 'Generate Basic Budget'}
                      </>
                    )}
                  </Button>
                  
                  {basicBudgetResult && !isGeneratingBasicBudget && (
                    <Button 
                      onClick={clearBasicBudgetData}
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-900/20 hover:text-red-300 px-6 py-3"
                    >
                      Clear Budget
                    </Button>
                  )}
                </div>

                {/* Error Display */}
                {basicBudgetError && (
                  <div className="bg-red-900/50 border border-red-600/30 rounded-lg p-4">
                    <div className="text-red-300 text-sm">{basicBudgetError}</div>
                  </div>
                )}

                {/* Requirements Notice */}
                {!selectedProject?.pdfAnalysisResults && (
                  <div className="bg-yellow-900/50 border border-yellow-600/30 rounded-lg p-4">
                    <div className="text-yellow-300 text-sm">
                      Script analysis required. Please analyze your script first on the Script page.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Basic Budget Results */}
          {activeTab === 'basicBudget' && basicBudgetResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-400" />
                Budget Summary
              </h3>
              
              <div className="space-y-8">
                {/* Budget Overview */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4">Budget Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        ${basicBudgetResult.basicBudgetOutput.budgetSummary.totalBudget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Total Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {basicBudgetResult.basicBudgetOutput.budgetSummary.shootDays}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Shoot Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        ${basicBudgetResult.basicBudgetOutput.budgetSummary.budgetRange.low.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Low Estimate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">
                        ${basicBudgetResult.basicBudgetOutput.budgetSummary.budgetRange.high.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">High Estimate</div>
                    </div>
                  </div>
                </div>

                {/* Budget Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Above the Line */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h5 className="text-md font-medium text-white mb-4 text-center">Above the Line</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Director:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.aboveTheLine.director.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Producer:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.aboveTheLine.producer.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Key Cast:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.aboveTheLine.keyCast.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-white">Subtotal:</span>
                          <span className="text-green-400">${basicBudgetResult.basicBudgetOutput.budgetCategories.aboveTheLine.subtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Below the Line */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h5 className="text-md font-medium text-white mb-4 text-center">Below the Line</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Crew:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.belowTheLine.crew.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Equipment:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.belowTheLine.equipment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Locations:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.belowTheLine.locations.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cast:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.belowTheLine.cast.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Post-Production:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.belowTheLine.postProduction.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-white">Subtotal:</span>
                          <span className="text-blue-400">${basicBudgetResult.basicBudgetOutput.budgetCategories.belowTheLine.subtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Costs */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h5 className="text-md font-medium text-white mb-4 text-center">Other Costs</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Insurance:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.otherCosts.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Contingency:</span>
                        <span className="text-white">${basicBudgetResult.basicBudgetOutput.budgetCategories.otherCosts.contingency.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-white">Subtotal:</span>
                          <span className="text-orange-400">${basicBudgetResult.basicBudgetOutput.budgetCategories.otherCosts.subtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Breakdown */}
                {basicBudgetResult.basicBudgetOutput.budgetBreakdown && basicBudgetResult.basicBudgetOutput.budgetBreakdown.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h5 className="text-md font-medium text-white mb-4">Detailed Breakdown</h5>
                    <div className="space-y-3">
                      {basicBudgetResult.basicBudgetOutput.budgetBreakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                          <div>
                            <div className="text-white text-sm font-medium">{item.category}</div>
                            <div className="text-gray-400 text-xs">{item.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white text-sm">${item.amount.toLocaleString()}</div>
                            <div className="text-gray-400 text-xs">{item.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {basicBudgetResult.basicBudgetOutput.recommendations && basicBudgetResult.basicBudgetOutput.recommendations.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h5 className="text-md font-medium text-white mb-4">Recommendations</h5>
                    <div className="space-y-3">
                      {basicBudgetResult.basicBudgetOutput.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            rec.impact === 'high' ? 'bg-red-400' : 
                            rec.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}></div>
                          <div>
                            <div className="text-white text-sm font-medium">{rec.category}</div>
                            <div className="text-gray-300 text-sm mt-1">{rec.suggestion}</div>
                            <div className={`text-xs mt-1 ${
                              rec.impact === 'high' ? 'text-red-400' : 
                              rec.impact === 'medium' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {rec.impact.toUpperCase()} IMPACT
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* JSON Input Section - Budget 1 - Budget Coordinator */}
          {activeTab === 'budget1' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Budget Coordinator Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for budget coordinator analysis:
                </label>
                <textarea
                  value={jsonInputBudgetCoordinator}
                  onChange={(e) => setJsonInputBudgetCoordinator(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {budgetCoordinatorError && (
                <div className="text-red-400 text-sm">{budgetCoordinatorError}</div>
              )}
              <Button 
                onClick={handleBudgetCoordinatorAnalysis}
                disabled={isAnalyzingBudgetCoordinator}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingBudgetCoordinator ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Budget Coordinator...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Budget Coordinator
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - Budget 2 - Labor Cost Calculator */}
          {activeTab === 'budget2' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Labor Cost Calculator Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for labor cost calculator analysis:
                </label>
                <textarea
                  value={jsonInputLaborCost}
                  onChange={(e) => setJsonInputLaborCost(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {laborCostError && (
                <div className="text-red-400 text-sm">{laborCostError}</div>
              )}
              <Button 
                onClick={handleLaborCostAnalysis}
                disabled={isAnalyzingLaborCost}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingLaborCost ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Labor Cost...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Labor Cost
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - Budget 3 - Equipment Pricing Engine */}
          {activeTab === 'budget3' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Equipment Pricing Engine Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for equipment pricing engine analysis:
                </label>
                <textarea
                  value={jsonInputEquipmentPricing}
                  onChange={(e) => setJsonInputEquipmentPricing(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {equipmentPricingError && (
                <div className="text-red-400 text-sm">{equipmentPricingError}</div>
              )}
              <Button 
                onClick={handleEquipmentPricingAnalysis}
                disabled={isAnalyzingEquipmentPricing}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingEquipmentPricing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Equipment Pricing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Equipment Pricing
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - Budget 4 - Location Cost Estimator */}
          {activeTab === 'budget4' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Location Cost Estimator Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for location cost estimator analysis:
                </label>
                <textarea
                  value={jsonInputLocationCost}
                  onChange={(e) => setJsonInputLocationCost(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {locationCostError && (
                <div className="text-red-400 text-sm">{locationCostError}</div>
              )}
              <Button 
                onClick={handleLocationCostAnalysis}
                disabled={isAnalyzingLocationCost}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingLocationCost ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Location Cost...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Location Cost
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - Budget 5 - Schedule Optimizer */}
          {activeTab === 'budget5' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Schedule Optimizer Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for schedule optimizer analysis:
                </label>
                <textarea
                  value={jsonInputScheduleOptimizer}
                  onChange={(e) => setJsonInputScheduleOptimizer(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {scheduleOptimizerError && (
                <div className="text-red-400 text-sm">{scheduleOptimizerError}</div>
              )}
              <Button 
                onClick={handleScheduleOptimizerAnalysis}
                disabled={isAnalyzingScheduleOptimizer}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingScheduleOptimizer ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Schedule Optimizer...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Schedule Optimizer
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - Budget 6 - Insurance Calculator */}
          {activeTab === 'budget6' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Insurance Calculator Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for insurance calculator analysis:
                </label>
                <textarea
                  value={jsonInputInsuranceCalculator}
                  onChange={(e) => setJsonInputInsuranceCalculator(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {insuranceCalculatorError && (
                <div className="text-red-400 text-sm">{insuranceCalculatorError}</div>
              )}
              <Button 
                onClick={handleInsuranceCalculatorAnalysis}
                disabled={isAnalyzingInsuranceCalculator}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingInsuranceCalculator ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Insurance Calculator...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Insurance Calculator
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* JSON Input Section - Budget 7 - Post-Production Estimator */}
          {activeTab === 'budget7' && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Post-Production Estimator Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter JSON data for post-production estimator analysis:
                </label>
                <textarea
                  value={jsonInputPostProductionEstimator}
                  onChange={(e) => setJsonInputPostProductionEstimator(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder='Enter your JSON data here...'
                />
              </div>
              {postProductionEstimatorError && (
                <div className="text-red-400 text-sm">{postProductionEstimatorError}</div>
              )}
              <Button 
                onClick={handlePostProductionEstimatorAnalysis}
                disabled={isAnalyzingPostProductionEstimator}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzingPostProductionEstimator ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Post-Production Estimator...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Post-Production Estimator
                  </>
                )}
              </Button>
            </div>
            </div>
          )}

          {/* Budget Coordinator Results Section - Budget 1 */}
          {activeTab === 'budget1' && budgetCoordinatorResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Budget Coordinator Output
              </h2>
              <div className="space-y-6">
                {/* System Status Report */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">System Status Report</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Intake Status:</span>
                      <span className="text-white ml-2">{budgetCoordinatorResult.budgetCoordinatorOutput.systemStatusReport.intakeStatus}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Validation:</span>
                      <span className="text-white ml-2">{budgetCoordinatorResult.budgetCoordinatorOutput.systemStatusReport.validationStatus}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Data Completeness:</span>
                      <span className="text-white ml-2">{budgetCoordinatorResult.budgetCoordinatorOutput.systemStatusReport.dataCompleteness}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Missing Info:</span>
                      <span className="text-white ml-2">{budgetCoordinatorResult.budgetCoordinatorOutput.systemStatusReport.missingInformation.length}</span>
                    </div>
                  </div>
                </div>

                {/* Model Data Packets */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Model Data Packets</h3>
                  <div className="space-y-3">
                    {Object.entries(budgetCoordinatorResult.budgetCoordinatorOutput.modelDataPackets).map(([key, packet]) => (
                      <div key={key} className="bg-gray-700 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{packet.model}</span>
                          <span className="text-purple-400 text-sm">{packet.priority}</span>
                        </div>
                        <div className="text-gray-300 text-sm mt-1">{packet.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identified Risks */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Identified Risks</h3>
                  <div className="space-y-2">
                    {budgetCoordinatorResult.budgetCoordinatorOutput.systemStatusReport.identifiedRisks.map((risk, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded">
                        <div className="text-white font-medium">{risk.riskId}</div>
                        <div className="text-gray-300 text-sm">{risk.description}</div>
                        <div className="text-purple-400 text-sm mt-1">Mitigation: {risk.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Response Section - Budget 2 */}
          {activeTab === 'budget2' && laborCostRawResponse && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                🔍 Raw Gemini API Response
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-green-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                  {laborCostRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                ℹ️ This is the raw JSON response from the Gemini API. You can copy this data for manual analysis.
              </div>
            </div>
          )}

          {/* Labor Cost Results Section - Budget 2 */}
          {activeTab === 'budget2' && laborCostResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Labor Cost Calculator Output
              </h2>
              <div className="space-y-6">
                {/* Processing Log Summary */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Processing Status</h3>
                  <div className="text-green-400 font-medium">
                    {laborCostResult.laborModelOutput.processingLog.overallProcessingStatus}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
                    <div>
                      <span className="text-gray-400">Positions Calculated:</span>
                      <span className="text-white ml-2">{laborCostResult.laborModelOutput.processingLog.baseWageCalculation.positionsCalculated}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Union Rates:</span>
                      <span className="text-white ml-2">{laborCostResult.laborModelOutput.processingLog.unionRateLookup.status}</span>
                    </div>
                  </div>
                </div>

                {/* Summary - Labor Grand Total */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Labor Cost Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Base Wages:</span>
                      <span className="text-white ml-2">${laborCostResult.laborModelOutput.summary.totalBaseWages.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Overtime & Penalties:</span>
                      <span className="text-white ml-2">${laborCostResult.laborModelOutput.summary.totalOvertimeAndPenalties.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Fringes:</span>
                      <span className="text-white ml-2">${laborCostResult.laborModelOutput.summary.totalFringes.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Labor Grand Total:</span>
                      <span className="text-green-400 ml-2 font-bold">${laborCostResult.laborModelOutput.summary.laborGrandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div>
                      <span className="text-gray-400">Special Requirements:</span>
                      <span className="text-white ml-2">${laborCostResult.laborModelOutput.summary.totalSpecialRequirements.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Cast Breakdown */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Cast Breakdown</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700 p-3 rounded">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Above-the-Line</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Principals:</span>
                          <span className="text-white ml-2">{laborCostResult.laborModelOutput.cast.aboveTheLine.principals.count} (${laborCostResult.laborModelOutput.cast.aboveTheLine.principals.baseWages.toLocaleString()})</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Supporting:</span>
                          <span className="text-white ml-2">{laborCostResult.laborModelOutput.cast.aboveTheLine.supporting.count} (${laborCostResult.laborModelOutput.cast.aboveTheLine.supporting.baseWages.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Below-the-Line</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Day Players:</span>
                          <span className="text-white ml-2">{laborCostResult.laborModelOutput.cast.belowTheLine.dayPlayers.count} (${laborCostResult.laborModelOutput.cast.belowTheLine.dayPlayers.baseWages.toLocaleString()})</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Extras:</span>
                          <span className="text-white ml-2">{laborCostResult.laborModelOutput.cast.belowTheLine.extras.manDays} days (${laborCostResult.laborModelOutput.cast.belowTheLine.extras.baseWages.toLocaleString()})</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Stunts:</span>
                          <span className="text-white ml-2">{laborCostResult.laborModelOutput.cast.belowTheLine.stunts.count} (${laborCostResult.laborModelOutput.cast.belowTheLine.stunts.baseWages.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Cast Subtotal:</span>
                        <span className="text-white ml-2">${laborCostResult.laborModelOutput.cast.castSubtotal.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Cast Fringes:</span>
                        <span className="text-white ml-2">${laborCostResult.laborModelOutput.cast.castFringesTotal.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Cast Total:</span>
                        <span className="text-white ml-2 font-bold">${laborCostResult.laborModelOutput.cast.castTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crew Breakdown */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Crew Breakdown by Department</h3>
                  <div className="space-y-3">
                    {Object.entries(laborCostResult.laborModelOutput.crew.departments).map(([dept, data]) => (
                      <div key={dept} className="bg-gray-700 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium capitalize">{dept.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-gray-300">${data.baseWages.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-4 text-sm mt-4 pt-3 border-t border-gray-600">
                      <div>
                        <span className="text-gray-400">Crew Subtotal:</span>
                        <span className="text-white ml-2">${laborCostResult.laborModelOutput.crew.crewSubtotal.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Crew Fringes:</span>
                        <span className="text-white ml-2">${laborCostResult.laborModelOutput.crew.crewFringesTotal.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Crew Total:</span>
                        <span className="text-white ml-2 font-bold">${laborCostResult.laborModelOutput.crew.crewTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Risk Assessment</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Contingency Percentage:</span>
                        <span className="text-orange-400 ml-2 font-medium">{laborCostResult.laborModelOutput.riskAssessment.recommendedContingencyPercentage}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Contingency Amount:</span>
                        <span className="text-orange-400 ml-2 font-medium">${laborCostResult.laborModelOutput.riskAssessment.contingencyAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Identified Risk Factors:</h4>
                      <div className="space-y-1">
                        {laborCostResult.laborModelOutput.riskAssessment.identifiedFactors.map((factor, index) => (
                          <div key={index} className="text-gray-300 text-sm">• {factor}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence Interval */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-white mb-3">Confidence Interval</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Lower Bound:</span>
                      <span className="text-red-400 ml-2">${laborCostResult.laborModelOutput.confidenceInterval.lowerBound.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Upper Bound:</span>
                      <span className="text-green-400 ml-2">${laborCostResult.laborModelOutput.confidenceInterval.upperBound.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget 1 - No Data Placeholder */}
          {activeTab === 'budget1' && !budgetCoordinatorResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Budget 1 - Budget Coordinator</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Budget Coordinator Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate budget coordinator analysis.
                </p>
              </div>
            </div>
          )}

          {/* Budget 2 - No Data Placeholder */}
          {activeTab === 'budget2' && !laborCostResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Budget 2 - Labor Cost Calculator</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Labor Cost Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate labor cost calculator analysis.
                </p>
              </div>
            </div>
          )}

          {/* Budget 3 - Equipment Pricing Engine Results */}
          {activeTab === 'budget3' && equipmentPricingResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-6">
                🎬 Equipment Pricing Engine Results
              </h2>
              
              <div className="space-y-6">
                {/* Processing Log */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-blue-400 mb-3">🔄 Processing Log</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Equipment Vendor Matching:</span>
                      <span className="ml-2 text-green-400">
                        {equipmentPricingResult.equipmentModelOutput.processingLog.equipmentVendorMatching.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Daily/Weekly Rate Calculation:</span>
                      <span className="ml-2 text-green-400">
                        {equipmentPricingResult.equipmentModelOutput.processingLog.dailyWeeklyRateCalculation.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Volume Discount Processing:</span>
                      <span className="ml-2 text-green-400">
                        {equipmentPricingResult.equipmentModelOutput.processingLog.volumeDiscountProcessing.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Overall Status:</span>
                      <span className="ml-2 text-green-400">
                        {equipmentPricingResult.equipmentModelOutput.processingLog.overallProcessingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Equipment Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Camera Equipment */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-purple-400 mb-3">📹 Camera Equipment</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Primary Packages:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.camera.primaryPackages.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Specialty Rigs:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.camera.specialtyRigs.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">{equipmentPricingResult.equipmentModelOutput.camera.cameraSubtotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lighting Equipment */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-yellow-400 mb-3">💡 Lighting Equipment</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Studio Package:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.lighting.studioPackage.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Specialty Lighting:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.lighting.specialtyLighting.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">{equipmentPricingResult.equipmentModelOutput.lighting.lightingSubtotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sound Equipment */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-green-400 mb-3">🎵 Sound Equipment</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Recording Package:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.sound.recordingPackage.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Communications:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.sound.communications.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">{equipmentPricingResult.equipmentModelOutput.sound.soundSubtotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Effects */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-red-400 mb-3">✨ Special Effects</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Mechanical Effects:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.specialEffects.mechanicalEffects.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Optical Effects:</span>
                        <span className="ml-2 text-white">{equipmentPricingResult.equipmentModelOutput.specialEffects.opticalEffects.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">{equipmentPricingResult.equipmentModelOutput.specialEffects.specialEffectsSubtotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipment Grand Total */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500">
                  <h3 className="text-lg font-semibold text-white mb-4">💰 Equipment Grand Total</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{equipmentPricingResult.equipmentModelOutput.equipmentGrandTotal.subtotal}</div>
                      <div className="text-sm text-gray-300">Subtotal</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">{equipmentPricingResult.equipmentModelOutput.equipmentGrandTotal.contingency}</div>
                      <div className="text-sm text-gray-300">Contingency</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{equipmentPricingResult.equipmentModelOutput.equipmentGrandTotal.insurance}</div>
                      <div className="text-sm text-gray-300">Insurance</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">{equipmentPricingResult.equipmentModelOutput.equipmentGrandTotal.total}</div>
                      <div className="text-sm text-gray-300">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Response Section - Budget 3 */}
          {activeTab === 'budget3' && equipmentPricingRawResponse && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                🔍 Raw Gemini API Response
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-green-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                  {equipmentPricingRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                ℹ️ This is the raw JSON response from the Gemini API. You can copy this data for manual analysis.
              </div>
            </div>
          )}

          {/* Budget 3 - No Data Placeholder */}
          {activeTab === 'budget3' && !equipmentPricingResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Budget 3 - Equipment Pricing Engine</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Equipment Pricing Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate equipment pricing engine analysis.
                </p>
              </div>
            </div>
          )}

          {/* Budget 4 - Location Cost Estimator Results */}
          {activeTab === 'budget4' && locationCostResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-6">
                🏢 Location Cost Estimator Results
              </h2>
              
              <div className="space-y-6">
                {/* Processing Log */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-blue-400 mb-3">🔄 Processing Log</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Location Fee Estimation:</span>
                      <span className="ml-2 text-green-400">
                        {locationCostResult.locationModelOutput.processingLog.locationFeeEstimation.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Permit Cost Calculation:</span>
                      <span className="ml-2 text-green-400">
                        {locationCostResult.locationModelOutput.processingLog.permitCostCalculation.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Security Requirements:</span>
                      <span className="ml-2 text-green-400">
                        {locationCostResult.locationModelOutput.processingLog.securityRequirementsProcessing.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Overall Status:</span>
                      <span className="ml-2 text-green-400">
                        {locationCostResult.locationModelOutput.processingLog.overallProcessingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location Fees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-green-400 mb-3">🌍 Location Fees</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Studio Facilities:</span>
                        <span className="ml-2 text-white">${locationCostResult.locationModelOutput.locationFees.studioFacilities.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Location Fees Total:</span>
                        <span className="ml-2 text-green-400 font-semibold">${locationCostResult.locationModelOutput.locationFees.locationFeesTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-blue-400 mb-3">📋 Permits</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">International:</span>
                        <span className="ml-2 text-white">${locationCostResult.locationModelOutput.permits.international.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">UK:</span>
                        <span className="ml-2 text-white">${locationCostResult.locationModelOutput.permits.uk.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Permits Total:</span>
                        <span className="ml-2 text-green-400 font-semibold">${locationCostResult.locationModelOutput.permits.permitsTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Support */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-red-400 mb-3">🛡️ Security & Transportation</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Security:</span>
                        <span className="ml-2 text-white">${locationCostResult.locationModelOutput.locationSupport.security.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Transportation:</span>
                        <span className="ml-2 text-white">${locationCostResult.locationModelOutput.locationSupport.transportation.cost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-yellow-400 mb-3">🏨 Accommodation & Facilities</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Accommodation:</span>
                        <span className="ml-2 text-white">${locationCostResult.locationModelOutput.locationSupport.accommodation.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Facilities:</span>
                        <span className="ml-2 text-white">${locationCostResult.locationModelOutput.locationSupport.facilities.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Grand Total */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500">
                  <h3 className="text-lg font-semibold text-white mb-4">💰 Location Grand Total</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">${locationCostResult.locationModelOutput.locationGrandTotal.subtotal}</div>
                      <div className="text-sm text-gray-300">Subtotal</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">${locationCostResult.locationModelOutput.locationGrandTotal.contingency}</div>
                      <div className="text-sm text-gray-300">Contingency</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">${locationCostResult.locationModelOutput.contingency.percentage}%</div>
                      <div className="text-sm text-gray-300">Contingency %</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">${locationCostResult.locationModelOutput.locationGrandTotal.total}</div>
                      <div className="text-sm text-gray-300">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Response Section - Budget 4 */}
          {activeTab === 'budget4' && locationCostRawResponse && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                🔍 Raw Gemini API Response
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-green-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                  {locationCostRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                ℹ️ This is the raw JSON response from the Gemini API. You can copy this data for manual analysis.
              </div>
            </div>
          )}

          {/* Budget 4 - No Data Placeholder */}
          {activeTab === 'budget4' && !locationCostResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Budget 4 - Location Cost Estimator</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Location Cost Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate location cost estimator analysis.
                </p>
              </div>
            </div>
          )}

          {/* Budget 5 - Schedule Optimizer Results */}
          {activeTab === 'budget5' && scheduleOptimizerResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-6">
                📅 Schedule Optimizer Results
              </h2>
              
              <div className="space-y-6">
                {/* Processing Log */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-blue-400 mb-3">🔄 Processing Log</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Scene Location Grouping:</span>
                      <span className="ml-2 text-green-400">
                        {scheduleOptimizerResult.scheduleModelOutput.processingLog.sceneLocationGrouping.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Company Move Minimization:</span>
                      <span className="ml-2 text-green-400">
                        {scheduleOptimizerResult.scheduleModelOutput.processingLog.companyMoveMinimization.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cast Schedule Optimization:</span>
                      <span className="ml-2 text-green-400">
                        {scheduleOptimizerResult.scheduleModelOutput.processingLog.castScheduleOptimization.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Overall Status:</span>
                      <span className="ml-2 text-green-400">
                        {scheduleOptimizerResult.scheduleModelOutput.processingLog.overallProcessingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Schedule Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-purple-400 mb-3">📊 Schedule Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Total Days:</span>
                        <span className="ml-2 text-white">{scheduleOptimizerResult.scheduleModelOutput.optimizedSchedule.summary.totalDays}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Efficiency:</span>
                        <span className="ml-2 text-white">{(scheduleOptimizerResult.scheduleModelOutput.optimizedSchedule.summary.efficiency * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Pages Per Day:</span>
                        <span className="ml-2 text-green-400 font-semibold">{scheduleOptimizerResult.scheduleModelOutput.optimizedSchedule.summary.pagesPerDay}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-yellow-400 mb-3">🎬 Production Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Company Moves:</span>
                        <span className="ml-2 text-white">{scheduleOptimizerResult.scheduleModelOutput.optimizedSchedule.summary.companyMoves}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Overtime Estimate:</span>
                        <span className="ml-2 text-white">${scheduleOptimizerResult.scheduleModelOutput.optimizedSchedule.summary.overtimeEstimate.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Production Phases */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-green-400 mb-3">🎭 Production Phases</h3>
                  <div className="space-y-3">
                    {scheduleOptimizerResult.scheduleModelOutput.optimizedSchedule.productionPhases.map((phase, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{phase.phase}</span>
                          <span className="text-purple-400 text-sm">{phase.days} days</span>
                        </div>
                        <div className="text-gray-300 text-sm">
                          {phase.startDate} to {phase.endDate} • {phase.location}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          Scenes: {phase.scenes.length} • Constraints: {phase.keyConstraints.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Impact */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500">
                  <h3 className="text-lg font-semibold text-white mb-4">💰 Cost Impact Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">${scheduleOptimizerResult.scheduleModelOutput.costImpact.laborCosts.total.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Total Labor</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">${scheduleOptimizerResult.scheduleModelOutput.costImpact.laborCosts.overtime.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Overtime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">${scheduleOptimizerResult.scheduleModelOutput.costImpact.efficiencySavings.total.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Savings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{scheduleOptimizerResult.scheduleModelOutput.riskFactors.length}</div>
                      <div className="text-sm text-gray-300">Risk Factors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Response Section - Budget 5 */}
          {activeTab === 'budget5' && scheduleOptimizerRawResponse && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                🔍 Raw Gemini API Response
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-green-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                  {scheduleOptimizerRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                ℹ️ This is the raw JSON response from the Gemini API. You can copy this data for manual analysis.
              </div>
            </div>
          )}

          {/* Budget 5 - No Data Placeholder */}
          {activeTab === 'budget5' && !scheduleOptimizerResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Budget 5 - Schedule Optimizer</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Schedule Optimizer Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate schedule optimizer analysis.
                </p>
              </div>
            </div>
          )}

          {/* Budget 6 - Insurance Calculator Results */}
          {activeTab === 'budget6' && insuranceCalculatorResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-6">
                🛡️ Insurance Calculator Results
              </h2>
              
              <div className="space-y-6">
                {/* Processing Log */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-blue-400 mb-3">🔄 Processing Log</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Coverage Requirements:</span>
                      <span className="ml-2 text-green-400">
                        {insuranceCalculatorResult.insuranceModelOutput.processingLog.coverageRequirementsCalculation.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk Factor Assessment:</span>
                      <span className="ml-2 text-green-400">
                        {insuranceCalculatorResult.insuranceModelOutput.processingLog.riskFactorAssessment.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Completion Bond Processing:</span>
                      <span className="ml-2 text-green-400">
                        {insuranceCalculatorResult.insuranceModelOutput.processingLog.completionBondProcessing.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Overall Status:</span>
                      <span className="ml-2 text-green-400">
                        {insuranceCalculatorResult.insuranceModelOutput.processingLog.overallProcessingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* General Liability & Equipment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-red-400 mb-3">🛡️ General Liability</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Coverage:</span>
                        <span className="ml-2 text-white">${insuranceCalculatorResult.insuranceModelOutput.generalLiability.coverage.perOccurrence.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Premium:</span>
                        <span className="ml-2 text-green-400 font-semibold">${insuranceCalculatorResult.insuranceModelOutput.generalLiability.premium.totalPremium.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Deductible:</span>
                        <span className="ml-2 text-white">${insuranceCalculatorResult.insuranceModelOutput.generalLiability.deductible.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-purple-400 mb-3">📷 Equipment Coverage</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Total Value:</span>
                        <span className="ml-2 text-white">${insuranceCalculatorResult.insuranceModelOutput.equipmentCoverage.totalValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Premium:</span>
                        <span className="ml-2 text-green-400 font-semibold">${insuranceCalculatorResult.insuranceModelOutput.equipmentCoverage.totalPremium.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Deductible:</span>
                        <span className="ml-2 text-white">${insuranceCalculatorResult.insuranceModelOutput.equipmentCoverage.deductible.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cast Insurance & Workers Comp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-yellow-400 mb-3">🎭 Cast Insurance</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Total Cast Premium:</span>
                        <span className="ml-2 text-green-400 font-semibold">${insuranceCalculatorResult.insuranceModelOutput.castInsurance.totalCastPremium.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Essential Elements:</span>
                        <span className="ml-2 text-white">{Object.keys(insuranceCalculatorResult.insuranceModelOutput.castInsurance.essentialElements).length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-blue-400 mb-3">👷 Workers Compensation</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Total Payroll:</span>
                        <span className="ml-2 text-white">${insuranceCalculatorResult.insuranceModelOutput.workersCompensation.totalPayroll.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Premium:</span>
                        <span className="ml-2 text-green-400 font-semibold">${insuranceCalculatorResult.insuranceModelOutput.workersCompensation.totalPremium.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-orange-400 mb-3">⚠️ Risk Assessment</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Overall Risk Level:</span>
                      <span className="ml-2 text-red-400 font-semibold">{insuranceCalculatorResult.insuranceModelOutput.riskAssessment.overallRisk}</span>
                    </div>
                    <div className="space-y-2">
                      {insuranceCalculatorResult.insuranceModelOutput.riskAssessment.riskFactors.map((factor, index) => (
                        <div key={index} className="bg-gray-700 p-2 rounded text-sm">
                          <span className="text-purple-400 font-medium">{factor.type}:</span>
                          <span className="text-gray-300 ml-2">{factor.description}</span>
                          <span className="text-orange-400 ml-2">({factor.level})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Insurance Grand Total */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500">
                  <h3 className="text-lg font-semibold text-white mb-4">💰 Insurance Grand Total</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">${insuranceCalculatorResult.insuranceModelOutput.insuranceSummary.subtotal.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Subtotal</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">${insuranceCalculatorResult.insuranceModelOutput.insuranceSummary.completionBond.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Completion Bond</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">${insuranceCalculatorResult.insuranceModelOutput.insuranceSummary.brokerFee.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Broker Fee</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">${insuranceCalculatorResult.insuranceModelOutput.insuranceSummary.grandTotal.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Grand Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Response Section - Budget 6 */}
          {activeTab === 'budget6' && insuranceCalculatorRawResponse && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                🔍 Raw Gemini API Response
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-green-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                  {insuranceCalculatorRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                ℹ️ This is the raw JSON response from the Gemini API. You can copy this data for manual analysis.
              </div>
            </div>
          )}

          {/* Budget 6 - No Data Placeholder */}
          {activeTab === 'budget6' && !insuranceCalculatorResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Budget 6 - Insurance Calculator</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Insurance Calculator Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate insurance calculator analysis.
                </p>
              </div>
            </div>
          )}

          {/* Budget 7 - Post-Production Estimator Results */}
          {activeTab === 'budget7' && postProductionEstimatorResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-6">
                🎬 Post-Production Estimator Results
              </h2>
              
              <div className="space-y-6">
                {/* Processing Log */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-blue-400 mb-3">🔄 Processing Log</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Editorial Time Estimation:</span>
                      <span className="ml-2 text-green-400">
                        {postProductionEstimatorResult.postProductionModelOutput.processingLog.editorialTimeEstimation.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">VFX Cost Calculation:</span>
                      <span className="ml-2 text-green-400">
                        {postProductionEstimatorResult.postProductionModelOutput.processingLog.vfxCostCalculation.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Sound Design & Mixing:</span>
                      <span className="ml-2 text-green-400">
                        {postProductionEstimatorResult.postProductionModelOutput.processingLog.soundDesignMixing.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Overall Status:</span>
                      <span className="ml-2 text-green-400">
                        {postProductionEstimatorResult.postProductionModelOutput.processingLog.overallProcessingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial & VFX */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-purple-400 mb-3">✂️ Editorial Costs</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Total Timeline:</span>
                        <span className="ml-2 text-white">{postProductionEstimatorResult.postProductionModelOutput.editorialCosts.timeline.totalWeeks} weeks</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Editorial Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">${postProductionEstimatorResult.postProductionModelOutput.editorialCosts.editorialSubtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-cyan-400 mb-3">🎨 Visual Effects</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Total Timeline:</span>
                        <span className="ml-2 text-white">{postProductionEstimatorResult.postProductionModelOutput.visualEffects.timeline.totalMonths} months</span>
                      </div>
                      <div>
                        <span className="text-gray-400">VFX Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">${postProductionEstimatorResult.postProductionModelOutput.visualEffects.vfxSubtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sound & Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-green-400 mb-3">🎵 Sound Post-Production</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Music Production:</span>
                        <span className="ml-2 text-white">${postProductionEstimatorResult.postProductionModelOutput.soundPostProduction.musicProduction.composerFee.cost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Sound Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">${postProductionEstimatorResult.postProductionModelOutput.soundPostProduction.soundSubtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-yellow-400 mb-3">🎨 Color & Finishing</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Lab Services:</span>
                        <span className="ml-2 text-white">${postProductionEstimatorResult.postProductionModelOutput.colorFinishing.colorTimingGrading.laboratoryServices.cost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Color Subtotal:</span>
                        <span className="ml-2 text-green-400 font-semibold">${postProductionEstimatorResult.postProductionModelOutput.colorFinishing.colorSubtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-md font-medium text-orange-400 mb-3">📊 Quality Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Shots:</span>
                      <span className="ml-2 text-white">{postProductionEstimatorResult.postProductionModelOutput.qualityMetrics.shotCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">VFX Shots:</span>
                      <span className="ml-2 text-white">{postProductionEstimatorResult.postProductionModelOutput.qualityMetrics.vfxShotCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Music Cues:</span>
                      <span className="ml-2 text-white">{postProductionEstimatorResult.postProductionModelOutput.qualityMetrics.musicCues}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Languages:</span>
                      <span className="ml-2 text-white">{postProductionEstimatorResult.postProductionModelOutput.qualityMetrics.languages}</span>
                    </div>
                  </div>
                </div>

                {/* Post-Production Grand Total */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500">
                  <h3 className="text-lg font-semibold text-white mb-4">💰 Post-Production Grand Total</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">${postProductionEstimatorResult.postProductionModelOutput.postProductionSummary.subtotal.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Subtotal</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">${postProductionEstimatorResult.postProductionModelOutput.postProductionSummary.contingencies.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Contingencies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{postProductionEstimatorResult.postProductionModelOutput.timeline.totalMonths} mo</div>
                      <div className="text-sm text-gray-300">Timeline</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">${postProductionEstimatorResult.postProductionModelOutput.postProductionSummary.grandTotal.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Grand Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Response Section - Budget 7 */}
          {activeTab === 'budget7' && postProductionEstimatorRawResponse && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                🔍 Raw Gemini API Response
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-green-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                  {postProductionEstimatorRawResponse}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                ℹ️ This is the raw JSON response from the Gemini API. You can copy this data for manual analysis.
              </div>
            </div>
          )}

          {/* Budget 7 - No Data Placeholder */}
          {activeTab === 'budget7' && !postProductionEstimatorResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Budget 7 - Post-Production Estimator</h3>
              <div className="text-center py-8">
                <Wand2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-300 mb-2">No Post-Production Estimator Data</h4>
                <p className="text-gray-500 mb-4">
                  Use the input section above to generate post-production estimator analysis.
                </p>
              </div>
            </div>
          )}

          {/* Budget 8-10 Placeholders */}
          {['budget8', 'budget9', 'budget10'].map((tab, index) => {
            const budgetNum = index + 8;
            const titles = [
              'Tax Incentive Analyzer',
              'Budget Aggregator',
              'Cash Flow Projector'
            ];
            const title = titles[index];
            
            return activeTab === tab && (
              <div key={tab} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-4">Budget {budgetNum} - {title}</h3>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
                  <h4 className="text-md font-medium text-orange-400 mb-2">📋 Service Implementation Ready</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    This budget service follows the same pattern as Budget 1-7. All system prompts and output schemas are provided and ready for implementation.
                  </p>
                  <div className="text-xs text-gray-400">
                    ✅ System prompt defined<br/>
                    ✅ Output JSON schema provided<br/>
                    ✅ Processing functions specified<br/>
                    ✅ Ready for Gemini AI integration
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-md font-medium text-blue-400 mb-2">🔄 Implementation Pattern</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>1. Create service file: <code className="text-purple-400">{tab}Service.ts</code></p>
                    <p>2. Define interfaces matching provided output.json structure</p>
                    <p>3. Implement Gemini AI integration with system prompt</p>
                    <p>4. Add response parsing and transformation logic</p>
                    <p>5. Add UI input/output sections following Budget 1-7 pattern</p>
                    <p>6. Add tab navigation and state management</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {title} Data (JSON)
                    </label>
                    <textarea
                      value={
                        tab === 'budget8' ? jsonInputTaxIncentiveAnalyzer : 
                        tab === 'budget9' ? jsonInputBudgetAggregator : 
                        jsonInputCashFlowProjector
                      }
                      onChange={(e) => {
                        if (tab === 'budget8') setJsonInputTaxIncentiveAnalyzer(e.target.value);
                        else if (tab === 'budget9') setJsonInputBudgetAggregator(e.target.value);
                        else setJsonInputCashFlowProjector(e.target.value);
                      }}
                      className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 text-sm font-mono"
                      placeholder={
                        tab === 'budget8' ? '{"jurisdictions": ["UK", "California"], "totalBudget": 65000000}' :
                        tab === 'budget9' ? '{"budgetSources": ["coordinator", "labor"], "totalBudget": 65000000}' :
                        '{"totalBudget": 65000000, "productionMonths": 24}'
                      }
                    />
                  </div>
                  {((tab === 'budget8' && taxIncentiveAnalyzerError) || 
                    (tab === 'budget9' && budgetAggregatorError) || 
                    (tab === 'budget10' && cashFlowProjectorError)) && (
                    <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md border border-red-800">
                      {tab === 'budget8' ? taxIncentiveAnalyzerError :
                       tab === 'budget9' ? budgetAggregatorError :
                       cashFlowProjectorError}
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      if (tab === 'budget8') handleTaxIncentiveAnalyzerAnalysis();
                      else if (tab === 'budget9') handleBudgetAggregatorAnalysis();
                      else handleCashFlowProjectorAnalysis();
                    }}
                    disabled={
                      (tab === 'budget8' && isAnalyzingTaxIncentiveAnalyzer) ||
                      (tab === 'budget9' && isAnalyzingBudgetAggregator) ||
                      (tab === 'budget10' && isAnalyzingCashFlowProjector)
                    }
                    className={
                      tab === 'budget8' ? "bg-green-600 hover:bg-green-700 text-white" :
                      tab === 'budget9' ? "bg-blue-600 hover:bg-blue-700 text-white" :
                      "bg-purple-600 hover:bg-purple-700 text-white"
                    }
                  >
                    {((tab === 'budget8' && isAnalyzingTaxIncentiveAnalyzer) ||
                      (tab === 'budget9' && isAnalyzingBudgetAggregator) ||
                      (tab === 'budget10' && isAnalyzingCashFlowProjector)) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing {title}...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Analyze {title}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Budget 8 Results */}
          {activeTab === 'budget8' && taxIncentiveAnalyzerResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">Tax Incentive Analyzer Results</h4>
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="text-md font-medium text-white mb-3">Total Incentive Value</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">UK Credits:</span>
                      <span className="text-white ml-2">${taxIncentiveAnalyzerResult.taxModelOutput.totalIncentiveValue.ukCreditsAndGrants.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Net Value:</span>
                      <span className="text-white ml-2">${taxIncentiveAnalyzerResult.taxModelOutput.totalIncentiveValue.netIncentiveValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Effective Rate:</span>
                      <span className="text-white ml-2">{taxIncentiveAnalyzerResult.taxModelOutput.effectiveIncentiveRate.percentageOfBudget.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget 9 Results */}
          {activeTab === 'budget9' && budgetAggregatorResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">Budget Aggregator Results</h4>
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="text-md font-medium text-white mb-3">Consolidated Budget</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Above the Line:</span>
                      <span className="text-white ml-2">${budgetAggregatorResult.budgetModelOutput.consolidatedBudget.aboveTheLine.aboveTheLineTotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Below the Line:</span>
                      <span className="text-white ml-2">${budgetAggregatorResult.budgetModelOutput.consolidatedBudget.belowTheLine.belowTheLineTotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Budget:</span>
                      <span className="text-white ml-2">${budgetAggregatorResult.budgetModelOutput.consolidatedBudget.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget 10 Results */}
          {activeTab === 'budget10' && cashFlowProjectorResult && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">Cash Flow Projector Results</h4>
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="text-md font-medium text-white mb-3">Key Metrics</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Financing Need:</span>
                      <span className="text-white ml-2">${cashFlowProjectorResult.cashFlowModelOutput.financingRequirements.totalFinancingNeed.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">ROI:</span>
                      <span className="text-white ml-2">{cashFlowProjectorResult.cashFlowModelOutput.keyMetrics.returnOnInvestment.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">IRR:</span>
                      <span className="text-white ml-2">{cashFlowProjectorResult.cashFlowModelOutput.keyMetrics.internalRateOfReturn.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw Response Sections for Budget 8-10 */}
          {activeTab === 'budget8' && taxIncentiveAnalyzerRawResponse && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">Google Gemini Raw Response</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                  {taxIncentiveAnalyzerRawResponse}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'budget9' && budgetAggregatorRawResponse && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">Google Gemini Raw Response</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                  {budgetAggregatorRawResponse}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'budget10' && cashFlowProjectorRawResponse && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">Google Gemini Raw Response</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                  {cashFlowProjectorRawResponse}
                </pre>
              </div>
            </div>
          )}

          {/* AI Budget Master Analysis Section - MATCHING SCRIPT ANALYSIS PATTERN */}
          {activeTab === 'aiMasterBudget' && (
            <div className="mb-8 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Wand2 className="mr-2 h-5 w-5 text-purple-400" />
                AI Budget Master Analysis
              </h2>
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-purple-800/20 rounded-lg p-4 border border-purple-600/30">
                  <p className="text-purple-100 text-sm leading-relaxed">
                    Execute comprehensive AI-powered budget analysis across 7 execution tiers. This master service orchestrates 
                    all 10 budget services in parallel and sequential processing to generate complete budget intelligence, 
                    optimization recommendations, and executive-level insights.
                  </p>
                  
                  {/* Status Indicator */}
                  {budgetMasterResult && (
                    <div className="mt-4 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        Analysis Complete - {budgetMasterResult.budgetMasterAnalysis?.masterBudgetSummary?.totalTiersProcessed || 0} tiers processed
                      </span>
                      <span className="text-purple-300 text-sm">
                        (Total Budget: ${budgetMasterResult.budgetMasterAnalysis?.budgetExecutiveSummary?.totalBudget?.toLocaleString() || 'N/A'})
                      </span>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  {isAnalyzingBudgetMaster && budgetMasterProgress && (
                    <div className="mt-4 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                      <span className="text-purple-300 text-sm">{budgetMasterProgress}</span>
                    </div>
                  )}

                  {/* Error Indicator */}
                  {budgetMasterError && (
                    <div className="mt-4 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 text-sm">{budgetMasterError}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleAIBudgetMasterAnalysis}
                    disabled={isAnalyzingBudgetMaster || !selectedProject}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
                  >
                    {isAnalyzingBudgetMaster ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {budgetMasterProgress || 'Analyzing...'}
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate AI Master Budget Analysis
                      </>
                    )}
                  </Button>

                  {budgetMasterResult && (
                    <Button
                      onClick={clearBudgetMasterData}
                      variant="outline"
                      className="border-purple-400 text-purple-300 hover:bg-purple-800/20"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear Analysis
                    </Button>
                  )}
                </div>

                {/* Requirements Notice */}
                {!selectedProject?.aiAnalysis && !selectedProject?.pdfAnalysisResults && (
                  <div className="bg-yellow-900/50 border border-yellow-600/30 rounded-lg p-4">
                    <div className="text-yellow-300 text-sm">
                      Script analysis required. Please analyze your script first on the Script page.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Budget Master Results - MATCHING SCRIPT ANALYSIS PATTERN */}
          {activeTab === 'aiMasterBudget' && budgetMasterResult && (
            <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-400" />
                AI Budget Master Analysis Results
              </h3>
              
              <div className="space-y-8">
                {/* Executive Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-green-400" />
                    Executive Budget Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.totalBudget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Total Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.shootDays}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Shoot Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {budgetMasterResult.budgetMasterAnalysis.masterBudgetSummary.totalTiersProcessed}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Tiers Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {budgetMasterResult.budgetMasterAnalysis.masterBudgetSummary.confidenceScore}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Confidence Score</div>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Conservative Estimate</div>
                      <div className="text-xl font-bold text-red-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.budgetRange.conservative.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Optimistic Estimate</div>
                      <div className="text-xl font-bold text-green-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.budgetRange.optimistic.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Major Categories Breakdown */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4 text-blue-400" />
                    Major Budget Categories
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Above-the-Line</div>
                      <div className="text-lg font-bold text-purple-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.majorCategories.aboveTheLine.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Below-the-Line</div>
                      <div className="text-lg font-bold text-blue-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.majorCategories.belowTheLine.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Post-Production</div>
                      <div className="text-lg font-bold text-green-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.majorCategories.postProduction.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Insurance</div>
                      <div className="text-lg font-bold text-yellow-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.majorCategories.insurance.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Contingency</div>
                      <div className="text-lg font-bold text-red-400">
                        ${budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.majorCategories.contingency.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Crew Size</div>
                      <div className="text-lg font-bold text-indigo-400">
                        {budgetMasterResult.budgetMasterAnalysis.budgetExecutiveSummary.crewSize} people
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-indigo-400" />
                    Processing Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">
                        {budgetMasterResult.budgetMasterAnalysis.masterBudgetSummary.totalServicesSuccessful}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Services Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-400">
                        {budgetMasterResult.budgetMasterAnalysis.masterBudgetSummary.totalServicesFailed}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Services Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">
                        {Math.round(budgetMasterResult.budgetMasterAnalysis.masterBudgetSummary.totalProcessingTime / 1000)}s
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Total Processing Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">
                        {Math.round(budgetMasterResult.budgetMasterAnalysis.masterBudgetSummary.averageProcessingTimePerTier / 1000)}s
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Avg Time Per Tier</div>
                    </div>
                  </div>
                </div>

                {/* Tier Results Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Settings className="mr-2 h-4 w-4 text-gray-400" />
                    Tier Execution Results
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(budgetMasterResult.budgetMasterAnalysis.tierResults).map(([tierKey, tierData]: [string, any]) => (
                      <div key={tierKey} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-white">
                            {tierKey.replace('tier', 'Tier ').replace('Results', '')}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            tierData?.status === 'completed' ? 'bg-green-600 text-white' :
                            tierData?.status === 'error' ? 'bg-red-600 text-white' :
                            'bg-gray-600 text-gray-300'
                          }`}>
                            {tierData?.status || 'skipped'}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Processing Time: {Math.round((tierData?.processingTime || 0) / 1000)}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Agent Raw JSON Display - MATCHING SCHEDULING PAGE PATTERN */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white flex items-center">
                      <Code className="mr-2 h-4 w-4 text-green-400" />
                      Agent Raw JSON Responses
                    </h4>
                    <Button
                      onClick={() => setShowRawJSON(!showRawJSON)}
                      variant="outline"
                      size="sm"
                      className="text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      <Code className="mr-2 h-4 w-4" />
                      {showRawJSON ? 'Hide' : 'Show'} Raw JSON
                    </Button>
                  </div>
                  {showRawJSON && (
                    <div className="space-y-4">
                      {Object.keys(rawAgentOutputs).length > 0 ? (
                        Object.entries(rawAgentOutputs).map(([tierKey, tierServices]: [string, any]) => (
                          <div key={tierKey} className="space-y-2">
                            <h5 className="text-md font-medium text-purple-300 capitalize mb-2">
                              {tierKey.replace('tier', 'Tier ').replace(/([0-9])/, '$1: ')}
                              {tierKey === 'tier0' && 'Coordination'}
                              {tierKey === 'tier1' && 'Base Analysis'}
                              {tierKey === 'tier2' && 'Cost Calculations'}
                              {tierKey === 'tier3' && 'Risk Assessment'}
                              {tierKey === 'tier4' && 'Budget Aggregation'}
                              {tierKey === 'tier5' && 'Financial Optimization'}
                              {tierKey === 'tier6' && 'Projection & Intelligence'}
                            </h5>
                            {Object.entries(tierServices).map(([serviceName, rawOutput]: [string, any]) => (
                              <div key={`${tierKey}-${serviceName}`} className="border border-gray-600 rounded-lg">
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer bg-gray-700 rounded-t-lg"
                                  onClick={() => toggleRawSection(`${tierKey}-${serviceName}`)}
                                >
                                  <div className="flex items-center space-x-2">
                                    {expandedRawSections[`${tierKey}-${serviceName}`] ? (
                                      <ChevronDown className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="text-white font-medium capitalize">
                                      {serviceName.replace(/([A-Z])/g, ' $1').trim()} Service
                                    </span>
                                  </div>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2));
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                {expandedRawSections[`${tierKey}-${serviceName}`] && (
                                  <div className="p-4 bg-gray-900 rounded-b-lg">
                                    <pre className="text-xs text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
                                      {typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-8">
                          No raw agent outputs available yet. Run the AI Master Budget Analysis to see individual service responses.
                        </div>
                      )}
                      
                      {/* Master Response */}
                      {budgetMasterRawResponse && (
                        <div className="border-t border-gray-600 pt-4 mt-6">
                          <div className="border border-gray-600 rounded-lg">
                            <div
                              className="flex items-center justify-between p-3 cursor-pointer bg-gray-700 rounded-t-lg"
                              onClick={() => toggleRawSection('masterResponse')}
                            >
                              <div className="flex items-center space-x-2">
                                {expandedRawSections.masterResponse ? (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-white font-medium">
                                  Master Budget Analysis Response
                                </span>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(budgetMasterRawResponse);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            {expandedRawSections.masterResponse && (
                              <div className="p-4 bg-gray-900 rounded-b-lg">
                                <pre className="text-xs text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
                                  {budgetMasterRawResponse}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Original Budget Table */}
          {activeTab === 'budgetTable' && (
            <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Move</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Tag Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Assign Fringes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Fringes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {budgetData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800 bg-gray-900">
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                          ⋮
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.code}
                        className="w-20 text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.name}
                        className="w-full text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      {item.tagType !== 'NONE' ? (
                        <CategoryBadge variant={getBadgeVariant(item.tagType)}>
                          {item.tagType}
                        </CategoryBadge>
                      ) : (
                        <span className="text-gray-500">NONE</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select className="text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option>Assign Fringes</option>
                        <option>DGA</option>
                        <option>SAG</option>
                        <option>IATSE</option>
                        <option>WGA</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.fringes}
                        onChange={(e) => updateFringes(item.id, Number(e.target.value))}
                        className="w-20 text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.estimate}
                        onChange={(e) => updateEstimate(item.id, Number(e.target.value))}
                        className="w-20 text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        min="0"
                      />
                    </td>
                  </tr>
                ))}
                
                <tr className="bg-gray-700">
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-medium text-white">Above-The-Line Production</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-medium text-white">0</td>
                  <td className="px-4 py-3 font-medium text-white">0</td>
                </tr>
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
