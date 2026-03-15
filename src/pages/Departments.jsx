import { useState } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatusBadge from '../components/common/StatusBadge';
import { DEPARTMENTS, COMPETENCY_HEATMAP, DEPARTMENT_COMPARISON } from '../data/mockData';
import { getEIColor } from '../utils/helpers';

function getHeatColor(score) {
  if (score >= 75) return 'bg-emerald-100 text-emerald-800';
  if (score >= 65) return 'bg-green-50 text-green-700';
  if (score >= 55) return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
}

const COMP_COLS = ['DEPT', 'APTITUDE', 'VERBAL', 'TECHNICAL', 'BEHAVIORAL', 'ANALYTICAL'];

export default function Departments() {
  const [selected, setSelected] = useState(DEPARTMENTS[0]);

  const chartData = DEPARTMENTS.map(d => ({ dept: d.code, avgEI: d.avgEI, students: d.students }));

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Department Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Comparative performance across all departments</p>
        </div>
        <button className="btn-secondary flex items-center gap-1.5 text-sm flex-shrink-0 self-start"><Download size={14} /> Export</button>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DEPARTMENTS.map(d => (
          <button key={d.code} onClick={() => setSelected(d)}
            className={`card p-4 text-left hover-lift transition-all ${selected.code === d.code ? 'ring-2 ring-indigo-600' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">{d.code}</span>
              <StatusBadge status={d.status} />
            </div>
            <p className="stat-number text-2xl">{d.avgEI}</p>
            <p className="text-xs text-gray-400 mt-0.5">Avg EI · {d.students} students</p>
          </button>
        ))}
      </div>

      {/* Detail + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overview */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900">{selected.name} ({selected.code})</h3>
          <p className="text-xs text-gray-500 mb-4">Department overview</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Total Students', value: selected.students, color: 'text-blue-600' },
              { label: 'Avg EI Score', value: selected.avgEI, color: getEIColor(selected.avgEI) },
              { label: 'Campus Ready', value: selected.campusReady, color: 'text-emerald-600' },
              { label: 'At Risk', value: selected.atRisk, color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`stat-number text-xl mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">EI Distribution</p>
            <div className="flex rounded-full overflow-hidden h-3">
              <div className="bg-emerald-500 transition-all" style={{ width: `${selected.distribution.ready}%` }} />
              <div className="bg-amber-400" style={{ width: `${selected.distribution.developing}%` }} />
              <div className="bg-red-400" style={{ width: `${selected.distribution.atRisk}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span className="text-emerald-600">Ready {selected.distribution.ready}%</span>
              <span className="text-amber-600">Dev {selected.distribution.developing}%</span>
              <span className="text-red-600">Risk {selected.distribution.atRisk}%</span>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Department Comparison</h3>
          <p className="text-xs text-gray-500 mb-4">Avg EI vs Student Count</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis yAxisId="ei" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis yAxisId="students" orientation="right" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="ei" dataKey="avgEI" name="Avg EI" fill="#4F46E5" radius={[3,3,0,0]} />
              <Bar yAxisId="students" dataKey="students" name="Students" fill="#E0E7FF" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competency Heatmap */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-1">Competency Heatmap</h3>
        <p className="text-xs text-gray-500 mb-4">Section-wise scores across all departments</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {COMP_COLS.map(h => <th key={h} className="table-header text-left px-3 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {COMPETENCY_HEATMAP.map(r => (
                <tr key={r.dept}>
                  <td className="px-3 py-2.5 text-sm font-semibold text-gray-900">{r.dept}</td>
                  {['aptitude','verbal','technical','behavioral','analytical'].map(key => (
                    <td key={key} className="px-3 py-2.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-sm font-medium ${getHeatColor(r[key])}`}>
                        {r[key]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
