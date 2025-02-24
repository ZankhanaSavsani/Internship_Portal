import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
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

const ManageCompanyApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        sortBy: sortField,
        order: sortOrder,
      });

      if (searchTerm) {
        params.append('companyName', searchTerm);
      }

      if (statusFilter !== '') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`http://localhost:5000/api/company-approvals`);
      setApprovals(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [page, sortField, sortOrder, searchTerm, statusFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/company-approvals/${id}`, {
        status: newStatus
      });
      fetchApprovals();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Approvals Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <select
            className="border rounded-md px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('companyName')}
                >
                  <div className="flex items-center">
                    Company Name
                    <SortIcon field="companyName" />
                  </div>
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead 
                  className="cursor-pointer"
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
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : approvals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No approvals found
                  </TableCell>
                </TableRow>
              ) : (
                approvals.map((approval) => (
                  <TableRow key={approval._id}>
                    <TableCell>{approval.companyName}</TableCell>
                    <TableCell>
                      {approval.student?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(approval.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                        approval.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {approval.status ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 mr-1" />
                        )}
                        {approval.status ? 'Approved' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!approval.status && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(approval._id, true)}
                          >
                            Approve
                          </Button>
                        )}
                        {approval.status && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(approval._id, false)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="py-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageCompanyApprovals;