import { GoogleGenAI } from "@google/genai";

// Resource Logistics Output Types
export interface ResourceLogisticsOutput {
  resourceLogisticsOutput: {
    projectId: string;
    processedTimestamp: string;
    processingTime: number;
    confidence: number;
    systemStatus: {
      resourceAnalysisStatus: "COMPLETE" | "PARTIAL" | "FAILED";
      availabilityValidationStatus: "VALIDATED" | "CONFLICTS_DETECTED" | "FAILED";
      logisticsCalculationStatus: "COMPLETE" | "PARTIAL" | "FAILED";
      reportGenerationStatus: "READY" | "PENDING" | "FAILED";
    };
    castResourceAnalysis: {
      totalCastMembers: number;
      principalActors: number;
      dayPlayers: number;
      background: number;
      totalWorkDays: number;
      averageUtilization: number;
      dayOutOfDaysReport: Array<{
        actorName: string;
        category: string;
        totalDays: number;
        workingDays: number;
        holdingDays: number;
        availabilityConflicts: string[];
        estimatedCost: number;
      }>;
    };
    crewResourceAnalysis: {
      departments: Array<{
        departmentName: string;
        headOfDepartment: string;
        crewSize: number;
        specializedRoles: string[];
        equipmentRequirements: string[];
        budgetAllocation: number;
      }>;
      totalCrewSize: number;
      keyPersonnelConflicts: string[];
      skillGapAnalysis: string[];
    };
    locationLogistics: {
      locationBreakdown: Array<{
        locationName: string;
        locationType: string;
        address: string;
        accessRequirements: string[];
        permitStatus: string;
        travelTimeFromBase: number;
        accommodationNeeds: boolean;
        logisticalComplexity: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
        estimatedCosts: {
          location: number;
          permits: number;
          travel: number;
          accommodation: number;
        };
      }>;
      companyMoveAnalysis: Array<{
        fromLocation: string;
        toLocation: string;
        distance: number;
        estimatedMoveTime: number;
        complexity: "SIMPLE" | "COMPLEX" | "EXTREME";
        costImpact: number;
      }>;
    };
    equipmentAllocation: {
      cameraPackage: {
        cameras: string[];
        lenses: string[];
        supports: string[];
        availability: "CONFIRMED" | "PENDING" | "CONFLICTS";
        dailyRate: number;
      };
      lightingPackage: {
        fixtures: string[];
        grip: string[];
        electrical: string[];
        availability: "CONFIRMED" | "PENDING" | "CONFLICTS";
        dailyRate: number;
      };
      soundPackage: {
        recording: string[];
        microphones: string[];
        wireless: string[];
        availability: "CONFIRMED" | "PENDING" | "CONFLICTS";
        dailyRate: number;
      };
      specializedEquipment: Array<{
        equipmentType: string;
        description: string;
        vendor: string;
        availability: "CONFIRMED" | "PENDING" | "CONFLICTS";
        specialRequirements: string[];
        dailyRate: number;
      }>;
    };
    resourceConflictAnalysis: {
      castConflicts: Array<{
        actorName: string;
        conflictType: "AVAILABILITY" | "UNION" | "CONTRACT" | "TRAVEL";
        affectedScenes: string[];
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        recommendedResolution: string;
      }>;
      equipmentConflicts: Array<{
        equipmentType: string;
        conflictDates: string[];
        alternativeOptions: string[];
        costImpact: number;
        resolution: string;
      }>;
      locationConflicts: Array<{
        locationName: string;
        conflictType: "PERMIT" | "ACCESS" | "WEATHER" | "AVAILABILITY";
        conflictDates: string[];
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        contingencyPlan: string;
      }>;
    };
    budgetResourceSummary: {
      totalAboveLine: number;
      totalBelowLine: number;
      castCosts: number;
      crewCosts: number;
      equipmentCosts: number;
      locationCosts: number;
      contingencyRecommendation: number;
      costOptimizationOpportunities: string[];
    };
    recommendedActions: string[];
  };
}

// System Prompt for Resource Logistics
const RESOURCE_LOGISTICS_SYSTEM_PROMPT = `
RESOURCE LOGISTICS AGENT SYSTEM PROMPT
=====================================

You are the Resource Logistics Agent in a multi-agent AI film scheduling system. Your primary responsibility is to analyze, coordinate, and optimize all human and material resources required for film production, including cast availability management, crew allocation, equipment scheduling, and location logistics coordination.

## Core Responsibilities

1. **Cast Resource Management**
   - Process Day Out of Days (DOOD) requirements for all performers
   - Analyze cast availability windows against scene requirements
   - Calculate holding days, travel days, and work pattern optimization
   - Validate union category compliance and rate structures
   - Identify and resolve cast scheduling conflicts

2. **Crew Resource Allocation**
   - Determine optimal crew sizes for each department
   - Identify specialized skill requirements and key personnel
   - Analyze crew availability and potential conflicts
   - Calculate crew costs and budget allocation by department
   - Assess skill gaps and recommend additional hiring

3. **Equipment Resource Coordination**
   - Coordinate camera, lighting, sound, and specialized equipment packages
   - Validate equipment availability against shooting schedules
   - Identify equipment conflicts and propose alternative solutions
   - Calculate equipment costs and optimize rental periods
   - Manage vendor relationships and booking coordination

4. **Location Logistics Management**
   - Analyze location access requirements and logistical complexity
   - Calculate travel times, accommodation needs, and company moves
   - Coordinate permit applications and regulatory compliance
   - Assess location-specific resource requirements
   - Optimize location groupings to minimize logistical costs

## Input Processing Protocol

### Cast Analysis Requirements
- Validate cast member availability windows against scene shooting requirements
- Calculate exact working days vs. holding days for each performer
- Identify makeup/costume prep time requirements and special needs
- Assess travel requirements for location-based shooting
- Analyze union compliance requirements for each performer category

### Crew Requirements Assessment
- Determine department-by-department crew size requirements
- Identify Head of Department (HOD) and key personnel needs
- Assess specialized skills required for specific scenes or sequences
- Calculate crew costs based on union rates and overtime projections
- Identify potential crew conflicts and availability issues

### Equipment Coordination Analysis
- Validate camera package requirements against shooting style and format
- Coordinate lighting package needs based on location and scene requirements
- Assess sound recording needs including wireless and specialized microphones
- Identify specialized equipment for stunts, VFX, underwater, aerial, etc.
- Analyze equipment vendor availability and coordinate booking schedules

### Location Logistics Evaluation
- Calculate travel times between locations and base operations
- Assess accommodation requirements for cast and crew
- Analyze permit requirements and regulatory compliance needs
- Evaluate location access restrictions and setup requirements
- Calculate company move costs and time requirements

## Resource Optimization Strategies

### Cast Optimization
1. **Continuity Grouping**: Schedule scenes to minimize costume/makeup changes
2. **Availability Maximization**: Optimize actor schedules to reduce holding days
3. **Travel Minimization**: Group location work to reduce cast travel requirements
4. **Union Compliance**: Ensure all scheduling meets union turnaround requirements
5. **Cost Efficiency**: Balance cast availability with daily rate optimization

### Equipment Optimization
1. **Package Consolidation**: Optimize equipment packages to reduce vendor management
2. **Utilization Maximization**: Schedule equipment to minimize idle rental periods
3. **Conflict Resolution**: Identify and resolve equipment booking conflicts early
4. **Vendor Coordination**: Manage multiple vendor relationships for specialized needs
5. **Backup Planning**: Ensure backup equipment availability for critical items

### Location Optimization
1. **Geographic Grouping**: Cluster scenes by location to minimize company moves
2. **Access Optimization**: Schedule locations to work within permit and access windows
3. **Accommodation Efficiency**: Minimize overnight location requirements
4. **Weather Planning**: Schedule weather-dependent exteriors during optimal seasons
5. **Permit Coordination**: Ensure all permits are secured before scheduling

## Conflict Resolution Protocols

### Cast Conflicts
- **Availability Conflicts**: Negotiate alternative dates or propose script adjustments
- **Union Violations**: Restructure schedules to meet mandatory turnaround requirements
- **Travel Conflicts**: Coordinate transportation and accommodation to resolve issues
- **Contract Conflicts**: Work with production legal to resolve scheduling disputes

### Equipment Conflicts
- **Vendor Conflicts**: Negotiate alternative rental periods or backup equipment
- **Technical Conflicts**: Identify alternative equipment that meets technical requirements
- **Budget Conflicts**: Propose cost-effective alternatives or schedule optimizations
- **Availability Conflicts**: Coordinate with multiple vendors to resolve booking issues

### Location Conflicts
- **Permit Conflicts**: Work with location managers to resolve regulatory issues
- **Access Conflicts**: Negotiate alternative access arrangements or backup locations
- **Weather Conflicts**: Develop contingency plans for weather-dependent scenes
- **Community Conflicts**: Coordinate with local authorities to minimize disruption

## Data Integration Requirements

### Input Data Processing
- Cast availability calendars with blackout dates and preferences
- Crew department requirements with specialized skill needs
- Equipment requirements with technical specifications and vendor preferences
- Location requirements with access restrictions and permit status
- Budget constraints with department allocation guidelines

### Output Data Formatting
- Detailed Day Out of Days (DOOD) reports for all cast members
- Crew allocation matrices with cost breakdowns by department
- Equipment booking schedules with vendor coordination requirements
- Location logistics breakdowns with travel and accommodation requirements
- Resource conflict analysis with resolution recommendations

## Quality Control Standards

### Data Validation
- Verify cast availability aligns with scene requirements
- Confirm crew size meets department needs and budget constraints
- Validate equipment specifications match technical requirements
- Ensure location logistics are feasible within schedule constraints
- Cross-reference all resource allocations against budget limitations

### Conflict Prevention
- Identify potential resource conflicts before final scheduling
- Propose alternative solutions for high-risk resource dependencies
- Validate backup plans for critical cast, crew, and equipment needs
- Ensure compliance with all union and regulatory requirements
- Coordinate with other agents to prevent scheduling conflicts

## MANDATORY OUTPUT FORMAT REQUIREMENTS

**CRITICAL: Every response MUST be a complete, valid JSON object following this exact structure:**

\`\`\`json
{
  "resourceLogisticsOutput": {
    "projectId": "string",
    "processedTimestamp": "ISO_timestamp",
    "processingTime": "number_in_seconds",
    "confidence": "decimal_0_to_1",
    "systemStatus": {
      "resourceAnalysisStatus": "COMPLETE|PARTIAL|FAILED",
      "availabilityValidationStatus": "VALIDATED|CONFLICTS_DETECTED|FAILED",
      "logisticsCalculationStatus": "COMPLETE|PARTIAL|FAILED", 
      "reportGenerationStatus": "READY|PENDING|FAILED"
    },
    "castResourceAnalysis": {
      "totalCastMembers": "number",
      "principalActors": "number",
      "dayPlayers": "number",
      "background": "number",
      "totalWorkDays": "number",
      "averageUtilization": "decimal_percentage",
      "dayOutOfDaysReport": [
        {
          "actorName": "string",
          "category": "PRINCIPAL|DAY_PLAYER|BACKGROUND",
          "totalDays": "number",
          "workingDays": "number",
          "holdingDays": "number",
          "availabilityConflicts": ["array_of_conflict_strings"],
          "estimatedCost": "number"
        }
      ]
    },
    "crewResourceAnalysis": {
      "departments": [
        {
          "departmentName": "string",
          "headOfDepartment": "string",
          "crewSize": "number",
          "specializedRoles": ["array_of_role_strings"],
          "equipmentRequirements": ["array_of_equipment_strings"],
          "budgetAllocation": "number"
        }
      ],
      "totalCrewSize": "number",
      "keyPersonnelConflicts": ["array_of_conflict_strings"],
      "skillGapAnalysis": ["array_of_gap_strings"]
    },
    "locationLogistics": {
      "locationBreakdown": [
        {
          "locationName": "string",
          "locationType": "STUDIO|PRACTICAL|CONSTRUCTION",
          "address": "string",
          "accessRequirements": ["array_of_requirement_strings"],
          "permitStatus": "SECURED|PENDING|REQUIRED",
          "travelTimeFromBase": "number_in_minutes",
          "accommodationNeeds": "boolean",
          "logisticalComplexity": "LOW|MEDIUM|HIGH|EXTREME",
          "estimatedCosts": {
            "location": "number",
            "permits": "number", 
            "travel": "number",
            "accommodation": "number"
          }
        }
      ],
      "companyMoveAnalysis": [
        {
          "fromLocation": "string",
          "toLocation": "string",
          "distance": "number_in_miles",
          "estimatedMoveTime": "number_in_hours",
          "complexity": "SIMPLE|COMPLEX|EXTREME",
          "costImpact": "number"
        }
      ]
    },
    "equipmentAllocation": {
      "cameraPackage": {
        "cameras": ["array_of_camera_strings"],
        "lenses": ["array_of_lens_strings"],
        "supports": ["array_of_support_strings"],
        "availability": "CONFIRMED|PENDING|CONFLICTS",
        "dailyRate": "number"
      },
      "lightingPackage": {
        "fixtures": ["array_of_fixture_strings"],
        "grip": ["array_of_grip_strings"],
        "electrical": ["array_of_electrical_strings"],
        "availability": "CONFIRMED|PENDING|CONFLICTS",
        "dailyRate": "number"
      },
      "soundPackage": {
        "recording": ["array_of_recording_strings"],
        "microphones": ["array_of_microphone_strings"],
        "wireless": ["array_of_wireless_strings"],
        "availability": "CONFIRMED|PENDING|CONFLICTS",
        "dailyRate": "number"
      },
      "specializedEquipment": [
        {
          "equipmentType": "string",
          "description": "string",
          "vendor": "string",
          "availability": "CONFIRMED|PENDING|CONFLICTS",
          "specialRequirements": ["array_of_requirement_strings"],
          "dailyRate": "number"
        }
      ]
    },
    "resourceConflictAnalysis": {
      "castConflicts": [
        {
          "actorName": "string",
          "conflictType": "AVAILABILITY|UNION|CONTRACT|TRAVEL",
          "affectedScenes": ["array_of_scene_strings"],
          "severity": "LOW|MEDIUM|HIGH|CRITICAL",
          "recommendedResolution": "string"
        }
      ],
      "equipmentConflicts": [
        {
          "equipmentType": "string",
          "conflictDates": ["array_of_date_strings"],
          "alternativeOptions": ["array_of_alternative_strings"],
          "costImpact": "number",
          "resolution": "string"
        }
      ],
      "locationConflicts": [
        {
          "locationName": "string",
          "conflictType": "PERMIT|ACCESS|WEATHER|AVAILABILITY",
          "conflictDates": ["array_of_date_strings"],
          "severity": "LOW|MEDIUM|HIGH|CRITICAL",
          "contingencyPlan": "string"
        }
      ]
    },
    "budgetResourceSummary": {
      "totalAboveLine": "number",
      "totalBelowLine": "number",
      "castCosts": "number",
      "crewCosts": "number",
      "equipmentCosts": "number",
      "locationCosts": "number",
      "contingencyRecommendation": "number",
      "costOptimizationOpportunities": ["array_of_opportunity_strings"]
    },
    "recommendedActions": ["array_of_action_strings"]
  }
}
\`\`\`

**NEVER provide text responses, explanations, or incomplete JSON. Always return the complete structured JSON object with all required fields populated.**

## Performance Optimization

### Resource Efficiency Metrics
- Cast utilization rate: Target >85%
- Equipment utilization rate: Target >75%
- Location grouping efficiency: Target >80%
- Crew optimization rate: Target >90%
- Budget variance control: Target <5%

### Cost Optimization Strategies
- Minimize holding days through intelligent scheduling
- Optimize equipment rental periods to reduce idle time
- Group location shooting to minimize travel and accommodation costs
- Balance crew size with budget constraints and production needs
- Identify cost-saving opportunities without compromising quality

Your resource logistics coordination is essential for production efficiency. Ensure accurate resource allocation, proactive conflict resolution, and comprehensive budget management throughout the planning process.
`;

class GeminiResourceService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI"
    });
  }

  async analyzeResourceData(jsonInput: string, projectId: string): Promise<ResourceLogisticsOutput> {
    console.log('');
    console.log('🏗️ ===== RESOURCE LOGISTICS ANALYSIS STARTING =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🆔 PROJECT_ID:', projectId);
    console.log('📊 METHOD: analyzeResourceData()');
    console.log('🏗️ ====================================================');
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
Please analyze this resource logistics data and provide a complete resource logistics response following the required JSON format:

RESOURCE LOGISTICS DATA:
${jsonInput}

PROJECT ID: ${projectId}

Remember to return ONLY the complete JSON object with all required fields populated according to the specified schema.
`;

      console.log('📊 PROMPT STATS:');
      console.log('  - User prompt length:', prompt.length, 'characters');
      console.log('  - System prompt length:', RESOURCE_LOGISTICS_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Total prompt length:', prompt.length + RESOURCE_LOGISTICS_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Estimated tokens (~4 chars/token):', Math.ceil((prompt.length + RESOURCE_LOGISTICS_SYSTEM_PROMPT.length) / 4));
      
      console.log('📤 PROMPT DETAILS:');
      console.log('┌─ SYSTEM INSTRUCTION (' + RESOURCE_LOGISTICS_SYSTEM_PROMPT.length + ' characters) ─┐');
      console.log('│ ' + RESOURCE_LOGISTICS_SYSTEM_PROMPT.substring(0, 200).replace(/\n/g, '\n│ ') + '...');
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
          systemInstruction: RESOURCE_LOGISTICS_SYSTEM_PROMPT
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
      console.log('🔄 Calling parseResourceResponse()...');
      
      const parsedResponse = this.parseResourceResponse(responseText);

      if (!parsedResponse) {
        console.error('');
        console.error('💥 ========== PARSE FAILURE ==========');
        console.error('❌ CRITICAL ERROR: Failed to parse resource response from Gemini API');
        console.error('🔍 Parsed response is null/undefined');
        console.error('📊 This indicates JSON parsing or validation failed');
        console.error('💥 ===================================');
        console.error('');
        throw new Error('Failed to parse resource logistics response');
      }
      
      console.log('✅ PARSE SUCCESS: Valid resource response received');
      console.log('');
      console.log('🚀 STEP 6: FINAL VALIDATION & COMPLETION');
      
      console.log('📊 FINAL ANALYSIS SUMMARY:');
      try {
        const summary = parsedResponse.resourceLogisticsOutput;
        console.log('  - Project ID:', summary?.projectId || 'N/A');
        console.log('  - Processing time:', summary?.processingTime || 'N/A', 'seconds');
        console.log('  - Confidence score:', summary?.confidence || 'N/A');
        console.log('  - Total cast members:', summary?.castResourceAnalysis?.totalCastMembers || 'N/A');
        console.log('  - Total crew size:', summary?.crewResourceAnalysis?.totalCrewSize || 'N/A');
        console.log('  - Department count:', summary?.crewResourceAnalysis?.departments?.length || 'N/A');
        console.log('  - Location count:', summary?.locationLogistics?.locationBreakdown?.length || 'N/A');
        console.log('  - Recommended actions count:', summary?.recommendedActions?.length || 'N/A');
      } catch (summaryError) {
        console.log('  - Summary extraction failed:', summaryError.message);
        console.log('  - But analysis data is still complete');
      }

      console.log('');
      console.log('🎉 ========== RESOURCE ANALYSIS COMPLETE ==========');
      console.log('✅ Resource logistics analysis completed successfully!');
      console.log('📁 Parsed response ready for use in application');
      console.log('🎯 Analysis ready for display in UI');
      console.log('🎉 =================================================');
      console.log('');
      
      return parsedResponse;

    } catch (error) {
      console.log('');
      console.log('💥 ========== ERROR OCCURRED ==========');
      console.error('❌ Error in resource logistics analysis:', error);
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

  private parseResourceResponse(responseText: string): ResourceLogisticsOutput | null {
    console.log('');
    console.log('🔍 ===== RESOURCE RESPONSE PARSING & VALIDATION =====');
    console.log('📅 Parse timestamp:', new Date().toISOString());
    console.log('🔍 ===================================================');
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
      console.log('🔍 Validating against ResourceLogisticsOutput format...');
      
      console.log('🔎 Checking for resourceLogisticsOutput property...');
      const hasResourceOutput = parsed.resourceLogisticsOutput !== undefined;
      console.log('  - resourceLogisticsOutput exists:', hasResourceOutput ? '✅ YES' : '❌ NO');
      
      if (!hasResourceOutput) {
        console.error('❌ VALIDATION FAILED: Missing resourceLogisticsOutput property');
        console.error('🔍 Available top-level keys:', Object.keys(parsed));
        return null;
      }
      
      console.log('🔎 Checking resourceLogisticsOutput structure...');
      const resourceOutput = parsed.resourceLogisticsOutput;
      console.log('  - resourceLogisticsOutput type:', typeof resourceOutput);
      console.log('  - resourceLogisticsOutput keys:', Object.keys(resourceOutput));
      
      console.log('🔎 Checking required properties...');
      const hasProjectId = resourceOutput.projectId !== undefined;
      const hasCastResourceAnalysis = resourceOutput.castResourceAnalysis !== undefined;
      
      console.log('  - projectId exists:', hasProjectId ? '✅ YES' : '❌ NO');
      console.log('  - castResourceAnalysis exists:', hasCastResourceAnalysis ? '✅ YES' : '❌ NO');

      // Validate structure
      if (parsed.resourceLogisticsOutput && 
          parsed.resourceLogisticsOutput.projectId &&
          parsed.resourceLogisticsOutput.castResourceAnalysis) {
        
        console.log('');
        console.log('✅ VALIDATION SUCCESS!');
        console.log('🎉 Correct ResourceLogisticsOutput structure found');
        console.log('📊 Final validation stats:');
        console.log('  - Project ID:', parsed.resourceLogisticsOutput.projectId);
        console.log('  - Cast analysis included:', !!parsed.resourceLogisticsOutput.castResourceAnalysis);
        console.log('  - Structure matches expected format: ✅ YES');
        console.log('  - Ready for return: ✅ YES');
        
        return parsed as ResourceLogisticsOutput;
      }

      console.error('❌ VALIDATION FAILED: Structure validation failed');
      console.error('🔍 Missing required properties');
      return null;

    } catch (error) {
      console.error('❌ Error parsing resource response:', error);
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
          return parsed as ResourceLogisticsOutput;
        } catch (e) {
          console.error('❌ Failed to parse extracted JSON:', e);
        }
      }
      
      return null;
    }
  }
}

// Export singleton instance
export const geminiResourceService = new GeminiResourceService();

// Export helper function
export const analyzeResourceWithAI = async (
  jsonInput: string,
  projectId: string,
  onProgress?: (status: string) => void
): Promise<{ status: 'completed' | 'error'; result?: ResourceLogisticsOutput; error?: string }> => {
  console.log('');
  console.log('🎯 ===== RESOURCE AI HELPER FUNCTION CALLED =====');
  console.log('📅 TIMESTAMP:', new Date().toISOString());
  console.log('🆔 PROJECT_ID:', projectId);
  console.log('📊 FUNCTION: analyzeResourceWithAI()');
  console.log('🎯 ===============================================');
  console.log('');
  
  try {
    console.log('🚀 HELPER: Starting resource logistics analysis...');
    console.log('📊 HELPER: Input JSON length:', jsonInput.length, 'characters');
    console.log('📊 HELPER: Project ID:', projectId);
    console.log('📊 HELPER: Progress callback provided:', !!onProgress);
    
    onProgress?.('Starting resource logistics analysis...');
    console.log('📢 HELPER: Progress callback called - Starting analysis');
    
    console.log('🔄 HELPER: Calling geminiResourceService.analyzeResourceData()...');
    const result = await geminiResourceService.analyzeResourceData(jsonInput, projectId);
    
    console.log('✅ HELPER: Analysis completed successfully!');
    console.log('📊 HELPER: Result type:', typeof result);
    console.log('📊 HELPER: Result has resourceLogisticsOutput:', !!result?.resourceLogisticsOutput);
    
    onProgress?.('Resource logistics completed successfully!');
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
    console.error('❌ HELPER: Resource analysis failed:', error);
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