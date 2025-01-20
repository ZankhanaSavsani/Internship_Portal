// pages/Dashboard.js
import React from 'react';
import NavLayout from './NavLayout';
import CompanyApprovalForm from './CompanyApprovalPage';

const Dashboard = () => {
  return (
    <NavLayout>
      {/* <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to your internship management system.</p> */}
      <div className="w-full">
    <CompanyApprovalForm />
  </div>
    </NavLayout>
  );
};

export default Dashboard;
