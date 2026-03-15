// ============================================================
// MOCK DATA — Single source of truth for Elevate Admin Portal
// ============================================================

// Auth mock data
export const MOCK_USERS = {
  superadmin: {
    id: 'sa-001',
    name: 'Mr. Rajesh Kumar',
    email: 'rajesh@elevate.com',
    role: 'superadmin',
    designation: 'Platform Administrator',
    avatar: null,
    college: null,
  },
  college_admin: {
    id: 'ca-001',
    name: 'Dr. V. Anand',
    email: 'v.anand@presidency.edu',
    role: 'college_admin',
    designation: 'Placement Officer',
    avatar: null,
    college: {
      id: 'col-001',
      name: 'Presidency Engineering College',
      code: 'PEC-2024',
      location: 'Chennai, Tamil Nadu',
    },
  },
};

// Dashboard
export const DASHBOARD_STATS = {
  totalStudents: 1755,
  totalStudentsChange: 142,
  avgEI: 68.7,
  avgEIChange: 4.3,
  highRisk: 357,
  highRiskPercent: 20.3,
  growthVelocity: 4.3,
  growthTarget: 3.0,
};

export const QUICK_METRICS = {
  campusReady: 999,
  developing: 399,
  atRisk: 357,
  placementRate: 73.2,
  assessmentCycles: 8,
  departments: 8,
};

export const EI_TREND_DATA = [
  { month: 'Jan 24', CSE: 68, ECE: 62, MECH: 55, IT: 65, MBA: 71 },
  { month: 'Mar 24', CSE: 69, ECE: 63, MECH: 56, IT: 66, MBA: 72 },
  { month: 'May 24', CSE: 70, ECE: 64, MECH: 58, IT: 68, MBA: 73 },
  { month: 'Aug 24', CSE: 71, ECE: 65, MECH: 59, IT: 69, MBA: 75 },
  { month: 'Oct 24', CSE: 73, ECE: 67, MECH: 61, IT: 70, MBA: 76 },
  { month: 'Jan 25', CSE: 74, ECE: 69, MECH: 62, IT: 72, MBA: 77 },
];

export const RISK_DISTRIBUTION = {
  ready: { count: 999, percent: 56.9 },
  developing: { count: 399, percent: 22.7 },
  atRisk: { count: 357, percent: 20.3 },
};

export const DEPARTMENT_COMPARISON = [
  { dept: 'CSE', avgEI: 74.2 },
  { dept: 'ECE', avgEI: 68.9 },
  { dept: 'MECH', avgEI: 62.3 },
  { dept: 'CIVIL', avgEI: 59.1 },
  { dept: 'IT', avgEI: 71.8 },
  { dept: 'EEE', avgEI: 64.5 },
  { dept: 'MBA', avgEI: 77.3 },
  { dept: 'MCA', avgEI: 73.6 },
];

export const PLACEMENT_PROGRESS = [
  { month: 'Aug 24', offers: 18, target: 25 },
  { month: 'Sep 24', offers: 32, target: 30 },
  { month: 'Oct 24', offers: 28, target: 30 },
  { month: 'Nov 24', offers: 45, target: 40 },
  { month: 'Dec 24', offers: 52, target: 45 },
  { month: 'Jan 25', offers: 38, target: 40 },
  { month: 'Feb 25', offers: 54, target: 50 },
];

export const DEPARTMENT_SUMMARY = [
  { dept: 'CSE', fullName: 'Computer Science & Engg', students: 320, avgEI: 74.2, campusReady: 218, campusReadyPct: 68.1, atRisk: 34, atRiskPct: 10.6, status: 'Ready' },
  { dept: 'ECE', fullName: 'Electronics & Comm Engg', students: 280, avgEI: 68.9, campusReady: 162, campusReadyPct: 57.9, atRisk: 52, atRiskPct: 18.6, status: 'Developing' },
  { dept: 'MECH', fullName: 'Mechanical Engineering', students: 240, avgEI: 62.3, campusReady: 112, campusReadyPct: 46.7, atRisk: 78, atRiskPct: 32.5, status: 'Developing' },
  { dept: 'CIVIL', fullName: 'Civil Engineering', students: 180, avgEI: 59.1, campusReady: 72, campusReadyPct: 40.0, atRisk: 72, atRiskPct: 40.0, status: 'At Risk' },
  { dept: 'IT', fullName: 'Information Technology', students: 260, avgEI: 71.8, campusReady: 180, campusReadyPct: 69.2, atRisk: 38, atRiskPct: 14.6, status: 'Ready' },
  { dept: 'EEE', fullName: 'Electrical & Electronics', students: 200, avgEI: 64.5, campusReady: 102, campusReadyPct: 51.0, atRisk: 52, atRiskPct: 26.0, status: 'Developing' },
  { dept: 'MBA', fullName: 'Master of Business Admin', students: 160, avgEI: 77.3, campusReady: 128, campusReadyPct: 80.0, atRisk: 14, atRiskPct: 8.8, status: 'Ready' },
  { dept: 'MCA', fullName: 'Master of Computer Apps', students: 115, avgEI: 73.6, campusReady: 82, campusReadyPct: 71.3, atRisk: 17, atRiskPct: 14.8, status: 'Ready' },
];

export const RECENT_ACTIVITY = [
  { id: 1, type: 'success', icon: 'check', text: 'Campus Readiness Evaluation completed — 1,755 participants', time: 'Today, 2:30 PM' },
  { id: 2, type: 'warning', icon: 'alert', text: '34 students in MECH fell below EI threshold of 50', time: 'Yesterday, 4:15 PM' },
  { id: 3, type: 'info', icon: 'clipboard', text: 'Technical Proficiency Test scheduled for Feb 28', time: '2d ago' },
  { id: 4, type: 'success', icon: 'trending', text: 'CSE department EI increased by 3.2 points this semester', time: '3d ago' },
];

export const TOP_PERFORMERS = [
  { rank: 1, name: 'Aishwarya Krishnan', dept: 'CSE', roll: '21CS001', eiScore: 97.4, percentile: '99th', status: 'Ready' },
  { rank: 2, name: 'Karthik Subramanian', dept: 'MBA', roll: '21MB008', eiScore: 95.8, percentile: '98th', status: 'Ready' },
  { rank: 3, name: 'Priya Venkatesh', dept: 'IT', roll: '21IT023', eiScore: 94.2, percentile: '97th', status: 'Ready' },
  { rank: 4, name: 'Rajiv Nair', dept: 'CSE', roll: '21CS047', eiScore: 93.7, percentile: '97th', status: 'Ready' },
  { rank: 5, name: 'Meenakshi Sundaram', dept: 'MCA', roll: '21MC011', eiScore: 92.1, percentile: '96th', status: 'Ready' },
];

// Students
export const STUDENTS_LIST = [
  { id: 1, name: 'Aishwarya Krishnan', roll: '21CS001', dept: 'CSE', year: '4th Year', eiScore: 97.4, percentile: '99th', cgpa: 9.6, consistency: 94, velocity: 2.3, status: 'Ready', lastAssessment: '2025-01-15' },
  { id: 2, name: 'Karthik Subramanian', roll: '21MB008', dept: 'MBA', year: '2nd Year', eiScore: 95.8, percentile: '98th', cgpa: 9.1, consistency: 91, velocity: 1.8, status: 'Ready', lastAssessment: '2025-01-15' },
  { id: 3, name: 'Priya Venkatesh', roll: '21IT023', dept: 'IT', year: '4th Year', eiScore: 94.2, percentile: '97th', cgpa: 9.3, consistency: 92, velocity: 2.1, status: 'Ready', lastAssessment: '2025-01-14' },
  { id: 4, name: 'Rajiv Nair', roll: '21CS047', dept: 'CSE', year: '4th Year', eiScore: 93.7, percentile: '97th', cgpa: 9.0, consistency: 89, velocity: 1.9, status: 'Ready', lastAssessment: '2025-01-15' },
  { id: 5, name: 'Meenakshi Sundaram', roll: '21MC011', dept: 'MCA', year: '2nd Year', eiScore: 92.1, percentile: '96th', cgpa: 9.2, consistency: 90, velocity: 2.0, status: 'Ready', lastAssessment: '2025-01-13' },
  { id: 6, name: 'Anand Babu', roll: '21EC034', dept: 'ECE', year: '4th Year', eiScore: 78.4, percentile: '82nd', cgpa: 8.2, consistency: 75, velocity: 1.2, status: 'Ready', lastAssessment: '2025-01-15' },
  { id: 7, name: 'Divya Mohan', roll: '21EE019', dept: 'EEE', year: '4th Year', eiScore: 65.2, percentile: '58th', cgpa: 7.4, consistency: 62, velocity: 0.8, status: 'Developing', lastAssessment: '2025-01-12' },
  { id: 8, name: 'Suresh Rajan', roll: '21ME055', dept: 'MECH', year: '4th Year', eiScore: 58.7, percentile: '43rd', cgpa: 6.8, consistency: 54, velocity: -0.3, status: 'Developing', lastAssessment: '2025-01-10' },
  { id: 9, name: 'Lakshmi Priya', roll: '21CV007', dept: 'CIVIL', year: '4th Year', eiScore: 47.3, percentile: '22nd', cgpa: 6.2, consistency: 41, velocity: -1.2, status: 'At Risk', lastAssessment: '2025-01-08' },
  { id: 10, name: 'Murugan Selvam', roll: '21ME088', dept: 'MECH', year: '4th Year', eiScore: 42.1, percentile: '15th', cgpa: 5.9, consistency: 38, velocity: -1.8, status: 'At Risk', lastAssessment: '2025-01-08' },
  { id: 11, name: 'Saranya Krishnamurthy', roll: '21CS112', dept: 'CSE', year: '4th Year', eiScore: 88.3, percentile: '91st', cgpa: 8.9, consistency: 86, velocity: 1.6, status: 'Ready', lastAssessment: '2025-01-15' },
  { id: 12, name: 'Vikram Annamalai', roll: '21CV031', dept: 'CIVIL', year: '4th Year', eiScore: 44.7, percentile: '18th', cgpa: 6.0, consistency: 40, velocity: -0.9, status: 'At Risk', lastAssessment: '2025-01-09' },
];

// Assessments
export const ASSESSMENT_CYCLES = [
  { id: 1, name: 'Campus Readiness Evaluation', batch: 'Batch 2025', date: '2025-01-15', type: 'Comprehensive', participants: 1755, avgScore: 68.7, status: 'Completed' },
  { id: 2, name: 'Technical Proficiency Test', batch: 'Batch 2025', date: '2025-02-28', type: 'Technical', participants: 1612, avgScore: null, status: 'Scheduled' },
  { id: 3, name: 'Verbal & Communication Assessment', batch: 'Batch 2025', date: '2024-11-10', type: 'Aptitude + Verbal', participants: 1710, avgScore: 71.2, status: 'Completed' },
  { id: 4, name: 'Aptitude Foundation Test', batch: 'Batch 2025', date: '2024-09-05', type: 'Aptitude + Verbal', participants: 1755, avgScore: 64.8, status: 'Completed' },
  { id: 5, name: 'Full Stack Competency Review', batch: 'Batch 2025', date: '2025-03-15', type: 'Full Stack', participants: 580, avgScore: null, status: 'Scheduled' },
  { id: 6, name: 'Mid-Year Behavioral Assessment', batch: 'Batch 2025', date: '2024-07-20', type: 'Comprehensive', participants: 1755, avgScore: 66.3, status: 'Completed' },
];

// Departments
export const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science & Engineering', students: 320, avgEI: 74.2, campusReady: 218, atRisk: 34, status: 'Ready', distribution: { ready: 63, developing: 26, atRisk: 11 } },
  { code: 'ECE', name: 'Electronics & Communication Engg', students: 280, avgEI: 68.9, campusReady: 162, atRisk: 52, status: 'Developing', distribution: { ready: 48, developing: 33, atRisk: 19 } },
  { code: 'MECH', name: 'Mechanical Engineering', students: 240, avgEI: 62.3, campusReady: 112, atRisk: 78, status: 'Developing', distribution: { ready: 35, developing: 32, atRisk: 33 } },
  { code: 'CIVIL', name: 'Civil Engineering', students: 180, avgEI: 59.1, campusReady: 72, atRisk: 72, status: 'At Risk', distribution: { ready: 28, developing: 32, atRisk: 40 } },
  { code: 'IT', name: 'Information Technology', students: 260, avgEI: 71.8, campusReady: 180, atRisk: 38, status: 'Ready', distribution: { ready: 60, developing: 29, atRisk: 11 } },
  { code: 'EEE', name: 'Electrical & Electronics Engg', students: 200, avgEI: 64.5, campusReady: 102, atRisk: 52, status: 'Developing', distribution: { ready: 43, developing: 31, atRisk: 26 } },
  { code: 'MBA', name: 'Master of Business Administration', students: 160, avgEI: 77.3, campusReady: 128, atRisk: 14, status: 'Ready', distribution: { ready: 72, developing: 19, atRisk: 9 } },
  { code: 'MCA', name: 'Master of Computer Applications', students: 115, avgEI: 73.6, campusReady: 82, atRisk: 17, status: 'Ready', distribution: { ready: 65, developing: 22, atRisk: 13 } },
];

export const COMPETENCY_HEATMAP = [
  { dept: 'CSE', aptitude: 78, verbal: 72, technical: 81, behavioral: 68, analytical: 76 },
  { dept: 'ECE', aptitude: 70, verbal: 66, technical: 74, behavioral: 63, analytical: 71 },
  { dept: 'MECH', aptitude: 62, verbal: 58, technical: 68, behavioral: 60, analytical: 63 },
  { dept: 'CIVIL', aptitude: 58, verbal: 55, technical: 61, behavioral: 57, analytical: 60 },
  { dept: 'IT', aptitude: 74, verbal: 70, technical: 76, behavioral: 67, analytical: 73 },
  { dept: 'EEE', aptitude: 65, verbal: 60, technical: 69, behavioral: 62, analytical: 66 },
  { dept: 'MBA', aptitude: 72, verbal: 84, technical: 65, behavioral: 79, analytical: 74 },
  { dept: 'MCA', aptitude: 76, verbal: 71, technical: 78, behavioral: 68, analytical: 75 },
];

// Analytics
export const GROWTH_TRAJECTORY = [
  { sem: 'Sem 1', aptitude: 52, verbal: 48, technical: 50, behavioral: 55 },
  { sem: 'Sem 2', aptitude: 56, verbal: 53, technical: 54, behavioral: 58 },
  { sem: 'Sem 3', aptitude: 61, verbal: 58, technical: 60, behavioral: 62 },
  { sem: 'Sem 4', aptitude: 65, verbal: 63, technical: 66, behavioral: 65 },
  { sem: 'Sem 5', aptitude: 70, verbal: 67, technical: 72, behavioral: 68 },
  { sem: 'Sem 6', aptitude: 74, verbal: 71, technical: 77, behavioral: 71 },
  { sem: 'Sem 7', aptitude: 76, verbal: 74, technical: 80, behavioral: 73 },
];

export const EI_VS_CGPA = [
  { cgpa: 9.6, ei: 97 }, { cgpa: 9.3, ei: 94 }, { cgpa: 9.1, ei: 95 }, { cgpa: 9.0, ei: 92 },
  { cgpa: 8.9, ei: 88 }, { cgpa: 8.7, ei: 85 }, { cgpa: 8.5, ei: 82 }, { cgpa: 8.2, ei: 78 },
  { cgpa: 8.0, ei: 75 }, { cgpa: 7.8, ei: 72 }, { cgpa: 7.5, ei: 68 }, { cgpa: 7.2, ei: 65 },
  { cgpa: 7.0, ei: 62 }, { cgpa: 6.8, ei: 58 }, { cgpa: 6.5, ei: 54 }, { cgpa: 6.2, ei: 47 },
  { cgpa: 6.0, ei: 44 }, { cgpa: 5.9, ei: 41 }, { cgpa: 5.7, ei: 38 }, { cgpa: 5.5, ei: 34 },
  { cgpa: 8.4, ei: 79 }, { cgpa: 7.9, ei: 73 }, { cgpa: 7.3, ei: 66 }, { cgpa: 6.7, ei: 55 },
];

export const RADAR_DATA = [
  { axis: 'Aptitude', CSE: 78, ECE: 70, IT: 74, MBA: 72 },
  { axis: 'Verbal', CSE: 72, ECE: 66, IT: 70, MBA: 84 },
  { axis: 'Technical', CSE: 81, ECE: 74, IT: 76, MBA: 65 },
  { axis: 'Behavioral', CSE: 68, ECE: 63, IT: 67, MBA: 79 },
  { axis: 'Analytical', CSE: 76, ECE: 71, IT: 73, MBA: 74 },
  { axis: 'Communication', CSE: 70, ECE: 65, IT: 69, MBA: 82 },
];

export const PLACEMENT_FUNNEL = [
  { label: 'Total Students', value: 1755, color: '#3B82F6' },
  { label: 'Assessment Cleared', value: 1612, color: '#3B82F6' },
  { label: 'Pre-placement Ready', value: 999, color: '#10B981' },
  { label: 'Offers Received', value: 267, color: '#10B981' },
];

export const INSIGHTS = [
  { type: 'positive', text: 'CSE leads with 74.2 avg EI — 6 points above institution average' },
  { type: 'critical', text: 'CIVIL dept requires immediate intervention — 34.3% at risk' },
  { type: 'positive', text: 'MBA verbal scores (84) highest across all departments' },
  { type: 'warning', text: 'Behavioral scores lagging across all engineering departments' },
];

export const MONTHLY_OFFER_TREND = [
  { month: 'Aug 24', offers: 18 }, { month: 'Sep 24', offers: 32 },
  { month: 'Oct 24', offers: 28 }, { month: 'Nov 24', offers: 45 },
  { month: 'Dec 24', offers: 52 }, { month: 'Jan 25', offers: 38 },
  { month: 'Feb 25', offers: 54 },
];

// Risk Monitor
export const RISK_STATS = {
  totalAtRisk: 357,
  criticalRisk: 89,
  decliningTrend: 43,
  interventionPending: 214,
};

export const RISK_BY_DEPARTMENT = [
  { dept: 'MECH', count: 78 },
  { dept: 'CIVIL', count: 72 },
  { dept: 'EEE', count: 52 },
  { dept: 'ECE', count: 52 },
  { dept: 'IT', count: 38 },
  { dept: 'CSE', count: 34 },
  { dept: 'MBA', count: 14 },
  { dept: 'MCA', count: 17 },
];

export const INTERVENTION_CATEGORIES = [
  { name: 'Aptitude Training', value: 134, color: '#3B82F6' },
  { name: 'Communication Workshop', value: 89, color: '#8B5CF6' },
  { name: 'Technical Bootcamp', value: 187, color: '#F59E0B' },
  { name: 'Behavioral Coaching', value: 98, color: '#10B981' },
];

export const WEAK_SECTIONS = [
  { section: 'Aptitude < 50', count: 134, total: 357 },
  { section: 'Verbal < 50', count: 98, total: 357 },
  { section: 'Technical < 50', count: 187, total: 357 },
  { section: 'Behavioral < 50', count: 112, total: 357 },
  { section: 'Overall EI < 50', count: 357, total: 1755 },
];

export const AT_RISK_STUDENTS = [
  { id: 1, name: 'Lakshmi Priya', roll: '21CV007', dept: 'CIVIL', eiScore: 47.3, cgpa: 6.2, velocity: -1.2, intervention: 'Aptitude + Verbal Training', urgency: 'High' },
  { id: 2, name: 'Murugan Selvam', roll: '21ME088', dept: 'MECH', eiScore: 42.1, cgpa: 5.9, velocity: -1.8, intervention: 'Technical Bootcamp', urgency: 'Critical' },
  { id: 3, name: 'Vikram Annamalai', roll: '21CV031', dept: 'CIVIL', eiScore: 44.7, cgpa: 6.0, velocity: -0.9, intervention: 'Communication Workshop', urgency: 'High' },
  { id: 4, name: 'Deepak Raj', roll: '21EE062', dept: 'EEE', eiScore: 46.8, cgpa: 6.4, velocity: -0.5, intervention: 'Aptitude Training', urgency: 'Medium' },
  { id: 5, name: 'Nithya Devi', roll: '21ME033', dept: 'MECH', eiScore: 38.4, cgpa: 5.7, velocity: -2.1, intervention: 'Full Intervention Program', urgency: 'Critical' },
];

// Reports
export const REPORT_TYPES = [
  { id: 1, title: 'Institutional Employability Report', format: 'PDF', pages: 24, status: 'Ready', category: 'Institutional', description: 'Comprehensive EI analysis across all departments for AY 2024-25 with trend insights and recommendations.', date: '2025-01-15' },
  { id: 2, title: 'Department-wise Performance Report', format: 'PDF', pages: 16, status: 'Ready', category: 'Department', description: 'Detailed breakdown of EI scores, competency gaps, and growth trajectories per department.', date: '2025-01-14' },
  { id: 3, title: 'At-Risk Student Intervention Report', format: 'PDF', pages: 12, status: 'Ready', category: 'Risk', description: 'List of 357 at-risk students with recommended intervention plans and priority levels.', date: '2025-01-13' },
  { id: 4, title: 'Assessment Cycle Summary', format: 'Excel', pages: 8, status: 'Ready', category: 'Assessment', description: 'Consolidated scores, participation rates, and section-wise breakdown for all assessment cycles.', date: '2025-01-12' },
  { id: 5, title: 'Batch Growth Trajectory Report', format: 'PDF', pages: 18, status: 'Ready', category: 'Batch', description: 'Semester-wise EI progression for Batch 2025 from Sem 1 to Sem 7 with predictive analytics.', date: '2025-01-10' },
  { id: 6, title: 'Placement Readiness Report', format: 'PDF', pages: 20, status: 'Scheduled', category: 'Placement', description: 'Campus placement readiness analysis with company-wise eligibility mapping and shortlist projections.', date: '2025-02-01' },
];

// Settings
export const INSTITUTION_SETTINGS = {
  name: 'Presidency Engineering College',
  code: 'PEC-2024',
  naacGrade: 'A+',
  location: 'Chennai, Tamil Nadu',
  affiliatedUniversity: 'Anna University',
  aicteCode: 'AICTE-TN-2847',
  currentAY: '2024-25',
  activeBatch: 'Batch 2025',
};

export const EI_THRESHOLDS = {
  ready: 70,
  developing: 50,
};

export const COLLEGES_LIST = [
  { id: 'col-001', name: 'Presidency Engineering College', code: 'PEC-2024', location: 'Chennai, TN', admin: 'Dr. V. Anand', students: 1755, avgEI: 68.7, status: 'Active' },
  { id: 'col-002', name: 'PSG College of Technology', code: 'PSGCT-2024', location: 'Coimbatore, TN', admin: 'Dr. Ramesh Babu', students: 2340, avgEI: 71.2, status: 'Active' },
  { id: 'col-003', name: 'SSN College of Engineering', code: 'SSN-2024', location: 'Chennai, TN', admin: 'Prof. Suresh Kumar', students: 1890, avgEI: 73.8, status: 'Active' },
  { id: 'col-004', name: 'Kumaraguru College of Technology', code: 'KCT-2024', location: 'Coimbatore, TN', admin: 'Dr. Priya Mohan', students: 2100, avgEI: 69.5, status: 'Active' },
  { id: 'col-005', name: 'Kongu Engineering College', code: 'KEC-2024', location: 'Erode, TN', admin: 'Dr. Senthil Raj', students: 1650, avgEI: 66.8, status: 'Active' },
];

export const NOTIFICATION_SETTINGS = {
  emailAlerts: true,
  riskThresholdAlerts: true,
  assessmentReminders: true,
  weeklyDigest: false,
  placementUpdates: true,
};
