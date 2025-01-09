import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, Clock, AlertTriangle, Building2, Users, FileText, CheckSquare, ClipboardList } from 'lucide-react';

const InternshipManagement = () => {
  const [activeTab, setActiveTab] = useState('company');

  const mentors = [
    { id: 1, name: 'Dr. Smith', department: 'Computer Science' },
    { id: 2, name: 'Prof. Johnson', department: 'Electronics' },
    { id: 3, name: 'Dr. Williams', department: 'IT' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'company':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Company Approval Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Company Name" />
              <Input placeholder="Company Address" />
              <Input placeholder="Contact Person" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Phone" type="tel" />
              <Textarea placeholder="Company Description" />
              <Button className="w-full">Submit for Approval</Button>
            </CardContent>
          </Card>
        );
      case 'mentor':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Mentor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map(mentor => (
                    <SelectItem key={mentor.id} value={mentor.id.toString()}>
                      {mentor.name} - {mentor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full">Confirm Selection</Button>
            </CardContent>
          </Card>
        );
      case 'status':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Internship Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 p-4 bg-green-50 rounded">
                <Check className="text-green-500" />
                <span>Company Approved</span>
              </div>
              <div className="flex items-center space-x-2 p-4 bg-yellow-50 rounded">
                <Clock className="text-yellow-500" />
                <span>Internship In Progress</span>
              </div>
              <Textarea placeholder="Current Status Notes" />
              <Button className="w-full">Update Status</Button>
            </CardContent>
          </Card>
        );
      case 'completion':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="date" placeholder="End Date" />
              <Textarea placeholder="Project Summary" />
              <Input type="file" className="w-full" />
              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded">
                <AlertTriangle className="text-blue-500" />
                <span>Pending Certificate Upload</span>
              </div>
              <Button className="w-full">Submit Completion</Button>
            </CardContent>
          </Card>
        );
      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Report Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      Week {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="Weekly Activities" />
              <Textarea placeholder="Learning Outcomes" />
              <Input type="file" className="w-full" />
              <Button className="w-full">Submit Report</Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Internship Portal</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'company' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Building2 size={20} />
                <span>Company Approval</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('mentor')}
                className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'mentor' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Users size={20} />
                <span>Mentor Selection</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('status')}
                className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'status' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <FileText size={20} />
                <span>Status</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('completion')}
                className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'completion' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <CheckSquare size={20} />
                <span>Completion</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'reports' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <ClipboardList size={20} />
                <span>Weekly Reports</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default InternshipManagement;