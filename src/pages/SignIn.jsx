import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Shield, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';

export default function SignIn() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [role, setRole] = useState(ROLES.COLLEGE_ADMIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email || 'demo@elevate.com', password || 'demo', role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-3/5 flex-col justify-between p-10 relative overflow-hidden"
        style={{ backgroundColor: '#0F172A' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-3"
          style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-tight">EI Portal</div>
            <div className="text-indigo-400 text-sm">Employability Intelligence</div>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Empowering Institutions with Student Employability Intelligence
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Track, analyze, and improve student employability scores across departments.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['Real-time Analytics', 'Risk Monitoring', 'Placement Tracking', 'Department Insights'].map(f => (
              <span key={f} className="px-4 py-2 rounded-full text-sm font-medium text-indigo-300"
                style={{ backgroundColor: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)' }}>
                {f}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-10">
            {[
              { label: 'Institutions', value: '50+' },
              { label: 'Students Tracked', value: '1.2L+' },
              { label: 'Assessments', value: '2,400+' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{s.value}</div>
                <div className="text-slate-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-slate-600 text-sm">
          © 2025 Elevate Systems. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-gray-900 font-bold">EI Portal</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm mb-7">Sign in to your admin account</p>

          {/* Role toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-[12px]">
            <button
              type="button"
              onClick={() => setRole(ROLES.SUPER_ADMIN)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[9px] text-sm font-medium transition-all ${
                role === ROLES.SUPER_ADMIN
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Shield size={15} />
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => setRole(ROLES.COLLEGE_ADMIN)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[9px] text-sm font-medium transition-all ${
                role === ROLES.COLLEGE_ADMIN
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Building2 size={15} />
              College Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[9px] text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === ROLES.SUPER_ADMIN ? 'rajesh@elevate.com' : 'v.anand@presidency.edu'}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* SSO divider */}
          {/* <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div> */}

          {/* <div className="flex gap-3">
            {['Google', 'Microsoft'].map(provider => (
              <button key={provider} className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2">
                {provider}
              </button>
            ))}
          </div> */}

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-indigo-50 rounded-[9px] text-xs text-indigo-700 text-center">
            Demo: Click <strong>Sign In</strong> with any credentials to enter as {role === ROLES.SUPER_ADMIN ? 'Super Admin' : 'College Admin'}
          </div>
        </div>
      </div>
    </div>
  );
}
