import { useContext } from 'react';
import { Bell, Search, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SidebarContext } from '../../context/SidebarContext';
import { useFilters } from '../../context/FilterContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Header() {
  const { user, logout, isSuperAdmin } = useAuth();
  const { setMobileOpen } = useContext(SidebarContext);
  const navigate = useNavigate();

  const {
    colleges,
    collegesLoading,
    selectedCollege,
    setSelectedCollege,
    ayOptions,
    selectedAY,
    setSelectedAY,
    batchOptions,
    selectedBatch,
    setSelectedBatch,
  } = useFilters();

  const displayName = user?.name
    ?? (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : null)
    ?? user?.email
    ?? 'Admin';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();


  const handleLogout = async () => {
    await logout();
    navigate('/sign-in');
  };

  const handleCollegeChange = (id) => {
    const college = colleges.find(c => (c.id ?? c._id) === id);
    if (college) setSelectedCollege(college);
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Hamburger — visible only on mobile (<lg) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </Button>

      {/* Left: dropdowns */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* College dropdown */}
        {isSuperAdmin ? (
          <Select
            value={selectedCollege ? (selectedCollege.id ?? selectedCollege._id ?? '') : ''}
            onValueChange={handleCollegeChange}
            disabled={collegesLoading}
          >
            <SelectTrigger className="text-sm font-medium max-w-[130px] sm:max-w-[200px] md:max-w-none">
              <SelectValue placeholder={collegesLoading ? 'Loading…' : 'Select college'} />
            </SelectTrigger>
            <SelectContent>
              {colleges.map(c => {
                const cid = c.id ?? c._id;
                return (
                  <SelectItem key={cid} value={cid}>
                    {c.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          // <div className="text-sm font-medium border border-gray-200 rounded-[9px] px-3 py-1.5 text-gray-600 bg-gray-50 max-w-[130px] sm:max-w-[200px] md:max-w-none truncate">
          //   {selectedCollege?.name ?? user?.college?.name}
          // </div>
          <></>
        )}

        {/* AY — hidden on mobile */}
        <div className="hidden sm:block">
          <Select value={selectedAY} onValueChange={setSelectedAY}>
            <SelectTrigger className="text-sm w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ayOptions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Batch — hidden on mobile */}
        {/* <div className="hidden sm:block">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="text-sm w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {batchOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Search — hidden on mobile */}
      <div className="hidden sm:block flex-1 max-w-md mx-auto relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search students, roll no, assessments..."
          className="pl-9 bg-gray-50"
        />
      </div>

      {/* Right: bell + profile */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => navigate('/notifications')}
            aria-label="View notifications"
          >
            <Bell size={20} />
          </Button>
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">2</span>
        </div>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors group outline-none">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm shadow-indigo-200">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col items-start min-w-0">
                <span className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[110px]">
                  {displayName}
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-1.5 py-px rounded-full border border-emerald-200 leading-none mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                  {user?.role}
                </span>
              </div>
              <ChevronDown
                className="hidden sm:block text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0"
                style={{ width: 14, height: 14 }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User size={14} className="mr-2" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut size={14} className="mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
