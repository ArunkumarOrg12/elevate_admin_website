import { useState } from 'react';
import { Save, Pencil, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSettings, useGeneralSettings, useUpdateGeneralSettings, useProfileSettings, useUpdateProfileSettings } from '../controllers/settingsController';

const ALL_TABS = [
  { id: 'profile', label: 'Profile', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { id: 'general', label: 'General', roles: [ROLES.COLLEGE_ADMIN] },
  { id: 'thresholds', label: 'EI Thresholds', roles: [ROLES.SUPER_ADMIN] },
  { id: 'users', label: 'User Management', roles: [ROLES.SUPER_ADMIN] },
  { id: 'security', label: 'Security', roles: [ROLES.SUPER_ADMIN] },
];

// Read-only display row
function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  );
}

// Editable input row
function EditField({ label, name, value, type = 'text', readOnly = false, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <Input
        type={type}
        name={name}
        defaultValue={value ?? ''}
        readOnly={readOnly}
        onChange={onChange}
        className={readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}
      />
    </div>
  );
}

// Section header with edit / cancel toggle
function SectionHeader({ title, editing, onEdit, onCancel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {editing ? (
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={14} /> Cancel
        </button>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
        >
          <Pencil size={13} /> Edit
        </button>
      )}
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  const { data: raw, isLoading } = useProfileSettings();
  const { mutate: updateProfile, isPending } = useUpdateProfileSettings();

  const profile = raw?.data ?? raw ?? {};

  const displayName = profile.name
    ?? (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : null)
    ?? profile.email ?? '';
  const initials = (displayName || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const hasFirstLast = profile.first_name !== undefined;

  function handleEdit() {
    setForm({
      ...(hasFirstLast
        ? { first_name: profile.first_name ?? '', last_name: profile.last_name ?? '' }
        : { name: profile.name ?? '' }),
      email: profile.email ?? '',
      phone: profile.phone ?? '',
    });
    setEditing(true);
  }

  function handleCancel() {
    setForm(null);
    setEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    updateProfile(form, { onSuccess: () => setEditing(false) });
  }

  if (isLoading) {
    return <Card className="p-5"><p className="text-sm text-gray-400">Loading…</p></Card>;
  }

  return (
    <Card className="p-5">
      {/* Avatar row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-indigo-200 flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{displayName}</p>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {profile.role}
          </span>
        </div>
      </div>

      <SectionHeader
        title="Personal Information"
        editing={editing}
        onEdit={handleEdit}
        onCancel={handleCancel}
      />

      {editing ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hasFirstLast ? (
              <>
                <EditField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
                <EditField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
              </>
            ) : (
              <EditField label="Full Name" name="name" value={form.name} onChange={handleChange} />
            )}
            <EditField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <EditField label="Role" name="role" value={profile.role} readOnly />
            {profile.college && (
              <EditField label="College" name="college" value={profile.college?.name ?? profile.college} readOnly />
            )}
            <EditField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              <Save size={14} /> {isPending ? 'Saving…' : 'Save Profile'}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hasFirstLast ? (
            <>
              <DetailRow label="First Name" value={profile.first_name} />
              <DetailRow label="Last Name" value={profile.last_name} />
            </>
          ) : (
            <DetailRow label="Full Name" value={profile.name} />
          )}
          <DetailRow label="Email" value={profile.email} />
          <DetailRow label="Role" value={profile.role} />
          {profile.college && <DetailRow label="College" value={profile.college?.name ?? profile.college} />}
          {profile.phone && <DetailRow label="Phone" value={profile.phone} />}
        </div>
      )}
    </Card>
  );
}

// ── General Tab ───────────────────────────────────────────────────────────────
function GeneralTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  const { data: raw, isLoading } = useGeneralSettings();
  const { mutate: updateGeneral, isPending } = useUpdateGeneralSettings();

  const college = raw?.data ?? raw ?? {};

  function handleEdit() {
    setForm({
      name: college.name ?? '',
      code: college.code ?? '',
      domain: college.domain ?? '',
      address: college.address ?? '',
      contact_email: college.contact_email ?? '',
      contact_phone: college.contact_phone ?? '',
    });
    setEditing(true);
  }

  function handleCancel() {
    setForm(null);
    setEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    updateGeneral(form, {
      onSuccess: () => setEditing(false),
    });
  }

  if (isLoading) {
    return <Card className="p-5"><p className="text-sm text-gray-400">Loading…</p></Card>;
  }

  return (
    <Card className="p-5">
      <SectionHeader
        title="Institution Settings"
        editing={editing}
        onEdit={handleEdit}
        onCancel={handleCancel}
      />

      {editing ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditField label="Institution Name" name="name" value={form.name} onChange={handleChange} />
            <EditField label="Institution Code" name="code" value={form.code} onChange={handleChange} />
            <EditField label="Domain" name="domain" value={form.domain} onChange={handleChange} />
            <EditField label="Address" name="address" value={form.address} onChange={handleChange} />
            <EditField label="Contact Email" name="contact_email" type="email" value={form.contact_email} onChange={handleChange} />
            <EditField label="Contact Phone" name="contact_phone" value={form.contact_phone} onChange={handleChange} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              <Save size={14} /> {isPending ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Institution Name" value={college.name} />
          <DetailRow label="Institution Code" value={college.code} />
          <DetailRow label="Domain" value={college.domain} />
          <DetailRow label="Address" value={college.address} />
          <DetailRow label="Contact Email" value={college.contact_email} />
          <DetailRow label="Contact Phone" value={college.contact_phone} />
          <DetailRow label="Status" value={college.is_active ? 'Active' : 'Inactive'} />
        </div>
      )}
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = ALL_TABS.filter(t => t.roles.includes(user?.role));

  const { data: settingsData, isLoading: settingsLoading } = useSettings();
  const settings = settingsData?.data ?? settingsData;
  const thresholds = settings?.thresholds ?? settings?.eiThresholds ?? {};

  return (
    <div className="page-enter">
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your profile and platform settings</p>
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
          {activeTab === 'profile' && <ProfileTab />}

          {activeTab === 'general' && <GeneralTab />}

          {activeTab === 'thresholds' && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">EI Score Thresholds</h3>
              {settingsLoading ? (
                <p className="text-sm text-gray-400">Loading…</p>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <label className="block text-sm font-semibold text-emerald-800 mb-2">Campus Ready Threshold (≥)</label>
                    <Input type="number" defaultValue={thresholds.ready ?? 70} min={0} max={100} className="w-32 border-emerald-300 focus:ring-emerald-500" />
                    <p className="text-xs text-emerald-600 mt-1">Students with EI ≥ this score are classified as Campus Ready</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <label className="block text-sm font-semibold text-red-800 mb-2">At Risk Threshold (&lt;)</label>
                    <Input type="number" defaultValue={thresholds.developing ?? thresholds.atRisk ?? 50} min={0} max={100} className="w-32 border-red-300 focus:ring-red-500" />
                    <p className="text-xs text-red-600 mt-1">Students with EI &lt; this score are classified as At Risk</p>
                  </div>
                </div>
              )}
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
                {(settings?.admins ?? []).map(u => (
                  <div key={u.id ?? u._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-700">{u.name ?? `${u.first_name} ${u.last_name}`} — {u.college?.name ?? u.collegeName ?? ''}</span>
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
                  <Input type="number" defaultValue={settings?.security?.sessionTimeout ?? 30} className="w-32" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                  <Input type="number" defaultValue={settings?.security?.minPasswordLength ?? 8} className="w-32" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Require Two-Factor Authentication</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={settings?.security?.twoFactor ?? false} />
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
