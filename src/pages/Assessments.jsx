import { useState } from 'react';
import { Download, Plus, ClipboardList, CheckCircle, Clock, Users, Calendar } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { ASSESSMENT_CYCLES } from '../data/mockData';
import { formatDate } from '../utils/helpers';

function ScheduleModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 fade-in">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Schedule Assessment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Name</label>
            <input className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Campus Readiness Evaluation" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option>Comprehensive</option>
                <option>Aptitude + Verbal</option>
                <option>Technical</option>
                <option>Full Stack</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
            <select multiple className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24">
              {['CSE','ECE','MECH','CIVIL','IT','EEE','MBA','MCA'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
          <button onClick={onClose} className="btn-primary text-sm">Schedule</button>
        </div>
      </div>
    </div>
  );
}

export default function Assessments() {
  const [showModal, setShowModal] = useState(false);
  const stats = {
    total: ASSESSMENT_CYCLES.length,
    completed: ASSESSMENT_CYCLES.filter(a => a.status === 'Completed').length,
    scheduled: ASSESSMENT_CYCLES.filter(a => a.status === 'Scheduled').length,
    participants: 1755,
  };

  const TYPE_COLORS = {
    'Comprehensive': 'bg-indigo-50 text-indigo-700',
    'Aptitude + Verbal': 'bg-blue-50 text-blue-700',
    'Technical': 'bg-purple-50 text-purple-700',
    'Full Stack': 'bg-cyan-50 text-cyan-700',
  };

  return (
    <div className="page-enter space-y-5">
      {showModal && <ScheduleModal onClose={() => setShowModal(false)} />}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Assessment Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{stats.total} cycles · Batch 2025 · AY 2024-25</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={14} /> Schedule Assessment
          </button>
          <button className="btn-secondary flex items-center gap-1.5 text-sm"><Download size={14} /> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL CYCLES" value={stats.total} icon={ClipboardList} accentColor="indigo" />
        <StatCard label="COMPLETED" value={stats.completed} icon={CheckCircle} accentColor="emerald" />
        <StatCard label="SCHEDULED" value={stats.scheduled} icon={Clock} accentColor="blue" />
        <StatCard label="TOTAL PARTICIPANTS" value={stats.participants.toLocaleString()} icon={Users} accentColor="cyan" />
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Assessment Cycles</h3>
          <p className="text-xs text-gray-500 mt-0.5">All scheduled and completed cycles</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['ASSESSMENT NAME', 'DATE', 'TYPE', 'PARTICIPANTS', 'AVG SCORE', 'STATUS', 'ACTION'].map(h => (
                  <th key={h} className="table-header text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ASSESSMENT_CYCLES.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{a.name}</div>
                    <div className="text-xs text-gray-400">{a.batch}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Calendar size={13} className="text-gray-400" />
                      {formatDate(a.date)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type] || 'bg-gray-100 text-gray-600'}`}>
                      {a.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Users size={13} className="text-gray-400" />
                      {a.participants.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {a.avgScore ? (
                      <span className={`text-sm font-semibold ${a.avgScore >= 70 ? 'text-emerald-600' : a.avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {a.avgScore}
                      </span>
                    ) : <span className="text-gray-400 text-sm">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={a.status === 'Completed' ? 'badge-completed' : 'badge-scheduled'}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {a.status === 'Completed' && (
                      <button className="text-indigo-600 text-sm hover:underline flex items-center gap-1">
                        <Download size={13} /> Report
                      </button>
                    )}
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
