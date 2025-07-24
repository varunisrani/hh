
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { performance } = require('perf_hooks');

class FilmScriptAnalyzer {
    constructor(pdfPath, scriptName) {
        this.pdfPath = pdfPath;
        this.scriptName = scriptName;
        this.outputDir = path.join(__dirname, 'analysis_outputs', `${scriptName}_outputs`);

        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Initialize data structures
        this.scenes = [];
        this.dialogues = [];
        this.characters = new Set();
        this.movieCharacters = [];
    }

    async extractPdfText() {
        console.log(`📖 Extracting text from ${this.scriptName} PDF...`);
        try {
            const dataBuffer = fs.readFileSync(this.pdfPath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            console.error(`❌ Error extracting PDF: ${error.message}`);
            return "";
        }
    }

    parseScreenplay(text) {
        console.log(`🎬 Parsing ${this.scriptName} screenplay structure...`);

        const lines = text.split('\n');
        let currentScene = null;
        let currentSceneAction = "";
        let currentSceneCharacters = [];
        let currentSceneDialogues = [];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            const sceneMatch = trimmedLine.match(/^(?:\d+\s+)?(INT\.|EXT\.|INTERIOR|EXTERIOR)\s+(.+)/i);
            if (sceneMatch) {
                if (currentScene) {
                    this.scenes.push({
                        Scene_Names: currentScene,
                        Scene_action: currentSceneAction.trim(),
                        Scene_Characters: currentSceneCharacters.length > 0 ? [...currentSceneCharacters] : null,
                        Scene_Dialogue: currentSceneDialogues.length > 0 ? [...currentSceneDialogues] : null,
                        Contents: `${currentSceneAction.trim()}\n${currentSceneDialogues.join(' ')}`
                    });
                }
                currentScene = trimmedLine;
                currentSceneAction = "";
                currentSceneCharacters = [];
                currentSceneDialogues = [];
            } else if (trimmedLine.includes(':')) {
                // More flexible character dialogue pattern
                const charMatch = trimmedLine.match(/^([A-Z][A-Z\s'().-]{1,49}):\s*(.*)/);
                if (charMatch) {
                    let character = charMatch[1].trim().replace(/\s*\(.*?\)/, '').replace(/\s+/g, ' ').trim();
                    const dialogue = charMatch[2].trim();
                    
                    // Filter out obvious non-character patterns
                    const invalidPatterns = /^(INT|EXT|FADE|CUT|INTERIOR|EXTERIOR|SCENE|THE|AND|OR|TO|IN|ON|AT|TIME|PLACE|LOCATION)$/i;
                    
                    if (character && character.length > 1 && !invalidPatterns.test(character)) {
                        this.characters.add(character);
                        if (!currentSceneCharacters.includes(character)) {
                            currentSceneCharacters.push(character);
                        }
                        if (dialogue) {
                            currentSceneDialogues.push(dialogue);
                            this.dialogues.push({
                                characters: character,
                                Character_dialogue: dialogue
                            });
                        }
                    }
                }
            } else if (/^[A-Z'\s]+$/.test(trimmedLine) && trimmedLine.length > 2 && trimmedLine.length < 30) {
                let character = trimmedLine.trim().replace(/\s*\(.*?\)/, '');
                if (character && !['THE', 'AND', 'OR', 'TO', 'IN', 'ON', 'AT'].includes(character)) {
                    this.characters.add(character);
                    if (!currentSceneCharacters.includes(character)) {
                        currentSceneCharacters.push(character);
                    }
                }
            } else if (/^[A-Z][A-Z\s'().]+$/.test(trimmedLine) && trimmedLine.length < 50) {
                let character = trimmedLine.trim().replace(/\s*\(.*?\)/, '');
                if (character) {
                    this.characters.add(character);
                    if (!currentSceneCharacters.includes(character)) {
                        currentSceneCharacters.push(character);
                    }
                }
            } else {
                currentSceneAction += " " + trimmedLine;
            }
        }

        if (currentScene) {
            this.scenes.push({
                Scene_Names: currentScene,
                Scene_action: currentSceneAction.trim(),
                Scene_Characters: currentSceneCharacters.length > 0 ? [...currentSceneCharacters] : null,
                Scene_Dialogue: currentSceneDialogues.length > 0 ? [...currentSceneDialogues] : null,
                Contents: `${currentSceneAction.trim()}\n${currentSceneDialogues.join(' ')}`
            });
        }
        this.movieCharacters = Array.from(this.characters).sort();
    }

    saveAllScenes() {
        console.log(`💾 Saving ALL ${this.scriptName} scenes...`);
        const filePath = path.join(this.outputDir, 'ALL_SCENES_COMPLETE.txt');
        let content = `${this.scriptName.toUpperCase()} - ALL SCENES COMPLETE\n`;
        content += `Complete extraction of all ${this.scenes.length} scenes\n`;
        content += "=".repeat(80) + "\n\n";

        this.scenes.forEach((scene, idx) => {
            content += `SCENE ${idx + 1}:\n`;
            content += "-".repeat(40) + "\n";
            content += `Scene Name: ${scene.Scene_Names}\n`;
            content += `Scene Action: ${scene.Scene_action}\n`;
            content += `Characters: ${scene.Scene_Characters ? scene.Scene_Characters.join(', ') : 'None'}\n`;
            content += `Dialogues: ${scene.Scene_Dialogue ? scene.Scene_Dialogue.join(' | ') : 'None'}\n`;
            content += `Complete Content: ${scene.Contents}\n`;
            content += "=".repeat(80) + "\n\n";
        });

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ ALL ${this.scenes.length} scenes saved`);
    }

    saveAllDialogues() {
        console.log(`💾 Saving ALL ${this.scriptName} dialogues...`);
        const filePath = path.join(this.outputDir, 'ALL_DIALOGUES_COMPLETE.txt');
        let content = `${this.scriptName.toUpperCase()} - ALL DIALOGUES COMPLETE\n`;
        content += `Complete extraction of all ${this.dialogues.length} dialogue entries\n`;
        content += "=".repeat(80) + "\n\n";

        this.dialogues.forEach((dialogue, idx) => {
            content += `DIALOGUE ${idx + 1}:\n`;
            content += "-".repeat(40) + "\n";
            content += `Character: ${dialogue.characters}\n`;
            content += `Dialogue: ${dialogue.Character_dialogue}\n`;
            content += "-".repeat(40) + "\n";
        });

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ ALL ${this.dialogues.length} dialogues saved`);
    }

    saveAllCharacters() {
        console.log(`💾 Saving ALL ${this.scriptName} characters...`);
        const filePath = path.join(this.outputDir, 'ALL_CHARACTERS_COMPLETE.txt');
        
        const characterCounts = this.dialogues.reduce((acc, dialogue) => {
            acc[dialogue.characters] = (acc[dialogue.characters] || 0) + 1;
            return acc;
        }, {});

        const sortedCharactersByCount = Object.entries(characterCounts).sort((a, b) => b[1] - a[1]);

        let content = `${this.scriptName.toUpperCase()} - ALL CHARACTERS COMPLETE\n`;
        content += `Complete list of all ${this.movieCharacters.length} characters\n`;
        content += "=".repeat(80) + "\n\n";

        if (sortedCharactersByCount.length > 0) {
            content += "CHARACTER RANKING BY DIALOGUE COUNT:\n";
            content += "-".repeat(40) + "\n";
            sortedCharactersByCount.forEach(([character, count], idx) => {
                content += `${(idx + 1).toString().padStart(2, ' ')}. ${character}: ${count} dialogues\n`;
            });
        }

        content += `\nALL CHARACTERS IDENTIFIED:\n`;
        content += "-".repeat(40) + "\n";
        this.movieCharacters.forEach((character, idx) => {
            const dialogueCount = characterCounts[character] || 0;
            content += `${(idx + 1).toString().padStart(2, ' ')}. ${character} (${dialogueCount} dialogues)\n`;
        });

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ ALL ${this.movieCharacters.length} characters saved`);
    }

    saveCharacterInteractions() {
        console.log(`💾 Saving ${this.scriptName} character interactions...`);
        const filePath = path.join(this.outputDir, 'ALL_CHARACTER_INTERACTIONS.txt');
        const interactions = {};

        this.scenes.forEach(scene => {
            if (scene.Scene_Characters && scene.Scene_Characters.length > 1) {
                const uniqueChars = [...new Set(scene.Scene_Characters)];
                for (let i = 0; i < uniqueChars.length; i++) {
                    for (let j = i + 1; j < uniqueChars.length; j++) {
                        const pair = [uniqueChars[i], uniqueChars[j]].sort().join(' ↔ ');
                        interactions[pair] = (interactions[pair] || 0) + 1;
                    }
                }
            }
        });

        const sortedInteractions = Object.entries(interactions).sort((a, b) => b[1] - a[1]);

        let content = `${this.scriptName.toUpperCase()} - ALL CHARACTER INTERACTIONS\n`;
        content += `Complete character interaction analysis\n`;
        content += `Total character pairs found: ${sortedInteractions.length}\n`;
        content += "=".repeat(80) + "\n\n";
        content += "CHARACTER PAIRS (Sorted by co-occurrence):\n";
        content += "-".repeat(50) + "\n";
        sortedInteractions.forEach(([pair, count], idx) => {
            content += `${(idx + 1).toString().padStart(3, ' ')}. ${pair}: ${count} scenes together\n`;
        });

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ ${sortedInteractions.length} character interactions saved`);
    }

    saveCompleteSummary() {
        console.log(`💾 Saving ${this.scriptName} complete summary...`);
        const filePath = path.join(this.outputDir, 'COMPLETE_ANALYSIS_SUMMARY.txt');

        const characterCounts = this.dialogues.reduce((acc, dialogue) => {
            acc[dialogue.characters] = (acc[dialogue.characters] || 0) + 1;
            return acc;
        }, {});
        const sortedCharactersByCount = Object.entries(characterCounts).sort((a, b) => b[1] - a[1]);

        let content = `${this.scriptName.toUpperCase()} - COMPLETE ANALYSIS SUMMARY\n`;
        content += `Full extraction and analysis of ${this.scriptName} screenplay\n`;
        content += "=".repeat(80) + "\n\n";
        content += "EXTRACTION RESULTS:\n";
        content += "-".repeat(20) + "\n";
        content += `Total Scenes: ${this.scenes.length}\n`;
        content += `Total Dialogues: ${this.dialogues.length}\n`;
        content += `Total Characters: ${this.movieCharacters.length}\n`;

        if (sortedCharactersByCount.length > 0) {
            content += `\nTOP 10 CHARACTERS BY DIALOGUE COUNT:\n`;
            content += "-".repeat(40) + "\n";
            sortedCharactersByCount.slice(0, 10).forEach(([character, count], idx) => {
                content += `${(idx + 1).toString().padStart(2, ' ')}. ${character}: ${count} dialogues\n`;
            });
        }

        content += `\nFILES GENERATED:\n`;
        content += "-".repeat(16) + "\n";
        content += `1. ALL_SCENES_COMPLETE.txt - All ${this.scenes.length} scenes\n`;
        content += "2. ALL_DIALOGUES_COMPLETE.txt - All dialogue entries\n";
        content += "3. ALL_CHARACTERS_COMPLETE.txt - All character details\n";
        content += "4. ALL_CHARACTER_INTERACTIONS.txt - Character relationships\n";
        content += "5. COMPLETE_ANALYSIS_SUMMARY.txt - This summary\n";

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log("✅ Complete summary saved");
    }

    async runCompleteAnalysis() {
        console.log(`\n🎬 ${this.scriptName.toUpperCase()} COMPLETE ANALYZER`);
        console.log("Extracting ALL scenes, dialogues, and characters");
        console.log("=".repeat(60));

        try {
            const text = await this.extractPdfText();
            if (!text) {
                console.error(`❌ Failed to extract text from ${this.scriptName}`);
                throw new Error(`Failed to extract text from ${this.scriptName}`);
            }
            this.parseScreenplay(text);
            
            this.saveAllScenes();
            this.saveAllDialogues();
            this.saveAllCharacters();
            this.saveCharacterInteractions();
            this.saveCompleteSummary();

            console.log(`\n🎉 ${this.scriptName.toUpperCase()} ANALYSIS FINISHED!`);
            console.log(`📁 All files saved to: ${this.outputDir}`);
            console.log(`🎭 Analyzed ${this.movieCharacters.length} characters`);
            console.log(`🎬 Processed ${this.scenes.length} scenes`);
            console.log(`💬 Extracted ${this.dialogues.length} dialogues`);
            
            // Return structured data instead of boolean
            return {
                scriptName: this.scriptName,
                totalScenes: this.scenes.length,
                totalDialogues: this.dialogues.length,
                totalCharacters: this.movieCharacters.length,
                scenes: this.scenes,
                dialogues: this.dialogues,
                characters: this.movieCharacters,
                outputDir: this.outputDir
            };
        } catch (error) {
            console.error(`❌ ${this.scriptName} analysis failed: ${error.message}`);
            console.error(error.stack);
            throw error;
        }
    }
}

// Export the class for use by server
module.exports = { FilmScriptAnalyzer };

// Optional: Allow direct execution for testing
if (require.main === module) {
    async function main() {
        const pdfPath = "/Users/varunisrani/Downloads/BLACK_PANTHER.pdf";
        const scriptName = "BLACK_PANTHER_JS";

        if (!fs.existsSync(pdfPath)) {
            console.error(`❌ PDF not found: ${pdfPath}`);
            return;
        }

        const analyzer = new FilmScriptAnalyzer(pdfPath, scriptName);
        try {
            const result = await analyzer.runCompleteAnalysis();
            console.log("\n🎊 BLACK PANTHER COMPLETE ANALYSIS COMPLETED (JavaScript)!");
            console.log("ALL scenes, dialogues, and characters extracted!");
            console.log(result);
        } catch (error) {
            console.log("\n❌ Analysis failed:", error.message);
        }
    }

    main();
} 