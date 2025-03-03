import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CheckSquare,
  ClipboardList,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  RadixDropdownMenuTrigger,
  RadixDropdownMenuContent,
  CustomDropdownMenuItem,
  CustomDropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useAuth } from "../../layouts/AuthProvider";

const NavLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    // { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/Dashboard" },
    {
      icon: <Building2 size={20} />,
      text: "Company Approval",
      path: "/student/CompanyApprovalForm",
    },
    { icon: <FileText size={20} />, text: "Status", path: "/student/SummerInternshipStatusForm" },
    {
      icon: <CheckSquare size={20} />,
      text: "Completion",
      path: "/student/SummerInternshipCompletionForm",
    },
    {
      icon: <ClipboardList size={20} />,
      text: "Weekly Reports",
      path: "/student/AddWeeklyReportPage",
    },
    { icon: <Users size={20} />, text: "Mentor Selection", path: "/student/mentor" },
  ];

  const handleLogout = async () => {
    await logout(); // Call the logout function from AuthProvider
    navigate("/login"); // Redirect to login
  };

  const handleStudentProfile = () => {
    navigate("/student/StudentProfile");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-50 px-4 py-3 border-b shadow-md flex justify-between items-center">
      <div className="h-20 flex items-center">
        <img
          src="/images/logo.png"
          alt="Company Logo"
          className="h-full w-auto object-contain max-w-[250px]"
        />
      </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} className="text-gray-600" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 focus:outline-none"
          >
            {isOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static 
        w-64 h-[calc(100vh-4rem)] lg:h-screen
        bg-white shadow-lg 
        transition-transform duration-300 ease-in-out
        z-40
        flex flex-col
        ${isOpen ? "translate-x-0 mt-16 lg:mt-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="hidden lg:flex p-4 border-b bg-gray-100 justify-between items-center">
      <div className="h-20 flex items-center">
        <img
          src="/images/logo.png"
          alt="Company Logo"
          className="h-full w-auto object-contain max-w-[280px]"
        />
      </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Menu Section */}
        <div className="p-4 border-t bg-gray-100">
          {/* Desktop Notifications */}
          <div className="hidden lg:flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} className="text-gray-600" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu
            trigger={
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={20} className="text-gray-700" />
                </div>
                <span className="font-medium text-gray-700">Zankhana</span>
                <ChevronDown size={16} className="text-gray-600" />
              </div>
            }
          >
            <CustomDropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg" onClick={handleStudentProfile}>
              <User className="mr-2 h-4 w-4 text-gray-600" />
              <span>Profile</span>
            </CustomDropdownMenuItem>
            <CustomDropdownMenuSeparator />
            <CustomDropdownMenuItem
              className="cursor-pointer text-red-600 hover:bg-gray-100 p-3 rounded-lg"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </CustomDropdownMenuItem>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:min-h-screen bg-gray-50 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
};

export default NavLayout;
