import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/student/pages/Dashboard";
import "./components/student/css/globals.css";
import CompanyApprovalForm from "./components/student/pages/CompanyApprovalPage";
import Layout from "./components/student/Layout";
import WeeklyReportForm from "./components/student/pages/WeeklyReportForm";
import AddWeeklyReportPage from "./components/student/pages/AddWeeklyReportPage";
import SummerInternshipCompletionForm from "./components/student/pages/SummerInternshipCompletionStatusForm";
import SummerInternshipForm from "./components/student/pages/SummerInternshipStatusForm";
import StudentProfile from "./components/student/pages/StudentProfile";
import LoginPage from "./components/pages/LoginPage";
import PasswordResetPage from "./components/pages/PasswordResetPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/PasswordResetPage" element={<PasswordResetPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<StudentProfile />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route
            path="/CompanyApprovalForm"
            element={<CompanyApprovalForm />}
          />
          <Route path="/WeeklyReportForm" element={<WeeklyReportForm />} />
          <Route
            path="/AddWeeklyReportPage"
            element={<AddWeeklyReportPage />}
          />
          <Route
            path="/SummerInternshipCompletionForm"
            element={<SummerInternshipCompletionForm />}
          />
          <Route
            path="/SummerInternshipForm"
            element={<SummerInternshipForm />}
          />
          <Route path="/StudentProfile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
