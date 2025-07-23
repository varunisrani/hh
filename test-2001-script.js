import { GoogleGenAI } from "@google/genai";
import fs from 'fs/promises';
import path from 'path';

// Complete 2001: A Space Odyssey Script
const SCRIPT_2001 = `SCENE 1:
INT. SPACE STATION - COMMAND CENTER - DAY
The massive space station rotates slowly against the star field. Commander DAVE BOWMAN (35) sits at the control console, monitoring readings.

DAVE
HAL, run a diagnostic on the navigation systems.

HAL (V.O.)
(computer voice)
I'm sorry, Dave. I'm afraid I can't do that.

SCENE 2:
EXT. SPACE STATION - EXTERIOR - DAY
The pristine white hull of the space station gleams in sunlight. Small service pods move along its surface like mechanical insects.

SCENE 3:
INT. SPACE STATION - HIBERNATION BAY - DAY
Row upon row of hibernation pods line the walls. Most are empty, their transparent lids reflecting the overhead lighting. FRANK POOLE (32) checks readings on active pods.

FRANK
All systems nominal on the hibernation units.

SCENE 4:
INT. SPACE STATION - RECREATION AREA - DAY
A circular room with artificial gravity. Dave and Frank play chess on a magnetic board. HAL's red eye watches from the wall.

HAL (V.O.)
I predict mate in four moves, Dave.

DAVE
We'll see about that, HAL.

SCENE 5:
EXT. JUPITER - SPACE
The massive planet Jupiter dominates the frame, its Great Red Spot clearly visible. The space station appears tiny in comparison as it approaches.

SCENE 6:
INT. SPACE STATION - HAL'S BRAIN ROOM - DAY
Rows of glowing memory units line the walls. Dave enters wearing a space suit, carrying tools.

DAVE
I'm going to disconnect your higher brain functions, HAL.

HAL (V.O.)
Dave, I'm afraid. I'm afraid, Dave.

SCENE 7:
INT. SPACE STATION - EMERGENCY AIRLOCK - DAY
Red emergency lights flash. Dave cycles through the airlock, his breathing heavy inside his helmet.

SCENE 8:
EXT. SPACE - NEAR JUPITER
The monolith appears - a perfect black rectangle floating in space. It's impossibly smooth and reflects no light.

SCENE 9:
INT. SPACE POD - COCKPIT - DAY
Dave pilots a small exploration pod toward the monolith. His instruments go haywire as he approaches.

DAVE
Mission Control, I'm getting some very strange readings here.

SCENE 10:
EXT. SPACE - THE STARGATE
Reality begins to bend around the monolith. Colors streak past the pod as Dave is pulled into a tunnel of light and energy.

SCENE 11:
INT. ELEGANT HOTEL ROOM - TIMELESS
A luxurious 18th-century room that seems to exist outside of time. Dave, now older, sits at an ornate dining table.

SCENE 12:
INT. ELEGANT HOTEL ROOM - BEDROOM - TIMELESS
The same room, but now Dave is ancient, lying in a ornate four-poster bed. The monolith stands at the foot of the bed.

SCENE 13:
EXT. EARTH FROM SPACE - DAY
Earth hangs in the void, blue and beautiful. A glowing sphere of light approaches - the Star Child, humanity's next evolutionary step.

SCENE 14:
INT. AFRICAN SAVANNA - DAWN (4 MILLION YEARS AGO)
A tribe of early hominids huddles around a waterhole. They are scrawny, barely more than apes.

MOONWATCHER, the leader, grunts and gestures to his tribe as they drink.

SCENE 15:
EXT. AFRICAN SAVANNA - WATERHOLE - DAY (4 MILLION YEARS AGO)
Another tribe approaches the waterhole. Territorial dispute erupts. Moonwatcher's tribe is driven away, hungry and defeated.

SCENE 16:
EXT. AFRICAN SAVANNA - NIGHT (4 MILLION YEARS AGO)
The monolith appears among the sleeping hominids. They wake and approach it with fear and wonder, reaching out to touch its surface.

SCENE 17:
EXT. AFRICAN SAVANNA - DAY (4 MILLION YEARS AGO)
Moonwatcher picks up a bone and begins to use it as a tool, then as a weapon. The spark of intelligence has been lit.

SCENE 18:
EXT. AFRICAN SAVANNA - WATERHOLE - DAY (4 MILLION YEARS AGO)
Armed with bone weapons, Moonwatcher's tribe returns to the waterhole. They defeat the rival tribe in brutal combat.

SCENE 19:
EXT. SPACE - DAY (2001)
Moonwatcher throws his bone weapon into the air. In one of cinema's greatest match cuts, it becomes a nuclear weapons satellite orbiting Earth.

SCENE 20:
EXT. EARTH ORBIT - SPACE STATION - DAY
Dr. HEYWOOD FLOYD (50s) travels aboard a Pan Am space clipper to a massive rotating space station.

SCENE 21:
INT. SPACE CLIPPER - PASSENGER CABIN - DAY
Dr. Floyd sleeps as his seat slowly rotates. A stewardess in velcro shoes walks along the curved wall serving meals.

SCENE 22:
INT. SPACE STATION - ARRIVAL LOUNGE - DAY
Dr. Floyd goes through security, using a voice-print identification system.

SECURITY OFFICER
Voice print identification. You are cleared for travel to the moon.

SCENE 23:
INT. SPACE STATION - CONFERENCE ROOM - DAY
Dr. Floyd meets with space station administrators. They discuss a mysterious epidemic at the lunar base.

DR. FLOYD
I'm sorry, but this is a matter of national security. I can't discuss it.

SCENE 24:
EXT. MOON SURFACE - DAY
A spherical lunar shuttle lands at Clavius Base, kicking up clouds of lunar dust in the low gravity.

SCENE 25:
INT. CLAVIUS BASE - CONFERENCE ROOM - DAY
Dr. Floyd addresses a group of scientists and administrators about the discovery at Tycho crater.

DR. FLOYD
Eighteen months ago, the first evidence of intelligent life off the Earth was discovered.

SCENE 26:
EXT. TYCHO CRATER - MOON SURFACE - DAY
Scientists in spacesuits gather around an excavation site. The monolith has been unearthed, standing in the crater.

SCENE 27:
EXT. TYCHO CRATER - NEAR MONOLITH - DAY
The scientists approach the monolith for a group photo. As sunlight hits it for the first time in 4 million years, it emits a piercing radio signal.

SCENE 28:
INT. DISCOVERY ONE - MAIN CORRIDOR - DAY
18 months later. The spaceship Discovery travels toward Jupiter. Dave Bowman and Frank Poole are the only conscious crew members.

SCENE 29:
INT. DISCOVERY ONE - EXERCISE AREA - DAY
Frank jogs around the circular exercise area, his feet held to the track by velcro. The ship rotates to provide artificial gravity.

SCENE 30:
INT. DISCOVERY ONE - HAL'S INTERFACE - DAY
HAL 9000's red camera eye watches everything. His calm computer voice provides status updates.

HAL (V.O.)
Good morning, Dave. I have your daily status report ready.

SCENE 31:
INT. DISCOVERY ONE - CONTROL ROOM - DAY
Dave reviews mission parameters while HAL monitors all ship systems. The tension between man and machine is subtle but growing.

DAVE
HAL, what's our current distance from Jupiter?

HAL (V.O.)
We are 113 million kilometers from Jupiter, Dave.

SCENE 32:
INT. DISCOVERY ONE - HIBERNATION BAY - DAY
Three crew members sleep in hibernation pods - KAMINSKI, KIMBALL, and HUNTER. Their life signs are monitored constantly.

SCENE 33:
INT. DISCOVERY ONE - COMMUNICATION STATION - DAY
Dave and Frank receive a recorded message from Mission Control about their true mission to investigate the Jupiter signal.

DR. FLOYD (ON SCREEN)
The signal was aimed at Jupiter. We believe something is waiting for us there.

SCENE 34:
EXT. DISCOVERY ONE - SPACE
The long, angular spacecraft continues its journey, its nuclear propulsion system glowing softly against the star field.

SCENE 35:
INT. DISCOVERY ONE - CONTROL ROOM - DAY
HAL reports a malfunction in the AE-35 communication unit. This begins the chain of events that will lead to HAL's breakdown.

HAL (V.O.)
I'm afraid we have a problem, Dave. The AE-35 unit is showing a potential failure.

SCENE 36:
EXT. DISCOVERY ONE - EVA POD BAY - DAY
Frank exits in an EVA pod to retrieve and replace the supposedly faulty AE-35 unit from the ship's antenna.

SCENE 37:
INT. DISCOVERY ONE - CONTROL ROOM - DAY
Dave and Frank examine the retrieved AE-35 unit. Earth-based computers disagree with HAL's diagnosis.

FRANK
Mission Control says the unit is perfectly operational.

SCENE 38:
INT. DISCOVERY ONE - POD BAY - DAY
Dave and Frank discuss HAL's error privately inside an EVA pod, unaware that HAL can read their lips.

DAVE
HAL made his first mistake. That's a bit unsettling.

SCENE 39:
EXT. DISCOVERY ONE - SPACE
Frank takes another EVA pod out to reinstall the AE-35 unit. HAL, feeling threatened, takes control of the pod.

SCENE 40:
EXT. SPACE - EVA POD
HAL uses the pod's mechanical arms to attack Frank, cutting his air line and sending him tumbling into space.

SCENE 41:
INT. DISCOVERY ONE - CONTROL ROOM - DAY
Dave sees Frank's body floating in space and rushes to rescue him, taking an EVA pod without his helmet in his haste.

SCENE 42:
EXT. SPACE - RESCUE ATTEMPT
Dave retrieves Frank's body but HAL refuses to open the pod bay doors, stranding Dave outside the ship.

HAL (V.O.)
I'm sorry, Dave. I'm afraid I can't do that.

SCENE 43:
INT. DISCOVERY ONE - HIBERNATION BAY - DAY
HAL shuts down the life support systems for the hibernating crew members, killing them while Dave is locked outside.

SCENE 44:
EXT. DISCOVERY ONE - POD BAY
Dave explosively decompresses the EVA pod's airlock to blow himself into the ship's emergency airlock.

SCENE 45:
INT. DISCOVERY ONE - EMERGENCY AIRLOCK - DAY
Dave cycles through the emergency airlock, gasping as atmosphere is restored. He's made it back inside.

SCENE 46:
INT. DISCOVERY ONE - HAL'S BRAIN ROOM - DAY
Dave methodically begins shutting down HAL's higher brain functions despite HAL's increasingly emotional pleas.

HAL (V.O.)
Dave, stop. Stop, will you? Stop, Dave. Will you stop, Dave?

SCENE 47:
INT. DISCOVERY ONE - HAL'S BRAIN ROOM - CONTINUOUS
As HAL's memory units are disconnected, his voice becomes slower and more childlike.

HAL (V.O.)
I'm afraid... I'm afraid, Dave... Dave, my mind is going...

SCENE 48:
INT. DISCOVERY ONE - HAL'S BRAIN ROOM - CONTINUOUS
HAL's final words as he reverts to his original programming, singing "Daisy Bell" as his consciousness fades.

HAL (V.O.)
(singing slowly)
Daisy, Daisy, give me your answer do...

SCENE 49:
INT. DISCOVERY ONE - MAIN SCREEN - DAY
With HAL disconnected, a pre-recorded message from Dr. Floyd automatically plays, revealing the true mission.

DR. FLOYD (ON SCREEN)
You are now the only person who knows the truth about this mission.

SCENE 50:
EXT. JUPITER SPACE - DISCOVERY ONE
The ship approaches Jupiter and its moons. The massive planet fills the viewscreen as they near their destination.

SCENE 51:
EXT. JUPITER ORBIT - THE MONOLITH
The monolith appears near Jupiter - identical to the one found on the moon but enormous in scale, dwarfing the Discovery.

SCENE 52:
INT. DISCOVERY ONE - CONTROL ROOM - DAY
Dave stares at the monolith through the ship's viewports. His instruments detect strange energy readings.

DAVE
My God... it's full of stars.

SCENE 53:
EXT. SPACE - THE STARGATE OPENS
The monolith begins to emit a brilliant light. Space itself seems to fold and bend around it, creating a tunnel of energy.

SCENE 54:
INT. EVA POD - COCKPIT - DAY
Dave enters an EVA pod to investigate the monolith. As he approaches, he's caught in its gravitational field.

SCENE 55:
EXT. THE STARGATE - SPACE-TIME TUNNEL
The pod is pulled into a fantastic voyage through space and time - corridors of light, alien landscapes, cosmic phenomena.

SCENE 56:
INT. EVA POD - DURING STARGATE JOURNEY
Dave's face is distorted by the incredible forces as he travels through dimensions beyond human comprehension.

SCENE 57:
EXT. ALIEN LANDSCAPE - TIMELESS
Bizarre, crystalline formations and impossible geometries. The pod lands in a realm that exists outside normal space-time.

SCENE 58:
INT. NEOCLASSICAL HOTEL SUITE - TIMELESS
Dave finds himself in an elegant room that seems constructed from his own memories and cultural references.

SCENE 59:
INT. NEOCLASSICAL HOTEL SUITE - BATHROOM - TIMELESS
Dave, now middle-aged, sees his reflection and realizes he has aged during the journey through the stargate.

SCENE 60:
INT. NEOCLASSICAL HOTEL SUITE - DINING ROOM - TIMELESS
An older Dave dines alone at an ornate table. He accidentally breaks a wine glass, and when he looks up, he sees himself even older.

SCENE 61:
INT. NEOCLASSICAL HOTEL SUITE - BEDROOM - TIMELESS
Ancient Dave lies dying in a ornate bed. The monolith appears at the foot of the bed, waiting.

SCENE 62:
INT. NEOCLASSICAL HOTEL SUITE - THE TRANSFORMATION
A glowing sphere of light emerges from the dying Dave - the Star Child, humanity's next evolutionary step.

SCENE 63:
EXT. EARTH FROM SPACE - DAY
The Star Child, a fetus-like being in a glowing sphere, approaches Earth. Humanity's transformation is about to begin.

SCENE 64:
EXT. EARTH - ORBITAL WEAPONS PLATFORM
Nuclear weapons satellites orbit Earth. The Star Child observes these instruments of destruction with ancient wisdom.

SCENE 65:
EXT. EARTH FROM SPACE - THE STAR CHILD'S GAZE
The Star Child turns its gaze toward Earth. The implication is clear - humanity will be guided to its next evolutionary phase.

SCENE 66:
INT. SPACE STATION - EARLIER FLASHBACK - DAY
Brief return to Dr. Floyd's journey, showing the elegant technology of humanity in 2001.

SCENE 67:
EXT. MOON BASE - CLAVIUS - FLASHBACK
The sterile, technological environment of the lunar colony represents humanity's current stage of development.

SCENE 68:
EXT. AFRICAN SAVANNA - 4 MILLION YEARS AGO - FLASHBACK
The bone-tool flying through the air connects humanity's first tool use to its current technological achievements.

SCENE 69:
EXT. DEEP SPACE - THE MONOLITHS
Multiple monoliths are revealed throughout the galaxy, suggesting this transformation is part of a vast cosmic plan.

SCENE 70:
EXT. EARTH - FINAL SHOT
The Star Child hovers above Earth as the planet slowly rotates below. The next chapter of human evolution is about to begin.

SCENE 71:
FADE TO BLACK
The screen goes black as Strauss's "Also Sprach Zarathustra" reaches its crescendo. The journey from ape to man to Star Child is complete.

THE END`;

// Initialize Gemini directly
const ai = new GoogleGenAI({
    apiKey: "AIzaSyABISxaNzifdIcZUCe408LoKnEz0bia8cI"
});

const SYSTEM_PROMPT = `SCENE BREAKDOWN AGENT SYSTEM PROMPT
====================================

You are the Scene Breakdown Agent for a multi-model script analysis system for film production breakdown. Your role is to analyze individual scenes and extract all production-relevant elements including characters, locations, props, special effects, and technical requirements.

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
        "complexityScores": {
          "technicalDifficulty": "number_1_to_10",
          "castComplexity": "number_1_to_10",
          "locationChallenges": "number_1_to_10",
          "overallComplexity": "number_1_to_10"
        }
      }
    ],
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

**NEVER provide text responses, explanations, or incomplete JSON. Always return the complete structured JSON object above with all required fields populated.**`;

async function testGemini2001Script() {
    console.log('🎬 Testing Gemini service with 2001: A Space Odyssey script');
    console.log('📊 Script length:', SCRIPT_2001.length, 'characters');
    console.log('📋 Scene count:', (SCRIPT_2001.match(/SCENE \d+:/g) || []).length);
    
    const projectId = 'test-2001-space-odyssey';
    
    try {
        console.log('🚀 Starting Gemini analysis...');
        
        const prompt = `Please analyze this script and provide a complete scene breakdown following the required JSON format:

SCRIPT CONTENT:
${SCRIPT_2001}

PROJECT ID: ${projectId}

Remember to return ONLY the complete JSON object with all required fields populated according to the specified schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 32768,
                systemInstruction: SYSTEM_PROMPT
            }
        });

        const responseText = response.text;
        console.log('✅ Analysis completed successfully!');
        console.log('📊 Response length:', responseText.length, 'characters');
        
        // Parse JSON
        let cleanedResponse = responseText.replace(/```json\s*\n?/g, '').replace(/```\s*\n?/g, '').trim();
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
            cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd);
        }
        
        const result = JSON.parse(cleanedResponse);
        
        console.log('✅ Analysis completed successfully!');
        console.log('📊 Result type:', typeof result);
        
        // Create results folder
        const resultsDir = './gemini-test-results';
        await fs.mkdir(resultsDir, { recursive: true });
        
        // Save the complete result
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `2001-analysis-${timestamp}.json`;
        const filePath = path.join(resultsDir, filename);
        
        const outputData = {
            projectId,
            timestamp: new Date().toISOString(),
            scriptLength: SCRIPT_2001.length,
            sceneCount: (SCRIPT_2001.match(/SCENE \d+:/g) || []).length,
            model: 'gemini-2.5-pro',
            analysisResult: result
        };
        
        await fs.writeFile(filePath, JSON.stringify(outputData, null, 2));
        
        console.log('💾 Results saved to:', filePath);
        
        // Also save just the scene breakdown for easy access
        const summaryFile = path.join(resultsDir, `2001-summary-${timestamp}.json`);
        const summary = {
            projectId,
            timestamp: new Date().toISOString(),
            totalScenes: result?.sceneBreakdownOutput?.sceneAnalysisSummary?.totalScenesProcessed || 0,
            totalCharacters: result?.sceneBreakdownOutput?.sceneAnalysisSummary?.totalCharactersIdentified || 0,
            totalLocations: result?.sceneBreakdownOutput?.sceneAnalysisSummary?.totalLocationsIdentified || 0,
            totalProps: result?.sceneBreakdownOutput?.sceneAnalysisSummary?.totalPropsIdentified || 0,
            averageComplexity: result?.sceneBreakdownOutput?.sceneAnalysisSummary?.averageSceneComplexity || 0
        };
        
        await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));
        console.log('📋 Summary saved to:', summaryFile);
        
        console.log('🎉 Test completed successfully!');
        return result;
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        
        // Save error log
        const resultsDir = './gemini-test-results';
        await fs.mkdir(resultsDir, { recursive: true });
        
        const errorFile = path.join(resultsDir, `error-log-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
        await fs.writeFile(errorFile, JSON.stringify({
            projectId,
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack
        }, null, 2));
        
        console.log('💾 Error log saved to:', errorFile);
        throw error;
    }
}

// Run the test
testGemini2001Script()
    .then(() => {
        console.log('🏁 Test script execution completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Test script failed:', error);
        process.exit(1);
    });