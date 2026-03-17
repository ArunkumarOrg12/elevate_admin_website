import { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList, Building2,
  BarChart3, AlertTriangle, FileText, Settings, Building,
  GraduationCap, ChevronLeft, ChevronRight, LogOut, X,
  ChevronDown, HelpCircle, PlusCircle, LibraryBig, Layers, RefreshCw,
} from 'lucide-react';
import { SidebarContext } from '../../context/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';

const ASSESSMENT_CHILDREN = [
  { icon: HelpCircle,  label: 'Questions',     path: '/assessments/questions',  roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: PlusCircle,  label: 'Add Question',  path: '/assessments/questions/add', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: Layers,      label: 'Paper Sets',    path: '/assessments/paper-sets', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: LibraryBig,  label: 'Question Bank', path: '/assessments/bank',       roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: RefreshCw,   label: 'Cycles',        path: '/assessments/cycles',     roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: Users, label: 'Students', path: '/students', badge: '1.8k', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  {
    icon: ClipboardList,
    label: 'Assessments',
    path: '/assessments',
    roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
    children: ASSESSMENT_CHILDREN,
  },
  { icon: Building2, label: 'Departments', path: '/departments', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: AlertTriangle, label: 'Risk Monitor', path: '/risk-monitor', badge: '357', badgeDanger: true, roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: FileText, label: 'Reports', path: '/reports', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN] },
  { icon: Building, label: 'College Management', path: '/college-management', roles: [ROLES.SUPER_ADMIN] },
];

export default function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useContext(SidebarContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track which parent item is expanded (by path)
  const [expandedItem, setExpandedItem] = useState(() => {
    // Auto-expand if current path is under assessments
    if (location.pathname.startsWith('/assessments')) return '/assessments';
    return null;
  });

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  // Show labels when expanded on desktop OR when open as mobile drawer
  const showLabels = !collapsed || mobileOpen;

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
    setMobileOpen(false);
  };

  const toggleExpanded = (path) => {
    setExpandedItem(prev => prev === path ? null : path);
  };

  const isParentActive = (item) => {
    if (item.children) {
      return location.pathname === item.path || item.children.some(c => location.pathname.startsWith(c.path));
    }
    return location.pathname === item.path;
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full flex flex-col transition-all duration-300 z-40
          w-[240px] ${collapsed ? 'lg:w-[72px]' : 'lg:w-[240px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
        style={{ backgroundColor: '#1E293B' }}
      >
        {/* Logo */}
        <div className="flex items-center px-4 py-5 border-b border-white/10">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          {showLabels && (
            <div className="ml-3 overflow-hidden flex-1">
              <div className="text-white font-bold text-sm leading-tight">EI Portal</div>
              <div className="text-gray-400 text-xs">Employability Intelligence</div>
            </div>
          )}
          {/* Close button — mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {visibleItems.map(item => {
            const active = isParentActive(item);
            const isExpanded = expandedItem === item.path;
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              const visibleChildren = item.children.filter(c => c.roles.includes(user?.role));
              return (
                <div key={item.path}>
                  {/* Parent row */}
                  <button
                    onClick={() => {
                      if (showLabels) {
                        toggleExpanded(item.path);
                      } else {
                        // When collapsed, navigate to parent and expand
                        navigate(item.path);
                        setExpandedItem(item.path);
                      }
                    }}
                    className={`flex items-center w-full mx-2 mb-1 rounded-[9px] transition-all duration-150
                      ${active
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }
                      ${showLabels ? 'px-3 py-2.5' : 'justify-center px-0 py-3'}
                      `}
                    style={{ width: showLabels ? 'calc(100% - 16px)' : 'calc(100% - 16px)' }}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    {showLabels && (
                      <>
                        <span className="ml-3 text-sm font-medium flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          size={15}
                          className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>

                  {/* Children */}
                  {showLabels && isExpanded && (
                    <div className="mb-1 ml-2">
                      {/* Divider line */}
                      <div className="ml-3 pl-3 border-l border-white/10">
                        {visibleChildren.map(child => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            end
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-3 py-2 mb-0.5 rounded-[8px] text-sm transition-all duration-150
                              ${isActive
                                ? 'bg-indigo-600 text-white font-medium'
                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                              }`
                            }
                          >
                            <child.icon size={15} className="flex-shrink-0" />
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center mx-2 mb-1 rounded-[9px] transition-all duration-150 group
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }
                  ${showLabels ? 'px-3 py-2.5' : 'justify-center px-0 py-3'}`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {showLabels && (
                  <>
                    <span className="ml-3 text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        item.badgeDanger ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                      }`}>{item.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full rounded-[9px] text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-2
              ${showLabels ? 'px-3 py-2' : 'justify-center px-0 py-2.5'}`}
          >
            <LogOut size={18} />
            {showLabels && <span className="ml-3 text-sm">Sign Out</span>}
          </button>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex items-center w-full rounded-[9px] text-gray-500 hover:text-white hover:bg-white/5 transition-all
              ${showLabels ? 'px-3 py-2' : 'justify-center px-0 py-2.5'}`}
          >
            {collapsed ? <ChevronRight size={18} /> : (
              <>
                <ChevronLeft size={18} />
                <span className="ml-3 text-xs text-gray-500">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
