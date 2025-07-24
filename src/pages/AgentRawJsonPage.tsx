import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Play, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useSelectedProject } from "@/hooks/useSelectedProject";

// Import all budget services
import { geminiLaborCostService } from "@/services/laborCostService";
import { geminiEquipmentPricingService } from "@/services/equipmentPricingService";
import { geminiLocationCostService } from "@/services/locationCostService";
import { geminiInsuranceCalculatorService } from "@/services/insuranceCalculatorService";
import { geminiTaxIncentiveAnalyzerService } from "@/services/taxIncentiveAnalyzerService";
import { geminiPostProductionEstimatorService } from "@/services/postProductionEstimatorService";
import { geminiCashFlowProjectorService } from "@/services/cashFlowProjectorService";
import { geminiBudgetAggregatorService } from "@/services/budgetAggregatorService";

interface AgentResponse {
  serviceName: string;
  tier: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  rawJson?: any;
  error?: string;
  executionTime?: number;
  responseLength?: number;
}

const AgentRawJsonPage: React.FC = () => {
  const { selectedProject } = useSelectedProject();
  const [agents, setAgents] = useState<AgentResponse[]>([
    { serviceName: 'Labor Cost Calculator', tier: 'Tier 2: Cost Calculations', status: 'pending' },
    { serviceName: 'Equipment Pricing Engine', tier: 'Tier 2: Cost Calculations', status: 'pending' },
    { serviceName: 'Location Cost Estimator', tier: 'Tier 2: Cost Calculations', status: 'pending' },
    { serviceName: 'Insurance Calculator', tier: 'Tier 2: Cost Calculations', status: 'pending' },
    { serviceName: 'Tax Incentive Analyzer', tier: 'Tier 2: Cost Calculations', status: 'pending' },
    { serviceName: 'Post-Production Estimator', tier: 'Tier 2: Cost Calculations', status: 'pending' },
    { serviceName: 'Cash Flow Projector', tier: 'Tier 2: Cost Calculations', status: 'pending' },
    { serviceName: 'Budget Aggregator', tier: 'Tier 3: Aggregation', status: 'pending' },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [hideRawJson, setHideRawJson] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Sample input data for testing
  const sampleInputData = {
    projectId: selectedProject?.id || 'test-project-001',
    scenes: [
      {
        sceneNumber: '1',
        location: 'Spaceship Interior - Discovery One',
        description: 'HAL 9000 computer room with rotating centrifuge',
        castMembers: ['Dave Bowman', 'Frank Poole', 'HAL 9000'],
        complexity: 'high',
        specialRequirements: ['Rotating set construction', 'Computer interface props', 'Voice recording for HAL'],
        estimatedDays: 5
      },
      {
        sceneNumber: '2', 
        location: 'Moon Surface - Tycho Crater',
        description: 'Monolith excavation scene with spacesuit work',
        castMembers: ['Dr. Heywood Floyd', 'Excavation Team'],
        complexity: 'extreme',
        specialRequirements: ['Moon surface set', 'Spacesuit costumes', 'Monolith prop'],
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

  const updateAgentStatus = (serviceName: string, updates: Partial<AgentResponse>) => {
    setAgents(prev => prev.map(agent => 
      agent.serviceName === serviceName 
        ? { ...agent, ...updates }
        : agent
    ));
  };

  const runSingleAgent = async (agent: AgentResponse) => {
    const startTime = Date.now();
    updateAgentStatus(agent.serviceName, { status: 'running' });

    try {
      const inputJson = JSON.stringify(sampleInputData);
      let result;

      switch (agent.serviceName) {
        case 'Labor Cost Calculator':
          result = await geminiLaborCostService.analyzeLaborCostData(inputJson, sampleInputData.projectId);
          break;
        case 'Equipment Pricing Engine':
          result = await geminiEquipmentPricingService.analyzeEquipmentPricingData(inputJson, sampleInputData.projectId);
          break;
        case 'Location Cost Estimator':
          result = await geminiLocationCostService.analyzeLocationCostData(inputJson, sampleInputData.projectId);
          break;
        case 'Insurance Calculator':
          result = await geminiInsuranceCalculatorService.analyzeInsuranceCalculatorData(inputJson, sampleInputData.projectId);
          break;
        case 'Tax Incentive Analyzer':
          result = await geminiTaxIncentiveAnalyzerService.analyzeTaxIncentiveAnalyzerData(inputJson, sampleInputData.projectId);
          break;
        case 'Post-Production Estimator':
          result = await geminiPostProductionEstimatorService.analyzePostProductionEstimatorData(inputJson, sampleInputData.projectId);
          break;
        case 'Cash Flow Projector':
          result = await geminiCashFlowProjectorService.analyzeCashFlowProjectorData(inputJson, sampleInputData.projectId);
          break;
        case 'Budget Aggregator':
          result = await geminiBudgetAggregatorService.analyzeBudgetAggregatorData(inputJson, sampleInputData.projectId);
          break;
        default:
          throw new Error(`Unknown service: ${agent.serviceName}`);
      }

      const executionTime = Date.now() - startTime;
      const responseLength = result.rawResponse ? result.rawResponse.length : 0;

      if (result.result) {
        updateAgentStatus(agent.serviceName, {
          status: 'completed',
          rawJson: result.result,
          executionTime,
          responseLength
        });
      } else if (result.error) {
        updateAgentStatus(agent.serviceName, {
          status: 'error',
          error: result.error,
          executionTime
        });
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      updateAgentStatus(agent.serviceName, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime
      });
    }
  };

  const runAllAgents = async () => {
    setIsRunning(true);
    
    try {
      // Reset all agents to pending
      setAgents(prev => prev.map(agent => ({ 
        ...agent, 
        status: 'pending' as const,
        rawJson: undefined,
        error: undefined,
        executionTime: undefined,
        responseLength: undefined
      })));

      // Run all agents in parallel to show raw JSON responses
      const agentPromises = agents.map(agent => runSingleAgent(agent));
      await Promise.allSettled(agentPromises);

    } catch (error) {
      console.error('Error running agents:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const completedAgents = agents.filter(a => a.status === 'completed');
  const errorAgents = agents.filter(a => a.status === 'error');
  const runningAgents = agents.filter(a => a.status === 'running');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Raw JSON Responses</h1>
          <p className="text-gray-600 mt-2">
            Test all budget analysis agents and view their raw JSON responses from Gemini AI
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setHideRawJson(!hideRawJson)}
            className="flex items-center gap-2"
          >
            {hideRawJson ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {hideRawJson ? 'Show' : 'Hide'} Raw JSON
          </Button>
          <Button
            onClick={runAllAgents}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Running...' : 'Run All Agents'}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{completedAgents.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{runningAgents.length}</div>
            <div className="text-sm text-gray-600">Running</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{errorAgents.length}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{agents.length}</div>
            <div className="text-sm text-gray-600">Total Agents</div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Results */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="raw-json">Raw JSON Responses</TabsTrigger>
          <TabsTrigger value="sample-input">Sample Input Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{agent.serviceName}</CardTitle>
                      <p className="text-sm text-gray-600">{agent.tier}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent.executionTime && (
                        <Badge variant="outline">
                          {agent.executionTime}ms
                        </Badge>
                      )}
                      {agent.responseLength && (
                        <Badge variant="outline">
                          {(agent.responseLength / 1024).toFixed(1)}KB
                        </Badge>
                      )}
                      <Badge className={getStatusColor(agent.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(agent.status)}
                          {agent.status}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {(agent.error || (agent.rawJson && !hideRawJson)) && (
                  <CardContent className="pt-0">
                    {agent.error && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-red-800 text-sm">{agent.error}</p>
                      </div>
                    )}
                    {agent.rawJson && !hideRawJson && (
                      <div className="bg-gray-50 border rounded p-3">
                        <ScrollArea className="h-32">
                          <pre className="text-xs">
                            {formatJson(agent.rawJson).substring(0, 500)}
                            {formatJson(agent.rawJson).length > 500 && '...'}
                          </pre>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="raw-json" className="space-y-4">
          <div className="space-y-6">
            {agents.filter(a => a.rawJson).map((agent, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{agent.serviceName} - Raw JSON Response</span>
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full">
                    <pre className="text-xs bg-gray-50 p-4 rounded border overflow-auto">
                      {formatJson(agent.rawJson)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sample-input">
          <Card>
            <CardHeader>
              <CardTitle>Sample Input Data Sent to All Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full">
                <pre className="text-xs bg-gray-50 p-4 rounded border">
                  {formatJson(sampleInputData)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentRawJsonPage;