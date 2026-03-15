import { useState } from 'react';
import { Download, Calendar, FileText, Eye } from 'lucide-react';
import RoleGuard from '../components/common/RoleGuard';
import { ROLES } from '../constants/roles';
import { REPORT_TYPES } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const TABS = ['All', 'Institutional', 'Department', 'Risk', 'Assessment', 'Batch', 'Placement'];

function ScheduleReportModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 fade-in">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Schedule Report</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              {TABS.slice(1).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
            <input type="date" className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option>PDF</option>
              <option>Excel</option>
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

export default function Reports() {
  const [activeTab, setActiveTab] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filtered = activeTab === 'All' ? REPORT_TYPES : REPORT_TYPES.filter(r => r.category === activeTab);

  return (
    <div className="page-enter space-y-5">
      {showModal && <ScheduleReportModal onClose={() => setShowModal(false)} />}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Reports & Exports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Institutional-grade PDF and Excel reports for decision makers</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setShowModal(true)} className="btn-secondary flex items-center gap-1.5 text-sm">
            <Calendar size={14} /> Schedule Report
          </button>
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
            <button className="btn-primary flex items-center gap-1.5 text-sm">
              <Download size={14} /> Bulk Export
            </button>
          </RoleGuard>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-[9px] text-sm font-medium transition-colors ${activeTab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(r => (
          <div key={r.id} className="card p-5 hover-lift flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{r.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={r.format === 'PDF' ? 'badge-pdf' : 'badge-excel'}>{r.format}</span>
                  <span className="text-xs text-gray-400">{r.pages} pages</span>
                  <span className={r.status === 'Ready' ? 'badge-completed' : 'badge-scheduled'}>{r.status}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 flex-1">{r.description}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Generated: {formatDate(r.date)}</span>
              <div className="flex gap-2">
                <button className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
                  <Eye size={12} /> Preview
                </button>
                <button className="btn-primary flex items-center gap-1 text-xs py-1 px-2">
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
