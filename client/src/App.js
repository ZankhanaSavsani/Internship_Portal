import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/student/pages/Dashboard";
import "./components/student/css/globals.css";
import CompanyApprovalForm from "./components/student/pages/CompanyApprovalPage";
import Layout from "./components/student/Layout";
import WeeklyReportForm from "./components/student/pages/WeeklyReportForm";
import AddWeeklyReportPage from "./components/student/pages/AddWeeklyReportPage";
import SummerInternshipCompletionForm from "./components/student/pages/SummerInternshipCompletionStatusForm";
import SummerInternshipStatusForm from "./components/student/pages/SummerInternshipStatusForm";
import StudentProfile from "./components/student/pages/StudentProfile";
import LoginPage from "./components/pages/LoginPage";
import PasswordResetPage from "./components/pages/PasswordResetPage";
import AdminLayout from "./components/admin/AdminLayout";
import ManageCompanyApprovals from "./components/admin/pages/ManageCompanyApprovals";
import StudentManagementPages from "./components/admin/pages/StudentManagementPages";
import AddStudentPage from "./components/admin/pages/AddStudentPage";
import EditStudentPage from "./components/admin/pages/EditStudentPage";
import DeleteStudentPage from "./components/admin/pages/DeleteStudentPage";
import AddGuidePage from "./components/admin/pages/AddGuidePage";

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
            path="/SummerInternshipStatusForm"
            element={<SummerInternshipStatusForm />}
          />
          <Route path="/StudentProfile" element={<StudentProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout/>}>
        <Route
            path="/admin/ManageCompanyApprovals"
            element={<ManageCompanyApprovals />}
          />
        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
        <Route
            path="/admin/StudentManagementPages"
            element={<StudentManagementPages />}
          />
        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
        <Route
            path="/admin/AddStudentPage"
            element={<AddStudentPage />}
          />
        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
        <Route
            path="/admin/EditStudentPage"
            element={<EditStudentPage />}
          />
        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
        <Route
            path="/admin/DeleteStudentPage"
            element={<DeleteStudentPage />}
          />
        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
        <Route
            path="/admin/AddGuidePage"
            element={<AddGuidePage/>}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
