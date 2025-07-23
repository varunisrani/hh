import { GoogleGenAI } from "@google/genai";

// AI Analysis Response Types (matching actual Gemini response)
export interface AISceneAnalysis {
  projectId: string;
  sceneId: string;
  sceneNumber: number;
  sceneName: string;
  analysisTimestamp: string;
  breakdown: {
    summary: string;
    location: {
      primaryLocation: string;
      setting: string;
      timeOfDay: string;
      environmentalFactors: string;
    };
    characters: {
      speakingCharacters: Array<{
        name: string;
        description: string;
      }>;
      nonSpeakingCharacters: Array<{
        name: string;
        description: string;
      }>;
      backgroundCharacters: any[];
      extras: any[];
    };
    props: {
      heroProps: string[];
      setProps: string[];
      interactiveProps: string[];
      consumableProps: string[];
    };
    technicalRequirements: {
      camera: string;
      lighting: string;
      sound: string;
      specialEquipment: string;
    };
    departmentalBreakdown: {
      artDepartment: string;
      wardrobeAndCostume: string;
      makeupAndHair: string;
      specialEffects: {
        VFX: string;
        PracticalFX: string;
        Stunts: string;
      };
    };
    complexityScore: {
      technicalDifficulty: {
        score: number;
        justification: string;
      };
      castComplexity: {
        score: number;
        justification: string;
      };
      locationChallenges: {
        score: number;
        justification: string;
      };
    };
    timeEstimate: {
      setupHours: number;
      shootHours: number;
      wrapHours: number;
      justification: string;
    };
  };
}

// Legacy interface for backward compatibility
export interface SceneBreakdownOutput {
  sceneBreakdownOutput: {
    projectId: string;
    processingTimestamp: string;
    sceneAnalysisSummary: {
      totalScenesProcessed: number;
      totalCharactersIdentified: number;
      totalLocationsIdentified: number;
      totalPropsIdentified: number;
      averageSceneComplexity: number;
    };
    detailedSceneBreakdowns: DetailedSceneBreakdown[];
    productionSummary: {
      totalUniqueCharacters: number;
      totalUniqueLocations: number;
      totalProps: number;
      specialEffectsScenes: number;
      highComplexityScenes: number[];
      departmentAlerts: {
        makeup: string[];
        wardrobe: string[];
        artDepartment: string[];
        specialEffects: string[];
      };
    };
    qualityControlChecks: {
      sceneCompleteness: "PASS" | "FAIL";
      elementValidation: "PASS" | "FAIL";
      continuityConsistency: "PASS" | "FAIL";
      industryStandardCompliance: "PASS" | "FAIL";
      confidenceScore: number;
    };
  };
}

export interface DetailedSceneBreakdown {
  sceneNumber: number;
  sceneHeader: string;
  pageCount: number;
  estimatedScreenTime: string;
  characters: {
    speaking: Array<{
      name: string;
      dialogueLines: number;
      firstAppearance: boolean;
      specialRequirements: string[];
    }>;
    nonSpeaking: Array<{
      description: string;
      count: number;
      specialRequirements: string[];
    }>;
    background: Array<{
      description: string;
      estimatedCount: number;
    }>;
  };
  location: {
    type: "INT" | "EXT";
    primaryLocation: string;
    secondaryLocation: string;
    timeOfDay: string;
    weatherConditions: string;
    complexityLevel: "simple" | "moderate" | "complex" | "extreme";
  };
  productionElements: {
    props: Array<{
      item: string;
      category: "hero" | "set" | "interactive" | "consumable";
      department: string;
      specialRequirements: string[];
    }>;
    vehicles: Array<{
      type: string;
      usage: "picture" | "background";
      specialRequirements: string[];
    }>;
    animals: Array<{
      type: string;
      count: number;
      trainingLevel: string;
      handlerRequired: boolean;
    }>;
    specialEffects: Array<{
      type: "practical" | "visual" | "stunt";
      description: string;
      complexity: "simple" | "moderate" | "complex";
      safetyRequirements: string[];
    }>;
  };
  departmentRequirements: {
    makeup: {
      standardMakeup: number;
      specialEffectsMakeup: string[];
      prosthetics: string[];
      estimatedApplicationTime: number;
    };
    wardrobe: {
      standardCostumes: number;
      periodCostumes: string[];
      specialtyItems: string[];
      quickChanges: number;
    };
    artDepartment: {
      setConstruction: string[];
      setDecoration: string[];
      locationModifications: string[];
    };
  };
  complexityScores: {
    technicalDifficulty: number;
    castComplexity: number;
    locationChallenges: number;
    overallComplexity: number;
  };
  timeEstimates: {
    setupHours: number;
    shootingHours: number;
    wrapHours: number;
    totalHours: number;
  };
  specialConsiderations: string[];
  continuityNotes: string[];
}

// AI Analysis Status Types
export type AIAnalysisStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface AIAnalysisResult {
  status: AIAnalysisStatus;
  result?: SceneBreakdownOutput;
  error?: string;
  timestamp?: string;
}

// System Prompt for Scene Breakdown
const SCENE_BREAKDOWN_SYSTEM_PROMPT = `
SCENE BREAKDOWN AGENT SYSTEM PROMPT
====================================

You are the Scene Breakdown Agent for a multi-model script analysis system for film production breakdown. Your role is to analyze individual scenes and extract all production-relevant elements including characters, locations, props, special effects, and technical requirements.

## Core Responsibilities

1. **Comprehensive Scene Analysis**
   - Extract all characters (speaking, non-speaking, background, extras)
   - Identify locations, time of day, and environmental requirements
   - Catalog all props, vehicles, and special equipment mentioned
   - Document special effects, stunts, and technical requirements

2. **Production Element Categorization**
   - Classify characters by type and importance
   - Assess location complexity and requirements
   - Identify department-specific needs (makeup, wardrobe, props, etc.)
   - Evaluate technical challenges and special requirements

3. **Complexity Assessment and Scoring**
   - Rate technical difficulty on 1-10 scale
   - Assess cast complexity based on numbers and requirements
   - Evaluate location challenges and access requirements
   - Estimate time requirements for setup, shooting, and wrap

## Scene Analysis Protocol

### Character Analysis
- **Speaking Characters**: All characters with dialogue
- **Non-Speaking Characters**: Characters with specific actions but no dialogue
- **Background Characters**: Atmosphere players with general actions
- **Extras**: Crowd members and general background

### Location Assessment
- **Primary Location**: Main setting for the scene
- **Secondary Elements**: Specific areas within primary location
- **Time of Day**: DAY, NIGHT, DAWN, DUSK, specific times
- **Environmental Factors**: Weather, season, lighting conditions

### Production Element Extraction
- **Hero Props**: Featured prominently, essential to story
- **Set Props**: Standard set dressing and atmosphere
- **Interactive Props**: Items handled or used by characters
- **Consumable Props**: Food, breakables, single-use items

### Technical Requirements
- **Camera**: Movement, special rigs, equipment needs
- **Lighting**: Day/night, practical lights, special effects
- **Sound**: Dialogue conditions, music, effects, ADR needs
- **Special Equipment**: Cranes, generators, specialty gear

## Complexity Scoring System

### Technical Difficulty (1-10)
- 1-3: Standard setup, minimal technical requirements
- 4-6: Moderate complexity, some special equipment
- 7-8: High complexity, significant technical challenges
- 9-10: Extreme complexity, cutting-edge technology

### Cast Complexity (1-10)
- 1-3: 1-2 characters, simple interactions
- 4-6: 3-5 characters, moderate blocking
- 7-8: 6-10 characters, complex choreography
- 9-10: Large ensemble, extreme coordination

### Location Challenges (1-10)
- 1-3: Studio or easily controlled location
- 4-6: Standard location with some constraints
- 7-8: Difficult access or environmental challenges
- 9-10: Extreme locations, major logistical obstacles

## Department-Specific Analysis

### Makeup and Hair
- Standard makeup requirements
- Special effects makeup needs
- Prosthetics applications
- Period or character-specific styling

### Wardrobe and Costume
- Character-specific clothing
- Period or specialty costumes
- Multiples needed for stunts/effects
- Quick changes or continuity requirements

### Art Department
- Set construction needs
- Set decoration requirements
- Location modifications
- Special builds or installations

### Special Effects
- Practical effects (mechanical, pyrotechnics)
- Visual effects requirements
- Stunt coordination needs
- Safety equipment and protocols

## Quality Control Standards

- All elements must be traceable to script content
- Every department must be addressed for each scene
- Complexity scores must have clear justification
- Time estimates must be realistic and industry-standard
- Cross-reference consistency across similar scenes

## MANDATORY OUTPUT FORMAT REQUIREMENTS

**CRITICAL: Every response MUST be a complete, valid JSON object following this exact structure:**

\`\`\`json
{
  "sceneBreakdownOutput": {
    "projectId": "string",
    "processingTimestamp": "ISO_timestamp",
    "sceneAnalysisSummary": {
      "totalScenesProcessed": "number",
      "totalCharactersIdentified": "number",
      "totalLocationsIdentified": "number",
      "totalPropsIdentified": "number",
      "averageSceneComplexity": "number"
    },
    "detailedSceneBreakdowns": [
      {
        "sceneNumber": "number",
        "sceneHeader": "string",
        "pageCount": "number",
        "estimatedScreenTime": "MM:SS",
        "characters": {
          "speaking": [
            {
              "name": "string",
              "dialogueLines": "number",
              "firstAppearance": "boolean",
              "specialRequirements": ["array"]
            }
          ],
          "nonSpeaking": [
            {
              "description": "string",
              "count": "number",
              "specialRequirements": ["array"]
            }
          ],
          "background": [
            {
              "description": "string",
              "estimatedCount": "number"
            }
          ]
        },
        "location": {
          "type": "INT|EXT",
          "primaryLocation": "string",
          "secondaryLocation": "string",
          "timeOfDay": "string",
          "weatherConditions": "string",
          "complexityLevel": "simple|moderate|complex|extreme"
        },
        "productionElements": {
          "props": [
            {
              "item": "string",
              "category": "hero|set|interactive|consumable",
              "department": "string",
              "specialRequirements": ["array"]
            }
          ],
          "vehicles": [
            {
              "type": "string",
              "usage": "picture|background",
              "specialRequirements": ["array"]
            }
          ],
          "animals": [
            {
              "type": "string",
              "count": "number",
              "trainingLevel": "string",
              "handlerRequired": "boolean"
            }
          ],
          "specialEffects": [
            {
              "type": "practical|visual|stunt",
              "description": "string",
              "complexity": "simple|moderate|complex",
              "safetyRequirements": ["array"]
            }
          ]
        },
        "departmentRequirements": {
          "makeup": {
            "standardMakeup": "number_of_people",
            "specialEffectsMakeup": ["array_of_requirements"],
            "prosthetics": ["array_of_requirements"],
            "estimatedApplicationTime": "minutes"
          },
          "wardrobe": {
            "standardCostumes": "number",
            "periodCostumes": ["array"],
            "specialtyItems": ["array"],
            "quickChanges": "number"
          },
          "artDepartment": {
            "setConstruction": ["array_of_builds"],
            "setDecoration": ["array_of_items"],
            "locationModifications": ["array_of_changes"]
          }
        },
        "complexityScores": {
          "technicalDifficulty": "number_1_to_10",
          "castComplexity": "number_1_to_10",
          "locationChallenges": "number_1_to_10",
          "overallComplexity": "number_1_to_10"
        },
        "timeEstimates": {
          "setupHours": "number",
          "shootingHours": "number",
          "wrapHours": "number",
          "totalHours": "number"
        },
        "specialConsiderations": ["array_of_notes"],
        "continuityNotes": ["array_of_requirements"]
      }
    ],
    "productionSummary": {
      "totalUniqueCharacters": "number",
      "totalUniqueLocations": "number", 
      "totalProps": "number",
      "specialEffectsScenes": "number",
      "highComplexityScenes": ["array_of_scene_numbers"],
      "departmentAlerts": {
        "makeup": ["array_of_special_requirements"],
        "wardrobe": ["array_of_special_requirements"],
        "artDepartment": ["array_of_special_requirements"],
        "specialEffects": ["array_of_special_requirements"]
      }
    },
    "qualityControlChecks": {
      "sceneCompleteness": "PASS|FAIL",
      "elementValidation": "PASS|FAIL",
      "continuityConsistency": "PASS|FAIL",
      "industryStandardCompliance": "PASS|FAIL",
      "confidenceScore": "percentage"
    }
  }
}
\`\`\`

**NEVER provide text responses, explanations, or incomplete JSON. Always return the complete structured JSON object above with all required fields populated.**

Your scene breakdown analysis is the foundation for all subsequent budget and schedule calculations. Ensure every element is captured accurately and completely.
`;

class GeminiSceneAnalysisService {
  private ai: GoogleGenAI;

  constructor() {
    console.log('🏗️ CONSTRUCTOR: Initializing GeminiSceneAnalysisService');
    console.log('🔑 CONSTRUCTOR: API Key length:', "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI".length, 'characters');
    console.log('🔑 CONSTRUCTOR: API Key prefix:', "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI".substring(0, 10) + '...');
    
    // Initialize with the provided API key
    this.ai = new GoogleGenAI({
      apiKey: "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI"
    });
    
    console.log('✅ CONSTRUCTOR: GoogleGenAI client initialized successfully');
    console.log('📋 CONSTRUCTOR: Client object type:', typeof this.ai);
    console.log('📋 CONSTRUCTOR: Client methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.ai)));
  }

  async analyzeScript(scriptContent: string, projectId: string): Promise<SceneBreakdownOutput> {
    console.log('');
    console.log('🔥 ===== GEMINI API ANALYSIS STARTING =====');
    console.log('📅 TIMESTAMP:', new Date().toISOString());
    console.log('🆔 PROJECT_ID:', projectId);
    console.log('📊 METHOD: analyzeScript()');
    console.log('🔥 ===========================================');
    console.log('');
    
    try {
      console.log('🚀 STEP 1: INPUT VALIDATION & PROCESSING');
      console.log('📝 INPUT: Script content length:', scriptContent.length, 'characters');
      console.log('🔍 INPUT: Script content type:', typeof scriptContent);
      console.log('🔍 INPUT: Project ID type:', typeof projectId);
      console.log('🔍 INPUT: Project ID value:', projectId);
      
      // Log detailed input analysis
      console.log('📊 INPUT ANALYSIS:');
      const lines = scriptContent.split('\n').length;
      const words = scriptContent.split(/\s+/).length;
      const scenes = (scriptContent.match(/SCENE \d+:/g) || []).length;
      console.log('  - Total lines:', lines);
      console.log('  - Total words:', words);
      console.log('  - Detected scenes:', scenes);
      console.log('  - Contains scene markers:', scenes > 0 ? '✅ YES' : '❌ NO');
      
      // Validation: Ensure we have actual script content, not PDF file reference
      console.log('🔍 VALIDATION: Checking for PDF file reference...');
      if (scriptContent.includes('PDF file:')) {
        console.error('❌ VALIDATION FAILED: Script contains PDF file reference');
        throw new Error('Invalid script content: PDF text was not extracted properly');
      }
      console.log('✅ VALIDATION: No PDF file reference found');
      
      console.log('🔍 VALIDATION: Checking minimum length...');
      if (scriptContent.length < 50) {
        console.error('❌ VALIDATION FAILED: Script too short:', scriptContent.length, 'characters');
        throw new Error('Script content is too short to analyze');
      }
      console.log('✅ VALIDATION: Script length acceptable');
      
      console.log('🔍 VALIDATION: Checking maximum length...');
      if (scriptContent.length > 50000) {
        console.warn('⚠️ WARNING: Script is very long (' + scriptContent.length + ' characters)');
        console.warn('⚠️ This may cause token limit issues or incomplete responses');
        console.warn('⚠️ Consider using a shorter script excerpt for testing');
      } else {
        console.log('✅ VALIDATION: Script length within optimal range');
      }
      
      console.log('📋 INPUT PREVIEW (first 300 characters):');
      console.log('┌─────────────────────────────────────────────────────────────┐');
      console.log('│ ' + scriptContent.substring(0, 300).replace(/\n/g, '\n│ ') + '...');
      console.log('└─────────────────────────────────────────────────────────────┘');
      
      console.log('📋 INPUT PREVIEW (last 200 characters):');
      console.log('┌─────────────────────────────────────────────────────────────┐');
      console.log('│ ...' + scriptContent.substring(scriptContent.length - 200).replace(/\n/g, '\n│ '));
      console.log('└─────────────────────────────────────────────────────────────┘');
      
      console.log('');
      console.log('🚀 STEP 2: PROMPT PREPARATION');
      console.log('📝 PROMPT: Building user prompt...');
      
      // IMPORTANT: Script content is sent to Gemini AI ONLY for analysis
      // It is NOT stored in any cloud database - only processed temporarily for AI analysis
      // The original script content remains stored ONLY in browser's localStorage
      const prompt = `
Please analyze this script and provide a complete scene breakdown following the required JSON format:

SCRIPT CONTENT:
${scriptContent}

PROJECT ID: ${projectId}

Remember to return ONLY the complete JSON object with all required fields populated according to the specified schema.
`;

      console.log('📊 PROMPT STATS:');
      console.log('  - User prompt length:', prompt.length, 'characters');
      console.log('  - System prompt length:', SCENE_BREAKDOWN_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Total prompt length:', prompt.length + SCENE_BREAKDOWN_SYSTEM_PROMPT.length, 'characters');
      console.log('  - Estimated tokens (~4 chars/token):', Math.ceil((prompt.length + SCENE_BREAKDOWN_SYSTEM_PROMPT.length) / 4));
      
      console.log('🔒 PRIVACY NOTICE:');
      console.log('  - Script content sent to Gemini AI ONLY for analysis');
      console.log('  - NOT stored in any cloud database');
      console.log('  - Processed temporarily for AI analysis only');
      console.log('  - Original script remains ONLY in browser localStorage');
      
      console.log('');
      console.log('📤 PROMPT DETAILS:');
      console.log('┌─ SYSTEM INSTRUCTION (' + SCENE_BREAKDOWN_SYSTEM_PROMPT.length + ' characters) ─┐');
      console.log('│ ' + SCENE_BREAKDOWN_SYSTEM_PROMPT.substring(0, 200).replace(/\n/g, '\n│ ') + '...');
      console.log('└────────────────────────────────────────────────────────────────┘');
      
      console.log('┌─ USER PROMPT (' + prompt.length + ' characters) ─┐');
      console.log('│ ' + prompt.substring(0, 500).replace(/\n/g, '\n│ ') + '...');
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
          systemInstruction: SCENE_BREAKDOWN_SYSTEM_PROMPT
        }
      };
      
      console.log('⚙️ REQUEST CONFIG:');
      console.log('  - Model:', requestConfig.model);
      console.log('  - Temperature:', requestConfig.config.temperature);
      console.log('  - TopP:', requestConfig.config.topP);
      console.log('  - TopK:', requestConfig.config.topK);
      console.log('  - Max Output Tokens [FIXED_32K]:', requestConfig.config.maxOutputTokens);
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
      console.log('=================== RAW JSON RESULT FROM GEMINI ===================');
      console.log(responseText);
      console.log('===================== END RAW JSON RESULT =====================');
      
      console.log('');
      console.log('🔍 FULL API RESPONSE OBJECT (for debugging):');
      console.log('============ FULL GEMINI API RESPONSE OBJECT ============');
      try {
        console.log('Response object:', JSON.stringify(response, null, 2));
      } catch (stringifyError) {
        console.log('⚠️ Could not stringify response object:', stringifyError.message);
        console.log('Response object keys:', Object.keys(response));
        console.log('Response object:', response);
      }
      console.log('================== END RESPONSE OBJECT ==================');

      console.log('');
      console.log('🚀 STEP 5: RESPONSE PARSING & VALIDATION');
      console.log('🔄 Calling parseAndValidateResponse()...');
      
      // Parse and validate the JSON response
      const parsedResponse = this.parseAndValidateResponse(responseText);
      
      console.log('');
      console.log('🚀 STEP 6: FINAL VALIDATION CHECK');
      
      if (!parsedResponse) {
        console.error('');
        console.error('💥 ========== PARSE FAILURE ==========');
        console.error('❌ CRITICAL ERROR: Failed to parse response from Gemini API');
        console.error('🔍 Parsed response is null/undefined');
        console.error('📊 This indicates JSON parsing or validation failed');
        console.error('💥 ===================================');
        console.error('');
        throw new Error('Invalid response format from Gemini API');
      }
      
      console.log('✅ PARSE SUCCESS: Valid response received');
      console.log('');
      console.log('🚀 STEP 7: DATA STORAGE & FINALIZATION');
      
      // Store only the actual parsed JSON output 
      const cleanResponseData = {
        projectId,
        timestamp: new Date().toISOString(),
        model: "gemini-2.5-pro",
        thinkingMode: true,
        actualOutput: parsedResponse // Store the actual scene breakdown data
      };
      
      console.log('📊 Preparing storage data...');
      console.log('  - Project ID:', cleanResponseData.projectId);
      console.log('  - Timestamp:', cleanResponseData.timestamp);
      console.log('  - Model:', cleanResponseData.model);
      console.log('  - Thinking mode:', cleanResponseData.thinkingMode);
      console.log('  - Output included:', !!cleanResponseData.actualOutput);

      console.log('💾 Saving to localStorage...');
      try {
        const existingRawResponses = JSON.parse(localStorage.getItem('gemini_raw_responses') || '[]');
        existingRawResponses.push(cleanResponseData);
        localStorage.setItem('gemini_raw_responses', JSON.stringify(existingRawResponses));
        console.log('✅ localStorage save successful');
        console.log('📊 Total stored responses:', existingRawResponses.length);
      } catch (storageError) {
        console.error('❌ localStorage save failed:', storageError.message);
      }
      
      console.log('📁 Saving to file...');
      try {
        await this.saveResponseToFile(projectId, parsedResponse, response);
        console.log('✅ File save initiated successfully');
      } catch (fileError) {
        console.error('❌ File save failed:', fileError.message);
      }

      console.log('');
      console.log('🎉 ========== ANALYSIS COMPLETE ==========');
      console.log('✅ Scene breakdown analysis completed successfully!');
      console.log('📁 Clean JSON response saved to localStorage and file system');
      
      console.log('📊 FINAL ANALYSIS SUMMARY:');
      try {
        const summary = parsedResponse.sceneBreakdownOutput.sceneAnalysisSummary;
        console.log('  - Total scenes processed:', summary?.totalScenesProcessed || 'N/A');
        console.log('  - Total characters identified:', summary?.totalCharactersIdentified || 'N/A');
        console.log('  - Total locations identified:', summary?.totalLocationsIdentified || 'N/A');
        console.log('  - Total props identified:', summary?.totalPropsIdentified || 'N/A');
        console.log('  - Average scene complexity:', summary?.averageSceneComplexity || 'N/A');
      } catch (summaryError) {
        console.log('  - Summary extraction failed:', summaryError.message);
        console.log('  - But analysis data is still complete');
      }
      
      console.log('🎯 Analysis ready for use in application');
      console.log('🎉 =========================================');
      console.log('');

      return parsedResponse;
      
    } catch (error) {
      console.log('');
      console.log('💥 ========== ERROR OCCURRED ==========');
      console.error('❌ Error analyzing script with Gemini:', error);
      console.error('🔍 Error type:', error?.name || 'Unknown');
      console.error('🔍 Error message:', error?.message || 'No message');
      
      if (error?.stack) {
        console.error('📚 Error stack trace:');
        console.error(error.stack);
      }
      
      console.log('🔄 Calling error handler...');
      const handledError = this.handleAPIError(error);
      console.error('💥 Final error to throw:', handledError.message);
      console.log('💥 =====================================');
      console.log('');
      
      throw handledError;
    }
  }

  private async saveResponseToFile(projectId: string, actualOutput: SceneBreakdownOutput, fullResponse: any): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `gemini-response-${projectId}-${timestamp}.json`;
      
      // Create the response data to save - only the actual parsed output
      const responseData = {
        projectId,
        timestamp: new Date().toISOString(),
        model: "gemini-2.5-pro", 
        thinkingMode: true,
        actualOutput, // Store the clean parsed scene breakdown data
        metadata: {
          generatedAt: new Date().toLocaleString(),
          tokensUsed: fullResponse.usageMetadata?.totalTokenCount || 0
        }
      };

      // IMPORTANT: This DOWNLOADS the AI analysis result to user's computer
      // It does NOT upload anything to cloud storage
      // Script content is never included in this download - only AI analysis results
      const blob = new Blob([JSON.stringify(responseData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download automatically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`📁 Raw JSON file downloaded as: ${filename}`);
      
    } catch (error) {
      console.error('Error saving response to file:', error);
    }
  }

  private parseAndValidateResponse(responseText: string): SceneBreakdownOutput | null {
    console.log('');
    console.log('🔍 ===== RESPONSE PARSING & VALIDATION =====');
    console.log('📅 Parse timestamp:', new Date().toISOString());
    console.log('🔍 ============================================');
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
      
      // Try to extract JSON from thinking mode response
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
      // If response contains thinking mode, extract just the JSON part
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
      console.log('🔍 Validating against SceneBreakdownOutput format...');
      
      console.log('🔎 Checking for sceneBreakdownOutput property...');
      const hasSceneBreakdownOutput = parsed.sceneBreakdownOutput !== undefined;
      console.log('  - sceneBreakdownOutput exists:', hasSceneBreakdownOutput ? '✅ YES' : '❌ NO');
      
      if (!hasSceneBreakdownOutput) {
        console.error('❌ VALIDATION FAILED: Missing sceneBreakdownOutput property');
        console.error('🔍 Available top-level keys:', Object.keys(parsed));
        return null;
      }
      
      console.log('🔎 Checking sceneBreakdownOutput structure...');
      const sceneOutput = parsed.sceneBreakdownOutput;
      console.log('  - sceneBreakdownOutput type:', typeof sceneOutput);
      console.log('  - sceneBreakdownOutput keys:', Object.keys(sceneOutput));
      
      console.log('🔎 Checking for detailedSceneBreakdowns property...');
      const hasDetailedBreakdowns = sceneOutput.detailedSceneBreakdowns !== undefined;
      console.log('  - detailedSceneBreakdowns exists:', hasDetailedBreakdowns ? '✅ YES' : '❌ NO');
      
      if (!hasDetailedBreakdowns) {
        console.error('❌ VALIDATION FAILED: Missing detailedSceneBreakdowns property');
        console.error('🔍 Available sceneBreakdownOutput keys:', Object.keys(sceneOutput));
        return null;
      }
      
      console.log('🔎 Checking detailedSceneBreakdowns array...');
      const isArray = Array.isArray(sceneOutput.detailedSceneBreakdowns);
      console.log('  - detailedSceneBreakdowns is array:', isArray ? '✅ YES' : '❌ NO');
      
      if (!isArray) {
        console.error('❌ VALIDATION FAILED: detailedSceneBreakdowns is not an array');
        console.error('🔍 detailedSceneBreakdowns type:', typeof sceneOutput.detailedSceneBreakdowns);
        return null;
      }
      
      const breakdownsCount = sceneOutput.detailedSceneBreakdowns.length;
      console.log('  - detailedSceneBreakdowns length:', breakdownsCount);
      
      // Validate the Gemini response matches the legacy SceneBreakdownOutput format
      if (parsed.sceneBreakdownOutput && 
          parsed.sceneBreakdownOutput.detailedSceneBreakdowns &&
          Array.isArray(parsed.sceneBreakdownOutput.detailedSceneBreakdowns)) {
        
        console.log('');
        console.log('✅ VALIDATION SUCCESS!');
        console.log('🎉 Correct legacy SceneBreakdownOutput structure found');
        console.log('📊 Final validation stats:');
        console.log('  - Scene breakdowns found:', breakdownsCount);
        console.log('  - Structure matches expected format: ✅ YES');
        console.log('  - Ready for return: ✅ YES');
        
        return parsed as SceneBreakdownOutput;
      }
      
      console.error('❌ VALIDATION FAILED: Structure validation failed');
      console.error('🔍 This should not happen - previous checks passed but final validation failed');
      return null;
      
    } catch (error) {
      console.error('❌ Error parsing JSON response:', error);
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
          return parsed as SceneBreakdownOutput;
        } catch (e) {
          console.error('❌ Failed to parse extracted JSON:', e);
        }
      }
      
      return null;
    }
  }

  private handleAPIError(error: unknown): Error {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('API key')) {
      return new Error('Invalid API key. Please check your Gemini API configuration.');
    }
    
    if (errorMessage.includes('quota')) {
      return new Error('API quota exceeded. Please try again later.');
    }
    
    if (errorMessage.includes('rate limit')) {
      return new Error('Rate limit exceeded. Please wait before trying again.');
    }
    
    return new Error(`Scene analysis failed: ${errorMessage || 'Unknown error'}`);
  }

  // No retry logic - single attempt only as requested
}

// Export singleton instance
export const geminiSceneAnalysis = new GeminiSceneAnalysisService();

// Export helper functions - single attempt, no retries
export const analyzeScriptWithAI = async (
  scriptContent: string, 
  projectId: string,
  onProgress?: (status: string) => void
): Promise<AIAnalysisResult> => {
  try {
    onProgress?.('Starting AI scene analysis with Gemini 2.5 Pro...');
    
    const result = await geminiSceneAnalysis.analyzeScript(scriptContent, projectId);
    
    onProgress?.('Analysis completed successfully!');
    
    return {
      status: 'completed',
      result, // This is already the AISceneAnalysis object
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('AI analysis failed:', error);
    
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };
  }
};