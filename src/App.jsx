import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import RoleGuard from './components/common/RoleGuard';
import { ROLES } from './constants/roles';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Assessments from './pages/Assessments';
import Departments from './pages/Departments';
import Analytics from './pages/Analytics';
import RiskMonitor from './pages/RiskMonitor';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import CollegeManagement from './pages/CollegeManagement';
// Assessment sub-pages
import Questions from './pages/assessments/Questions';
import AddQuestion from './pages/assessments/AddQuestion';
import QuestionDetail from './pages/assessments/QuestionDetail';
import PaperSets from './pages/assessments/PaperSets';
import QuestionBank from './pages/assessments/QuestionBank';
import Cycles from './pages/assessments/Cycles';
import CycleParticipants from './pages/assessments/CycleParticipants';
import Admins from './pages/Admins';
import Programs from './pages/Programs';

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/assessments/questions" element={<Questions />} />
        <Route path="/assessments/questions/add" element={<AddQuestion />} />
        <Route path="/assessments/questions/:id" element={<QuestionDetail />} />
        <Route path="/assessments/paper-sets" element={<PaperSets />} />
        <Route path="/assessments/bank" element={<QuestionBank />} />
        <Route path="/assessments/cycles" element={<Cycles />} />
        <Route path="/assessments/cycles/:id/participants" element={<CycleParticipants />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/risk-monitor" element={<RiskMonitor />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/programs" element={<Programs/>} />
        <Route path="/college-management" element={
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} fallback={<Navigate to="/dashboard" replace />}>
            <CollegeManagement />
          </RoleGuard>
        } />
        <Route path="/admins" element={
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} fallback={<Navigate to="/dashboard" replace />}>
            <Admins/>
          </RoleGuard>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
