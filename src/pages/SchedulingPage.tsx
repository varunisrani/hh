
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { mockProject } from '@/data/mockData';
import { Plus, Share2, Download, Calendar, Clock, BookOpen, Settings, ArrowUpDown, Wand2 } from 'lucide-react';

export const SchedulingPage = () => {
  const [activeTab, setActiveTab] = useState('scriptyard');
  
  const scriptScenes = [
    { 
      id: 1, 
      scene: 'EXT. A SAVANNAH STREET - DAY (1981)', 
      description: 'A feather floats through the air. The falling feather.',
      castId: '',
      pages: '1 4/8',
      unit: 'Assign Unit',
      estimation: '1.5',
      location: 'Assign Location'
    },
    { 
      id: 13, 
      scene: 'EXT. GUMP BOARDING HOUSE - DAY', 
      description: 'A cab driver closes the trunk of the car as two woman walk t...',
      castId: '',
      pages: '2/8',
      unit: 'Assign Unit',
      estimation: '0',
      location: 'Assign Location'
    },
    { 
      id: 2, 
      scene: 'INT. COUNTRY DOCTOR\'S OFFICE - GREENBOW, ALABAMA - DAY', 
      description: '(1951) A little boy closes his eyes tightly. It is young For...',
      castId: '',
      pages: '5/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 3, 
      scene: 'EXT. GREENBOW, ALABAMA', 
      description: 'Mrs. Gump and young Forrest walk across the street. Forrest ...',
      castId: '',
      pages: '1/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 4, 
      scene: 'EXT. RURAL ALABAMA', 
      description: 'A black and white photo of General Nathan Bedford Forrest ...',
      castId: '',
      pages: '3/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 5, 
      scene: 'EXT. GREENBOW', 
      description: 'Mrs. Gump and Forrest walk across the street.',
      castId: '',
      pages: '7/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 6, 
      scene: 'EXT. OAK ALLEY/THE GUMP BOARDING HOUSE', 
      description: 'Mrs. Gump and Forrest walk along a dirt road. A row of mailb...',
      castId: '',
      pages: '6/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 7, 
      scene: 'INT. ELEMENTARY SCHOOL / PRINCIPAL\'S OFFICE - DAY', 
      description: 'PRINCIPAL',
      castId: '',
      pages: '2/8',
      unit: 'Assign Unit',
      estimation: '0.5',
      location: 'Assign Location'
    },
    { 
      id: 8, 
      scene: 'INT. HALLWAY', 
      description: 'Forrest sits outside the principal\'s office and waits.',
      castId: '',
      pages: '6/8',
      unit: 'Assign Unit',
      estimation: '0',
      location: 'Assign Location'
    }
  ];
  
  const boneyardItems = [
    { id: 1, scene: '9', description: 'Interior coffee shop scene', reason: 'Location not available', priority: 'High' },
    { id: 2, scene: '12', description: 'Car chase sequence', reason: 'Stunt coordinator unavailable', priority: 'Medium' },
    { id: 3, scene: '15', description: 'Rooftop dialogue', reason: 'Weather dependent', priority: 'Low' },
    { id: 4, scene: '18', description: 'Restaurant dinner scene', reason: 'Cast scheduling conflict', priority: 'High' }
  ];
  
  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('scriptyard')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'scriptyard' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Scriptyard
          </button>
          <button
            onClick={() => setActiveTab('boneyard')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'boneyard' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Boneyard
          </button>
        </div>
      </div>
      
      {activeTab === 'boneyard' && (
        <div className="space-y-2">
          {boneyardItems.map((item) => (
            <div key={item.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-medium">Scene {item.scene}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.priority === 'High' ? 'bg-red-600 text-white' :
                  item.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                  'bg-green-600 text-white'
                }`}>
                  {item.priority}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-1">{item.description}</div>
              <div className="text-xs text-gray-500">{item.reason}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <MainLayout sidebar={sidebar}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Demo: Forrest Gump</h1>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder="Enter your scheduling request. Example: Scenes with cars and animals first, then stunt scenes. Sort nights first, then outdoor days."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
                <Wand2 className="mr-2 h-4 w-4" />
                AI Sort (1 of 1)
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('scriptyard')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === 'scriptyard' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Scriptyard
                </button>
                <button
                  onClick={() => setActiveTab('boneyard')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === 'boneyard' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Boneyard
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 bg-gray-800 hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 bg-gray-800 hover:bg-gray-700">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort Items
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 bg-gray-800 hover:bg-gray-700">
                <Calendar className="mr-2 h-4 w-4" />
                Auto Day Breaks
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-black bg-white hover:bg-gray-100">
                Share Project
                <Share2 className="ml-2 h-4 w-4" />
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          {activeTab === 'scriptyard' && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium w-16">#</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Set</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-32">Cast ID</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-24">Pages</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-32">Unit</th>
                      <th className="text-left p-4 text-gray-300 font-medium w-32">Estimation, h</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Shooting Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scriptScenes.map((scene, index) => (
                      <tr key={scene.id} className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-850' : 'bg-gray-900'
                      }`}>
                        <td className="p-4 text-white font-medium">{scene.id}</td>
                        <td className="p-4">
                          <div className="text-white font-medium text-sm mb-1">{scene.scene}</div>
                          <div className="text-gray-400 text-xs">{scene.description}</div>
                        </td>
                        <td className="p-4 text-gray-400">{scene.castId}</td>
                        <td className="p-4">
                          <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm">
                            <option>{scene.pages}</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button className="text-gray-400 hover:text-white text-sm">
                            {scene.unit}
                          </button>
                        </td>
                        <td className="p-4">
                          <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm w-16">
                            <option>{scene.estimation}</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button className="text-gray-400 hover:text-white text-sm">
                            {scene.location}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'boneyard' && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Boneyard Items</h3>
              <div className="space-y-3">
                {boneyardItems.map((item) => (
                  <div key={item.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Scene {item.scene}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'High' ? 'bg-red-600 text-white' :
                        item.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">{item.description}</div>
                    <div className="text-sm text-gray-500">{item.reason}</div>
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
