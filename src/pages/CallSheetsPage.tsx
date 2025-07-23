
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { mockProject } from '@/data/mockData';
import { Plus, Share2, Download } from 'lucide-react';

export const CallSheetsPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const templates = [
    {
      id: 'standard',
      name: 'Call sheet template',
      description: 'Standard call sheet template',
      color: 'bg-gradient-to-br from-purple-500 to-purple-700'
    }
  ];
  
  const callSheets = [
    // Mock empty state for now
  ];
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">{mockProject.name}</h1>
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
          
          <div className="mb-8">
            <h2 className="text-lg font-medium text-white mb-4">Select a Call Sheet Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-16 h-16 ${template.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <div className="text-white font-bold text-lg">📋</div>
                  </div>
                  <h3 className="font-medium text-white">{template.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Call Sheets</h2>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Call Sheet
            </Button>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Sent to</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {callSheets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No call sheets created yet
                    </td>
                  </tr>
                ) : (
                  callSheets.map((sheet, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-white">{sheet.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{sheet.sentTo}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{sheet.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-900 bg-white hover:bg-gray-100">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
