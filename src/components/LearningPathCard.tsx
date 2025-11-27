import React from 'react';
import { Users, MoreHorizontal } from 'lucide-react';
interface LearningPathCardProps {
  title: string;
  assignedCount: number;
  category: string;
  urgency: string;
  editedTime: string;
  completed?: number;
  illustration: string;
  illustrationBg: string;
}
export function LearningPathCard({
  title,
  assignedCount,
  category,
  urgency,
  editedTime,
  completed,
  illustration,
  illustrationBg
}: LearningPathCardProps) {
  return <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Illustration */}
      <div className={`h-32 ${illustrationBg} relative overflow-hidden`}>
        <img src={illustration} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
          <span>{assignedCount} Assigned</span>
          <div className="w-3 h-3 bg-white/20 rounded flex items-center justify-center">
            <Users size={10} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
            {category}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            {urgency}
          </span>
          <button className="ml-auto p-1 hover:bg-gray-100 rounded">
            <Users size={16} className="text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Edited {editedTime}</span>
          {completed !== undefined && <>
              <span>•</span>
              <span>Completed:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full border-2 border-teal-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full" style={{
                clipPath: `polygon(0 0, ${completed}% 0, ${completed}% 100%, 0 100%)`
              }} />
                </div>
                <span className="font-medium text-gray-900">{completed}%</span>
              </div>
            </>}
        </div>
      </div>
    </div>;
}