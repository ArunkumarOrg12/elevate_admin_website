import { useState } from 'react';
import { Plus, Edit2, Trash2, Building } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { COLLEGES_LIST } from '../data/mockData';
import { getEIColor } from '../utils/helpers';

export default function CollegeManagement() {
  const [colleges] = useState(COLLEGES_LIST);

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>College Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{colleges.length} institutions on the platform</p>
        </div>
        <button className="btn-primary flex items-center gap-1.5 text-sm flex-shrink-0 self-start">
          <Plus size={14} /> Add College
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Institutions', value: colleges.length, color: 'text-indigo-600' },
          { label: 'Total Students', value: colleges.reduce((a, c) => a + c.students, 0).toLocaleString(), color: 'text-blue-600' },
          { label: 'Avg Platform EI', value: (colleges.reduce((a, c) => a + c.avgEI, 0) / colleges.length).toFixed(1), color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`stat-number text-2xl mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['COLLEGE', 'CODE', 'LOCATION', 'ADMIN', 'STUDENTS', 'AVG EI', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} className="table-header text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {colleges.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Building size={14} className="text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.admin}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.students.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${getEIColor(c.avgEI)}`}>{c.avgEI}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status="Ready" /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
