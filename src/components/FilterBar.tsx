import React from 'react';
import { X, Filter, Search, Grid3x3, List, ChevronDown } from 'lucide-react';
export function FilterBar() {
  return <div className="px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
            <span>Category: Prototyping, Not Urgent</span>
            <button className="hover:bg-indigo-100 rounded">
              <X size={14} />
            </button>
          </div>
          <button className="px-3 py-1.5 text-indigo-600 text-sm font-medium hover:bg-indigo-50 rounded-lg">
            Reset
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter size={16} />
            Add Filter
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
            <ChevronDown size={16} />
            Date Created
          </button>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button className="p-1.5 bg-white rounded shadow-sm">
              <Grid3x3 size={16} className="text-gray-700" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded">
              <List size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-sm font-medium text-gray-900">3 content</span>
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
    </div>;
}