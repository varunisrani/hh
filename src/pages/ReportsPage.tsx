
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { mockCastData, mockProject } from '@/data/mockData';
import { Search, Plus, Share2, Download } from 'lucide-react';

export const ReportsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('CAST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  
  const categories = [
    { name: 'CAST', count: 19, color: 'bg-purple-500' },
    { name: 'EXTRAS', count: 2, color: 'bg-green-500' },
    { name: 'PROPS', count: 25, color: 'bg-orange-500' },
    { name: 'LOCATION DETAILS', count: 13, color: 'bg-blue-500' },
    { name: 'SOUND', count: 4, color: 'bg-green-600' },
    { name: 'COSTUMES', count: 9, color: 'bg-orange-600' },
    { name: 'VEHICLES', count: 4, color: 'bg-blue-600' },
    { name: 'ANIMALS', count: 1, color: 'bg-yellow-600' },
    { name: 'SET', count: 11, color: 'bg-gray-600' }
  ];
  
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleItemSelection = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const getCategoryData = (category: string) => {
    switch(category) {
      case 'CAST':
        return mockCastData;
      case 'EXTRAS':
        return [
          { id: 1, tag: "CROWD", dood: 3, scenes: 5, occurrence: 2, pages: "1/8" },
          { id: 2, tag: "BACKGROUND", dood: 2, scenes: 8, occurrence: 3, pages: "2/8" }
        ];
      case 'PROPS':
        return [
          { id: 1, tag: "Feather", dood: 1, scenes: 3, occurrence: 5, pages: "1/8" },
          { id: 2, tag: "Bus bench", dood: 2, scenes: 4, occurrence: 2, pages: "2/8" },
          { id: 3, tag: "Box of chocolates", dood: 1, scenes: 6, occurrence: 3, pages: "1/8" }
        ];
      case 'LOCATION DETAILS':
        return [
          { id: 1, tag: "Street", dood: 2, scenes: 8, occurrence: 4, pages: "3/8" },
          { id: 2, tag: "Bench", dood: 1, scenes: 3, occurrence: 2, pages: "1/8" },
          { id: 3, tag: "City", dood: 1, scenes: 5, occurrence: 3, pages: "2/8" }
        ];
      default:
        return [];
    }
  };

  const currentData = getCategoryData(selectedCategory);
  
  const sidebar = (
    <div className="p-4 bg-gray-950 border-r border-gray-800">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
        />
      </div>
      
      <div className="space-y-2">
        {filteredCategories.map((category, index) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              selectedCategory === category.name 
                ? `${category.color} text-white font-medium` 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{index + 1}. {category.name}</span>
              <span className="text-xs opacity-75">({category.count})</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
  
  return (
    <MainLayout sidebar={sidebar}>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Reports & References</h1>
              <p className="text-gray-400 mt-1">Project Name: {mockProject.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                <Plus className="mr-2 h-4 w-4" />
                Add Tag
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
                <div className="text-purple-400 text-xs mt-1">filmustage.com</div>
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium">
                {selectedCategory} ({currentData.length})
              </span>
              <Button size="sm" variant="outline" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                Set Cast IDs
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100" disabled={selectedItems.size === 0}>
                Merge
              </Button>
              <Button size="sm" variant="outline" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100" disabled={selectedItems.size === 0}>
                Delete
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(new Set(currentData.map(item => item.id)));
                        } else {
                          setSelectedItems(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Cast ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Tag</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">DOOD</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Scenes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Occurrence</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Pages</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Notes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800 bg-gray-900">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">--</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{item.tag}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.dood}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.scenes}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.occurrence}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.pages}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <input
                        type="text"
                        placeholder="Add note..."
                        className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <input
                        type="text"
                        placeholder="Quick Search"
                        className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
