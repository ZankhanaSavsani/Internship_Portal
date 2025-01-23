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
import { Textarea } from "../ui/textarea";
import {
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Save,
  Building,
  Users,
  Code,
  Briefcase,
} from "lucide-react";

const CompanyApprovalForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: "",
    companyName: "",
    companyWebsite: "",
    companyAddress: "",
    employeeCount: "",
    branches: [{ location: "" }],
    headOfficeAddress: "",
    stipendAmount: "",
    hrName: "",
    hrPhone: "",
    hrEmail: "",
    technologies: [""],
    currentProject: "",
    clients: [""],
    companySource: "",
    reasonForChoice: "",
  });

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const [errors, setErrors] = useState({});

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      icon: <Building className="w-5 h-5" />,
    },
    { number: 2, title: "HR & Location", icon: <Users className="w-5 h-5" /> },
    {
      number: 3,
      title: "Technical Details",
      icon: <Code className="w-5 h-5" />,
    },
    {
      number: 4,
      title: "Additional Info",
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleBranchChange = (index, value) => {
    const newBranches = [...formData.branches];
    newBranches[index].location = value;
    handleChange("branches", newBranches);
  };

  const handleTechnologyChange = (index, value) => {
    const newTechnology = [...formData.technologies];
    newTechnology[index] = value;
    handleChange("technologies", newTechnology);
  };

  const handleClientChange = (index, value) => {
    const newClients = [...formData.clients];
    newClients[index] = value;
    handleChange("clients", newClients);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.studentName.trim()) {
          newErrors.studentName = "Student name is required";
        } else if (formData.studentName.length < 2) {
          newErrors.studentName = "Name must be at least 2 characters long";
        }

        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
        }

        if (formData.companyWebsite && !validateURL(formData.companyWebsite)) {
          newErrors.companyWebsite =
            "Please enter a valid URL (e.g., https://example.com)";
        }

        if (!formData.companyAddress.trim()) {
          newErrors.companyAddress = "Company address is required";
        } else if (formData.companyAddress.length < 10) {
          newErrors.companyAddress = "Please enter a complete address";
        }

        if (!formData.employeeCount) {
          newErrors.employeeCount = "Number of employees is required";
        } else if (formData.employeeCount < 1) {
          newErrors.employeeCount =
            "Number of employees must be greater than 0";
        }
        break;

      case 2:
        if (!formData.stipendAmount) {
          newErrors.stipendAmount = "Stipend amount is required";
        } else if (formData.stipendAmount < 0) {
          newErrors.stipendAmount = "Stipend amount cannot be negative";
        }

        if (!formData.hrName.trim()) {
          newErrors.hrName = "HR name is required";
        } else if (formData.hrName.length < 2) {
          newErrors.hrName = "HR name must be at least 2 characters long";
        }

        if (!formData.hrPhone) {
          newErrors.hrPhone = "HR phone is required";
        } else if (!validatePhone(formData.hrPhone)) {
          newErrors.hrPhone = "Please enter a valid phone number";
        }

        if (!formData.hrEmail) {
          newErrors.hrEmail = "HR email is required";
        } else if (!validateEmail(formData.hrEmail)) {
          newErrors.hrEmail = "Please enter a valid email address";
        }

        if (formData.branches.some((branch) => !branch.location.trim())) {
          newErrors.branches = "All branch locations must be filled";
        }

        if (!formData.headOfficeAddress.trim()) {
          newErrors.headOfficeAddress = "Head office address is required";
        }
        break;

      case 3:
        if (!formData.technologies[0]) {
          newErrors.technologies = "At least one technology is required";
        } else if (formData.technologies.some((tech) => !tech.trim())) {
          newErrors.technologies = "All technology fields must be filled";
        }

        if (!formData.currentProject.trim()) {
          newErrors.currentProject = "Current project is required";
        } else if (formData.currentProject.length < 5) {
          newErrors.currentProject =
            "Please provide more details about the current project";
        }
        break;

      case 4:
        if (!formData.companySource.trim()) {
          newErrors.companySource = "Source of company is required";
        }

        if (!formData.reasonForChoice.trim()) {
          newErrors.reasonForChoice = "Reason is required";
        }

        if (formData.clients.some((client) => !client.trim())) {
          newErrors.clients = "All client fields must be filled";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log("Form submitted:", formData);
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
                  ${
                    currentStep === step.number
                      ? "bg-blue-900 border-blue-900 text-white"
                      : currentStep > step.number
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
              >
                {step.icon}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name *
            </label>
            <Input
              value={formData.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
              className={errors.studentName ? "border-red-500" : ""}
              placeholder="Enter your full name"
            />
            {errors.studentName && (
              <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className={errors.companyName ? "border-red-500" : ""}
              placeholder="Enter company name"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Website *
            </label>
            <Input
              type="url"
              value={formData.companyWebsite}
              onChange={(e) => handleChange("companyWebsite", e.target.value)}
              className={errors.companyWebsite ? "border-red-500" : ""}
              placeholder="Enter company website"
            />
            {errors.companyWebsite && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyWebsite}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Address *
            </label>
            <Input
              value={formData.companyAddress}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              className={errors.companyAddress ? "border-red-500" : ""}
              placeholder="Enter complete company address"
            />
            {errors.companyAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyAddress}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Employees *
            </label>
            <Input
              type="number"
              value={formData.employeeCount}
              onChange={(e) => handleChange("employeeCount", e.target.value)}
              className={errors.employeeCount ? "border-red-500" : ""}
              placeholder="Enter number of employees"
              min="1"
            />
            {errors.employeeCount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.employeeCount}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHRLocation = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Branches *
            </label>
            {formData.branches.map((branch, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Branch Location"
                  value={branch.location}
                  onChange={(e) => handleBranchChange(index, e.target.value)}
                  className={errors.branches ? "border-red-500" : ""}
                />
                {formData.branches.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleChange(
                        "branches",
                        formData.branches.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            ))}
            {errors.branches && (
              <p className="text-red-500 text-sm mt-1">{errors.branches}</p>
            )}
            <Button
              type="button"
              onClick={() =>
                handleChange("branches", [
                  ...formData.branches,
                  { location: "" },
                ])
              }
              className="w-full"
            >
              <Plus size={16} className="mr-2" /> Add Branch
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Head Office Address *
            </label>
            <Input
              value={formData.headOfficeAddress}
              onChange={(e) =>
                handleChange("headOfficeAddress", e.target.value)
              }
              className={errors.headOfficeAddress ? "border-red-500" : ""}
              placeholder="Enter head office address"
            />
            {errors.headOfficeAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.headOfficeAddress}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stipend Amount *
            </label>
            <Input
              type="number"
              value={formData.stipendAmount}
              onChange={(e) => handleChange("stipendAmount", e.target.value)}
              className={errors.stipendAmount ? "border-red-500" : ""}
              placeholder="Enter stipend amount"
              min="0"
            />
            {errors.stipendAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stipendAmount}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              HR Details
            </label>
            <Input
              placeholder="HR Name *"
              value={formData.hrName}
              onChange={(e) => handleChange("hrName", e.target.value)}
              className={errors.hrName ? "border-red-500" : ""}
            />
            {errors.hrName && (
              <p className="text-red-500 text-sm mt-1">{errors.hrName}</p>
            )}

            <Input
              placeholder="HR Phone *"
              type="tel"
              value={formData.hrPhone}
              onChange={(e) => handleChange("hrPhone", e.target.value)}
              className={errors.hrPhone ? "border-red-500" : ""}
            />
            {errors.hrPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.hrPhone}</p>
            )}

            <Input
              placeholder="HR Email *"
              type="email"
              value={formData.hrEmail}
              onChange={(e) => handleChange("hrEmail", e.target.value)}
              className={errors.hrEmail ? "border-red-500" : ""}
            />
            {errors.hrEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.hrEmail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechnicalDetails = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Technologies *
            </label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Technology"
                  value={tech}
                  onChange={(e) =>
                    handleTechnologyChange(index, e.target.value)
                  }
                  className={errors.technologies ? "border-red-500" : ""}
                />
                {formData.technologies.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleChange(
                        "technologies",
                        formData.technologies.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            ))}
            {errors.technologies && (
              <p className="text-red-500 text-sm mt-1">{errors.technologies}</p>
            )}
            <Button
              type="button"
              onClick={() =>
                handleChange("technologies", [...formData.technologies, ""])
              }
              className="w-full"
            >
              <Plus size={16} className="mr-2" /> Add Technology
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Project *
            </label>
            <Input
              value={formData.currentProject}
              onChange={(e) => handleChange("currentProject", e.target.value)}
              className={errors.currentProject ? "border-red-500" : ""}
              placeholder="Enter current project"
            />
            {errors.currentProject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentProject}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Clients *
            </label>
            {formData.clients.map((client, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Client Name"
                  value={client}
                  onChange={(e) => handleClientChange(index, e.target.value)}
                  className={errors.clients ? "border-red-500" : ""}
                />
                {formData.clients.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleChange(
                        "clients",
                        formData.clients.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            ))}
            {errors.clients && (
              <p className="text-red-500 text-sm mt-1">{errors.clients}</p>
            )}
            <Button
              type="button"
              onClick={() => handleChange("clients", [...formData.clients, ""])}
              className="w-full"
            >
              <Plus size={16} className="mr-2" /> Add Client
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source of Company *
            </label>
            <Input
              value={formData.companySource}
              onChange={(e) => handleChange("companySource", e.target.value)}
              className={errors.companySource ? "border-red-500" : ""}
              placeholder="How did you find this company?"
            />
            {errors.companySource && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companySource}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason to Choose This Company *
            </label>
            <Textarea
              value={formData.reasonForChoice}
              onChange={(e) => handleChange("reasonForChoice", e.target.value)}
              className={errors.reasonForChoice ? "border-red-500" : ""}
              placeholder="Why do you want to work with this company?"
            />
            {errors.reasonForChoice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.reasonForChoice}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <Card className="w-full max-w-4xl mx-auto bg-gray-50">
      <CardHeader className="border-b bg-white">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Company Approval Form
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {renderStepIndicator()}
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderHRLocation()}
          {currentStep === 3 && renderTechnicalDetails()}
          {currentStep === 4 && renderAdditionalInfo()}
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Submit for Approval
            <Save className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
    </div>
  );
};

export default CompanyApprovalForm;
