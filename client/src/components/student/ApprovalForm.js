import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Users, FileText, CheckSquare, ClipboardList, Plus, Minus } from 'lucide-react';

const InternshipManagement = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [branches, setBranches] = useState([{ location: '' }]);
  const [technology, setTechnology] = useState(['']);
  const [clients, setClients] = useState(['']);

  const handleBranchChange = (index, value) => {
    const newBranches = [...branches];
    newBranches[index].location = value;
    setBranches(newBranches);
  };

  const addBranch = () => setBranches([...branches, { location: '' }]);
  const removeBranch = (index) => {
    const newBranches = branches.filter((_, i) => i !== index);
    setBranches(newBranches);
  };

  const handleTechnologyChange = (index, value) => {
    const newTechnology = [...technology];
    newTechnology[index] = value;
    setTechnology(newTechnology);
  };

  const handleClientChange = (index, value) => {
    const newClients = [...clients];
    newClients[index] = value;
    setClients(newClients);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'company':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Company Approval Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Student Name" required />
              <Input placeholder="Company Name" required />
              <Input placeholder="Company Website" type="url" />
              <Input placeholder="Company Address" required />
              <Input placeholder="Number of Employees" type="number" />
              
              {/* Branches */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Branches</label>
                {branches.map((branch, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder="Branch Location"
                      value={branch.location}
                      onChange={(e) => handleBranchChange(index, e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => removeBranch(index)}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addBranch} className="w-full">
                  <Plus size={16} className="mr-2" /> Add Branch
                </Button>
              </div>

              <Input placeholder="Head Office Address" />
              <Input placeholder="Stipend Amount" type="number" min="0" required />
              
              {/* HR Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium">HR Details</label>
                <Input placeholder="HR Name" required />
                <Input placeholder="HR Phone" required type="tel" />
                <Input placeholder="HR Email" required type="email" />
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Technologies</label>
                {technology.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder="Technology"
                      value={tech}
                      onChange={(e) => handleTechnologyChange(index, e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setTechnology(technology.filter((_, i) => i !== index))}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  onClick={() => setTechnology([...technology, ''])} 
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" /> Add Technology
                </Button>
              </div>

              <Input placeholder="Current Project" />

              {/* Clients */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Clients</label>
                {clients.map((client, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder="Client Name"
                      value={client}
                      onChange={(e) => handleClientChange(index, e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setClients(clients.filter((_, i) => i !== index))}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  onClick={() => setClients([...clients, ''])} 
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" /> Add Client
                </Button>
              </div>

              <Input placeholder="Source of Company" />
              <Textarea placeholder="Reason to Choose This Company" />
              
              <Button className="w-full">Submit for Approval</Button>
            </CardContent>
          </Card>
        );
      // ... [Other tab content remains the same]
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
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'company' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Building2 size={20} />
                <span>Company Approval</span>
              </button>
            </li>
            {/* ... [Other navigation items remain the same] */}
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