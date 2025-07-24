const { FilmScriptAnalyzer } = require('./server/pdfscript.cjs');
const path = require('path');

async function testAnalyzer() {
    console.log("Testing FilmScriptAnalyzer...");
    
    const pdfPath = path.join(__dirname, 'server/uploads/12_Angry_Men.pdf');
    const scriptName = 'test';
    
    try {
        const analyzer = new FilmScriptAnalyzer(pdfPath, scriptName);
        console.log("Analyzer created successfully");
        
        const result = await analyzer.runCompleteAnalysis();
        console.log("Analysis result:", result);
    } catch (error) {
        console.error("Error during analysis:", error.message);
        console.error("Stack trace:", error.stack);
    }
}

testAnalyzer();