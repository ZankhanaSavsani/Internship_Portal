import React, { useState } from 'react';
import { Menu, X, Building2, Users, FileText, CheckSquare, ClipboardList } from 'lucide-react';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <Building2 size={20} />, text: 'Company' },
    { icon: <Users size={20} />, text: 'Mentor' },
    { icon: <FileText size={20} />, text: 'Status' },
    { icon: <CheckSquare size={20} />, text: 'Completion' },
    { icon: <ClipboardList size={20} />, text: 'Reports' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white p-4 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
        <h1 className="text-xl font-bold">Internship Portal</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`
        lg:hidden fixed w-full bg-white z-40 shadow-md transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-[64px]' : 'translate-y-[-100%]'}
      `}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center space-x-2 w-full p-4 hover:bg-gray-50 border-b"
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            <span>{item.text}</span>
          </button>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed w-64 h-full bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Internship Portal</h1>
        </div>
        <nav className="p-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center space-x-2 w-full p-4 rounded-lg hover:bg-gray-50 mb-2"
            >
              {item.icon}
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Your form content goes here */}
          <h2 className="text-2xl font-bold mb-4">Content Area</h2>
          <p>Your form and other content will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Layout;
