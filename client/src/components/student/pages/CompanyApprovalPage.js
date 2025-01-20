import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Plus, Minus } from 'lucide-react';

const CompanyApprovalForm = () => {
  const [branches, setBranches] = useState([{ location: '' }]);
  const [technology, setTechnology] = useState(['']);
  const [clients, setClients] = useState(['']);

  const handleBranchChange = (index, value) => {
    const newBranches = [...branches];
    newBranches[index].location = value;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen overflow-y-auto w-full">
      <Card className="w-full">
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
                {branches.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setBranches(branches.filter((_, i) => i !== index))}
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              onClick={() => setBranches([...branches, { location: '' }])} 
              className="w-full"
            >
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
                {technology.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setTechnology(technology.filter((_, i) => i !== index))}
                  >
                    <Minus size={16} />
                  </Button>
                )}
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
                {clients.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setClients(clients.filter((_, i) => i !== index))}
                  >
                    <Minus size={16} />
                  </Button>
                )}
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
          
          <Button type="submit" className="w-full">Submit for Approval</Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default CompanyApprovalForm;