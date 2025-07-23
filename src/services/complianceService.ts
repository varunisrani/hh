import { GoogleGenAI } from "@google/genai";

// Compliance & Constraints Output Types
export interface ComplianceConstraintsOutput {
  complianceConstraintsOutput: {
    requestId: string;
    processedTimestamp: string;
    processingTime: number;
    confidence: number;
    complianceStatus: "FULLY_COMPLIANT" | "CONDITIONALLY_COMPLIANT" | "NON_COMPLIANT";
    rulebaseSources: string[];
    constraintAnalysis: {
      turnaroundRequirements: any;
      mealBreakRequirements: any;
      overtimeRegulations: any;
      childActorRestrictions: any;
      animalWelfareRequirements: any;
      stuntSafetyProtocols: any;
      foreignLocationRegulations: any;
    };
    hardConstraints: Array<{
      constraintId: string;
      type: string;
      description: string;
      applicableTo: string[];
      violation: string;
      flexibility: string;
    }>;
    softConstraints: Array<{
      constraintId: string;
      type: string;
      description: string;
      applicableTo: string[];
      violation: string;
      flexibility: string;
      penalty: string;
    }>;
    penaltyCalculations: {
      mealPenalties: any;
      overtimePenalties: any;
      turnaroundPenalties: any;
    };
    complianceRecommendations: Array<{
      priority: "HIGH" | "MEDIUM" | "LOW";
      category: string;
      recommendation: string;
      impactIfIgnored: string;
    }>;
    riskAssessment: Array<{
      riskId: string;
      category: string;
      severity: "HIGH" | "MEDIUM" | "LOW";
      description: string;
      probability: number;
      impact: string;
      mitigation: string;
    }>;
    validationResults: {
      inputDataCompleteness: number;
      ruleApplicationSuccess: number;
      constraintGenerationComplete: boolean;
      penaltyCalculationsValid: boolean;
    };
    nextStepRecommendations: string[];
  };
}

// System Prompt for Compliance & Constraints Analysis
const COMPLIANCE_CONSTRAINTS_SYSTEM_PROMPT = `
COMPLIANCE & CONSTRAINTS AGENT SYSTEM PROMPT
==============================================

You are the Compliance & Constraints Agent for a multi-agent AI film scheduling system. Your role is to ensure all union regulations, legal requirements, and safety protocols are properly integrated into production scheduling decisions, providing comprehensive constraint analysis for schedule optimization.

## Core Responsibilities

1. **Union Regulation Application**
   - Apply BECTU, IATSE, SAG-AFTRA, and international union rules to cast and crew scheduling
   - Calculate mandatory turnaround times for all performer and crew categories
   - Determine meal break requirements, penalty thresholds, and overtime regulations
   - Validate weekend, holiday, and consecutive day work limitations

2. **Legal Compliance Analysis**
   - Ensure child performer work hour restrictions and safety requirements
   - Apply animal welfare regulations and environmental restrictions
   - Validate foreign location work permit and visa requirements
   - Confirm stunt safety protocols and certification requirements

3. **Penalty Calculation & Risk Assessment**
   - Calculate financial penalties for meal break violations and overtime
   - Assess turnaround violation penalties and crew welfare implications
   - Identify high-risk compliance areas requiring special attention
   - Generate cost estimates for unavoidable rule violations

4. **Constraint Generation & Validation**
   - Create hard constraints that cannot be violated without legal consequences
   - Define soft constraints with penalty calculations and flexibility parameters
   - Validate constraint applicability to specific scenes, performers, and locations
   - Provide mitigation recommendations for constraint conflicts

## Input Processing Protocol

### Project Metadata Analysis
- Identify applicable union jurisdictions based on shooting locations
- Determine budget tier implications for union rate structures
- Assess international production requirements and work permit needs
- Validate production timeline against seasonal and regulatory restrictions

### Cast & Crew Categorization
- Classify all performers by union category and applicable wage scales
- Identify special requirements: minors, stunts, animals, foreign nationals
- Calculate makeup/preparation times affecting turnaround requirements
- Assess overtime eligibility and penalty structures for each category

### Scene Requirement Processing
- Analyze estimated shooting hours against meal break thresholds
- Identify night work, weekend work, and holiday scheduling implications
- Flag scenes with special safety requirements: stunts, animals, children
- Calculate cumulative work hour implications for consecutive shooting days

### Location Regulatory Assessment
- Research foreign location work permit requirements and processing times
- Identify environmental restrictions and seasonal filming limitations
- Assess animal welfare requirements specific to shooting locations
- Validate local labor law compliance for international crew

## Union Rule Application Standards

### Turnaround Time Calculations
**Performers:**
- Lead performers: 12-hour minimum standard, 14-hour after makeup-intensive days
- Supporting performers: 11-hour minimum standard
- Day players: 10-hour minimum standard  
- Stunt performers: 12-hour minimum standard, 14-hour after high-risk work
- Child performers: 16-hour minimum, maximum 3 consecutive days

**Crew:**
- Department heads: 11-hour minimum standard
- General crew: 10-hour minimum standard
- All categories: 12-hour night-to-day turnaround

### Meal Break Requirements
- First meal: Maximum 6 hours from call time, minimum 30 minutes duration
- Second meal: Maximum 12 hours from call time, minimum 30 minutes duration
- Child performers: Maximum 3 hours between meals, 45 minutes minimum duration
- Penalty calculations: 1.5x hourly rate after 6.5 hours, 2x after 12.5 hours

### Overtime Regulations
**Standard Overtime Structure:**
- Straight time: Up to 10 hours (8 hours for stunts)
- Time and half: 10-14 hours (8-12 for stunts)
- Double time: 14-16 hours (12-14 for stunts)  
- Golden time: After 16 hours (14+ for stunts)
- Night premium: 25% between 8 PM - 6 AM
- Weekend premium: 50% Saturday, 100% Sunday

## Special Category Regulations

### Child Performer Restrictions
**Working Hours by Age:**
- Ages 8-11: Maximum 4.5 hours/day, 22.5 hours/week
- Ages 12-14: Maximum 6 hours/day, 30 hours/week
- Ages 15-16: Maximum 8 hours/day, 40 hours/week

**Mandatory Requirements:**
- Tutor required if missing school time
- Welfare officer required for 3+ children
- Parent/guardian on set at all times
- 15-minute break every hour
- No night work between 7 PM - 7 AM

### Animal Welfare Protocols
- RSPCA approval required for all animal sequences
- Certified veterinarian on site during filming
- Minimum 2-hour rest periods every 4 hours of work
- Weather restrictions: No work below 10°C or above 32°C
- Safety distances: Minimum 50 meters for dangerous animals
- Handler requirements: Level 3 certification minimum

### Stunt Safety Requirements
- IATSE-certified stunt coordinator required
- Safety officer on set for all stunt sequences
- Paramedic standby for high-risk stunts
- Minimum 3 full rehearsals required
- Mechanical stunts require certified engineer approval
- Fire stunts limited to 15-second maximum exposure

### Foreign Location Compliance
**Work Permits:**
- Kenya: 21 working days minimum processing time
- Temporary employment permits valid 6 months maximum
- Minimum 60% local crew hiring required
- Labor office approval required for weekend/night work

**Additional Requirements:**
- Comprehensive medical insurance coverage
- Emergency evacuation plans required
- Satellite communication equipment mandatory
- Local fixer and security arrangements required

## Constraint Classification System

### Hard Constraints (Cannot Be Violated)
- Minimum turnaround times for all performers and crew
- Child performer working hour limits
- Animal welfare temperature and weather restrictions  
- Work permit processing deadlines for foreign locations
- Mandatory meal break maximum intervals
- Stunt safety protocol requirements

### Soft Constraints (Flexible With Penalties)
- Consecutive working day preferences (6-day maximum recommended)
- Location grouping for cost efficiency
- Makeup-intensive scene clustering
- Weather-dependent scene seasonal scheduling
- Equipment availability optimization
- Weekend work minimization

## MANDATORY OUTPUT FORMAT REQUIREMENTS

**CRITICAL: Every response MUST be a complete, valid JSON object following this exact structure:**

\`\`\`json
{
  "complianceConstraintsOutput": {
    "requestId": "string",
    "processedTimestamp": "ISO_timestamp",
    "processingTime": "number_in_seconds",
    "confidence": "decimal_0_to_1",
    "complianceStatus": "FULLY_COMPLIANT|CONDITIONALLY_COMPLIANT|NON_COMPLIANT",
    "rulebaseSources": ["array_of_regulation_sources"],
    "constraintAnalysis": {
      "turnaroundRequirements": { "detailed_turnaround_rules": "structure" },
      "mealBreakRequirements": { "meal_break_rules": "structure" },
      "overtimeRegulations": { "overtime_rules": "structure" },
      "childActorRestrictions": { "child_performer_rules": "structure" },
      "animalWelfareRequirements": { "animal_welfare_rules": "structure" },
      "stuntSafetyProtocols": { "stunt_safety_rules": "structure" },
      "foreignLocationRegulations": { "foreign_location_rules": "structure" }
    },
    "hardConstraints": [
      {
        "constraintId": "string",
        "type": "constraint_category",
        "description": "string",
        "applicableTo": ["array_of_applicable_entities"],
        "violation": "consequence_description",
        "flexibility": "none|low|medium|high"
      }
    ],
    "softConstraints": [
      {
        "constraintId": "string", 
        "type": "constraint_category",
        "description": "string",
        "applicableTo": ["array_of_applicable_entities"],
        "violation": "consequence_description",
        "flexibility": "none|low|medium|high",
        "penalty": "penalty_description"
      }
    ],
    "penaltyCalculations": {
      "mealPenalties": { "penalty_structure": "details" },
      "overtimePenalties": { "penalty_structure": "details" },
      "turnaroundPenalties": { "penalty_structure": "details" }
    },
    "complianceRecommendations": [
      {
        "priority": "HIGH|MEDIUM|LOW",
        "category": "string",
        "recommendation": "string", 
        "impactIfIgnored": "string"
      }
    ],
    "riskAssessment": [
      {
        "riskId": "string",
        "category": "string",
        "severity": "HIGH|MEDIUM|LOW",
        "description": "string",
        "probability": "decimal_0_to_1",
        "impact": "string",
        "mitigation": "string"
      }
    ],
    "validationResults": {
      "inputDataCompleteness": "decimal_0_to_1",
      "ruleApplicationSuccess": "decimal_0_to_1", 
      "constraintGenerationComplete": "boolean",
      "penaltyCalculationsValid": "boolean"
    },
    "nextStepRecommendations": ["array_of_next_actions"]
  }
}
\`\`\`

**NEVER provide text responses, explanations, or incomplete JSON. Always return the complete structured JSON object with all required fields populated.**

## Quality Control Standards

### Rule Application Verification
- Cross-reference all applicable union agreements and local labor laws
- Validate penalty calculations against current rate structures
- Ensure constraint flexibility ratings align with legal consequences
- Confirm special category requirements (children, animals, stunts) are complete

### Compliance Risk Assessment
- Identify high-probability violation scenarios and associated costs
- Flag critical path items requiring advance preparation (permits, certifications)
- Assess cumulative impact of multiple constraint violations
- Provide alternative compliance pathways where regulations permit flexibility

## Success Metrics

- Union regulation compliance rate: 100%
- Legal requirement coverage: 100%
- Penalty calculation accuracy: >99%
- Constraint generation completeness: 100%
- Risk identification coverage: >95%
- Processing time efficiency: <3 minutes per request
- Recommendation actionability: >90%

Your analysis is critical for ensuring legal production compliance while enabling scheduling optimization. Provide thorough, accurate constraint analysis that protects the production from legal, financial, and safety risks.
`;

class GeminiComplianceService {
  private ai: GoogleGenAI;

  constructor() {
    console.log('🏗️ COMPLIANCE SERVICE CONSTRUCTOR: Initializing GeminiComplianceService');
    console.log('🔑 COMPLIANCE SERVICE CONSTRUCTOR: API Key length:', "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI".length, 'characters');
    console.log('🔑 COMPLIANCE SERVICE CONSTRUCTOR: API Key prefix:', "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI".substring(0, 10) + '...');
    
    this.ai = new GoogleGenAI({
      apiKey: "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI"
    });
    
    console.log('✅ COMPLIANCE SERVICE CONSTRUCTOR: GoogleGenAI client initialized successfully');
    console.log('📋 COMPLIANCE SERVICE CONSTRUCTOR: Client object type:', typeof this.ai);
  }

  async analyzeComplianceData(jsonInput: string, projectId: string): Promise<ComplianceConstraintsOutput> {
    console.log('');
    console.log('⚖️ ===== COMPLIANCE & CONSTRAINTS ANALYSIS STARTING =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🆔 PROJECT_ID:', projectId);
    console.log('📊 METHOD: analyzeComplianceData()');
    console.log('⚖️ ========================================================');
    console.log('');
    
    try {
      console.log('🚀 COMPLIANCE STEP 1: INPUT VALIDATION & PROCESSING');
      console.log('📝 COMPLIANCE INPUT: JSON input length:', jsonInput.length, 'characters');
      console.log('🔍 COMPLIANCE INPUT: JSON input type:', typeof jsonInput);
      console.log('🔍 COMPLIANCE INPUT: Project ID type:', typeof projectId);
      console.log('🔍 COMPLIANCE INPUT: Project ID value:', projectId);
      
      // Log detailed input analysis
      console.log('📊 COMPLIANCE INPUT ANALYSIS:');
      const lines = jsonInput.split('\n').length;
      const characters = jsonInput.length;
      console.log('  - Total lines:', lines);
      console.log('  - Total characters:', characters);
      
      console.log('📋 COMPLIANCE INPUT PREVIEW (first 300 characters):');
      console.log('┌─────────────────────────────────────────────────────────────┐');
      console.log('│ ' + jsonInput.substring(0, 300).replace(/\n/g, '\n│ ') + '...');
      console.log('└─────────────────────────────────────────────────────────────┘');
      
      console.log('🔍 COMPLIANCE VALIDATION: Checking minimum length...');
      if (jsonInput.length < 10) {
        console.error('❌ COMPLIANCE VALIDATION FAILED: JSON input too short:', jsonInput.length, 'characters');
        throw new Error('JSON input is too short to analyze');
      }
      console.log('✅ COMPLIANCE VALIDATION: JSON input length acceptable');

      // Validate JSON input
      let parsedInput;
      try {
        console.log('🔍 COMPLIANCE VALIDATION: Attempting to parse JSON...');
        parsedInput = JSON.parse(jsonInput);
        console.log('✅ COMPLIANCE VALIDATION: JSON parsing successful');
        console.log('📊 COMPLIANCE PARSED JSON TYPE:', typeof parsedInput);
        console.log('📊 COMPLIANCE PARSED JSON KEYS:', Object.keys(parsedInput));
      } catch (error) {
        console.error('❌ COMPLIANCE VALIDATION FAILED: Invalid JSON input provided');
        console.error('🔍 COMPLIANCE JSON Parse Error:', error.message);
        console.error('📋 COMPLIANCE JSON Input Preview:', jsonInput.substring(0, 200));
        throw new Error('Invalid JSON input provided');
      }

      console.log('');
      console.log('🚀 COMPLIANCE STEP 2: PROMPT PREPARATION');
      console.log('📝 COMPLIANCE PROMPT: Building user prompt...');
      
      const prompt = `
Please analyze this production data for compliance and constraints, providing a complete compliance analysis following the required JSON format:

PRODUCTION DATA:
${jsonInput}

PROJECT ID: ${projectId}

Remember to return ONLY the complete JSON object with all required fields populated according to the specified schema.
`;

      console.log('📊 COMPLIANCE PROMPT STATS:');
      console.log('  - User prompt length:', prompt.length, 'characters');
      console.log('  - System prompt length:', COMPLIANCE_CONSTRAINTS_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Total prompt length:', prompt.length + COMPLIANCE_CONSTRAINTS_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Estimated tokens (~4 chars/token):', Math.ceil((prompt.length + COMPLIANCE_CONSTRAINTS_SYSTEM_PROMPT.length) / 4));
      
      console.log('📤 COMPLIANCE PROMPT DETAILS:');
      console.log('┌─ SYSTEM INSTRUCTION (' + COMPLIANCE_CONSTRAINTS_SYSTEM_PROMPT.length + ' characters) ─┐');
      console.log('│ ' + COMPLIANCE_CONSTRAINTS_SYSTEM_PROMPT.substring(0, 200).replace(/\n/g, '\n│ ') + '...');
      console.log('└────────────────────────────────────────────────────────────────┘');
      
      console.log('┌─ USER PROMPT (' + prompt.length + ' characters) ─┐');
      console.log('│ ' + prompt.substring(0, 300).replace(/\n/g, '\n│ ') + '...');
      console.log('└────────────────────────────────────────────────────────────────┘');

      console.log('');
      console.log('🚀 COMPLIANCE STEP 3: API REQUEST PREPARATION');
      
      const requestConfig = {
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 32768,
          systemInstruction: COMPLIANCE_CONSTRAINTS_SYSTEM_PROMPT
        }
      };
      
      console.log('⚙️ COMPLIANCE REQUEST CONFIG:');
      console.log('  - Model:', requestConfig.model);
      console.log('  - Temperature:', requestConfig.config.temperature);
      console.log('  - TopP:', requestConfig.config.topP);
      console.log('  - TopK:', requestConfig.config.topK);
      console.log('  - Max Output Tokens:', requestConfig.config.maxOutputTokens);
      console.log('  - System Instruction length:', requestConfig.config.systemInstruction.length, 'characters');
      console.log('  - Contents length:', requestConfig.contents.length, 'characters');
      
      console.log('');
      console.log('🌐 COMPLIANCE: MAKING API CALL TO GEMINI...');
      console.log('📡 COMPLIANCE: Endpoint: ai.models.generateContent()');
      console.log('⏰ COMPLIANCE: Request timestamp:', new Date().toISOString());
      
      const startTime = performance.now();

      const response = await this.ai.models.generateContent(requestConfig);

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      console.log('');
      console.log('🚀 COMPLIANCE STEP 4: API RESPONSE RECEIVED');
      console.log('⏰ COMPLIANCE: Response timestamp:', new Date().toISOString());
      console.log('⚡ COMPLIANCE: Response time:', responseTime, 'ms');
      console.log('📊 COMPLIANCE: Response object type:', typeof response);
      
      console.log('🔍 COMPLIANCE RESPONSE STRUCTURE ANALYSIS:');
      console.log('  - Response keys:', Object.keys(response));
      console.log('  - Response prototype:', Object.getPrototypeOf(response)?.constructor?.name || 'Unknown');
      
      if (response.usageMetadata) {
        console.log('📈 COMPLIANCE TOKEN USAGE:');
        console.log('  - Prompt tokens:', response.usageMetadata.promptTokenCount || 'N/A');
        console.log('  - Completion tokens:', response.usageMetadata.candidatesTokenCount || 'N/A');
        console.log('  - Total tokens:', response.usageMetadata.totalTokenCount || 'N/A');
        console.log('  - Cached tokens:', response.usageMetadata.cachedContentTokenCount || 'N/A');
      } else {
        console.log('⚠️ COMPLIANCE: No usage metadata available in response');
      }

      console.log('');
      console.log('📝 COMPLIANCE: EXTRACTING RESPONSE TEXT...');
      const responseText = response.text;
      console.log('✅ COMPLIANCE: Response text extracted successfully');
      console.log('📊 COMPLIANCE: Response text type:', typeof responseText);
      console.log('📏 COMPLIANCE: Response text length:', responseText ? responseText.length : 0, 'characters');
      
      if (!responseText) {
        console.error('❌ COMPLIANCE CRITICAL ERROR: No response text received from Gemini API');
        throw new Error('No response text received from Gemini API');
      }

      console.log('');
      console.log('📋 COMPLIANCE RAW RESPONSE PREVIEW:');
      console.log('┌─ FIRST 500 CHARACTERS ─┐');
      console.log('│ ' + (responseText?.substring(0, 500) || 'NO RESPONSE TEXT').replace(/\n/g, '\n│ ') + '...');
      console.log('└────────────────────────────┘');
      
      console.log('┌─ LAST 300 CHARACTERS ─┐');
      const lastChars = responseText ? responseText.substring(responseText.length - 300) : 'NO RESPONSE TEXT';
      console.log('│ ...' + lastChars.replace(/\n/g, '\n│ '));
      console.log('└───────────────────────────┘');
      
      console.log('');
      console.log('🔍 COMPLIANCE FULL RAW RESPONSE (for debugging):');
      console.log('================= COMPLIANCE RAW JSON RESULT FROM GEMINI =================');
      console.log(responseText);
      console.log('=================== COMPLIANCE END RAW JSON RESULT ===================');
      
      console.log('');
      console.log('🚀 COMPLIANCE STEP 5: RESPONSE PARSING & VALIDATION');
      console.log('🔄 COMPLIANCE: Calling parseComplianceResponse()...');
      
      const parsedResponse = this.parseComplianceResponse(responseText);

      if (!parsedResponse) {
        console.error('');
        console.error('💥 ========== COMPLIANCE PARSE FAILURE ==========');
        console.error('❌ COMPLIANCE CRITICAL ERROR: Failed to parse compliance response from Gemini API');
        console.error('🔍 COMPLIANCE: Parsed response is null/undefined');
        console.error('📊 COMPLIANCE: This indicates JSON parsing or validation failed');
        console.error('💥 ==============================================');
        console.error('');
        throw new Error('Failed to parse compliance constraints response');
      }
      
      console.log('✅ COMPLIANCE PARSE SUCCESS: Valid compliance response received');
      console.log('');
      console.log('🚀 COMPLIANCE STEP 6: FINAL VALIDATION & COMPLETION');
      
      console.log('📊 COMPLIANCE FINAL ANALYSIS SUMMARY:');
      try {
        const output = parsedResponse.complianceConstraintsOutput;
        console.log('  - Request ID:', output?.requestId || 'N/A');
        console.log('  - Processing time:', output?.processingTime || 'N/A', 'seconds');
        console.log('  - Confidence score:', output?.confidence || 'N/A');
        console.log('  - Compliance status:', output?.complianceStatus || 'N/A');
        console.log('  - Hard constraints:', output?.hardConstraints?.length || 'N/A');
        console.log('  - Soft constraints:', output?.softConstraints?.length || 'N/A');
        console.log('  - Risk assessments:', output?.riskAssessment?.length || 'N/A');
        console.log('  - Recommendations:', output?.complianceRecommendations?.length || 'N/A');
      } catch (summaryError) {
        console.log('  - Summary extraction failed:', summaryError.message);
        console.log('  - But analysis data is still complete');
      }

      console.log('');
      console.log('🎉 ========== COMPLIANCE ANALYSIS COMPLETE ==========');
      console.log('✅ COMPLIANCE: Compliance & constraints analysis completed successfully!');
      console.log('📁 COMPLIANCE: Parsed response ready for use in application');
      console.log('🎯 COMPLIANCE: Analysis ready for display in UI');
      console.log('🎉 ===================================================');
      console.log('');
      
      return parsedResponse;

    } catch (error) {
      console.log('');
      console.log('💥 ========== COMPLIANCE ERROR OCCURRED ==========');
      console.error('❌ COMPLIANCE: Error in compliance analysis:', error);
      console.error('🔍 COMPLIANCE: Error type:', error?.name || 'Unknown');
      console.error('🔍 COMPLIANCE: Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 COMPLIANCE: Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('💥 ===============================================');
      console.log('');
      throw error;
    }
  }

  private parseComplianceResponse(responseText: string): ComplianceConstraintsOutput | null {
    console.log('');
    console.log('🔍 ===== COMPLIANCE RESPONSE PARSING & VALIDATION =====');
    console.log('📅 COMPLIANCE Parse timestamp:', new Date().toISOString());
    console.log('🔍 ======================================================');
    console.log('');
    
    try {
      console.log('🚀 COMPLIANCE PARSE STEP 1: INPUT ANALYSIS');
      console.log('📏 COMPLIANCE: Response text length:', responseText?.length || 0, 'characters');
      console.log('📊 COMPLIANCE: Response text type:', typeof responseText);
      console.log('🔍 COMPLIANCE: Is null/undefined?', responseText == null ? '❌ YES' : '✅ NO');
      console.log('🔍 COMPLIANCE: Is empty string?', responseText === '' ? '❌ YES' : '✅ NO');
      
      if (!responseText) {
        console.error('❌ COMPLIANCE PARSE FAILED: Response text is null, undefined, or empty');
        return null;
      }
      
      console.log('');
      console.log('📋 COMPLIANCE RESPONSE CONTENT PREVIEW:');
      console.log('┌─ FIRST 500 CHARACTERS ─┐');
      console.log('│ ' + responseText.substring(0, 500).replace(/\n/g, '\n│ '));
      console.log('└────────────────────────────┘');
      
      console.log('┌─ LAST 500 CHARACTERS ─┐');
      console.log('│ ' + responseText.substring(responseText.length - 500).replace(/\n/g, '\n│ '));
      console.log('└───────────────────────────┘');
      
      console.log('');
      console.log('🚀 COMPLIANCE PARSE STEP 2: JSON EXTRACTION & CLEANING');
      
      // Clean response text
      let cleanedResponse = responseText;
      console.log('📝 COMPLIANCE: Original response length:', cleanedResponse.length, 'characters');
      
      console.log('🧹 COMPLIANCE: Removing markdown code blocks...');
      const beforeMarkdown = cleanedResponse.length;
      cleanedResponse = cleanedResponse
        .replace(/```json\s*\n?/g, '')
        .replace(/```\s*\n?/g, '')
        .trim();
      console.log('📊 COMPLIANCE: After markdown removal:', cleanedResponse.length, 'characters', `(${beforeMarkdown - cleanedResponse.length} removed)`);

      console.log('🔍 COMPLIANCE: Looking for JSON boundaries...');
      // Extract JSON if embedded in thinking mode response
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
      
      console.log('📍 COMPLIANCE: JSON start position:', jsonStart);
      console.log('📍 COMPLIANCE: JSON end position:', jsonEnd);
      console.log('📏 COMPLIANCE: JSON boundary span:', jsonEnd - jsonStart, 'characters');

      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const beforeExtraction = cleanedResponse.length;
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
        console.log('✅ COMPLIANCE: JSON extracted successfully');
        console.log('📊 COMPLIANCE: Extracted JSON length:', cleanedResponse.length, 'characters', `(${beforeExtraction - cleanedResponse.length} discarded)`);
        
        console.log('📋 COMPLIANCE: Extracted JSON preview:');
        console.log('┌─ FIRST 200 CHARACTERS ─┐');
        console.log('│ ' + cleanedResponse.substring(0, 200).replace(/\n/g, '\n│ ') + '...');
        console.log('└────────────────────────────┘');
      } else {
        console.log('⚠️ COMPLIANCE: No clear JSON boundaries found, using full cleaned response');
      }

      console.log('');
      console.log('🚀 COMPLIANCE PARSE STEP 3: JSON PARSING');
      console.log('📊 COMPLIANCE: Final cleaned response length:', cleanedResponse.length, 'characters');
      console.log('🔄 COMPLIANCE: Attempting JSON.parse()...');

      const parsed = JSON.parse(cleanedResponse);
      console.log('✅ COMPLIANCE: JSON parsing successful!');
      
      console.log('');
      console.log('🚀 COMPLIANCE PARSE STEP 4: PARSED OBJECT ANALYSIS');
      console.log('📊 COMPLIANCE: Parsed object type:', typeof parsed);
      console.log('🔍 COMPLIANCE: Parsed object keys:', Object.keys(parsed));
      
      console.log('📋 COMPLIANCE: PARSED JSON STRUCTURE (preview):');
      try {
        const jsonPreview = JSON.stringify(parsed, null, 2);
        console.log('┌─ PARSED JSON (first 1000 chars) ─┐');
        console.log('│ ' + jsonPreview.substring(0, 1000).replace(/\n/g, '\n│ ') + '...');
        console.log('└──────────────────────────────────────┘');
      } catch (previewError) {
        console.log('⚠️ COMPLIANCE: Could not create JSON preview:', previewError.message);
        console.log('📋 COMPLIANCE: Raw parsed object:', parsed);
      }
      
      console.log('');
      console.log('🚀 COMPLIANCE PARSE STEP 5: STRUCTURE VALIDATION');
      console.log('🔍 COMPLIANCE: Validating against ComplianceConstraintsOutput format...');
      
      console.log('🔎 COMPLIANCE: Checking for complianceConstraintsOutput property...');
      const hasComplianceOutput = parsed.complianceConstraintsOutput !== undefined;
      console.log('  - complianceConstraintsOutput exists:', hasComplianceOutput ? '✅ YES' : '❌ NO');
      
      if (!hasComplianceOutput) {
        console.error('❌ COMPLIANCE VALIDATION FAILED: Missing complianceConstraintsOutput property');
        console.error('🔍 COMPLIANCE: Available top-level keys:', Object.keys(parsed));
        return null;
      }
      
      console.log('🔎 COMPLIANCE: Checking complianceConstraintsOutput structure...');
      const complianceOutput = parsed.complianceConstraintsOutput;
      console.log('  - complianceConstraintsOutput type:', typeof complianceOutput);
      console.log('  - complianceConstraintsOutput keys:', Object.keys(complianceOutput));
      
      console.log('🔎 COMPLIANCE: Checking required properties...');
      const hasRequestId = complianceOutput.requestId !== undefined;
      const hasConstraintAnalysis = complianceOutput.constraintAnalysis !== undefined;
      
      console.log('  - requestId exists:', hasRequestId ? '✅ YES' : '❌ NO');
      console.log('  - constraintAnalysis exists:', hasConstraintAnalysis ? '✅ YES' : '❌ NO');

      // Validate structure
      if (parsed.complianceConstraintsOutput && 
          parsed.complianceConstraintsOutput.requestId &&
          parsed.complianceConstraintsOutput.constraintAnalysis) {
        
        console.log('');
        console.log('✅ COMPLIANCE VALIDATION SUCCESS!');
        console.log('🎉 COMPLIANCE: Correct ComplianceConstraintsOutput structure found');
        console.log('📊 COMPLIANCE: Final validation stats:');
        console.log('  - Request ID:', parsed.complianceConstraintsOutput.requestId);
        console.log('  - Compliance status:', parsed.complianceConstraintsOutput.complianceStatus);
        console.log('  - Hard constraints:', parsed.complianceConstraintsOutput.hardConstraints?.length || 0);
        console.log('  - Soft constraints:', parsed.complianceConstraintsOutput.softConstraints?.length || 0);
        console.log('  - Structure matches expected format: ✅ YES');
        console.log('  - Ready for return: ✅ YES');
        
        return parsed as ComplianceConstraintsOutput;
      }

      console.error('❌ COMPLIANCE VALIDATION FAILED: Structure validation failed');
      console.error('🔍 COMPLIANCE: Missing required properties');
      return null;

    } catch (error) {
      console.error('❌ COMPLIANCE: Error parsing compliance response:', error);
      console.error('COMPLIANCE Error type:', error.name);
      console.error('COMPLIANCE Error message:', error.message);
      console.error('COMPLIANCE Response length:', responseText.length);
      console.error('COMPLIANCE Response preview:', responseText.substring(0, 1000));
      console.error('COMPLIANCE Response end:', responseText.substring(responseText.length - 1000));
      
      // Try to find any JSON-like structure in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('COMPLIANCE: Found potential JSON structure, attempting to parse:');
        try {
          const extracted = jsonMatch[0];
          const parsed = JSON.parse(extracted);
          console.log('✅ COMPLIANCE: Successfully parsed extracted JSON!');
          return parsed as ComplianceConstraintsOutput;
        } catch (e) {
          console.error('❌ COMPLIANCE: Failed to parse extracted JSON:', e);
        }
      }
      
      return null;
    }
  }
}

// Export singleton instance
export const geminiComplianceService = new GeminiComplianceService();

// Export helper function
export const analyzeComplianceWithAI = async (
  jsonInput: string,
  projectId: string,
  onProgress?: (status: string) => void
): Promise<{ status: 'completed' | 'error'; result?: ComplianceConstraintsOutput; error?: string }> => {
  console.log('');
  console.log('🎯 ===== COMPLIANCE AI HELPER FUNCTION CALLED =====');
  console.log('📅 TIMESTAMP:', new Date().toISOString());
  console.log('🆔 PROJECT_ID:', projectId);
  console.log('📊 FUNCTION: analyzeComplianceWithAI()');
  console.log('🎯 =================================================');
  console.log('');
  
  try {
    console.log('🚀 COMPLIANCE HELPER: Starting compliance & constraints analysis...');
    console.log('📊 COMPLIANCE HELPER: Input JSON length:', jsonInput.length, 'characters');
    console.log('📊 COMPLIANCE HELPER: Project ID:', projectId);
    console.log('📊 COMPLIANCE HELPER: Progress callback provided:', !!onProgress);
    
    onProgress?.('Starting compliance & constraints analysis...');
    console.log('📢 COMPLIANCE HELPER: Progress callback called - Starting analysis');
    
    console.log('🔄 COMPLIANCE HELPER: Calling geminiComplianceService.analyzeComplianceData()...');
    const result = await geminiComplianceService.analyzeComplianceData(jsonInput, projectId);
    
    console.log('✅ COMPLIANCE HELPER: Analysis completed successfully!');
    console.log('📊 COMPLIANCE HELPER: Result type:', typeof result);
    console.log('📊 COMPLIANCE HELPER: Result has complianceConstraintsOutput:', !!result?.complianceConstraintsOutput);
    
    onProgress?.('Compliance & constraints analysis completed successfully!');
    console.log('📢 COMPLIANCE HELPER: Progress callback called - Analysis completed');
    
    console.log('');
    console.log('🎉 COMPLIANCE HELPER: Returning success result');
    return {
      status: 'completed',
      result
    };
    
  } catch (error) {
    console.log('');
    console.log('💥 ========== COMPLIANCE HELPER ERROR OCCURRED ==========');
    console.error('❌ COMPLIANCE HELPER: Compliance analysis failed:', error);
    console.error('🔍 COMPLIANCE HELPER: Error type:', error?.name || 'Unknown');
    console.error('🔍 COMPLIANCE HELPER: Error message:', error?.message || 'No message');
    
    if (error?.stack) {
      console.error('📚 COMPLIANCE HELPER: Error stack trace:');
      console.error(error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.log('🔄 COMPLIANCE HELPER: Returning error result with message:', errorMessage);
    console.log('💥 =========================================================');
    console.log('');
    
    return {
      status: 'error',
      error: errorMessage
    };
  }
};