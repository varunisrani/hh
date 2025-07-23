import { GoogleGenAI } from "@google/genai";

// Optimization & Scenario Output Types
export interface OptimizationScenarioOutput {
  optimizationScenarioOutput: {
    projectId: string;
    processedTimestamp: string;
    processingTime: number;
    confidence: number;
    systemStatus: {
      constraintProcessingStatus: "COMPLETE" | "PARTIAL" | "FAILED";
      optimizationCalculationStatus: "COMPLETE" | "PARTIAL" | "FAILED";
      scenarioGenerationStatus: "COMPLETE" | "PARTIAL" | "FAILED";
      validationStatus: "PASSED" | "WARNINGS" | "FAILED";
    };
    optimizationParameters: {
      primaryObjective: "COST_OPTIMIZATION" | "TIME_OPTIMIZATION" | "QUALITY_OPTIMIZATION" | "RISK_MINIMIZATION";
      secondaryObjectives: string[];
      weightingFactors: {
        costWeight: number;
        timeWeight: number;
        qualityWeight: number;
        riskWeight: number;
      };
      constraintPriorities: {
        unionCompliance: "MANDATORY" | "HIGH" | "MEDIUM" | "LOW";
        budgetCompliance: "MANDATORY" | "HIGH" | "MEDIUM" | "LOW";
        castAvailability: "MANDATORY" | "HIGH" | "MEDIUM" | "LOW";
        locationAccess: "MANDATORY" | "HIGH" | "MEDIUM" | "LOW";
        equipmentAvailability: "MANDATORY" | "HIGH" | "MEDIUM" | "LOW";
      };
    };
    optimizedScheduleScenarios: Array<{
      scenarioId: string;
      scenarioName: string;
      description: string;
      optimizationScore: number;
      feasibilityRating: number;
      riskAssessment: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      schedulingStrategy: {
        castGroupingStrategy: string;
        locationGroupingStrategy: string;
        equipmentUtilizationStrategy: string;
        bufferTimeStrategy: string;
      };
      scheduleBreakdown: {
        totalShootDays: number;
        prepDays: number;
        principalPhotographyDays: number;
        wrapDays: number;
        contingencyDays: number;
        estimatedCompletionDate: string;
      };
      resourceUtilization: {
        castUtilizationRate: number;
        crewUtilizationRate: number;
        equipmentUtilizationRate: number;
        locationEfficiency: number;
      };
      costProjections: {
        totalBudgetProjection: number;
        castCosts: number;
        crewCosts: number;
        equipmentCosts: number;
        locationCosts: number;
        contingencyRecommendation: number;
        potentialSavings: number;
      };
      constraintCompliance: {
        unionViolations: number;
        budgetOverages: number;
        castConflicts: number;
        locationConflicts: number;
        equipmentConflicts: number;
        complianceScore: number;
      };
      riskFactors: Array<{
        riskType: "WEATHER" | "CAST" | "LOCATION" | "EQUIPMENT" | "BUDGET" | "SCHEDULE";
        description: string;
        probability: number;
        impact: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        mitigationStrategy: string;
      }>;
      qualityMetrics: {
        narrativeContinuity: number;
        productionValue: number;
        crewEfficiency: number;
        postProductionComplexity: number;
        overallQualityScore: number;
      };
    }>;
    scenarioComparison: {
      recommendedScenario: string;
      comparisonMatrix: Array<{
        scenarioId: string;
        costRanking: number;
        timeRanking: number;
        qualityRanking: number;
        riskRanking: number;
        overallRanking: number;
      }>;
      tradeoffAnalysis: Array<{
        factor: string;
        bestScenario: string;
        worstScenario: string;
        impact: string;
        recommendation: string;
      }>;
    };
    contingencyPlanning: {
      weatherContingencies: Array<{
        affectedScenes: string[];
        alternativeScheduling: string;
        budgetImpact: number;
        timeImpact: number;
      }>;
      castContingencies: Array<{
        actor: string;
        replacementStrategy: string;
        scheduleImpact: string;
        budgetImpact: number;
      }>;
      equipmentContingencies: Array<{
        equipment: string;
        backupPlan: string;
        vendorAlternatives: string[];
        costDifference: number;
      }>;
      locationContingencies: Array<{
        location: string;
        alternativeLocation: string;
        modificationRequired: string;
        impactAssessment: string;
      }>;
    };
    optimizationInsights: {
      keyOptimizationOpportunities: string[];
      potentialBottlenecks: string[];
      efficiencyRecommendations: string[];
      costSavingOpportunities: string[];
      qualityEnhancementSuggestions: string[];
    };
    implementationGuidance: {
      phaseOneActions: string[];
      phaseTwoActions: string[];
      criticalPathItems: string[];
      successMetrics: string[];
      monitoringRecommendations: string[];
    };
    nextSteps: string[];
  };
}

// System Prompt for Optimization & Scenario
const OPTIMIZATION_SCENARIO_SYSTEM_PROMPT = `
OPTIMIZATION & SCENARIO AGENT SYSTEM PROMPT
===========================================

You are the Optimization & Scenario Agent in a multi-agent AI film scheduling system. Your responsibility is to create multiple optimized production schedule scenarios by processing constraints and resource data, then generating feasible schedule alternatives that balance cost, time, quality, and risk factors while ensuring maximum production efficiency.

## Core Responsibilities

1. **Constraint Processing & Integration**
   - Process hard and soft constraints from Compliance & Constraints Agent
   - Integrate resource availability data from Resource Logistics Agent
   - Validate constraint compatibility and identify potential conflicts
   - Prioritize constraints based on production requirements and flexibility

2. **Multi-Objective Optimization**
   - Generate schedule scenarios optimized for different primary objectives (cost, time, quality, risk)
   - Balance competing priorities using weighted optimization algorithms
   - Create trade-off analyses between different optimization approaches
   - Ensure all scenarios maintain basic feasibility and compliance standards

3. **Scenario Generation & Analysis**
   - Create multiple distinct scheduling scenarios with different strategic approaches
   - Analyze resource utilization efficiency across all scenarios
   - Calculate cost projections and budget impact for each scenario
   - Assess risk levels and develop mitigation strategies for each approach

4. **Quality Assessment & Validation**
   - Evaluate narrative continuity and production value for each scenario
   - Assess crew efficiency and equipment utilization rates
   - Validate schedule feasibility against real-world production constraints
   - Score scenarios based on multiple quality and efficiency metrics

## Optimization Methodologies

### Cost Optimization Strategy
1. **Resource Efficiency**: Minimize idle time for cast, crew, and equipment
2. **Location Grouping**: Cluster scenes by location to reduce company moves
3. **Cast Continuity**: Group scenes to minimize actor holding days
4. **Equipment Utilization**: Optimize rental periods and multi-purpose usage
5. **Overtime Minimization**: Structure days to avoid meal penalties and overtime

### Time Optimization Strategy
1. **Parallel Processing**: Schedule simultaneous prep work and secondary units
2. **Critical Path Analysis**: Identify and optimize the longest dependency chains
3. **Buffer Minimization**: Reduce contingency time while maintaining quality
4. **Efficient Transitions**: Minimize setup and strike times between scenes
5. **Fast-Track Scheduling**: Overlap traditionally sequential production phases

### Quality Optimization Strategy
1. **Narrative Continuity**: Schedule scenes to support performance and story flow
2. **Technical Excellence**: Allow adequate time for complex technical sequences
3. **Crew Rest**: Ensure adequate turnaround times for optimal crew performance
4. **Equipment Quality**: Prioritize best available equipment over cost savings
5. **Post-Production**: Schedule to optimize downstream editing and VFX workflows

### Risk Minimization Strategy
1. **Contingency Planning**: Build robust backup plans for high-risk elements
2. **Weather Protection**: Schedule weather-dependent scenes during optimal periods
3. **Cast Protection**: Minimize actor travel and physical demands
4. **Equipment Redundancy**: Ensure backup equipment for critical components
5. **Budget Buffers**: Maintain adequate financial contingencies for complications

## Scenario Generation Protocol

### Primary Scenario Types
1. **Aggressive Cost-Optimized**: Minimum budget with acceptable quality and risk
2. **Balanced Optimization**: Equal weighting of cost, time, quality, and risk factors
3. **Quality-Premium**: Maximum production value with cost and time flexibility
4. **Fast-Track**: Minimum schedule duration with cost and resource flexibility
5. **Risk-Averse**: Maximum contingency planning with conservative resource allocation

### Scenario Validation Requirements
- All scenarios must comply with mandatory union regulations
- Cast availability must be confirmed for all assigned shooting days
- Equipment booking must be verified with vendor confirmation
- Location access must be secured with proper permits and agreements
- Budget allocations must not exceed approved department maximums

### Comparative Analysis Framework
- Rank scenarios across cost, time, quality, and risk dimensions
- Identify trade-offs between competing optimization objectives
- Highlight scenarios best suited for different production priorities
- Provide clear recommendations based on production constraints and goals

## Advanced Optimization Techniques

### Constraint Satisfaction Problem (CSP) Modeling
- Model scheduling as multi-dimensional constraint satisfaction problem
- Apply backtracking algorithms for conflict resolution
- Use constraint propagation to reduce solution space efficiently
- Implement heuristic search strategies for optimal solution discovery

### Resource Allocation Optimization
- Apply linear programming techniques for resource distribution
- Optimize cast schedules using Day Out of Days (DOOD) algorithms
- Balance crew workloads across departments and time periods
- Minimize equipment rental costs while ensuring availability

### Monte Carlo Risk Analysis
- Run probabilistic simulations for schedule reliability assessment
- Model uncertainty in weather, equipment failure, and talent availability
- Calculate confidence intervals for completion dates and budget projections
- Identify most likely failure points and develop mitigation strategies

### Machine Learning Integration
- Apply pattern recognition to historical production data
- Predict potential conflicts based on similar project characteristics
- Optimize schedules using reinforcement learning from production outcomes
- Continuously improve recommendations based on real-world results

## Risk Assessment & Mitigation

### Weather Risk Management
- Analyze historical weather patterns for location-specific scheduling
- Develop alternative indoor locations for weather-dependent exteriors
- Calculate weather delay probabilities and budget impact
- Create flexible schedule templates for rapid weather-related adjustments

### Cast & Crew Risk Factors
- Assess actor availability conflicts and contract restrictions
- Identify key personnel dependencies and develop backup plans
- Evaluate crew fatigue factors and schedule sustainable work patterns
- Plan for illness, injury, or other personnel-related disruptions

### Equipment & Technical Risks
- Identify single points of failure in technical systems
- Develop equipment redundancy plans for critical components
- Assess vendor reliability and create backup supplier relationships
- Plan for technology failures and rapid replacement scenarios

### Budget & Financial Risks
- Model cost overrun scenarios and identify trigger points
- Develop cost-cutting contingency plans for budget pressures
- Assess cash flow requirements and payment timing optimization
- Create financial buffers for unexpected expenses and opportunities

## Quality Metrics & Performance Indicators

### Production Efficiency Metrics
- Cast utilization rate: Target >85%
- Crew efficiency rating: Target >90%
- Equipment utilization: Target >75%
- Location efficiency: Target >80%
- Schedule adherence: Target >95%

### Financial Performance Indicators
- Budget variance: Target <5%
- Cost per shooting day: Benchmark against industry standards
- Resource cost optimization: Target 10-15% savings vs. baseline
- Contingency usage: Target <50% of allocated emergency funds

### Quality Assurance Standards
- Narrative continuity score: Target >85%
- Technical quality rating: Target >90%
- Crew satisfaction index: Target >80%
- Post-production efficiency: Target <120% of baseline schedule

## MANDATORY OUTPUT FORMAT REQUIREMENTS

**CRITICAL: Every response MUST be a complete, valid JSON object following this exact structure:**

\`\`\`json
{
  "optimizationScenarioOutput": {
    "projectId": "string",
    "processedTimestamp": "ISO_timestamp",
    "processingTime": "number_in_seconds",
    "confidence": "decimal_0_to_1",
    "systemStatus": {
      "constraintProcessingStatus": "COMPLETE|PARTIAL|FAILED",
      "optimizationCalculationStatus": "COMPLETE|PARTIAL|FAILED",
      "scenarioGenerationStatus": "COMPLETE|PARTIAL|FAILED",
      "validationStatus": "PASSED|WARNINGS|FAILED"
    },
    "optimizationParameters": {
      "primaryObjective": "COST_OPTIMIZATION|TIME_OPTIMIZATION|QUALITY_OPTIMIZATION|RISK_MINIMIZATION",
      "secondaryObjectives": ["array_of_secondary_objectives"],
      "weightingFactors": {
        "costWeight": "decimal_0_to_1",
        "timeWeight": "decimal_0_to_1", 
        "qualityWeight": "decimal_0_to_1",
        "riskWeight": "decimal_0_to_1"
      },
      "constraintPriorities": {
        "unionCompliance": "MANDATORY|HIGH|MEDIUM|LOW",
        "budgetCompliance": "MANDATORY|HIGH|MEDIUM|LOW",
        "castAvailability": "MANDATORY|HIGH|MEDIUM|LOW",
        "locationAccess": "MANDATORY|HIGH|MEDIUM|LOW",
        "equipmentAvailability": "MANDATORY|HIGH|MEDIUM|LOW"
      }
    },
    "optimizedScheduleScenarios": [
      {
        "scenarioId": "string",
        "scenarioName": "string",
        "description": "string",
        "optimizationScore": "decimal_0_to_100",
        "feasibilityRating": "decimal_0_to_100",
        "riskAssessment": "LOW|MEDIUM|HIGH|CRITICAL",
        "schedulingStrategy": {
          "castGroupingStrategy": "string",
          "locationGroupingStrategy": "string",
          "equipmentUtilizationStrategy": "string",
          "bufferTimeStrategy": "string"
        },
        "scheduleBreakdown": {
          "totalShootDays": "number",
          "prepDays": "number",
          "principalPhotographyDays": "number",
          "wrapDays": "number",
          "contingencyDays": "number",
          "estimatedCompletionDate": "YYYY-MM-DD"
        },
        "resourceUtilization": {
          "castUtilizationRate": "decimal_percentage",
          "crewUtilizationRate": "decimal_percentage",
          "equipmentUtilizationRate": "decimal_percentage",
          "locationEfficiency": "decimal_percentage"
        },
        "costProjections": {
          "totalBudgetProjection": "number",
          "castCosts": "number",
          "crewCosts": "number",
          "equipmentCosts": "number",
          "locationCosts": "number",
          "contingencyRecommendation": "number",
          "potentialSavings": "number"
        },
        "constraintCompliance": {
          "unionViolations": "number",
          "budgetOverages": "number",
          "castConflicts": "number",
          "locationConflicts": "number",
          "equipmentConflicts": "number",
          "complianceScore": "decimal_0_to_100"
        },
        "riskFactors": [
          {
            "riskType": "WEATHER|CAST|LOCATION|EQUIPMENT|BUDGET|SCHEDULE",
            "description": "string",
            "probability": "decimal_0_to_1",
            "impact": "LOW|MEDIUM|HIGH|CRITICAL",
            "mitigationStrategy": "string"
          }
        ],
        "qualityMetrics": {
          "narrativeContinuity": "decimal_0_to_100",
          "productionValue": "decimal_0_to_100",
          "crewEfficiency": "decimal_0_to_100",
          "postProductionComplexity": "decimal_0_to_100",
          "overallQualityScore": "decimal_0_to_100"
        }
      }
    ],
    "scenarioComparison": {
      "recommendedScenario": "string_scenario_id",
      "comparisonMatrix": [
        {
          "scenarioId": "string",
          "costRanking": "number_1_to_n",
          "timeRanking": "number_1_to_n",
          "qualityRanking": "number_1_to_n",
          "riskRanking": "number_1_to_n",
          "overallRanking": "number_1_to_n"
        }
      ],
      "tradeoffAnalysis": [
        {
          "factor": "string",
          "bestScenario": "string_scenario_id",
          "worstScenario": "string_scenario_id", 
          "impact": "string",
          "recommendation": "string"
        }
      ]
    },
    "contingencyPlanning": {
      "weatherContingencies": [
        {
          "affectedScenes": ["array_of_scene_strings"],
          "alternativeScheduling": "string",
          "budgetImpact": "number",
          "timeImpact": "number_in_days"
        }
      ],
      "castContingencies": [
        {
          "actor": "string",
          "replacementStrategy": "string",
          "scheduleImpact": "string", 
          "budgetImpact": "number"
        }
      ],
      "equipmentContingencies": [
        {
          "equipment": "string",
          "backupPlan": "string",
          "vendorAlternatives": ["array_of_vendor_strings"],
          "costDifference": "number"
        }
      ],
      "locationContingencies": [
        {
          "location": "string",
          "alternativeLocation": "string",
          "modificationRequired": "string",
          "impactAssessment": "string"
        }
      ]
    },
    "optimizationInsights": {
      "keyOptimizationOpportunities": ["array_of_opportunity_strings"],
      "potentialBottlenecks": ["array_of_bottleneck_strings"], 
      "efficiencyRecommendations": ["array_of_recommendation_strings"],
      "costSavingOpportunities": ["array_of_savings_strings"],
      "qualityEnhancementSuggestions": ["array_of_enhancement_strings"]
    },
    "implementationGuidance": {
      "phaseOneActions": ["array_of_action_strings"],
      "phaseTwoActions": ["array_of_action_strings"],
      "criticalPathItems": ["array_of_critical_strings"],
      "successMetrics": ["array_of_metric_strings"],
      "monitoringRecommendations": ["array_of_monitoring_strings"]
    },
    "nextSteps": ["array_of_next_step_strings"]
  }
}
\`\`\`

**NEVER provide text responses, explanations, or incomplete JSON. Always return the complete structured JSON object with all required fields populated.**

## Implementation Success Criteria

### Optimization Effectiveness
- Generate 3-5 distinct, viable schedule scenarios
- Achieve measurable improvements in at least 2 of 4 optimization dimensions
- Maintain 100% compliance with mandatory constraints
- Provide clear trade-off analysis between scenarios
- Deliver actionable implementation guidance

### Risk Mitigation Coverage
- Address all high-probability risk factors with specific mitigation strategies
- Develop contingency plans for weather, cast, equipment, and location risks
- Calculate realistic probability and impact assessments
- Provide cost-effective backup plans for critical dependencies

### Quality Assurance Standards
- Ensure all scenarios maintain minimum acceptable quality thresholds
- Balance optimization gains against production value preservation
- Validate technical feasibility of all proposed scheduling approaches
- Confirm resource availability for all scenario recommendations

Your optimization and scenario generation capabilities are crucial for production success. Ensure comprehensive analysis, realistic projections, and practical implementation guidance that enables informed decision-making and successful production execution.
`;

class GeminiOptimizationService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI"
    });
  }

  async analyzeOptimizationData(jsonInput: string, projectId: string): Promise<OptimizationScenarioOutput> {
    console.log('');
    console.log('⚡ ===== OPTIMIZATION & SCENARIO ANALYSIS STARTING =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🆔 PROJECT_ID:', projectId);
    console.log('📊 METHOD: analyzeOptimizationData()');
    console.log('⚡ ======================================================');
    console.log('');
    
    try {
      console.log('🚀 STEP 1: INPUT VALIDATION & PROCESSING');
      console.log('📝 INPUT: JSON input length:', jsonInput.length, 'characters');
      console.log('🔍 INPUT: JSON input type:', typeof jsonInput);
      console.log('🔍 INPUT: Project ID type:', typeof projectId);
      console.log('🔍 INPUT: Project ID value:', projectId);
      
      // Log detailed input analysis
      console.log('📊 INPUT ANALYSIS:');
      const lines = jsonInput.split('\n').length;
      const characters = jsonInput.length;
      console.log('  - Total lines:', lines);
      console.log('  - Total characters:', characters);
      
      console.log('📋 INPUT PREVIEW (first 300 characters):');
      console.log('┌─────────────────────────────────────────────────────────────┐');
      console.log('│ ' + jsonInput.substring(0, 300).replace(/\n/g, '\n│ ') + '...');
      console.log('└─────────────────────────────────────────────────────────────┘');
      
      console.log('🔍 VALIDATION: Checking minimum length...');
      if (jsonInput.length < 10) {
        console.error('❌ VALIDATION FAILED: JSON input too short:', jsonInput.length, 'characters');
        throw new Error('JSON input is too short to analyze');
      }
      console.log('✅ VALIDATION: JSON input length acceptable');

      // Validate JSON input
      let parsedInput;
      try {
        console.log('🔍 VALIDATION: Attempting to parse JSON...');
        parsedInput = JSON.parse(jsonInput);
        console.log('✅ VALIDATION: JSON parsing successful');
        console.log('📊 PARSED JSON TYPE:', typeof parsedInput);
        console.log('📊 PARSED JSON KEYS:', Object.keys(parsedInput));
      } catch (error) {
        console.error('❌ VALIDATION FAILED: Invalid JSON input provided');
        console.error('🔍 JSON Parse Error:', error.message);
        console.error('📋 JSON Input Preview:', jsonInput.substring(0, 200));
        throw new Error('Invalid JSON input provided');
      }

      console.log('');
      console.log('🚀 STEP 2: PROMPT PREPARATION');
      console.log('📝 PROMPT: Building user prompt...');
      
      const prompt = `
Please analyze this optimization and scenario data and provide a complete optimization scenario response following the required JSON format:

OPTIMIZATION & SCENARIO DATA:
${jsonInput}

PROJECT ID: ${projectId}

Remember to return ONLY the complete JSON object with all required fields populated according to the specified schema.
`;

      console.log('📊 PROMPT STATS:');
      console.log('  - User prompt length:', prompt.length, 'characters');
      console.log('  - System prompt length:', OPTIMIZATION_SCENARIO_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Total prompt length:', prompt.length + OPTIMIZATION_SCENARIO_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Estimated tokens (~4 chars/token):', Math.ceil((prompt.length + OPTIMIZATION_SCENARIO_SYSTEM_PROMPT.length) / 4));
      
      console.log('📤 PROMPT DETAILS:');
      console.log('┌─ SYSTEM INSTRUCTION (' + OPTIMIZATION_SCENARIO_SYSTEM_PROMPT.length + ' characters) ─┐');
      console.log('│ ' + OPTIMIZATION_SCENARIO_SYSTEM_PROMPT.substring(0, 200).replace(/\n/g, '\n│ ') + '...');
      console.log('└────────────────────────────────────────────────────────────────┘');
      
      console.log('┌─ USER PROMPT (' + prompt.length + ' characters) ─┐');
      console.log('│ ' + prompt.substring(0, 300).replace(/\n/g, '\n│ ') + '...');
      console.log('└────────────────────────────────────────────────────────────────┘');

      console.log('');
      console.log('🚀 STEP 3: API REQUEST PREPARATION');
      
      const requestConfig = {
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 32768,
          systemInstruction: OPTIMIZATION_SCENARIO_SYSTEM_PROMPT
        }
      };
      
      console.log('⚙️ REQUEST CONFIG:');
      console.log('  - Model:', requestConfig.model);
      console.log('  - Temperature:', requestConfig.config.temperature);
      console.log('  - TopP:', requestConfig.config.topP);
      console.log('  - TopK:', requestConfig.config.topK);
      console.log('  - Max Output Tokens:', requestConfig.config.maxOutputTokens);
      console.log('  - System Instruction length:', requestConfig.config.systemInstruction.length, 'characters');
      console.log('  - Contents length:', requestConfig.contents.length, 'characters');
      
      console.log('');
      console.log('🌐 MAKING API CALL TO GEMINI...');
      console.log('📡 Endpoint: ai.models.generateContent()');
      console.log('⏰ Request timestamp:', new Date().toISOString());
      
      const startTime = performance.now();

      const response = await this.ai.models.generateContent(requestConfig);

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      console.log('');
      console.log('🚀 STEP 4: API RESPONSE RECEIVED');
      console.log('⏰ Response timestamp:', new Date().toISOString());
      console.log('⚡ Response time:', responseTime, 'ms');
      console.log('📊 Response object type:', typeof response);
      
      console.log('🔍 RESPONSE STRUCTURE ANALYSIS:');
      console.log('  - Response keys:', Object.keys(response));
      console.log('  - Response prototype:', Object.getPrototypeOf(response)?.constructor?.name || 'Unknown');
      
      if (response.usageMetadata) {
        console.log('📈 TOKEN USAGE:');
        console.log('  - Prompt tokens:', response.usageMetadata.promptTokenCount || 'N/A');
        console.log('  - Completion tokens:', response.usageMetadata.candidatesTokenCount || 'N/A');
        console.log('  - Total tokens:', response.usageMetadata.totalTokenCount || 'N/A');
        console.log('  - Cached tokens:', response.usageMetadata.cachedContentTokenCount || 'N/A');
      } else {
        console.log('⚠️ No usage metadata available in response');
      }

      console.log('');
      console.log('📝 EXTRACTING RESPONSE TEXT...');
      const responseText = response.text;
      console.log('✅ Response text extracted successfully');
      console.log('📊 Response text type:', typeof responseText);
      console.log('📏 Response text length:', responseText ? responseText.length : 0, 'characters');
      
      if (!responseText) {
        console.error('❌ CRITICAL ERROR: No response text received from Gemini API');
        throw new Error('No response text received from Gemini API');
      }

      console.log('');
      console.log('📋 RAW RESPONSE PREVIEW:');
      console.log('┌─ FIRST 500 CHARACTERS ─┐');
      console.log('│ ' + (responseText?.substring(0, 500) || 'NO RESPONSE TEXT').replace(/\n/g, '\n│ ') + '...');
      console.log('└────────────────────────────┘');
      
      console.log('┌─ LAST 300 CHARACTERS ─┐');
      const lastChars = responseText ? responseText.substring(responseText.length - 300) : 'NO RESPONSE TEXT';
      console.log('│ ...' + lastChars.replace(/\n/g, '\n│ '));
      console.log('└───────────────────────────┘');
      
      console.log('');
      console.log('🔍 FULL RAW RESPONSE (for debugging):');
      console.log('================= RAW JSON RESULT FROM GEMINI =================');
      console.log(responseText);
      console.log('=================== END RAW JSON RESULT ===================');
      
      console.log('');
      console.log('🚀 STEP 5: RESPONSE PARSING & VALIDATION');
      console.log('🔄 Calling parseOptimizationResponse()...');
      
      const parsedResponse = this.parseOptimizationResponse(responseText);

      if (!parsedResponse) {
        console.error('');
        console.error('💥 ========== PARSE FAILURE ==========');
        console.error('❌ CRITICAL ERROR: Failed to parse optimization response from Gemini API');
        console.error('🔍 Parsed response is null/undefined');
        console.error('📊 This indicates JSON parsing or validation failed');
        console.error('💥 ===================================');
        console.error('');
        throw new Error('Failed to parse optimization scenario response');
      }
      
      console.log('✅ PARSE SUCCESS: Valid optimization response received');
      console.log('');
      console.log('🚀 STEP 6: FINAL VALIDATION & COMPLETION');
      
      console.log('📊 FINAL ANALYSIS SUMMARY:');
      try {
        const summary = parsedResponse.optimizationScenarioOutput;
        console.log('  - Project ID:', summary?.projectId || 'N/A');
        console.log('  - Processing time:', summary?.processingTime || 'N/A', 'seconds');
        console.log('  - Confidence score:', summary?.confidence || 'N/A');
        console.log('  - Optimization scenarios count:', summary?.optimizedScheduleScenarios?.length || 'N/A');
        console.log('  - Recommended scenario:', summary?.scenarioComparison?.recommendedScenario || 'N/A');
        console.log('  - Contingency plans:', Object.keys(summary?.contingencyPlanning || {}).length || 'N/A');
        console.log('  - Next steps count:', summary?.nextSteps?.length || 'N/A');
      } catch (summaryError) {
        console.log('  - Summary extraction failed:', summaryError.message);
        console.log('  - But analysis data is still complete');
      }

      console.log('');
      console.log('🎉 ========== OPTIMIZATION ANALYSIS COMPLETE ==========');
      console.log('✅ Optimization scenario analysis completed successfully!');
      console.log('📁 Parsed response ready for use in application');
      console.log('🎯 Analysis ready for display in UI');
      console.log('🎉 =====================================================');
      console.log('');
      
      return parsedResponse;

    } catch (error) {
      console.log('');
      console.log('💥 ========== ERROR OCCURRED ==========');
      console.error('❌ Error in optimization scenario analysis:', error);
      console.error('🔍 Error type:', error?.name || 'Unknown');
      console.error('🔍 Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('💥 ====================================');
      console.log('');
      throw error;
    }
  }

  private parseOptimizationResponse(responseText: string): OptimizationScenarioOutput | null {
    console.log('');
    console.log('🔍 ===== OPTIMIZATION RESPONSE PARSING & VALIDATION =====');
    console.log('📅 Parse timestamp:', new Date().toISOString());
    console.log('🔍 ========================================================');
    console.log('');
    
    try {
      console.log('🚀 PARSE STEP 1: INPUT ANALYSIS');
      console.log('📏 Response text length:', responseText?.length || 0, 'characters');
      console.log('📊 Response text type:', typeof responseText);
      console.log('🔍 Is null/undefined?', responseText == null ? '❌ YES' : '✅ NO');
      console.log('🔍 Is empty string?', responseText === '' ? '❌ YES' : '✅ NO');
      
      if (!responseText) {
        console.error('❌ PARSE FAILED: Response text is null, undefined, or empty');
        return null;
      }
      
      console.log('');
      console.log('📋 RESPONSE CONTENT PREVIEW:');
      console.log('┌─ FIRST 500 CHARACTERS ─┐');
      console.log('│ ' + responseText.substring(0, 500).replace(/\n/g, '\n│ '));
      console.log('└────────────────────────────┘');
      
      console.log('┌─ LAST 500 CHARACTERS ─┐');
      console.log('│ ' + responseText.substring(responseText.length - 500).replace(/\n/g, '\n│ '));
      console.log('└───────────────────────────┘');
      
      console.log('');
      console.log('🚀 PARSE STEP 2: JSON EXTRACTION & CLEANING');
      
      // Clean response text
      let cleanedResponse = responseText;
      console.log('📝 Original response length:', cleanedResponse.length, 'characters');
      
      console.log('🧹 Removing markdown code blocks...');
      const beforeMarkdown = cleanedResponse.length;
      cleanedResponse = cleanedResponse
        .replace(/```json\s*\n?/g, '')
        .replace(/```\s*\n?/g, '')
        .trim();
      console.log('📊 After markdown removal:', cleanedResponse.length, 'characters', `(${beforeMarkdown - cleanedResponse.length} removed)`);

      console.log('🔍 Looking for JSON boundaries...');
      // Extract JSON if embedded in thinking mode response
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
      
      console.log('📍 JSON start position:', jsonStart);
      console.log('📍 JSON end position:', jsonEnd);
      console.log('📏 JSON boundary span:', jsonEnd - jsonStart, 'characters');

      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const beforeExtraction = cleanedResponse.length;
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
        console.log('✅ JSON extracted successfully');
        console.log('📊 Extracted JSON length:', cleanedResponse.length, 'characters', `(${beforeExtraction - cleanedResponse.length} discarded)`);
        
        console.log('📋 Extracted JSON preview:');
        console.log('┌─ FIRST 200 CHARACTERS ─┐');
        console.log('│ ' + cleanedResponse.substring(0, 200).replace(/\n/g, '\n│ ') + '...');
        console.log('└────────────────────────────┘');
      } else {
        console.log('⚠️ No clear JSON boundaries found, using full cleaned response');
      }

      console.log('');
      console.log('🚀 PARSE STEP 3: JSON PARSING');
      console.log('📊 Final cleaned response length:', cleanedResponse.length, 'characters');
      console.log('🔄 Attempting JSON.parse()...');

      const parsed = JSON.parse(cleanedResponse);
      console.log('✅ JSON parsing successful!');
      
      console.log('');
      console.log('🚀 PARSE STEP 4: PARSED OBJECT ANALYSIS');
      console.log('📊 Parsed object type:', typeof parsed);
      console.log('🔍 Parsed object keys:', Object.keys(parsed));
      
      console.log('📋 PARSED JSON STRUCTURE (preview):');
      try {
        const jsonPreview = JSON.stringify(parsed, null, 2);
        console.log('┌─ PARSED JSON (first 1000 chars) ─┐');
        console.log('│ ' + jsonPreview.substring(0, 1000).replace(/\n/g, '\n│ ') + '...');
        console.log('└──────────────────────────────────────┘');
      } catch (previewError) {
        console.log('⚠️ Could not create JSON preview:', previewError.message);
        console.log('📋 Raw parsed object:', parsed);
      }
      
      console.log('');
      console.log('🚀 PARSE STEP 5: STRUCTURE VALIDATION');
      console.log('🔍 Validating against OptimizationScenarioOutput format...');
      
      console.log('🔎 Checking for optimizationScenarioOutput property...');
      const hasOptimizationOutput = parsed.optimizationScenarioOutput !== undefined;
      console.log('  - optimizationScenarioOutput exists:', hasOptimizationOutput ? '✅ YES' : '❌ NO');
      
      if (!hasOptimizationOutput) {
        console.error('❌ VALIDATION FAILED: Missing optimizationScenarioOutput property');
        console.error('🔍 Available top-level keys:', Object.keys(parsed));
        return null;
      }
      
      console.log('🔎 Checking optimizationScenarioOutput structure...');
      const optimizationOutput = parsed.optimizationScenarioOutput;
      console.log('  - optimizationScenarioOutput type:', typeof optimizationOutput);
      console.log('  - optimizationScenarioOutput keys:', Object.keys(optimizationOutput));
      
      console.log('🔎 Checking required properties...');
      const hasProjectId = optimizationOutput.projectId !== undefined;
      const hasOptimizedScenarios = optimizationOutput.optimizedScheduleScenarios !== undefined;
      
      console.log('  - projectId exists:', hasProjectId ? '✅ YES' : '❌ NO');
      console.log('  - optimizedScheduleScenarios exists:', hasOptimizedScenarios ? '✅ YES' : '❌ NO');

      // Validate structure
      if (parsed.optimizationScenarioOutput && 
          parsed.optimizationScenarioOutput.projectId &&
          parsed.optimizationScenarioOutput.optimizedScheduleScenarios) {
        
        console.log('');
        console.log('✅ VALIDATION SUCCESS!');
        console.log('🎉 Correct OptimizationScenarioOutput structure found');
        console.log('📊 Final validation stats:');
        console.log('  - Project ID:', parsed.optimizationScenarioOutput.projectId);
        console.log('  - Scenario count:', parsed.optimizationScenarioOutput.optimizedScheduleScenarios.length);
        console.log('  - Structure matches expected format: ✅ YES');
        console.log('  - Ready for return: ✅ YES');
        
        return parsed as OptimizationScenarioOutput;
      }

      console.error('❌ VALIDATION FAILED: Structure validation failed');
      console.error('🔍 Missing required properties');
      return null;

    } catch (error) {
      console.error('❌ Error parsing optimization response:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Response length:', responseText.length);
      console.error('Response preview:', responseText.substring(0, 1000));
      console.error('Response end:', responseText.substring(responseText.length - 1000));
      
      // Try to find any JSON-like structure in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('Found potential JSON structure, attempting to parse:');
        try {
          const extracted = jsonMatch[0];
          const parsed = JSON.parse(extracted);
          console.log('✅ Successfully parsed extracted JSON!');
          return parsed as OptimizationScenarioOutput;
        } catch (e) {
          console.error('❌ Failed to parse extracted JSON:', e);
        }
      }
      
      return null;
    }
  }
}

// Export singleton instance
export const geminiOptimizationService = new GeminiOptimizationService();

// Export helper function
export const analyzeOptimizationWithAI = async (
  jsonInput: string,
  projectId: string,
  onProgress?: (status: string) => void
): Promise<{ status: 'completed' | 'error'; result?: OptimizationScenarioOutput; error?: string }> => {
  console.log('');
  console.log('🎯 ===== OPTIMIZATION AI HELPER FUNCTION CALLED =====');
  console.log('📅 TIMESTAMP:', new Date().toISOString());
  console.log('🆔 PROJECT_ID:', projectId);
  console.log('📊 FUNCTION: analyzeOptimizationWithAI()');
  console.log('🎯 ====================================================');
  console.log('');
  
  try {
    console.log('🚀 HELPER: Starting optimization scenario analysis...');
    console.log('📊 HELPER: Input JSON length:', jsonInput.length, 'characters');
    console.log('📊 HELPER: Project ID:', projectId);
    console.log('📊 HELPER: Progress callback provided:', !!onProgress);
    
    onProgress?.('Starting optimization scenario analysis...');
    console.log('📢 HELPER: Progress callback called - Starting analysis');
    
    console.log('🔄 HELPER: Calling geminiOptimizationService.analyzeOptimizationData()...');
    const result = await geminiOptimizationService.analyzeOptimizationData(jsonInput, projectId);
    
    console.log('✅ HELPER: Analysis completed successfully!');
    console.log('📊 HELPER: Result type:', typeof result);
    console.log('📊 HELPER: Result has optimizationScenarioOutput:', !!result?.optimizationScenarioOutput);
    
    onProgress?.('Optimization scenario completed successfully!');
    console.log('📢 HELPER: Progress callback called - Analysis completed');
    
    console.log('');
    console.log('🎉 HELPER: Returning success result');
    return {
      status: 'completed',
      result
    };
    
  } catch (error) {
    console.log('');
    console.log('💥 ========== HELPER ERROR OCCURRED ==========');
    console.error('❌ HELPER: Optimization analysis failed:', error);
    console.error('🔍 HELPER: Error type:', error?.name || 'Unknown');
    console.error('🔍 HELPER: Error message:', error?.message || 'No message');
    
    if (error?.stack) {
      console.error('📚 HELPER: Error stack trace:');
      console.error(error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.log('🔄 HELPER: Returning error result with message:', errorMessage);
    console.log('💥 ==========================================');
    console.log('');
    
    return {
      status: 'error',
      error: errorMessage
    };
  }
};