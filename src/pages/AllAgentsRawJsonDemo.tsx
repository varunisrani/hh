import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Play, Copy, ChevronDown, ChevronRight, Code, Brain, BarChart3, DollarSign, MapPin, Users, Calendar, Shield, Building2 } from "lucide-react";
import { useSelectedProject } from '@/hooks/useSelectedProject';

// Import all budget services
import { analyzeLaborCostWithAI } from '@/services/laborCostService';
import { analyzeEquipmentPricingWithAI } from '@/services/equipmentPricingService';
import { analyzeLocationCostWithAI } from '@/services/locationCostService';
import { analyzeInsuranceCalculatorWithAI } from '@/services/insuranceCalculatorService';
import { analyzeTaxIncentiveAnalyzerWithAI } from '@/services/taxIncentiveAnalyzerService';
import { analyzePostProductionEstimatorWithAI } from '@/services/postProductionEstimatorService';
import { analyzeCashFlowProjectorWithAI } from '@/services/cashFlowProjectorService';
import { analyzeBudgetAggregatorWithAI } from '@/services/budgetAggregatorService';

interface AgentResult {
  serviceName: string;
  icon: React.ReactNode;
  description: string;
  tier: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  rawJson?: any;
  error?: string;
  executionTime?: number;
  expanded?: boolean;
}

const AllAgentsRawJsonDemo: React.FC = () => {
  const { selectedProject } = useSelectedProject();
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [agents, setAgents] = useState<AgentResult[]>([
    {
      serviceName: 'Labor Cost Calculator',
      icon: <Users className="h-5 w-5 text-blue-400" />,
      description: 'Calculate all labor costs including cast, crew, and benefits',
      tier: 'Tier 2: Cost Calculations',
      status: 'pending'
    },
    {
      serviceName: 'Equipment Pricing Engine', 
      icon: <Building2 className="h-5 w-5 text-green-400" />,
      description: 'Price all equipment rentals and purchases',
      tier: 'Tier 2: Cost Calculations',
      status: 'pending'
    },
    {
      serviceName: 'Location Cost Estimator',
      icon: <MapPin className="h-5 w-5 text-purple-400" />,
      description: 'Estimate costs for all filming locations and permits',
      tier: 'Tier 2: Cost Calculations', 
      status: 'pending'
    },
    {
      serviceName: 'Insurance Calculator',
      icon: <Shield className="h-5 w-5 text-orange-400" />,
      description: 'Calculate insurance requirements and premiums',
      tier: 'Tier 2: Cost Calculations',
      status: 'pending'
    },
    {
      serviceName: 'Tax Incentive Analyzer',
      icon: <DollarSign className="h-5 w-5 text-yellow-400" />,
      description: 'Analyze tax incentives and rebates across jurisdictions',
      tier: 'Tier 2: Cost Calculations',
      status: 'pending'
    },
    {
      serviceName: 'Post-Production Estimator',
      icon: <BarChart3 className="h-5 w-5 text-red-400" />,
      description: 'Estimate all post-production costs and timelines',
      tier: 'Tier 2: Cost Calculations',
      status: 'pending'
    },
    {
      serviceName: 'Cash Flow Projector',
      icon: <Calendar className="h-5 w-5 text-indigo-400" />,
      description: 'Project cash flows and financing requirements',
      tier: 'Tier 2: Cost Calculations',
      status: 'pending'
    },
    {
      serviceName: 'Budget Aggregator',
      icon: <Brain className="h-5 w-5 text-pink-400" />,
      description: 'Aggregate all budget components into final analysis',
      tier: 'Tier 3: Aggregation',
      status: 'pending'
    }
  ]);

  const sampleInputData = {
    projectId: selectedProject?.id || 'test-project-001',
    scenes: [
      {
        sceneNumber: '1',
        location: 'Spaceship Interior - Discovery One',
        description: 'HAL 9000 computer room with rotating centrifuge set',
        castMembers: ['Dave Bowman', 'Frank Poole', 'HAL 9000 (voice)'],
        complexity: 'high',
        specialRequirements: ['Rotating set construction', 'Computer interface props', 'Voice recording studio'],
        estimatedDays: 5
      },
      {
        sceneNumber: '2',
        location: 'Moon Surface - Tycho Crater',
        description: 'Monolith excavation scene with astronauts in spacesuits',
        castMembers: ['Dr. Heywood Floyd', 'Excavation Team (6 actors)'],
        complexity: 'extreme',
        specialRequirements: ['Moon surface set', 'Custom spacesuit costumes', 'Monolith prop construction'],
        estimatedDays: 8
      }
    ],
    budget: {
      totalBudget: 10500000,
      aboveTheLine: 2500000,
      belowTheLine: 6000000,
      postProduction: 2000000
    },
    schedule: {
      prepWeeks: 12,
      shootWeeks: 18,
      postWeeks: 24
    }
  };

  const updateAgentStatus = (serviceName: string, updates: Partial<AgentResult>) => {
    setAgents(prev => prev.map(agent => 
      agent.serviceName === serviceName 
        ? { ...agent, ...updates }
        : agent
    ));
  };

  const runSingleAgent = async (agent: AgentResult) => {
    const startTime = Date.now();
    updateAgentStatus(agent.serviceName, { status: 'running' });

    try {
      const inputJson = JSON.stringify(sampleInputData);
      let result;

      console.log(`🚀 Running ${agent.serviceName}...`);

      switch (agent.serviceName) {
        case 'Labor Cost Calculator':
          result = await analyzeLaborCostWithAI(inputJson, sampleInputData.projectId);
          break;
        case 'Equipment Pricing Engine':
          result = await analyzeEquipmentPricingWithAI(inputJson, sampleInputData.projectId);
          break;
        case 'Location Cost Estimator':
          result = await analyzeLocationCostWithAI(inputJson, sampleInputData.projectId);
          break;
        case 'Insurance Calculator':
          result = await analyzeInsuranceCalculatorWithAI(inputJson, sampleInputData.projectId);
          break;
        case 'Tax Incentive Analyzer':
          result = await analyzeTaxIncentiveAnalyzerWithAI(inputJson, sampleInputData.projectId);
          break;
        case 'Post-Production Estimator':
          result = await analyzePostProductionEstimatorWithAI(inputJson, sampleInputData.projectId);
          break;
        case 'Cash Flow Projector':
          result = await analyzeCashFlowProjectorWithAI(inputJson, sampleInputData.projectId);
          break;
        case 'Budget Aggregator':
          result = await analyzeBudgetAggregatorWithAI(inputJson, sampleInputData.projectId);
          break;
        default:
          throw new Error(`Unknown service: ${agent.serviceName}`);
      }

      const executionTime = Date.now() - startTime;

      if (result.status === 'completed' && result.result) {
        console.log(`✅ ${agent.serviceName} completed successfully`);
        updateAgentStatus(agent.serviceName, {
          status: 'completed',
          rawJson: result.result,
          executionTime
        });
      } else if (result.status === 'error') {
        console.error(`❌ ${agent.serviceName} failed:`, result.error);
        updateAgentStatus(agent.serviceName, {
          status: 'error',
          error: result.error,
          executionTime
        });
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`💥 ${agent.serviceName} threw error:`, error);
      updateAgentStatus(agent.serviceName, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime
      });
    }
  };

  const runAllAgents = async () => {
    setIsRunningAll(true);
    
    console.log('🎬 ===== RUNNING ALL BUDGET AGENTS =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🔢 TOTAL AGENTS:', agents.length);
    console.log('🎬 =====================================');

    // Reset all agents
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'pending' as const,
      rawJson: undefined,
      error: undefined,
      executionTime: undefined,
      expanded: false
    })));

    try {
      // Run all agents in parallel to show true concurrency
      const agentPromises = agents.map(agent => runSingleAgent(agent));
      await Promise.allSettled(agentPromises);
      
      console.log('🎉 All agents completed execution');
    } catch (error) {
      console.error('💥 Error running agents:', error);
    } finally {
      setIsRunningAll(false);
    }
  };

  const toggleAgentExpansion = (serviceName: string) => {
    setAgents(prev => prev.map(agent => 
      agent.serviceName === serviceName 
        ? { ...agent, expanded: !agent.expanded }
        : agent
    ));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('📋 Raw JSON copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy to clipboard:', error);
    }
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />;
      case 'completed': return <div className="h-4 w-4 rounded-full bg-green-400"></div>;
      case 'error': return <div className="h-4 w-4 rounded-full bg-red-400"></div>;
      default: return <div className="h-4 w-4 rounded-full bg-gray-400"></div>;
    }
  };

  const completedAgents = agents.filter(a => a.status === 'completed');
  const errorAgents = agents.filter(a => a.status === 'error');
  const runningAgents = agents.filter(a => a.status === 'running');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              🤖 Master Budget Agent Raw JSON Responses
            </h1>
            <p className="text-gray-400 mt-2">
              Execute all budget analysis agents and view their complete raw JSON responses from Gemini AI
            </p>
          </div>
          <Button
            onClick={runAllAgents}
            disabled={isRunningAll}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
          >
            {isRunningAll ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Running All Agents...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Run All Budget Agents
              </>
            )}
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-400">{completedAgents.length}</div>
              <div className="text-gray-400">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-blue-400">{runningAgents.length}</div>
              <div className="text-gray-400">Running</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-red-400">{errorAgents.length}</div>
              <div className="text-gray-400">Errors</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-purple-400">{agents.length}</div>
              <div className="text-gray-400">Total Agents</div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Results */}
        <div className="space-y-4">
          {agents.map((agent, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {agent.icon}
                    <div>
                      <CardTitle className="text-xl text-white">{agent.serviceName}</CardTitle>
                      <p className="text-gray-400 text-sm">{agent.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {agent.tier}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {agent.executionTime && (
                      <Badge variant="outline" className="text-gray-300">
                        {agent.executionTime}ms
                      </Badge>
                    )}
                    {getStatusIcon(agent.status)}
                    <Badge className={
                      agent.status === 'completed' ? 'bg-green-600' :
                      agent.status === 'running' ? 'bg-blue-600' :
                      agent.status === 'error' ? 'bg-red-600' : 'bg-gray-600'
                    }>
                      {agent.status}
                    </Badge>
                    {(agent.rawJson || agent.error) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAgentExpansion(agent.serviceName)}
                        className="text-gray-400 hover:text-white"
                      >
                        {agent.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {agent.expanded && (agent.rawJson || agent.error) && (
                <CardContent className="pt-0">
                  {agent.error && (
                    <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-4">
                      <h4 className="text-red-300 font-medium mb-2">Error Details:</h4>
                      <p className="text-red-200 text-sm">{agent.error}</p>
                    </div>
                  )}
                  
                  {agent.rawJson && (
                    <div className="bg-gray-900 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between p-3 border-b border-gray-600">
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4 text-green-400" />
                          <h4 className="text-green-300 font-medium">Raw JSON Response from Gemini AI</h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(formatJson(agent.rawJson))}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <ScrollArea className="h-96">
                        <pre className="text-xs p-4 text-green-300 overflow-auto">
                          {formatJson(agent.rawJson)}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Sample Input Data */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Sample Input Data Sent to All Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <pre className="text-xs text-gray-300 bg-gray-900 p-4 rounded">
                {formatJson(sampleInputData)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllAgentsRawJsonDemo;