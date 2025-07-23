
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { mockBudgetData, mockProject } from '@/data/mockData';
import { Plus, Share2, Download, Settings, Search } from 'lucide-react';

export const BudgetingPage = () => {
  const [budgetData, setBudgetData] = useState(mockBudgetData);
  const [showFringes, setShowFringes] = useState(false);
  const [fringeSearch, setFringeSearch] = useState('');
  
  const fringesData = [
    { id: 1, title: 'DGA', type: 'Perc', amount: 22.00 },
    { id: 2, title: 'SAG', type: 'Perc', amount: 21.00 },
    { id: 3, title: 'IATSE', type: 'Perc', amount: 28.00 },
    { id: 4, title: 'WGA', type: 'Perc', amount: 16.25 }
  ];

  const filteredFringes = fringesData.filter(fringe =>
    fringe.title.toLowerCase().includes(fringeSearch.toLowerCase())
  );
  
  const getBadgeVariant = (tagType: string) => {
    switch (tagType) {
      case 'Cast': return 'cast';
      case 'Extras': return 'location';
      case 'Greenery': return 'set';
      case 'Visual FX': return 'vehicles';
      default: return 'default';
    }
  };
  
  const updateEstimate = (id: number, value: number) => {
    setBudgetData(budgetData.map(item => 
      item.id === id ? { ...item, estimate: value } : item
    ));
  };
  
  const updateFringes = (id: number, value: number) => {
    setBudgetData(budgetData.map(item => 
      item.id === id ? { ...item, fringes: value } : item
    ));
  };

  const sidebar = showFringes ? (
    <div className="p-4 bg-gray-950 border-r border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Fringes</h3>
        <Button size="sm" variant="outline" onClick={() => setShowFringes(false)} className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
          Back
        </Button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search fringe..."
          value={fringeSearch}
          onChange={(e) => setFringeSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
        />
      </div>
      
      <div className="space-y-3">
        {filteredFringes.map((fringe) => (
          <div key={fringe.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between text-white text-sm">
              <div>
                <div className="font-medium">{fringe.title}</div>
                <div className="text-gray-400 text-xs">{fringe.type}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{fringe.amount}</div>
                <Button size="sm" variant="outline" className="mt-1 text-xs border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
  
  return (
    <MainLayout sidebar={sidebar}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">{mockProject.name}</h1>
            <div className="flex items-center space-x-3">
              <Button variant="default" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                Generate AI Budget ✨
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                Create Category
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100" onClick={() => setShowFringes(true)}>
                Fringes
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                <Settings className="mr-2 h-4 w-4" />
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
          
          <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Move</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Tag Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Assign Fringes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Fringes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {budgetData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800 bg-gray-900">
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                          ⋮
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.code}
                        className="w-20 text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.name}
                        className="w-full text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      {item.tagType !== 'NONE' ? (
                        <CategoryBadge variant={getBadgeVariant(item.tagType)}>
                          {item.tagType}
                        </CategoryBadge>
                      ) : (
                        <span className="text-gray-500">NONE</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select className="text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option>Assign Fringes</option>
                        <option>DGA</option>
                        <option>SAG</option>
                        <option>IATSE</option>
                        <option>WGA</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.fringes}
                        onChange={(e) => updateFringes(item.id, Number(e.target.value))}
                        className="w-20 text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.estimate}
                        onChange={(e) => updateEstimate(item.id, Number(e.target.value))}
                        className="w-20 text-sm bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        min="0"
                      />
                    </td>
                  </tr>
                ))}
                
                <tr className="bg-gray-700">
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-medium text-white">Above-The-Line Production</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-medium text-white">0</td>
                  <td className="px-4 py-3 font-medium text-white">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
