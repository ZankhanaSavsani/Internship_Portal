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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Briefcase,
  FileText,
  MapPin,
  Upload,
} from "lucide-react";

const SummerInternshipCompletionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    typeOfInternship: "",
    technology: "",
    technologyDetails: "",
    modeOfInternship: "",
    internshipLocation: "",
    companyAddress: "",
    hrDetails: {
      name: "",
      contactNo: "",
      email: "",
    },
    startDate: "",
    endDate: "",
    stipendAmount: "",
    stipendProof: null,
    completionCertificate: null,
  });

  const [errors, setErrors] = useState({});

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

  const steps = [
    {
      number: 1,
      title: "Company Details",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      number: 2,
      title: "Internship Details",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      number: 3,
      title: "Location & HR",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      number: 4,
      title: "Documents",
      icon: <Upload className="w-5 h-5" />,
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

  const handleHRChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hrDetails: {
        ...prev.hrDetails,
        [field]: value,
      },
    }));
    if (errors[`hrDetails.${field}`]) {
      setErrors((prev) => ({
        ...prev,
        [`hrDetails.${field}`]: undefined,
      }));
    }
  };

  const handleFileChange = (field) => (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [field]: file
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
        }
        if (!formData.typeOfInternship) {
          newErrors.typeOfInternship = "Type of internship is required";
        }
        if (!formData.technology.trim()) {
          newErrors.technology = "Technology is required";
        }
        if (!formData.technologyDetails.trim()) {
          newErrors.technologyDetails = "Technology details are required";
        }
        break;

      case 2:
        if (!formData.startDate) {
          newErrors.startDate = "Start date is required";
        }
        if (!formData.endDate) {
          newErrors.endDate = "End date is required";
        }
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
          newErrors.endDate = "End date must be after start date";
        }
        if (!formData.stipendAmount || formData.stipendAmount < 0) {
          newErrors.stipendAmount = "Valid stipend amount is required";
        }
        break;

      case 3:
        if (!formData.modeOfInternship) {
          newErrors.modeOfInternship = "Mode of internship is required";
        }
        if (!formData.internshipLocation.trim()) {
          newErrors.internshipLocation = "Internship location is required";
        }
        if (!formData.companyAddress.trim()) {
          newErrors.companyAddress = "Company address is required";
        }
        if (!formData.hrDetails.name.trim()) {
          newErrors["hrDetails.name"] = "HR name is required";
        }
        if (!validatePhone(formData.hrDetails.contactNo)) {
          newErrors["hrDetails.contactNo"] = "Valid phone number is required";
        }
        if (!validateEmail(formData.hrDetails.email)) {
          newErrors["hrDetails.email"] = "Valid email is required";
        }
        break;

      case 4:
        if (!formData.completionCertificate) {
          newErrors.completionCertificate = "Completion certificate is required";
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
                      ? "bg-blue-600 border-blue-600 text-white"
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

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
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
              Type of Internship
            </label>
            <Select
              value={formData.typeOfInternship}
              onValueChange={(value) => handleChange("typeOfInternship", value)}
            >
              <SelectTrigger className={errors.typeOfInternship ? "border-red-500" : ""}>
                <SelectValue placeholder="Select internship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Development Project">Development Project</SelectItem>
                <SelectItem value="Research Project">Research Project</SelectItem>
                <SelectItem value="On Technology Training">On Technology Training</SelectItem>
              </SelectContent>
            </Select>
            {errors.typeOfInternship && (
              <p className="text-red-500 text-sm mt-1">{errors.typeOfInternship}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technology
            </label>
            <Input
              value={formData.technology}
              onChange={(e) => handleChange("technology", e.target.value)}
              className={errors.technology ? "border-red-500" : ""}
              placeholder="Enter primary technology used"
            />
            {errors.technology && (
              <p className="text-red-500 text-sm mt-1">{errors.technology}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technology Details
            </label>
            <Textarea
              value={formData.technologyDetails}
              onChange={(e) => handleChange("technologyDetails", e.target.value)}
              className={errors.technologyDetails ? "border-red-500" : ""}
              placeholder="Describe the technology stack and tools used"
            />
            {errors.technologyDetails && (
              <p className="text-red-500 text-sm mt-1">{errors.technologyDetails}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInternshipDetails = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stipend Amount
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
              <p className="text-red-500 text-sm mt-1">{errors.stipendAmount}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationHR = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Internship
            </label>
            <Select
              value={formData.modeOfInternship}
              onValueChange={(value) => handleChange("modeOfInternship", value)}
            >
              <SelectTrigger className={errors.modeOfInternship ? "border-red-500" : ""}>
                <SelectValue placeholder="Select mode of internship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {errors.modeOfInternship && (
              <p className="text-red-500 text-sm mt-1">{errors.modeOfInternship}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Internship Location 
            </label>
            <Input
              value={formData.internshipLocation}
              onChange={(e) => handleChange("internshipLocation", e.target.value)}
              className={errors.internshipLocation ? "border-red-500" : ""}
              placeholder="Enter internship location"
            />
            {errors.internshipLocation && (
              <p className="text-red-500 text-sm mt-1">{errors.internshipLocation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Address 
            </label>
            <Textarea
              value={formData.companyAddress}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              className={errors.companyAddress ? "border-red-500" : ""}
              placeholder="Enter complete company address"
            />
            {errors.companyAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              HR Details
            </label>
            <Input
              placeholder="HR Name *"
              value={formData.hrDetails.name}
              onChange={(e) => handleHRChange("name", e.target.value)}
              className={errors["hrDetails.name"] ? "border-red-500" : ""}
            />
            {errors["hrDetails.name"] && (
              <p className="text-red-500 text-sm mt-1">{errors["hrDetails.name"]}</p>
            )}

            <Input
              placeholder="HR Contact Number *"
              value={formData.hrDetails.contactNo}
              onChange={(e) => handleHRChange("contactNo", e.target.value)}
              className={errors["hrDetails.contactNo"] ? "border-red-500" : ""}
            />
            {errors["hrDetails.contactNo"] && (
              <p className="text-red-500 text-sm mt-1">{errors["hrDetails.contactNo"]}</p>
            )}

            <Input
              placeholder="HR Email *"
              type="email"
              value={formData.hrDetails.email}
              onChange={(e) => handleHRChange("email", e.target.value)}
              className={errors["hrDetails.email"] ? "border-red-500" : ""}
            />
            {errors["hrDetails.email"] && (
              <p className="text-red-500 text-sm mt-1">{errors["hrDetails.email"]}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stipend Proof
            </label>
            <Input
              type="file"
              onChange={(e) => handleFileChange("stipendProof")}
              className={errors.stipendProof ? "border-red-500" : ""}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-gray-500 text-xs mt-1">
              Upload proof of stipend (optional)
            </p>
            {errors.stipendProof && (
              <p className="text-red-500 text-sm mt-1">{errors.stipendProof}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Completion Certificate
            </label>
            <Input
              type="file"
              onChange={(e) => handleFileChange("completionCertificate")}
              className={errors.completionCertificate ? "border-red-500" : ""}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-gray-500 text-xs mt-1">
              Upload internship completion certificate
            </p>
            {errors.completionCertificate && (
              <p className="text-red-500 text-sm mt-1">{errors.completionCertificate}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-50">
      <CardHeader className="border-b bg-white">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Summer Internship Completion Form
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {renderStepIndicator()}
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderCompanyDetails()}
          {currentStep === 2 && renderInternshipDetails()}
          {currentStep === 3 && renderLocationHR()}
          {currentStep === 4 && renderDocuments()}
        </form>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-white mt-6 p-6">
        <Button
          type="button"
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
            type="button"
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Submit Form
            <Save className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SummerInternshipCompletionForm;