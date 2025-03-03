// components/layouts/GuideLayout.js
import React from 'react';
import { useAuth } from './AuthProvider';
import GuideSidebar from '../navigation/GuideSidebar';
import Header from '../navigation/Header';

const GuideLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <GuideSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username={user?.username} role="Guide" onLogout={logout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default GuideLayout;
