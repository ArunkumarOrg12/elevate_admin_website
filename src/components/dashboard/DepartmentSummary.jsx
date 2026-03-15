import { ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { DEPARTMENT_SUMMARY } from '../../data/mockData';
import { getEIColor } from '../../utils/helpers';

export default function DepartmentSummary() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Department Summary</h3>
        <button className="flex items-center gap-1 text-indigo-600 text-sm hover:underline">
          View all <ArrowRight size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['DEPARTMENT', 'STUDENTS', 'AVG EI', 'CAMPUS READY', 'AT RISK', 'STATUS'].map(h => (
                <th key={h} className="table-header text-left pb-2 px-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DEPARTMENT_SUMMARY.map(d => (
              <tr key={d.dept} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-medium text-sm text-gray-900">{d.dept}</div>
                  <div className="text-xs text-gray-400">{d.fullName}</div>
                </td>
                <td className="py-3 px-2 text-sm text-gray-700">{d.students}</td>
                <td className="py-3 px-2">
                  <span className={`font-semibold text-sm ${getEIColor(d.avgEI)}`}>{d.avgEI}</span>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm text-gray-700">{d.campusReady}</div>
                  <div className="text-xs text-emerald-600">{d.campusReadyPct}%</div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-medium text-red-600">{d.atRisk}</div>
                  <div className="text-xs text-red-400">{d.atRiskPct}%</div>
                </td>
                <td className="py-3 px-2"><StatusBadge status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
