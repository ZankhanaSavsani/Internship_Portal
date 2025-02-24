import React, { useState } from 'react';
import { UserX, ArrowLeft, AlertTriangle } from 'lucide-react';

const DeleteStudentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Example student data - replace with your actual data or API call
  const students = [
    { id: '1', firstName: 'John', lastName: 'Doe', studentId: 'STU001', department: 'Computer Engineering', semester: '6' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', studentId: 'STU002', department: 'Electrical Engineering', semester: '4' },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    console.log('Deleting student:', selectedStudent);
    // Add your delete API call here
    setShowConfirmDialog(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Delete Student</h1>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-6 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Students List */}
          <div className="p-6">
            {filteredStudents.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No students found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map(student => (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <p>Student ID: {student.studentId}</p>
                        <p>Department: {student.department}</p>
                        <p>Semester: {student.semester}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(student)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedStudent?.firstName} {selectedStudent?.lastName}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteStudentPage;