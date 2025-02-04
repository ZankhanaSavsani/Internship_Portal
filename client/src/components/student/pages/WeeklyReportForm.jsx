import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, ClipboardList, Calendar, Target, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const WeeklyReportForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    projectTitle: '',
    reportWeek: '',
    reportWeekStart: '',
    reportWeekEnd: '',
    objectivesForWeek: '',
    tasksCompleted: '',
    keyFindings: '',
    challengesEncountered: '',
    planForNextWeek: ''
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Basic Information", icon: <ClipboardList className="w-5 h-5" /> },
    { number: 2, title: "Report Period", icon: <Calendar className="w-5 h-5" /> },
    { number: 3, title: "Progress Details", icon: <Target className="w-5 h-5" /> },
    { number: 4, title: "Analysis & Planning", icon: <FileText className="w-5 h-5" /> }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.studentName) newErrors.studentName = 'Student name is required';
        if (!formData.projectTitle) newErrors.projectTitle = 'Project title is required';
        if (!formData.reportWeek) newErrors.reportWeek = 'Report week is required';
        break;
      case 2:
        if (!formData.reportWeekStart) newErrors.reportWeekStart = 'Start date is required';
        if (!formData.reportWeekEnd) newErrors.reportWeekEnd = 'End date is required';
        if (formData.reportWeekStart && formData.reportWeekEnd && 
            new Date(formData.reportWeekStart) > new Date(formData.reportWeekEnd)) {
          newErrors.reportWeekEnd = 'End date must be after start date';
        }
        break;
      case 3:
        if (!formData.objectivesForWeek) newErrors.objectivesForWeek = 'Objectives are required';
        if (!formData.tasksCompleted) newErrors.tasksCompleted = 'Tasks completed is required';
        break;
      case 4:
        if (!formData.keyFindings) newErrors.keyFindings = 'Key findings are required';
        if (!formData.challengesEncountered) newErrors.challengesEncountered = 'Challenges are required';
        if (!formData.planForNextWeek) newErrors.planForNextWeek = 'Plan for next week is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log('Form submitted:', formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2
                  ${currentStep === step.number 
                    ? 'bg-blue-900 border-blue-900 text-white'
                    : currentStep > step.number
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 text-gray-500'}`}
              >
                {step.icon}
              </div>
              <span className="text-xs font-medium text-gray-600">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
            <Input
              placeholder="Enter your full name"
              value={formData.studentName}
              onChange={e => handleChange('studentName', e.target.value)}
              className={`${errors.studentName ? 'border-red-500' : ''}`}
            />
            {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
            <Input
              placeholder="Enter project title"
              value={formData.projectTitle}
              onChange={e => handleChange('projectTitle', e.target.value)}
              className={`${errors.projectTitle ? 'border-red-500' : ''}`}
            />
            {errors.projectTitle && <p className="text-red-500 text-sm mt-1">{errors.projectTitle}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Week *</label>
            <Select
              value={formData.reportWeek}
              onValueChange={value => handleChange('reportWeek', value)}
            >
              <SelectTrigger className={errors.reportWeek ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Week " />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map(week => (
                  <SelectItem key={week} value={week.toString()}>
                    Week {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reportWeek && <p className="text-red-500 text-sm mt-1">{errors.reportWeek}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Week Start *</label>
            <Input
              type="date"
              value={formData.reportWeekStart}
              onChange={e => handleChange('reportWeekStart', e.target.value)}
              className={errors.reportWeekStart ? 'border-red-500' : ''}
            />
            {errors.reportWeekStart && <p className="text-red-500 text-sm mt-1">{errors.reportWeekStart}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Week End *</label>
            <Input
              type="date"
              value={formData.reportWeekEnd}
              onChange={e => handleChange('reportWeekEnd', e.target.value)}
              className={errors.reportWeekEnd ? 'border-red-500' : ''}
            />
            {errors.reportWeekEnd && <p className="text-red-500 text-sm mt-1">{errors.reportWeekEnd}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objectives for Week *</label>
            <Textarea
              placeholder="List your key objectives for this week"
              value={formData.objectivesForWeek}
              onChange={e => handleChange('objectivesForWeek', e.target.value)}
              className={`${errors.objectivesForWeek ? 'border-red-500' : ''} min-h-[120px]`}
            />
            {errors.objectivesForWeek && <p className="text-red-500 text-sm mt-1">{errors.objectivesForWeek}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tasks Completed *</label>
            <Textarea
              placeholder="Describe the tasks you completed"
              value={formData.tasksCompleted}
              onChange={e => handleChange('tasksCompleted', e.target.value)}
              className={`${errors.tasksCompleted ? 'border-red-500' : ''} min-h-[120px]`}
            />
            {errors.tasksCompleted && <p className="text-red-500 text-sm mt-1">{errors.tasksCompleted}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Findings *</label>
            <Textarea
              placeholder="Share your key findings and insights"
              value={formData.keyFindings}
              onChange={e => handleChange('keyFindings', e.target.value)}
              className={`${errors.keyFindings ? 'border-red-500' : ''} min-h-[100px]`}
            />
            {errors.keyFindings && <p className="text-red-500 text-sm mt-1">{errors.keyFindings}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Challenges Encountered *</label>
            <Textarea
              placeholder="Describe any challenges or obstacles faced"
              value={formData.challengesEncountered}
              onChange={e => handleChange('challengesEncountered', e.target.value)}
              className={`${errors.challengesEncountered ? 'border-red-500' : ''} min-h-[100px]`}
            />
            {errors.challengesEncountered && <p className="text-red-500 text-sm mt-1">{errors.challengesEncountered}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan for Next Week *</label>
            <Textarea
              placeholder="Outline your plans and goals for next week"
              value={formData.planForNextWeek}
              onChange={e => handleChange('planForNextWeek', e.target.value)}
              className={`${errors.planForNextWeek ? 'border-red-500' : ''} min-h-[100px]`}
            />
            {errors.planForNextWeek && <p className="text-red-500 text-sm mt-1">{errors.planForNextWeek}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <Card className="w-full max-w-4xl mx-auto bg-gray-50 max-h-[90vh]">
      <CardHeader className="border-b bg-white">
        <CardTitle className="text-2xl font-bold text-gray-800">Weekly Progress Report </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        {renderStepIndicator()}
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </form>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-white mt-6 p-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button 
            onClick={handleNext}
            className="bg-blue-900 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Submit Report
            <Save className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
    </div>
  );
};

export default WeeklyReportForm;