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

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';

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
          <div className="text-sm font-medium border border-gray-200 rounded-[9px] px-3 py-1.5 text-gray-600 bg-gray-50 max-w-[130px] sm:max-w-[200px] md:max-w-none truncate">
            {selectedCollege?.name ?? user?.college?.name}
          </div>
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

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</div>
                <div className="text-xs text-gray-500 leading-tight">{user?.designation}</div>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="normal-case text-sm font-normal px-3 py-2">
              <div className="font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User size={16} />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut size={16} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
