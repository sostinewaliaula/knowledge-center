import React, { useState } from 'react';
import { MainSidebar } from '../../components/MainSidebar';
import { Search, Plus, MoreVertical, ChevronDown, X } from 'lucide-react';

interface Learner {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  status: 'Not started' | 'In progress' | 'Overdue';
  points: number;
  progress: number;
  assignedTo: string;
  assignedToAvatar: string;
}

interface ReportsPageProps {}

export function ReportsPage({}: ReportsPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const learners: Learner[] = [{
    id: '1',
    name: 'Adit Irwan',
    role: 'Design',
    title: 'Jr UI/UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'Not started',
    points: 0,
    progress: 0,
    assignedTo: 'Rohan Baiq',
    assignedToAvatar: 'https://i.pravatar.cc/150?img=20'
  }, {
    id: '2',
    name: 'Arif Brata',
    role: 'Design',
    title: 'Jr UI/UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'Overdue',
    points: 0,
    progress: 0,
    assignedTo: 'Rohan Baiq',
    assignedToAvatar: 'https://i.pravatar.cc/150?img=20'
  }, {
    id: '3',
    name: 'Bagus Yuli',
    role: 'HR',
    title: 'Ld Human Resources',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'In progress',
    points: 0,
    progress: 0,
    assignedTo: 'Pandji Manjiw',
    assignedToAvatar: 'https://i.pravatar.cc/150?img=21'
  }, {
    id: '4',
    name: 'Beni Neon',
    role: 'Design',
    title: 'Jr UI/UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'In progress',
    points: 4,
    progress: 30,
    assignedTo: 'Pandji Manjiw',
    assignedToAvatar: 'https://i.pravatar.cc/150?img=21'
  }, {
    id: '5',
    name: 'Brian Domoni',
    role: 'HR',
    title: 'Staff Human Resources',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'Not started',
    points: 2,
    progress: 0,
    assignedTo: 'Pandji Manjiw',
    assignedToAvatar: 'https://i.pravatar.cc/150?img=21'
  }, {
    id: '6',
    name: 'Depe Prada',
    role: 'Design',
    title: 'PM UI/UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=6',
    status: 'Not started',
    points: 0,
    progress: 0,
    assignedTo: 'Rohan Baiq',
    assignedToAvatar: 'https://i.pravatar.cc/150?img=20'
  }, {
    id: '7',
    name: 'Fauzan Aziz',
    role: 'Design',
    title: 'Md UI/UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'In progress',
    points: 4,
    progress: 70,
    assignedTo: 'Pandji Manjiw',
    assignedToAvatar: 'https://i.pravatar.cc/150?img=21'
  }];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In progress':
        return 'text-orange-600';
      case 'Not started':
        return 'text-gray-500';
      case 'Overdue':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In progress':
        return '🔄';
      case 'Overdue':
        return '⚠️';
      default:
        return '⚪';
    }
  };

  return <div className="flex h-screen bg-gray-50">
      <MainSidebar activePage="reports" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                Learners
              </h1>

              <div className="flex gap-8 border-b border-gray-200">
                <button className="pb-3 text-sm text-gray-600 hover:text-gray-900">
                  Overview
                </button>
                <button className="pb-3 text-sm text-gray-900 font-semibold border-b-2 border-gray-900">
                  Progress
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      <Users size={18} />
                      <span>Peoples (160)</span>
                      <ChevronDown size={16} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-50 rounded-lg">
                      <Filter size={18} />
                      <span>Add Filter</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                      Export
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 32 * 0.5} ${2 * Math.PI * 32}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0ità flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-900">
                          50%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Trained</div>
                      <div className="text-xs text-gray-500">0</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      This week progress overview
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">
                        50
                      </div>
                      <div className="text-xs text-gray-500">In progress</div>
                      <div className="text-xs text-green-600 font-medium">
                        ↑3%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">
                        35
                      </div>
                      <div className="text-xs text-gray-500">Overdue</div>
                      <div className="text-xs text-red-600 font-medium">
                        ↑2%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">
                        75
                      </div>
                      <div className="text-xs text-gray-500">Passed</div>
                      <div className="text-xs text-green-600 font-medium">
                        ↑6%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">
                        15
                      </div>
                      <div className="text-xs text-gray-500">Failed</div>
                      <div className="text-xs text-red-600 font-medium">
                        ↑5%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Full name
                        <ChevronDown className="inline ml-1" size={14} />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                        <ChevronDown className="inline ml-1" size={14} />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Assigned to
                        <ChevronDown className="inline ml-1" size={14} />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {learners.map(learner => <tr key={learner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={learner.avatar} alt={learner.name} className="w-10 h-10 rounded-full" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {learner.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {learner.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 text-sm ${getStatusColor(learner.status)}`}>
                            <span className="text-base">
                              {getStatusIcon(learner.status)}
                            </span>
                            <span>{learner.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">⭐</span>
                            <span className="text-sm font-medium text-gray-900">
                              {learner.points}pts
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {learner.progress > 0 ? <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12">
                                <svg className="w-full h-full -rotate-90">
                                  <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                                  <circle cx="24" cy="24" r="20" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 20 * (learner.progress / 100)} ${2 * Math.PI * 20}`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-900">
                                    {learner.progress}%
                                  </span>
                                </div>
                              </div>
                            </div> : <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-400">
                                  0%
                                </span>
                              </div>
                            </div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <img src={learner.assignedToAvatar} alt={learner.assignedTo} className="w-6 h-6 rounded-full" />
                            <span className="text-sm text-gray-900">
                              {learner.assignedTo}
                            </span>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>;
}

function Users({
  size
}: {
  size: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>;
}

function Filter({
  size
}: {
  size: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>;
}

