import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/student/pages/Dashboard';
import './components/student/css/globals.css';
import CompanyApprovalForm from './components/student/pages/CompanyApprovalPage';
import Layout from './components/student/Layout';

// import LoginPage from './pages/LoginPage';
// import StudentDashboard from './pages/StudentDashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import GuideDashboard from './pages/GuideDashboard';

function App() {
  return (
    <Router>
      <Routes>
      <Route element={<Layout />}>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/guide" element={<GuideDashboard />} /> */}
        
        {/* Corrected Route Syntax */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CompanyApprovalForm" element={<CompanyApprovalForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
