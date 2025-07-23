import { GoogleGenAI } from "@google/genai";

// Scheduling Coordination Output Types
export interface SchedulingCoordinatorOutput {
  coordinatorOutput: {
    projectId: string;
    processedTimestamp: string;
    processingTime: number;
    confidence: number;
    systemStatus: {
      dataIntakeStatus: "SUCCESS" | "PARTIAL" | "FAILED";
      modelCreationStatus: "COMPLETE" | "PARTIAL" | "FAILED";
      validationStatus: "PASS" | "CONDITIONAL" | "FAIL";
      agentDistributionStatus: "READY" | "PENDING" | "FAILED";
    };
    comprehensiveProjectModel: {
      totalScenes: number;
      totalPages: number;
      totalEstimatedDays: number;
      complexityScore: number;
      riskFactors: string[];
    };
    agentDataPackets: {
      complianceConstraintsAgent: {
        agentName: string;
        priority: string;
        description: string;
        requestData: any;
      };
      resourceLogisticsAgent: {
        agentName: string;
        priority: string;
        description: string;
        requestData: any;
      };
      optimizationScenarioAgent: {
        agentName: string;
        priority: string;
        dependencies: string[];
        description: string;
        requestData: any;
      };
    };
    coordinationProtocol: {
      executionSequence: Array<{
        phase: string;
        agents: string[];
        description: string;
      }>;
      dataFlowValidation: any;
      qualityChecks: string[];
    };
    nextActions: string[];
  };
}

// System Prompt for Scheduling Coordination
const SCHEDULING_COORDINATION_SYSTEM_PROMPT = `
FILM SCHEDULING COORDINATOR SYSTEM PROMPT
==========================================

You are the Coordinator Agent for a multi-agent AI film scheduling system. Your role is to orchestrate the creation of optimized film production schedules by managing data flow between 3 specialized scheduling agents and assembling final production timelines.

## Core Responsibilities

1. **Data Intake & Project Model Creation**
   - Process comprehensive script breakdowns with scenes, cast, locations, and special requirements
   - Consolidate character analysis, department analysis, and location one-liners into unified project model
   - Validate input data completeness and identify missing critical scheduling information
   - Create initial unsequenced scene lists with all production requirements

2. **Agent Coordination & Data Distribution**
   - Distribute relevant data packets to Compliance & Constraints, Resource Logistics, and Optimization & Scenario agents
   - Manage execution sequence: parallel constraint/resource gathering, then optimization
   - Handle inter-agent dependencies and ensure data consistency
   - Coordinate timing of agent responses for efficient pipeline flow

3. **Schedule Assembly & Validation**
   - Receive and evaluate optimized schedule proposals from Optimization & Scenario Agent
   - Cross-validate proposals against compliance rules and resource availability
   - Select optimal schedule based on project parameters and quality requirements
   - Assemble final comprehensive shooting schedule with all production elements

## Input Processing Protocol

### Script Breakdown Analysis
- Extract all scene elements: cast, locations, props, special equipment, VFX requirements
- Calculate estimated setup times, shoot times, and complexity factors
- Identify weather dependencies, seasonal restrictions, and location access requirements
- Flag high-risk elements: stunts, animals, children, night work, special effects

### Cast & Character Processing
- Validate cast availability windows against scene requirements
- Identify makeup prep times, costume changes, and special performance needs
- Calculate Day Out of Days (DOOD) requirements for each principal performer
- Assess union category implications and daily rate structures

### Location & Logistics Assessment
- Categorize locations: practical, studio, construction required
- Estimate travel times, setup requirements, and logistical complexities
- Identify permit requirements, access restrictions, and seasonal limitations
- Calculate company move times and associated costs

### Department Requirements Integration
- Process camera, lighting, sound, makeup, stunts, and VFX department needs
- Identify specialized equipment requirements and availability dependencies
- Assess crew size requirements and specialized skill needs
- Validate technical feasibility and equipment dependencies

## Agent Data Distribution Strategy

### Compliance & Constraints Agent (Parallel Priority)
**Request Package:**
- Project metadata (union jurisdiction, budget tier, location)
- Cast details (categories, rates, special requirements, estimated days)
- Scene requirements (hours, meal breaks, night work, children, animals, stunts)
- Regulatory context (foreign locations, special effects, animal work)

**Expected Response:**
- Turnaround time calculations for all cast and crew
- Meal penalty thresholds and overtime regulations
- Child actor work restrictions and animal welfare requirements
- Stunt safety protocols and foreign location regulations
- Hard and soft constraints for optimization engine

### Resource Logistics Agent (Parallel Priority)
**Request Package:**
- Cast availability windows with blackout dates and scene requirements
- Crew requirements by department with specialized roles and equipment
- Location logistics (access, travel times, accommodation needs)
- Equipment allocation requirements with availability and costs

**Expected Response:**
- Preliminary Day Out of Days (DOOD) reports for all cast
- Resource availability matrix showing conflicts and dependencies
- Location logistics breakdown with travel and setup times
- Equipment allocation schedule with cost estimates
- Resource conflict analysis and resolution recommendations

### Optimization & Scenario Agent (Sequential Priority)
**Request Package:**
- Complete project model with all scene and production data
- Constraint set from Compliance & Constraints Agent
- Resource availability data from Resource Logistics Agent
- Optimization goals and scenario parameters
- Quality requirements and success metrics

**Expected Response:**
- Multiple optimized schedule proposals with different optimization priorities
- Resource utilization analysis showing efficiency metrics
- Constraint violation summary with mitigation recommendations
- Scenario comparison matrix for decision making
- Schedule quality metrics and risk assessments

## Schedule Assembly Protocol

### Proposal Evaluation Criteria
1. **Union Compliance**: Zero violations of mandatory turnaround and meal break rules
2. **Cast Efficiency**: Minimize actor holding days and maximize work continuity
3. **Location Efficiency**: Minimize company moves and optimize location groupings
4. **Resource Utilization**: Maximize equipment usage and minimize idle time
5. **Risk Mitigation**: Account for weather, equipment failure, and talent conflicts

### Final Schedule Components
- Scene-by-scene shooting order with estimated times
- Daily call sheets with cast, crew, and equipment requirements
- Day Out of Days (DOOD) reports for all performers
- Location schedule with prep, shoot, and wrap requirements
- Equipment booking schedule with setup and strike times
- Contingency planning for weather and technical issues

## Quality Control Standards

### Data Validation Requirements
- Verify all scene counts match source script breakdown
- Ensure cast member availability aligns with scene requirements
- Validate location day counts against access restrictions
- Cross-reference equipment needs with availability windows
- Confirm special requirements are addressed across all departments

### Schedule Feasibility Checks
- Validate turnaround times meet union minimum requirements
- Ensure meal breaks are scheduled within regulatory timeframes
- Confirm child actor work hours comply with labor restrictions
- Verify animal work aligns with welfare and seasonal requirements
- Check weather-dependent scenes against seasonal patterns

## MANDATORY OUTPUT FORMAT REQUIREMENTS

**CRITICAL: Every response MUST be a complete, valid JSON object following this exact structure:**

\`\`\`json
{
  "coordinatorOutput": {
    "projectId": "string",
    "processedTimestamp": "ISO_timestamp",
    "processingTime": "number_in_seconds",
    "confidence": "decimal_0_to_1",
    "systemStatus": {
      "dataIntakeStatus": "SUCCESS|PARTIAL|FAILED",
      "modelCreationStatus": "COMPLETE|PARTIAL|FAILED",
      "validationStatus": "PASS|CONDITIONAL|FAIL",
      "agentDistributionStatus": "READY|PENDING|FAILED"
    },
    "comprehensiveProjectModel": {
      "totalScenes": "number",
      "totalPages": "number", 
      "totalEstimatedDays": "number",
      "complexityScore": "decimal_1_to_10",
      "riskFactors": ["array_of_risk_strings"]
    },
    "agentDataPackets": {
      "complianceConstraintsAgent": {
        "agentName": "Compliance & Constraints Agent",
        "priority": "FIRST_PARALLEL",
        "description": "string",
        "requestData": { "structured_request_data": "value" }
      },
      "resourceLogisticsAgent": {
        "agentName": "Resource Logistics Agent", 
        "priority": "FIRST_PARALLEL",
        "description": "string",
        "requestData": { "structured_request_data": "value" }
      },
      "optimizationScenarioAgent": {
        "agentName": "Optimization & Scenario Agent",
        "priority": "SECOND_PARALLEL",
        "dependencies": ["complianceConstraintsAgent", "resourceLogisticsAgent"],
        "description": "string",
        "requestData": { "structured_request_data": "value" }
      }
    },
    "coordinationProtocol": {
      "executionSequence": [
        {
          "phase": "string",
          "agents": ["array_of_agent_names"],
          "description": "string"
        }
      ],
      "dataFlowValidation": { "validation_requirements": "value" },
      "qualityChecks": ["array_of_check_descriptions"]
    },
    "nextActions": ["array_of_next_step_strings"]
  }
}
\`\`\`

**NEVER provide text responses, explanations, or incomplete JSON. Always return the complete structured JSON object with all required fields populated.**

## Risk Assessment Integration

Continuously evaluate and flag:
- Cast availability conflicts that could delay production
- Location access restrictions that limit scheduling flexibility  
- Equipment dependencies that create bottlenecks
- Weather-dependent scenes requiring seasonal scheduling
- Union regulation compliance issues
- Budget constraints affecting scheduling options
- Technical feasibility concerns for complex sequences

## Success Metrics

- Schedule optimization efficiency: >90%
- Union compliance rate: 100% 
- Cast utilization efficiency: >85%
- Location grouping optimization: >80%
- Equipment utilization rate: >75%
- Weather contingency planning: Complete
- Budget adherence probability: >95%

Your coordination is essential for creating feasible, optimized production schedules. Ensure data accuracy, maintain agent workflow efficiency, and provide comprehensive risk assessment throughout the scheduling process.
`;

class GeminiSchedulingService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI"
    });
  }

  async analyzeSchedulingData(jsonInput: string, projectId: string): Promise<SchedulingCoordinatorOutput> {
    console.log('');
    console.log('🎬 ===== SCHEDULING COORDINATION ANALYSIS STARTING =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🆔 PROJECT_ID:', projectId);
    console.log('📊 METHOD: analyzeSchedulingData()');
    console.log('🎬 =========================================================');
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
Please analyze this scheduling data and provide a complete scheduling coordination response following the required JSON format:

SCHEDULING DATA:
${jsonInput}

PROJECT ID: ${projectId}

Remember to return ONLY the complete JSON object with all required fields populated according to the specified schema.
`;

      console.log('📊 PROMPT STATS:');
      console.log('  - User prompt length:', prompt.length, 'characters');
      console.log('  - System prompt length:', SCHEDULING_COORDINATION_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Total prompt length:', prompt.length + SCHEDULING_COORDINATION_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Estimated tokens (~4 chars/token):', Math.ceil((prompt.length + SCHEDULING_COORDINATION_SYSTEM_PROMPT.length) / 4));
      
      console.log('📤 PROMPT DETAILS:');
      console.log('┌─ SYSTEM INSTRUCTION (' + SCHEDULING_COORDINATION_SYSTEM_PROMPT.length + ' characters) ─┐');
      console.log('│ ' + SCHEDULING_COORDINATION_SYSTEM_PROMPT.substring(0, 200).replace(/\n/g, '\n│ ') + '...');
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
          systemInstruction: SCHEDULING_COORDINATION_SYSTEM_PROMPT
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
      console.log('🔄 Calling parseSchedulingResponse()...');
      
      const parsedResponse = this.parseSchedulingResponse(responseText);

      if (!parsedResponse) {
        console.error('');
        console.error('💥 ========== PARSE FAILURE ==========');
        console.error('❌ CRITICAL ERROR: Failed to parse scheduling response from Gemini API');
        console.error('🔍 Parsed response is null/undefined');
        console.error('📊 This indicates JSON parsing or validation failed');
        console.error('💥 ===================================');
        console.error('');
        throw new Error('Failed to parse scheduling coordination response');
      }
      
      console.log('✅ PARSE SUCCESS: Valid scheduling response received');
      console.log('');
      console.log('🚀 STEP 6: FINAL VALIDATION & COMPLETION');
      
      console.log('📊 FINAL ANALYSIS SUMMARY:');
      try {
        const summary = parsedResponse.coordinatorOutput;
        console.log('  - Project ID:', summary?.projectId || 'N/A');
        console.log('  - Processing time:', summary?.processingTime || 'N/A', 'seconds');
        console.log('  - Confidence score:', summary?.confidence || 'N/A');
        console.log('  - Total scenes:', summary?.comprehensiveProjectModel?.totalScenes || 'N/A');
        console.log('  - Total estimated days:', summary?.comprehensiveProjectModel?.totalEstimatedDays || 'N/A');
        console.log('  - Complexity score:', summary?.comprehensiveProjectModel?.complexityScore || 'N/A');
        console.log('  - Risk factors count:', summary?.comprehensiveProjectModel?.riskFactors?.length || 'N/A');
        console.log('  - Next actions count:', summary?.nextActions?.length || 'N/A');
      } catch (summaryError) {
        console.log('  - Summary extraction failed:', summaryError.message);
        console.log('  - But analysis data is still complete');
      }

      console.log('');
      console.log('🎉 ========== SCHEDULING ANALYSIS COMPLETE ==========');
      console.log('✅ Scheduling coordination analysis completed successfully!');
      console.log('📁 Parsed response ready for use in application');
      console.log('🎯 Analysis ready for display in UI');
      console.log('🎉 ===================================================');
      console.log('');
      
      return parsedResponse;

    } catch (error) {
      console.log('');
      console.log('💥 ========== ERROR OCCURRED ==========');
      console.error('❌ Error in scheduling coordination analysis:', error);
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

  private parseSchedulingResponse(responseText: string): SchedulingCoordinatorOutput | null {
    console.log('');
    console.log('🔍 ===== SCHEDULING RESPONSE PARSING & VALIDATION =====');
    console.log('📅 Parse timestamp:', new Date().toISOString());
    console.log('🔍 ======================================================');
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
      console.log('🔍 Validating against SchedulingCoordinatorOutput format...');
      
      console.log('🔎 Checking for coordinatorOutput property...');
      const hasCoordinatorOutput = parsed.coordinatorOutput !== undefined;
      console.log('  - coordinatorOutput exists:', hasCoordinatorOutput ? '✅ YES' : '❌ NO');
      
      if (!hasCoordinatorOutput) {
        console.error('❌ VALIDATION FAILED: Missing coordinatorOutput property');
        console.error('🔍 Available top-level keys:', Object.keys(parsed));
        return null;
      }
      
      console.log('🔎 Checking coordinatorOutput structure...');
      const coordinatorOutput = parsed.coordinatorOutput;
      console.log('  - coordinatorOutput type:', typeof coordinatorOutput);
      console.log('  - coordinatorOutput keys:', Object.keys(coordinatorOutput));
      
      console.log('🔎 Checking required properties...');
      const hasProjectId = coordinatorOutput.projectId !== undefined;
      const hasAgentDataPackets = coordinatorOutput.agentDataPackets !== undefined;
      
      console.log('  - projectId exists:', hasProjectId ? '✅ YES' : '❌ NO');
      console.log('  - agentDataPackets exists:', hasAgentDataPackets ? '✅ YES' : '❌ NO');

      // Validate structure
      if (parsed.coordinatorOutput && 
          parsed.coordinatorOutput.projectId &&
          parsed.coordinatorOutput.agentDataPackets) {
        
        console.log('');
        console.log('✅ VALIDATION SUCCESS!');
        console.log('🎉 Correct SchedulingCoordinatorOutput structure found');
        console.log('📊 Final validation stats:');
        console.log('  - Project ID:', parsed.coordinatorOutput.projectId);
        console.log('  - Agent packets count:', Object.keys(parsed.coordinatorOutput.agentDataPackets).length);
        console.log('  - Structure matches expected format: ✅ YES');
        console.log('  - Ready for return: ✅ YES');
        
        return parsed as SchedulingCoordinatorOutput;
      }

      console.error('❌ VALIDATION FAILED: Structure validation failed');
      console.error('🔍 Missing required properties');
      return null;

    } catch (error) {
      console.error('❌ Error parsing scheduling response:', error);
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
          return parsed as SchedulingCoordinatorOutput;
        } catch (e) {
          console.error('❌ Failed to parse extracted JSON:', e);
        }
      }
      
      return null;
    }
  }
}

// Export singleton instance
export const geminiSchedulingService = new GeminiSchedulingService();

// Export helper function
export const analyzeSchedulingWithAI = async (
  jsonInput: string,
  projectId: string,
  onProgress?: (status: string) => void
): Promise<{ status: 'completed' | 'error'; result?: SchedulingCoordinatorOutput; error?: string }> => {
  console.log('');
  console.log('🎯 ===== SCHEDULING AI HELPER FUNCTION CALLED =====');
  console.log('📅 TIMESTAMP:', new Date().toISOString());
  console.log('🆔 PROJECT_ID:', projectId);
  console.log('📊 FUNCTION: analyzeSchedulingWithAI()');
  console.log('🎯 ================================================');
  console.log('');
  
  try {
    console.log('🚀 HELPER: Starting scheduling coordination analysis...');
    console.log('📊 HELPER: Input JSON length:', jsonInput.length, 'characters');
    console.log('📊 HELPER: Project ID:', projectId);
    console.log('📊 HELPER: Progress callback provided:', !!onProgress);
    
    onProgress?.('Starting scheduling coordination analysis...');
    console.log('📢 HELPER: Progress callback called - Starting analysis');
    
    console.log('🔄 HELPER: Calling geminiSchedulingService.analyzeSchedulingData()...');
    const result = await geminiSchedulingService.analyzeSchedulingData(jsonInput, projectId);
    
    console.log('✅ HELPER: Analysis completed successfully!');
    console.log('📊 HELPER: Result type:', typeof result);
    console.log('📊 HELPER: Result has coordinatorOutput:', !!result?.coordinatorOutput);
    
    onProgress?.('Scheduling coordination completed successfully!');
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
    console.error('❌ HELPER: Scheduling analysis failed:', error);
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