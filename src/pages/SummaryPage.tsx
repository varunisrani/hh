
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { mockScenes, mockProject } from '@/data/mockData';
import { ChevronDown, ChevronRight, FileText, Share2, Download } from 'lucide-react';

export const SummaryPage = () => {
  const [selectedScene, setSelectedScene] = useState(1);
  const [openCategories, setOpenCategories] = useState(new Set(['cast']));
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  
  const currentScene = mockScenes.find(scene => scene.id === selectedScene);
  
  const toggleCategory = (category: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(category)) {
      newOpen.delete(category);
    } else {
      newOpen.add(category);
    }
    setOpenCategories(newOpen);
  };
  
  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };
  
  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800">
      <div className="space-y-2">
        {mockScenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setSelectedScene(scene.id)}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              selectedScene === scene.id 
                ? 'bg-yellow-500 text-gray-900 font-medium' 
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
              <h1 className="text-2xl font-bold text-white">Breakdown Summary</h1>
              <p className="text-gray-400 mt-1">Project Name: {mockProject.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                One Scene
              </Button>
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
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-100 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded text-sm font-medium">
                  1
                </span>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentScene?.header}
                </h2>
              </div>
              <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Pages: {currentScene?.pageFrame}</option>
              </select>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {currentScene?.content}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 bg-gray-900 hover:bg-gray-800">
              CAST (6)
            </Button>
            <Button variant="outline" size="sm" className="border-green-500 text-green-400 bg-gray-900 hover:bg-gray-800">
              EXTRAS (1)
            </Button>
            <Button variant="outline" size="sm" className="border-orange-500 text-orange-400 bg-gray-900 hover:bg-gray-800">
              PROPS (13)
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="text-white font-medium mb-3">Cast</h3>
              <div className="space-y-2">
                {currentScene?.breakdown.cast.map((cast, index) => (
                  <div key={index} className="text-gray-300 text-sm">{cast}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">People</h3>
              <div className="space-y-2">
                <div className="text-gray-300 text-sm">People</div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Props</h3>
              <div className="space-y-2">
                {currentScene?.breakdown.props.map((prop, index) => (
                  <div key={index} className="text-gray-300 text-sm">{prop}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
