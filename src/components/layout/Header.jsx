import { useState, useRef, useEffect, useContext } from 'react';
import { Bell, Search, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SidebarContext } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';

const COLLEGES = [
  'Presidency Engineering College',
  'PSG College of Technology',
  'SSN College of Engineering',
  'Kumaraguru College of Technology',
];

const AY_OPTIONS = ['2024-25', '2023-24', '2022-23'];
const BATCH_OPTIONS = ['Batch 2025', 'Batch 2024', 'Batch 2023'];

export default function Header() {
  const { user, logout, isSuperAdmin } = useAuth();
  const { setMobileOpen } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState(
    isSuperAdmin ? COLLEGES[0] : user?.college?.name
  );
  const [selectedAY, setSelectedAY] = useState('2024-25');
  const [selectedBatch, setSelectedBatch] = useState('Batch 2025');
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Hamburger — visible only on mobile (<lg) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-[9px] transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Left: dropdowns */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* College dropdown — always visible, truncated on mobile */}
        <div className="relative">
          <select
            value={selectedCollege}
            onChange={e => setSelectedCollege(e.target.value)}
            disabled={!isSuperAdmin}
            className={`text-sm font-medium border border-gray-200 rounded-[9px] px-3 py-1.5 pr-7 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none
              max-w-[130px] sm:max-w-[200px] md:max-w-none
              ${!isSuperAdmin ? 'text-gray-600 cursor-default bg-gray-50' : 'text-gray-900 cursor-pointer hover:border-indigo-300'}`}
          >
            {isSuperAdmin
              ? COLLEGES.map(c => <option key={c}>{c}</option>)
              : <option>{user?.college?.name}</option>
            }
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* AY — hidden on mobile, visible on sm+ */}
        <div className="relative hidden sm:block">
          <select
            value={selectedAY}
            onChange={e => setSelectedAY(e.target.value)}
            className="text-sm border border-gray-200 rounded-[9px] px-3 py-1.5 pr-7 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-gray-700"
          >
            {AY_OPTIONS.map(a => <option key={a}>{a}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Batch — hidden on mobile, visible on sm+ */}
        <div className="relative hidden sm:block">
          <select
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            className="text-sm border border-gray-200 rounded-[9px] px-3 py-1.5 pr-7 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-gray-700"
          >
            {BATCH_OPTIONS.map(b => <option key={b}>{b}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Search — hidden on mobile, visible on sm+ */}
      <div className="hidden sm:block flex-1 max-w-md mx-auto relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search students, roll no, assessments..."
          className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
        />
      </div>

      {/* Right: bell + profile */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-[9px] transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-[9px] px-2 py-1.5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</div>
              <div className="text-xs text-gray-500 leading-tight">{user?.designation}</div>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-[14px] shadow-card-hover border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <User size={16} />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
