import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Lock, User, Mail, GraduationCap, CalendarDays } from "lucide-react";

const StudentProfile = () => {
  const [userData] = useState({
    username: "john_doe",
    email: "john.doe@university.edu",
    semester: 6,
    year: 3,
    guide: "Dr. Jane Smith",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validatePasswordChange = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (validatePasswordChange()) {
      // TODO: Implement actual password change logic with backend
      console.log("Password change submitted");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-2xl font-bold text-gray-800 text-center">
            Student Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-8 p-8">
          {/* Profile Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Profile Details
            </h3>
            <div className="space-y-3">
              {[
                { icon: User, label: "Username", value: userData.username },
                { icon: Mail, label: "Email", value: userData.email },
                { icon: GraduationCap, label: "Semester", value: userData.semester },
                { icon: CalendarDays, label: "Year", value: userData.year },
                { icon: User, label: "Guide/Mentor", value: userData.guide }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center">
                  <Icon className="mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {[
                { 
                  label: "Current Password", 
                  field: "currentPassword",
                  type: "password"
                },
                { 
                  label: "New Password", 
                  field: "newPassword",
                  type: "password"
                },
                { 
                  label: "Confirm New Password", 
                  field: "confirmPassword",
                  type: "password"
                }
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <Input
                    type={type}
                    value={passwordData[field]}
                    onChange={(e) => handlePasswordChange(field, e.target.value)}
                    className={passwordErrors[field] ? "border-red-500" : ""}
                  />
                  {passwordErrors[field] && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors[field]}
                    </p>
                  )}
                </div>
              ))}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Lock className="mr-2 h-4 w-4" /> Change Password
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;