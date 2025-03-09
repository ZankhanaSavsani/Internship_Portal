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
import OnboardingPage from "./components/student/pages/OnboardingPage";

// Admin Components
import AdminLayout from "./components/layouts/AdminLayout";
import ManageCompanyApprovals from "./components/admin/pages/ManageCompanyApprovals";
import StudentManagementPages from "./components/admin/pages/StudentManagementPages";
import GuideManagementPages from "./components/admin/pages/GuideManagementPages";
import AddStudentPage from "./components/admin/pages/AddStudentPage";
import EditStudentPage from "./components/admin/pages/EditStudentPage";
import DeleteStudentPage from "./components/admin/pages/DeleteStudentPage";
import AddGuide from './components/admin/pages/AddGuide';
import EditGuide from './components/admin/pages/EditGuide';
import DeleteGuide from './components/admin/pages/DeleteGuide';
import AdminManagementPages from './components/admin/pages/AdminManagementPages';
import AddAdmin from './components/admin/pages/AddAdmin';
import EditAdmin from './components/admin/pages/EditAdmin';
import DeleteAdmin from './components/admin/pages/DeleteAdmin';

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
            <Route path="/student" element={<Navigate to="/student/StudentProfile" replace />} />
            <Route path="/student/onboarding" element={<OnboardingPage />} />
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
            <Route path="/admin/AddStudent" element={<AddStudentPage />} />
            <Route path="/admin/EditStudent" element={<EditStudentPage />} />
            <Route path="/admin/DeleteStudent" element={<DeleteStudentPage />} />
            <Route path="/admin/AddGuidePage" element={<AddGuide />} />
            <Route path="/admin/EditGuide" element={<EditGuide />} />
            <Route path="/admin/DeleteGuide" element={<DeleteGuide />} />
            <Route path="/admin/AddAdmin" element={<AddAdmin />} />
            <Route path="/admin/EditAdmin" element={<EditAdmin />} />
            <Route path="/admin/DeleteAdmin" element={<DeleteAdmin />} />
            <Route path="/admin/GuideManagementPages" element={<GuideManagementPages />} />
            <Route path="/admin/AdminManagementPages" element={<AdminManagementPages />} />
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
