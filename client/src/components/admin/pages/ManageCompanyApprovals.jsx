import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Search, ChevronDown, ChevronUp, X, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Textarea } from "../../ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";

const ManageCompanyApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [companySearch, setCompanySearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  
  // State for rejection modal
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentApprovalId, setCurrentApprovalId] = useState(null);
  
  // State for viewing detailed approval info
  const [selectedApproval, setSelectedApproval] = useState(null);
  
  // State for error handling
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        sortBy: sortField,
        order: sortOrder,
      });

      if (companySearch) {
        params.append('companyName', companySearch);
      }

      if (studentSearch) {
        params.append('studentName', studentSearch);
      }

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await axios.get(`/api/company-approvals?${params.toString()}`);
      setApprovals(response.data.data);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setError('Failed to load approvals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [page, sortField, sortOrder, companySearch, studentSearch, statusFilter]);

  // Clear notifications after some time
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const openRejectionModal = (id) => {
    setCurrentApprovalId(id);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const closeRejectionModal = () => {
    setShowRejectionModal(false);
    setCurrentApprovalId(null);
  };

  const submitRejection = async () => {
    if (rejectionReason.trim()) {
      await handleUpdateStatus(currentApprovalId, 'Rejected', rejectionReason);
      closeRejectionModal();
    }
  };
  
  const handleViewDetails = (approval) => {
    setSelectedApproval(approval);
  };
  
  const handleCloseDetailsModal = () => {
    setSelectedApproval(null);
  };

  const handleUpdateStatus = async (id, newStatus, rejectionReason = null) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const updateData = {
        approvalStatus: newStatus
      };
      
      if (rejectionReason && newStatus === 'Rejected') {
        updateData.rejectionReason = rejectionReason;
      }
      
      const response = await axios.put(`/api/company-approvals/${id}`, updateData);
      
      // Optimistically update the UI
      setApprovals(prevApprovals => 
        prevApprovals.map(approval => 
          approval._id === id ? { ...approval, approvalStatus: newStatus } : approval
        )
      );
      
      // Show success message
      setSuccess(`Successfully ${newStatus.toLowerCase()} the company approval request.`);
      
      // If we're in the details modal, close it
      if (selectedApproval && selectedApproval._id === id) {
        setSelectedApproval({...selectedApproval, approvalStatus: newStatus});
      }
      
      // Refresh data
      await fetchApprovals();
      
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  // Rejection Modal Component
  const RejectionModal = () => {
    if (!showRejectionModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full transform transition-all animate-scaleIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Rejection Reason</h3>
            <button onClick={closeRejectionModal} className="text-gray-400 hover:text-gray-500 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Please provide a reason for rejecting this company approval request.</p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-24 transition-all focus:border-blue-500 focus:ring focus:ring-blue-200"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={closeRejectionModal}
              className="transition-all hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={submitRejection}
              disabled={!rejectionReason.trim() || actionLoading}
              className="transition-all"
            >
              {actionLoading ? 'Processing...' : 'Reject Request'}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Details Modal Component
  const DetailsModal = () => {
    if (!selectedApproval) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
        <div className="bg-white rounded-lg w-full max-w-2xl mx-4 animate-scaleIn">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{selectedApproval.companyName}</h2>
            <p className="text-gray-500">Company Approval Request by {selectedApproval.studentName || selectedApproval.student?.name || 'N/A'}</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{selectedApproval.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student</p>
                    <p className="font-medium text-gray-900">{selectedApproval.studentName || selectedApproval.student?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Submitted</p>
                    <p className="font-medium text-gray-900">{new Date(selectedApproval.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedApproval.approvalStatus)}`}>
                      {selectedApproval.approvalStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="text-gray-900">{selectedApproval.industry || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{selectedApproval.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Size</p>
                    <p className="text-gray-900">{selectedApproval.companySize || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            {selectedApproval.description && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Description</h4>
                <p className="text-gray-900">{selectedApproval.description}</p>
              </div>
            )}
            {selectedApproval.rejectionReason && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Rejection Reason</h4>
                <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-800">
                  {selectedApproval.rejectionReason}
                </div>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
            {selectedApproval.approvalStatus === 'Pending' && (
              <>
                <Button
                  onClick={() => handleUpdateStatus(selectedApproval._id, 'Rejected')}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  disabled={actionLoading}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedApproval._id, 'Approved')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                  disabled={actionLoading}
                >
                  Approve
                </Button>
              </>
            )}
            <Button
              onClick={handleCloseDetailsModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-white rounded-t-lg border-b border-gray-200">
        <CardTitle className="text-2xl font-semibold text-gray-900">Company Approvals Management</CardTitle>
        <p className="text-gray-500 mt-1">Manage and review company approval requests</p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Notification Area */}
        {error && (
          <Alert variant="destructive" className="mb-4 animate-slideDown">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <button 
              onClick={() => setError(null)} 
              className="absolute top-2 right-2 text-red-800 hover:text-red-900"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 animate-slideDown">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
            <button 
              onClick={() => setSuccess(null)} 
              className="absolute top-2 right-2 text-green-800 hover:text-green-900"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        )}

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by company name..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Search by student name..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
            {['', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status || 'All Status'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('companyName')}
                >
                  <div className="flex items-center">
                    Company Name
                    <SortIcon field="companyName" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('studentName')}
                >
                  <div className="flex items-center">
                    Student
                    <SortIcon field="studentName" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Date
                    <SortIcon field="createdAt" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                      <span className="text-lg font-medium text-gray-700">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : approvals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
                    <p className="text-lg font-medium text-gray-700">No approvals found</p>
                    <p className="text-gray-500 mt-1">Try changing your search or filters</p>
                  </TableCell>
                </TableRow>
              ) : (
                approvals.map((approval) => (
                  <TableRow key={approval._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                          {approval.companyName.charAt(0)}
                        </div>
                        <span>{approval.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {approval.studentName || approval.student?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(approval.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusColor(approval.approvalStatus)}`}>
                        {approval.approvalStatus === 'Approved' ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : approval.approvalStatus === 'Rejected' ? (
                          <AlertCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 mr-1" />
                        )}
                        {approval.approvalStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {approval.approvalStatus === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(approval._id, 'Approved')}
                              disabled={actionLoading}
                              className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                            >
                              {actionLoading && currentApprovalId === approval._id ? 
                                <span className="flex items-center">
                                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span> 
                                  Processing
                                </span> : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectionModal(approval._id)}
                              disabled={actionLoading}
                              className="transition-colors hover:bg-red-700"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {(approval.approvalStatus === 'Approved' || approval.approvalStatus === 'Rejected') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(approval._id, 'Pending')}
                            disabled={actionLoading}
                            className="hover:bg-gray-100 transition-colors"
                          >
                            Reset
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewDetails(approval)}
                          className="hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} entries
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="hover:bg-gray-100 transition-colors"
              >
                Previous
              </Button>
              <span className="py-2 px-4 bg-gray-100 rounded-md text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="hover:bg-gray-100 transition-colors"
              >
                Next
              </Button>
            </div>
          )}
        </div>
        
        {/* Render the modals */}
        <RejectionModal />
        <DetailsModal />
        
        {/* Add CSS for animations */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          @keyframes slideDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
          
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default ManageCompanyApprovals;