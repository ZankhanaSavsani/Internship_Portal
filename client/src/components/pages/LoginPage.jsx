import React, { useState } from 'react';
import { Eye, EyeOff, Briefcase, GraduationCap, UserCog, Users } from 'lucide-react';

const InternshipLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const getUserMessage = () => {
    switch(selectedTab) {
      case 'student':
        return "Access internship opportunities and track your internship";
      case 'guide':
        return "Monitor and guide students through their internship journey";
      case 'admin':
        return "Manage portal operations and oversee all activities";
      default:
        return "";
    }
  };

  const getEmailPlaceholder = () => {
    switch(selectedTab) {
      case 'student':
        return "student@charusat.edu.in";
      case 'guide':
        return "guide@charusat.ac.in";
      case 'admin':
        return "admin@charusat.ac.in";
      default:
        return "email@domain.com";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all hover:scale-[1.01]">
        {/* Logo/Brand Area */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Internship Portal</h1>
          <p className="text-gray-600">
            Welcome to your internship management system
            <span className="text-blue-600 block mt-1">Connect. Learn. Grow.</span>
          </p>
        </div>

        {/* User Type Selector */}
        <div className="bg-gray-50 rounded-xl p-1.5">
          <div className="flex rounded-lg bg-white shadow-sm p-1">
            <button
              onClick={() => setSelectedTab('student')}
              className={`flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedTab === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student
            </button>
            <button
              onClick={() => setSelectedTab('guide')}
              className={`flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              Guide
            </button>
            <button
              onClick={() => setSelectedTab('admin')}
              className={`flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserCog className="h-4 w-4" />
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder={getEmailPlaceholder()}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200
                       focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 
                       transition-all duration-200"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200
                         focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 
                         transition-all duration-200 pr-11"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                         hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Keep me signed in
                </label>
              </div> */}
              <a href="\PasswordResetPage" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Reset password
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                     font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                     transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Sign in to Portal</span>
          </button>
        </form>

        {/* Footer */}
        <div className="space-y-4">
          {/* <p className="text-center text-sm text-gray-500">
            New to the platform?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
              Create an account
            </a>
          </p> */}
          
          <div className="text-xs text-center text-gray-500">
            {getUserMessage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipLoginForm;