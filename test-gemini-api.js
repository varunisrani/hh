// Test script for Gemini API integration
// This tests the fixed API with sample script content

import { analyzeScriptWithAI } from './src/services/geminiService.ts';
import fs from 'fs';
import path from 'path';

// Sample script content for testing (small excerpt to avoid copyright issues)
const testScriptContent = `SCENE 1:
----------------------------------------
Scene Name: 2 EXT. THE STREAM – THE OTHERS 2
Scene Action: As the dawn sky brightens, Moonwatcher and his tribe reach the shallow stream. The Others are already there. They were there on the other side every day – that did not make it any less annoying. There are eighteen of them, and it is impossible to distinguish them from the members of Moonwatcher's own tribe.
Characters: Moonwatcher, The Others
Location: EXT. THE STREAM
Time: Dawn

SCENE 2:
----------------------------------------
Scene Name: 3 EXT. AFRICAN PLAIN – HERBIVORES 3
Scene Action: Moonwatcher and his companions search for berries, fruit and leaves, and fight off pangs of hunger, while all around them, competing with them for the same fodder, is a potential source of more food than they could ever hope to eat.
Characters: Moonwatcher, companions
Location: EXT. AFRICAN PLAIN
Time: Day`;

const testProjectId = 'test-' + Date.now();

async function testGeminiAPI() {
  console.log('🚀 Starting Gemini API test...');
  console.log('📝 Project ID:', testProjectId);
  console.log('📄 Script content length:', testScriptContent.length, 'characters');
  
  try {
    console.log('🔄 Calling Gemini API...');
    
    const result = await analyzeScriptWithAI(
      testScriptContent,
      testProjectId,
      (status) => {
        console.log('📊 Progress:', status);
      }
    );
    
    console.log('✅ API call completed!');
    console.log('📊 Result status:', result.status);
    
    if (result.status === 'completed') {
      console.log('🎉 Analysis successful!');
      
      // Create results directory if it doesn't exist
      const resultsDir = './test-results';
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }
      
      // Save result to JSON file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `gemini-test-result-${timestamp}.json`;
      const filepath = path.join(resultsDir, filename);
      
      const outputData = {
        testInfo: {
          projectId: testProjectId,
          timestamp: new Date().toISOString(),
          scriptContentLength: testScriptContent.length,
          testType: 'sample-script-analysis'
        },
        apiResult: result
      };
      
      fs.writeFileSync(filepath, JSON.stringify(outputData, null, 2));
      
      console.log('💾 Results saved to:', filepath);
      console.log('📁 File size:', fs.statSync(filepath).size, 'bytes');
      
      if (result.result && result.result.sceneBreakdownOutput) {
        const analysis = result.result.sceneBreakdownOutput;
        console.log('📈 Analysis Summary:');
        console.log('   - Total scenes processed:', analysis.sceneAnalysisSummary?.totalScenesProcessed || 'N/A');
        console.log('   - Total characters identified:', analysis.sceneAnalysisSummary?.totalCharactersIdentified || 'N/A');
        console.log('   - Total locations identified:', analysis.sceneAnalysisSummary?.totalLocationsIdentified || 'N/A');
        console.log('   - Total props identified:', analysis.sceneAnalysisSummary?.totalPropsIdentified || 'N/A');
      }
      
    } else if (result.status === 'error') {
      console.error('❌ Analysis failed:', result.error);
      
      // Save error result as well
      const resultsDir = './test-results';
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `gemini-test-error-${timestamp}.json`;
      const filepath = path.join(resultsDir, filename);
      
      const errorData = {
        testInfo: {
          projectId: testProjectId,
          timestamp: new Date().toISOString(),
          scriptContentLength: testScriptContent.length,
          testType: 'sample-script-analysis-error'
        },
        error: result
      };
      
      fs.writeFileSync(filepath, JSON.stringify(errorData, null, 2));
      console.log('💾 Error details saved to:', filepath);
    }
    
  } catch (error) {
    console.error('💥 Test failed with exception:', error);
    
    // Save exception details
    const resultsDir = './test-results';
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `gemini-test-exception-${timestamp}.json`;
    const filepath = path.join(resultsDir, filename);
    
    const exceptionData = {
      testInfo: {
        projectId: testProjectId,
        timestamp: new Date().toISOString(),
        scriptContentLength: testScriptContent.length,
        testType: 'sample-script-analysis-exception'
      },
      exception: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    };
    
    fs.writeFileSync(filepath, JSON.stringify(exceptionData, null, 2));
    console.log('💾 Exception details saved to:', filepath);
  }
}

// Run the test
console.log('🧪 Gemini API Test Starting...');
console.log('===============================');
testGeminiAPI().then(() => {
  console.log('===============================');
  console.log('🏁 Test completed');
}).catch(error => {
  console.error('💥 Test runner failed:', error);
});