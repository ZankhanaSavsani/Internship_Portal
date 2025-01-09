import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building2, Users, FileText, CheckSquare, ClipboardList } from 'lucide-react';

const InternshipManagement = () => {
  const [activeTab, setActiveTab] = useState('completion');

  const renderContent = () => {
    switch(activeTab) {
      case 'completion':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Internship Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Company Name" required />
              
              <div className="space-y-2">
                <Label>Type of Internship</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development Project</SelectItem>
                    <SelectItem value="research">Research Project</SelectItem>
                    <SelectItem value="training">On Technology Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mode of Internship</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input placeholder="Technology" required />
              <Input placeholder="Technology Details" required />
              <Input placeholder="Internship Location" required />
              <Input placeholder="Company Address" required />
              
              <div className="space-y-2">
                <Label>HR Details</Label>
                <Input placeholder="HR Name" required />
                <Input placeholder="HR Contact Number" required type="tel" />
                <Input placeholder="HR Email" required type="email" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" required />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stipend Amount</Label>
                <Input type="number" min="0" required />
              </div>

              <div className="space-y-2">
                <Label>Stipend Proof (Optional)</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              <div className="space-y-2">
                <Label>Completion Certificate</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" required />
              </div>

              <Button className="w-full">Submit Completion Status</Button>
            </CardContent>
          </Card>
        );
      // [Previous cases remain unchanged]
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Internship Portal</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('completion')}
                className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'completion' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <CheckSquare size={20} />
                <span>Completion Status</span>
              </button>
            </li>
            {/* [Other navigation items remain unchanged] */}
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default InternshipManagement;
