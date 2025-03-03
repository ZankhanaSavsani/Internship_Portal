import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Student Components
import Dashboard from "./components/student/pages/Dashboard";
import "./components/student/css/globals.css";
import CompanyApprovalForm from "./components/student/pages/CompanyApprovalPage";
import StudentLayout from "./components/layouts/StudentLayout";
import WeeklyReportForm from "./components/student/pages/WeeklyReportForm";
import AddWeeklyReportPage from "./components/student/pages/AddWeeklyReportPage";
import SummerInternshipCompletionForm from "./components/student/pages/SummerInternshipCompletionStatusForm";
import SummerInternshipStatusForm from "./components/student/pages/SummerInternshipStatusForm";
import StudentProfile from "./components/student/pages/StudentProfile";

// Admin Components
import AdminLayout from "./components/layouts/AdminLayout";
import ManageCompanyApprovals from "./components/admin/pages/ManageCompanyApprovals";
import StudentManagementPages from "./components/admin/pages/StudentManagementPages";
import AddStudentPage from "./components/admin/pages/AddStudentPage";
import EditStudentPage from "./components/admin/pages/EditStudentPage";
import DeleteStudentPage from "./components/admin/pages/DeleteStudentPage";
import AddGuidePage from "./components/admin/pages/AddGuidePage";

// Auth Components
import LoginPage from "./components/pages/LoginPage";

import { AuthProvider } from "./components/layouts/AuthProvider";
import ProtectedRoute from "./components/layouts/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<Navigate to="/student/Dashboard" replace />} />
            <Route path="/student/Dashboard" element={<Dashboard />} />
            <Route path="/student/CompanyApprovalForm" element={<CompanyApprovalForm />} />
            <Route path="/student/WeeklyReportForm" element={<WeeklyReportForm />} />
            <Route path="/student/AddWeeklyReportPage" element={<AddWeeklyReportPage />} />
            <Route path="/student/SummerInternshipCompletionForm" element={<SummerInternshipCompletionForm />} />
            <Route path="/student/SummerInternshipStatusForm" element={<SummerInternshipStatusForm />} />
            <Route path="/student/StudentProfile" element={<StudentProfile />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/ManageCompanyApprovals" replace />} />
            <Route path="/admin/ManageCompanyApprovals" element={<ManageCompanyApprovals />} />
            <Route path="/admin/StudentManagementPages" element={<StudentManagementPages />} />
            <Route path="/admin/AddStudentPage" element={<AddStudentPage />} />
            <Route path="/admin/EditStudentPage" element={<EditStudentPage />} />
            <Route path="/admin/DeleteStudentPage" element={<DeleteStudentPage />} />
            <Route path="/admin/AddGuidePage" element={<AddGuidePage />} />
          </Route>
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
