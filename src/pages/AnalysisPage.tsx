
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { mockScenes, mockProject, analysisParameters } from '@/data/mockData';
import { X, Plus, Search, Share2, Download } from 'lucide-react';

export const AnalysisPage = () => {
  const [selectedScene, setSelectedScene] = useState(1);
  const [activeParameters, setActiveParameters] = useState(new Set(analysisParameters));
  const [customParameter, setCustomParameter] = useState('');
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{[key: string]: string}>({});
  
  const currentScene = mockScenes.find(scene => scene.id === selectedScene);
  
  const removeParameter = (parameter: string) => {
    const newParams = new Set(activeParameters);
    newParams.delete(parameter);
    setActiveParameters(newParams);
  };
  
  const addCustomParameter = () => {
    if (customParameter.trim()) {
      const newParams = new Set(activeParameters);
      newParams.add(customParameter.trim());
      setActiveParameters(newParams);
      setCustomParameter('');
    }
  };
  
  const runAnalysis = (allScenes = false) => {
    setIsAnalyzing(true);
    // Mock analysis results
    setTimeout(() => {
      const mockResults: {[key: string]: string} = {};
      activeParameters.forEach(param => {
        switch (param) {
          case 'COVID-19':
            mockResults[param] = 'Outdoor scene with minimal contact - standard protocols apply';
            break;
          case 'Minors':
            mockResults[param] = 'No minors detected in this scene';
            break;
          case 'Stunt Performers':
            mockResults[param] = 'No stunt work required';
            break;
          case 'Animal Wranglers':
            mockResults[param] = 'No animals present';
            break;
          default:
            mockResults[param] = `Analysis complete for ${param}`;
        }
      });
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };
  
  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tag..."
          className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        {mockScenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setSelectedScene(scene.id)}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              selectedScene === scene.id 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="font-medium">{scene.number}. {scene.header}</div>
            <div className="text-xs opacity-75 mt-1">{scene.pageFrame}</div>
          </button>
        ))}
      </div>
    </div>
  );
  
  const notesPanel = (
    <div className="p-4 bg-gray-950 border-l border-gray-800">
      <h3 className="text-white font-medium mb-4">Notes: Scene {selectedScene}</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter scene notes..."
        className="w-full h-40 p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
      />
    </div>
  );
  
  return (
    <MainLayout sidebar={sidebar} notes={notesPanel}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Scene Analysis</h1>
              <p className="text-gray-400 mt-1">Project Name: {mockProject.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                Share Project
                <Share2 className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-sm border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-white">Created:</span>
                <span className="ml-2 text-gray-400">{mockProject.created}</span>
              </div>
              <div>
                <span className="font-medium text-white">Scenes:</span>
                <span className="ml-2 text-gray-400">{mockProject.scenes}</span>
              </div>
              <div className="text-gray-400">
                Automatic script breakdown was created using Filmustage.
                <div className="text-purple-400 text-xs mt-1">filmustage.com</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                {selectedScene}
              </span>
              <h2 className="text-xl font-semibold text-white">
                {currentScene?.header}
              </h2>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>{currentScene?.pageFrame}</option>
              </select>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {currentScene?.content}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3">Add your custom parameter:</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customParameter}
                onChange={(e) => setCustomParameter(e.target.value)}
                placeholder="Enter your custom parameters. For example, 'Find all dangerous items'"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && addCustomParameter()}
              />
              <Button onClick={addCustomParameter} disabled={!customParameter.trim()} className="bg-purple-600 hover:bg-purple-700 text-white">
                Add
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3">Analyze the scene by saved parameters:</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(activeParameters).map((param) => (
                <div
                  key={param}
                  className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm border border-gray-700"
                >
                  <span>{param}</span>
                  <button
                    onClick={() => removeParameter(param)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex space-x-4">
              <Button
                onClick={() => runAnalysis(false)}
                disabled={isAnalyzing || activeParameters.size === 0}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze One Scene (0 of 1)'}
              </Button>
              <Button
                onClick={() => runAnalysis(true)}
                disabled={isAnalyzing || activeParameters.size === 0}
                variant="outline"
                className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100"
              >
                Analyze All Scenes
              </Button>
            </div>
          </div>
          
          {Object.keys(analysisResults).length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Analysis Results</h3>
              <div className="space-y-4">
                {Object.entries(analysisResults).map(([param, result]) => (
                  <div key={param} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-white">{param}</h4>
                    <p className="text-gray-300 mt-1">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
