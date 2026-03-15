import { useState, useContext } from 'react';
import { Bell, Search, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SidebarContext } from '../../context/SidebarContext';
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

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
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
          <Select value={selectedCollege} onValueChange={setSelectedCollege}>
            <SelectTrigger className="text-sm font-medium max-w-[130px] sm:max-w-[200px] md:max-w-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-sm font-medium border border-gray-200 rounded-[9px] px-3 py-1.5 text-gray-600 bg-gray-50 max-w-[130px] sm:max-w-[200px] md:max-w-none truncate">
            {user?.college?.name}
          </div>
        )}

        {/* AY — hidden on mobile */}
        <div className="hidden sm:block">
          <Select value={selectedAY} onValueChange={setSelectedAY}>
            <SelectTrigger className="text-sm w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AY_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Batch — hidden on mobile */}
        <div className="hidden sm:block">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="text-sm w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BATCH_OPTIONS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
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
          <Button variant="ghost" size="icon" className="text-gray-500">
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
