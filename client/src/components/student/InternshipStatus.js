import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building2, Users, FileText, CheckSquare, ClipboardList } from 'lucide-react';

const InternshipManagement = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Internship Portal</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center space-x-2 p-2 rounded bg-blue-100 text-blue-600">
                <FileText size={20} />
                <span>Internship Status</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Internship Status Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Company Name" required />
            <Input placeholder="Company Website" type="url" />
            
            <div className="space-y-2">
              <Label>Stipend Amount</Label>
              <Input type="number" min="0" required />
            </div>

            <div className="space-y-2">
              <Label>Learning Mode</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development Project">Development Project</SelectItem>
                  <SelectItem value="Inhouse/Research Project">Inhouse/Research Project</SelectItem>
                  <SelectItem value="On Technology Training">On Technology Training</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input placeholder="Confirmed Technology" required />
            <Input placeholder="Company City" required />
            <Input placeholder="Company Address" required />

            <div className="space-y-2">
              <Label>HR Details</Label>
              <Input placeholder="HR Name" required />
              <Input placeholder="HR Contact Number" required type="tel" />
              <Input placeholder="HR Email" required type="email" />
            </div>

            <div className="space-y-2">
              <Label>Offer Letter</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" required />
            </div>

            <Button className="w-full">Submit Status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternshipManagement;
