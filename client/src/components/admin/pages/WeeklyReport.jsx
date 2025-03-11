import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    CheckCircle,
    AlertCircle,
    Lock,
  } from "lucide-react";

const WeeklyReport = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', order: 'desc' });
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchReports = useCallback(async (page = 1, sortBy = 'createdAt', order = 'desc', status = 'All') => {
    try {
      setLoading(true);
      const params = { page, limit: 10, sortBy, order };
      if (status !== 'All') params.status = status;
      const response = await axios.get('/api/weekly-reports', { params });
      setReports(response.data.data);
      setPagination({ page: response.data.page, pages: response.data.pages, total: response.data.total });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(pagination.page, sortConfig.sortBy, sortConfig.order, filterStatus);
  }, [fetchReports, pagination.page, sortConfig.sortBy, sortConfig.order, filterStatus]);

  const handleSort = (field) => {
    const isAsc = sortConfig.sortBy === field && sortConfig.order === 'desc';
    setSortConfig({ sortBy: field, order: isAsc ? 'asc' : 'desc' });
    fetchReports(pagination.page, field, isAsc ? 'asc' : 'desc', filterStatus);
  };

  const handlePageChange = (newPage) => {
    fetchReports(newPage, sortConfig.sortBy, sortConfig.order, filterStatus);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchReports(1, sortConfig.sortBy, sortConfig.order, status);
  };

  const handleViewDetails = (report) => setSelectedReport(report);
  const handleCloseModal = () => setSelectedReport(null);

  const handleApproveReport = async (reportId) => {
    try {
      await axios.put(`/api/weekly-reports/${reportId}`, { status: 'Approved', comments: 'Report approved by admin' });
      fetchReports(pagination.page, sortConfig.sortBy, sortConfig.order, filterStatus);
      handleCloseModal();
    } catch (error) {
      console.error('Error approving report:', error);
    }
  };

  const handleRejectReport = async (reportId, reason = '') => {
    try {
      await axios.put(`/api/weekly-reports/${reportId}`, { status: 'Rejected', comments: reason || 'Report rejected by admin' });
      fetchReports(pagination.page, sortConfig.sortBy, sortConfig.order, filterStatus);
      handleCloseModal();
    } catch (error) {
      console.error('Error rejecting report:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Weekly Student Reports</h1>
            <p className="text-gray-500 mt-1">Manage and review student weekly progress</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filterStatus === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Reports Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-sm text-gray-500 uppercase">
                      {['Student Name', 'Project Title', 'Report Week', 'Status'].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 font-medium cursor-pointer"
                          onClick={() => handleSort(header.toLowerCase().replace(/\s/g, ''))}
                        >
                          <div className="flex items-center">
                            <span>{header}</span>
                            {sortConfig.sortBy === header.toLowerCase().replace(/\s/g, '') && (
                              <span className="ml-1">{sortConfig.order === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          <p className="text-lg font-medium">No reports found</p>
                          <p>Try changing your filters or check back later</p>
                        </td>
                      </tr>
                    ) : (
                      reports.map((report) => (
                        <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                {report.studentName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="font-medium text-gray-900">{report.studentName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{report.projectTitle}</td>
                          <td className="px-6 py-4 text-gray-700">{report.reportWeek}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(report)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {reports.length > 0 && (
                <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing {(pagination.page - 1) * 10 + 1} to {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} results
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{selectedReport.projectTitle}</h2>
              <p className="text-gray-500">Weekly Report by {selectedReport.studentName}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Student</p>
                      <p className="font-medium text-gray-900">{selectedReport.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project</p>
                      <p className="font-medium text-gray-900">{selectedReport.projectTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Week</p>
                      <p className="font-medium text-gray-900">{selectedReport.reportWeek}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Objectives for Week</p>
                      <p className="text-gray-900">{selectedReport.objectivesForWeek}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tasks Completed</p>
                      <p className="text-gray-900">{selectedReport.tasksCompleted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Key Findings</p>
                      <p className="text-gray-900">{selectedReport.keyFindings}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Challenges & Next Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Challenges</p>
                    <p className="text-gray-900">{selectedReport.challengesEncountered}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Week Plan</p>
                    <p className="text-gray-900">{selectedReport.planForNextWeek}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => handleRejectReport(selectedReport._id)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
              >
                Reject
              </button>
              <button
                onClick={() => handleApproveReport(selectedReport._id)}
                className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200"
              >
                Approve
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;