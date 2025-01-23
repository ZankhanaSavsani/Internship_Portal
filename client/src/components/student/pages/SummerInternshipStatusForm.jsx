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
  Minus,
  Briefcase,
  FileText,
  MapPin,
  Upload,
} from "lucide-react";

const SummerInternshipForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    stipendAmount: "",
    modeOfInternship: "",
    typeOfInternship: "",
    technologies: [""],
    technologiesDetails: "",
    companyCity: "",
    companyAddress: "",
    hrDetails: {
      name: "",
      contactNo: "",
      email: "",
    },
    offerLetter: null,
  });

  const [errors, setErrors] = useState({});

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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

  const handleTechnologyChange = (index, value) => {
    const newTechnology = [...formData.technologies];
    newTechnology[index] = value;
    handleChange("technologies", newTechnology);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
        }
        if (!formData.companyWebsite || !validateURL(formData.companyWebsite)) {
          newErrors.companyWebsite = "Valid company website URL is required";
        }
        break;

      case 2:
        if (!formData.stipendAmount || parseFloat(formData.stipendAmount) < 0) {
          newErrors.stipendAmount = "Valid stipend amount is required";
        }
        const validmodeOfInternships = [
          "Offline", "Online", "Hybrid",
        ];
        if (
          !formData.modeOfInternship ||
          !validmodeOfInternships.includes(formData.modeOfInternship)
        ) {
          newErrors.modeOfInternship = "Please select a valid internship mode";
        }
        const validtypeOfInternship = [
          "Development Project",
          "Inhouse/Research Project",
          "On technologies Training",
        ];
        if (
          !formData.typeOfInternship ||
          !validtypeOfInternship.includes(formData.typeOfInternship)
        ) {
          newErrors.typeOfInternship = "Please select a valid type Of Internship";
        }
        if (!formData.technologies[0]) {
          newErrors.technologies = "At least one technology is required";
        } else if (formData.technologies.some((tech) => !tech.trim())) {
          newErrors.technologies = "All technology fields must be filled";
        }
        if (!formData.technologiesDetails.trim()) {
          newErrors.technologiesDetails = "technologies Details is required";
        }
        break;

      case 3:
        if (!formData.companyCity.trim()) {
          newErrors.companyCity = "Company city is required";
        }
        if (!formData.companyAddress.trim()) {
          newErrors.companyAddress = "Company address is required";
        }
        if (!formData.hrDetails.name.trim()) {
          newErrors["hrDetails.name"] = "HR name is required";
        }
        if (!validatePhone(formData.hrDetails.contactNo)) {
          newErrors["hrDetails.contactNo"] = "Invalid contact number";
        }
        if (!validateEmail(formData.hrDetails.email)) {
          newErrors["hrDetails.email"] = "Invalid email address";
        }
        break;

      case 4:
        if (!formData.offerLetter) {
          newErrors.offerLetter = "Offer letter is required";
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      offerLetter: file,
    }));

    if (errors.offerLetter) {
      setErrors((prev) => ({
        ...prev,
        offerLetter: undefined,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(4)) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your backend
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "hrDetails") {
          Object.keys(formData.hrDetails).forEach((hrKey) => {
            submissionData.append(
              `hrDetails.${hrKey}`,
              formData.hrDetails[hrKey]
            );
          });
        } else {
          submissionData.append(key, formData[key]);
        }
      });
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

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );

  const renderInternshipDetails = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Mode *
            </label>
            <Select
              value={formData.modeOfInternship}
              onValueChange={(value) => handleChange("modeOfInternship", value)}
            >
              <SelectTrigger
                className={errors.modeOfInternship ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select learning mode" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="Offline" className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Offline</SelectItem>
                <SelectItem value="Online" className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Online</SelectItem>
                <SelectItem value="Hybrid" className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {errors.modeOfInternship && (
              <p className="text-red-500 text-sm mt-1">{errors.modeOfInternship}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Of Internship *
            </label>
            <Select
              value={formData.typeOfInternship}
              onValueChange={(value) => handleChange("typeOfInternship", value)}
            >
              <SelectTrigger
                className={errors.typeOfInternship ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select type Of Internship" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="Development Project" className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                  Development Project
                </SelectItem>
                <SelectItem value="Inhouse/Research Project" className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                  Inhouse/Research Project
                </SelectItem>
                <SelectItem value="On technologies Training" className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                  On technologies Training
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.typeOfInternship && (
              <p className="text-red-500 text-sm mt-1">{errors.typeOfInternship}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmed Technologies *
            </label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Technology"
                  value={tech}
                  onChange={(e) => handleTechnologyChange(index, e.target.value)}
                  className={errors.technologies ? "border-red-500" : ""}
                />
                {formData.technologies.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    // size="icon"
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
            <Button
              type="button"
              // variant="outline"
              onClick={() => 
                handleChange("technologies", [...formData.technologies, ""])
              }
              className="w-full"
            >
              Add Technology
            </Button>
            {errors.technologies && (
              <p className="text-red-500 text-sm mt-1">
                {errors.technologies}
              </p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Details
            </label>
            <Textarea
              value={formData.technologiesDetails}
              onChange={(e) =>
                handleChange("technologiesDetails", e.target.value)
              }
              placeholder="Provide additional details about the technologies"
              className={`min-h-[100px] ${errors.technologiesDetails ? 'border-red-500' : ''}`}
            />
            {errors.technologiesDetails && (
              <p className="text-red-500 text-sm mt-1">
                {errors.technologiesDetails}
              </p>
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
              Company City *
            </label>
            <Input
              value={formData.companyCity}
              onChange={(e) => handleChange("companyCity", e.target.value)}
              className={errors.companyCity ? "border-red-500" : ""}
              placeholder="Enter company city"
            />
            {errors.companyCity && (
              <p className="text-red-500 text-sm mt-1">{errors.companyCity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Address *
            </label>
            <Textarea
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
              <p className="text-red-500 text-sm mt-1">
                {errors["hrDetails.name"]}
              </p>
            )}

            <Input
              placeholder="HR Contact Number *"
              value={formData.hrDetails.contactNo}
              onChange={(e) => handleHRChange("contactNo", e.target.value)}
              className={errors["hrDetails.contactNo"] ? "border-red-500" : ""}
            />
            {errors["hrDetails.contactNo"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["hrDetails.contactNo"]}
              </p>
            )}

            <Input
              placeholder="HR Email *"
              type="email"
              value={formData.hrDetails.email}
              onChange={(e) => handleHRChange("email", e.target.value)}
              className={errors["hrDetails.email"] ? "border-red-500" : ""}
            />
            {errors["hrDetails.email"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["hrDetails.email"]}
              </p>
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
              Offer Letter *
            </label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className={errors.offerLetter ? "border-red-500" : ""}
            />
            {errors.offerLetter && (
              <p className="text-red-500 text-sm mt-1">{errors.offerLetter}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-50">
      <CardHeader className="border-b bg-white">
        <CardTitle className="text-2xl font-bold text-gray-800">
        Summer Internship Form
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
            Submit Application
            <Save className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SummerInternshipForm;
