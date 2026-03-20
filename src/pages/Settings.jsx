import { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { INSTITUTION_SETTINGS, EI_THRESHOLDS } from '../data/mockData';

const ALL_TABS = [
  { id: 'general', label: 'General', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { id: 'thresholds', label: 'EI Thresholds', roles: [ROLES.SUPER_ADMIN] },
  { id: 'users', label: 'User Management', roles: [ROLES.SUPER_ADMIN] },
  { id: 'security', label: 'Security', roles: [ROLES.SUPER_ADMIN] },
];

function Field({ label, value, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Input type={type} defaultValue={value} />
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const tabs = ALL_TABS.filter(t => t.roles.includes(user?.role));

  return (
    <div className="page-enter">
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your institution and platform settings</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-48 flex-shrink-0">
          <Card className="p-2 flex md:flex-col gap-1 overflow-x-auto">
            {tabs.map(t => (
              <Button
                key={t.id}
                variant={activeTab === t.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(t.id)}
                className="whitespace-nowrap md:w-full justify-start"
              >
                {t.label}
              </Button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === 'general' && (
            <>
              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Institution Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Institution Name" value={INSTITUTION_SETTINGS.name} />
                  <Field label="Institution Code" value={INSTITUTION_SETTINGS.code} />
                  <Field label="NAAC Grade" value={INSTITUTION_SETTINGS.naacGrade} />
                  <Field label="Location" value={INSTITUTION_SETTINGS.location} />
                  <Field label="Affiliated University" value={INSTITUTION_SETTINGS.affiliatedUniversity} />
                  <Field label="AICTE Code" value={INSTITUTION_SETTINGS.aicteCode} />
                </div>
                <Button size="sm" className="mt-4">
                  <Save size={14} /> Save Changes
                </Button>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Academic Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Academic Year</label>
                    <select className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" defaultValue={INSTITUTION_SETTINGS.currentAY}>
                      {['2024-25', '2023-24', '2022-23'].map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active Batch</label>
                    <select className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" defaultValue={INSTITUTION_SETTINGS.activeBatch}>
                      {['Batch 2025', 'Batch 2024', 'Batch 2023'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <Button size="sm" className="mt-4">
                  <Save size={14} /> Save
                </Button>
              </Card>
            </>
          )}



          {activeTab === 'thresholds' && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">EI Score Thresholds</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <label className="block text-sm font-semibold text-emerald-800 mb-2">Campus Ready Threshold (≥)</label>
                  <Input type="number" defaultValue={EI_THRESHOLDS.ready} min={0} max={100} className="w-32 border-emerald-300 focus:ring-emerald-500" />
                  <p className="text-xs text-emerald-600 mt-1">Students with EI ≥ this score are classified as Campus Ready</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <label className="block text-sm font-semibold text-red-800 mb-2">At Risk Threshold (&lt;)</label>
                  <Input type="number" defaultValue={EI_THRESHOLDS.developing} min={0} max={100} className="w-32 border-red-300 focus:ring-red-500" />
                  <p className="text-xs text-red-600 mt-1">Students with EI &lt; this score are classified as At Risk</p>
                </div>
              </div>
              <Button size="sm" className="mt-4">
                <Save size={14} /> Update Thresholds
              </Button>
            </Card>
          )}

          {activeTab === 'users' && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">User Management</h3>
              <p className="text-sm text-gray-500">Manage college admin accounts across all institutions.</p>
              <div className="mt-4 space-y-3">
                {['Dr. V. Anand — Presidency EC', 'Dr. Ramesh Babu — PSG CoT', 'Prof. Suresh Kumar — SSN CE'].map(u => (
                  <div key={u} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-700">{u}</span>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="text-xs py-1 px-2 h-auto">Edit</Button>
                      <Button variant="outline" size="sm" className="text-xs py-1 px-2 h-auto text-red-600 border-red-200 hover:bg-red-50">Disable</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="sm" className="mt-4">+ Add College Admin</Button>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <Input type="number" defaultValue={30} className="w-32" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                  <Input type="number" defaultValue={8} className="w-32" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Require Two-Factor Authentication</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              </div>
              <Button size="sm" className="mt-4">
                <Save size={14} /> Save Security Settings
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
