import React from 'react';
import { Upload, Plus, ChevronLeft } from 'lucide-react';
export function Header() {
  const tabs = ['Folder', 'Page', 'Course', 'Quiz', 'Assignment', 'Learning Path', 'Wiki'];
  return <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded" />
            </div>
            <h1 className="text-lg font-semibold">Fikri Studio</h1>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center text-xs font-semibold">
                RF
              </div>
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                <Users size={14} className="text-gray-500" />
              </div>
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                <Users size={14} className="text-gray-500" />
              </div>
              <button className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Upload size={16} />
            Upload
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Plus size={16} />
            New Content
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 px-6">
        {tabs.map(tab => <button key={tab} className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'Learning Path' ? 'border-indigo-600 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
            {tab}
          </button>)}
      </div>
    </header>;
}
function Users({
  size
}: {
  size: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>;
}