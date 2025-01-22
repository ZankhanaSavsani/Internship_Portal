import React, { useState } from "react";
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
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const NavLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/Dashboard" },
    {
      icon: <Building2 size={20} />,
      text: "Company Approval",
      path: "/CompanyApprovalForm",
    },
    { icon: <Users size={20} />, text: "Mentor Selection", path: "/mentor" },
    { icon: <FileText size={20} />, text: "Status", path: "/status" },
    {
      icon: <CheckSquare size={20} />,
      text: "Completion",
      path: "/SummerInternshipCompletionForm",
    },
    {
      icon: <ClipboardList size={20} />,
      text: "Weekly Reports",
      path: "/AddWeeklyReportPage",
    },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-50 px-4 py-3 border-b shadow-md flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">Internship Portal</h2>
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
          <h2 className="text-xl font-bold text-gray-700">Internship Portal</h2>
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
                <span className="font-medium text-gray-700">John Doe</span>
                <ChevronDown size={16} className="text-gray-600" />
              </div>
            }
          >
            <CustomDropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg">
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
// import React, { useState } from 'react';
// import {
//   Building2, Users, FileText, CheckSquare, ClipboardList, Menu, X,
//   Bell, LogOut, User, ChevronDown
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   RadixDropdownMenuTrigger,
//   RadixDropdownMenuContent,
//   CustomDropdownMenuItem,
//   CustomDropdownMenuSeparator,
// } from './ui/dropdown-menu';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';

// const NavLayout = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(3);

//   const navItems = [
//     { icon: <Building2 size={20} />, text: 'Company Approval', path: '/company' },
//     { icon: <Users size={20} />, text: 'Mentor Selection', path: '/mentor' },
//     { icon: <FileText size={20} />, text: 'Status', path: '/status' },
//     { icon: <CheckSquare size={20} />, text: 'Completion', path: '/completion' },
//     { icon: <ClipboardList size={20} />, text: 'Weekly Reports', path: '/reports' }
//   ];

//   const handleLogout = () => {
//     console.log('Logging out...');
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Mobile Header */}
//       <div className="lg:hidden fixed top-0 w-full bg-white z-50 px-4 py-3 border-b shadow-md flex justify-between items-center">
//         <h2 className="text-xl font-bold text-gray-700">Internship Portal</h2>
//         <div className="flex items-center space-x-2">
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell size={20} className="text-gray-600" />
//             {notificationCount > 0 && (
//               <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
//                 {notificationCount}
//               </Badge>
//             )}
//           </Button>
//           <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
//             {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
//           </button>
//         </div>
//       </div>

//       {/* Sidebar */}
//       <div className={`
//         fixed lg:static
//         w-64 h-full
//         bg-white shadow-lg
//         transition-transform duration-300 ease-in-out
//         z-40
//         flex flex-col
//         ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}>
//         <div className="hidden lg:flex p-4 border-b bg-gray-100 justify-between items-center">
//           <h2 className="text-xl font-bold text-gray-700">Internship Portal</h2>
//         </div>

//         {/* Navigation Items */}
//         <nav className="p-4 flex-1">
//           <ul className="space-y-2">
//             {navItems.map((item, index) => (
//               <li key={index}>
//                 <a
//                   href={item.path}
//                   className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.icon}
//                   <span className="font-medium">{item.text}</span>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* User Menu Section */}
//         <div className="p-4 border-t bg-gray-100">
//           {/* Desktop Notifications */}
//           <div className="hidden lg:flex justify-between items-center mb-4">
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell size={20} className="text-gray-600" />
//               {notificationCount > 0 && (
//                 <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
//                   {notificationCount}
//                 </Badge>
//               )}
//             </Button>
//           </div>

//           {/* User Profile Dropdown */}
//           <DropdownMenu>
//             <RadixDropdownMenuTrigger asChild>
//               <Button variant="ghost" className="w-full flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
//                     <User size={20} className="text-gray-700" />
//                   </div>
//                   <span className="font-medium text-gray-700">John Doe</span>
//                 </div>
//                 <ChevronDown size={16} className="text-gray-600" />
//               </Button>
//             </RadixDropdownMenuTrigger>
//             <RadixDropdownMenuContent align="end" className="w-56 bg-white shadow-md rounded-lg">
//               <CustomDropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg">
//                 <User className="mr-2 h-4 w-4 text-gray-600" />
//                 <span>Profile</span>
//               </CustomDropdownMenuItem>
//               <CustomDropdownMenuSeparator />
//               <CustomDropdownMenuItem className="cursor-pointer text-red-600 hover:bg-gray-100 p-3 rounded-lg" onClick={handleLogout}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Logout</span>
//               </CustomDropdownMenuItem>
//             </RadixDropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 lg:ml-64 pt-16 lg:pt-0 bg-gray-50">
//         <div className="p-8 overflow-auto min-h-screen">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NavLayout;
