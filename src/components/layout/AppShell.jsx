import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SidebarContext } from '../../context/SidebarContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell() {
  const { isAuthenticated, isLoading } = useAuth();
  const { collapsed } = useContext(SidebarContext);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 mx-auto mb-3 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-gray-500">Loading EI Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {/* On mobile (<lg): no left margin — sidebar is an overlay drawer.
          On desktop (lg+): margin matches sidebar width (collapsed or expanded). */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300
          ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]'}`}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
