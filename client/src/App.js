import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/student/pages/Dashboard';
import './components/student/css/globals.css';

// import LoginPage from './pages/LoginPage';
// import StudentDashboard from './pages/StudentDashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import GuideDashboard from './pages/GuideDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/guide" element={<GuideDashboard />} /> */}
        
        {/* Corrected Route Syntax */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
