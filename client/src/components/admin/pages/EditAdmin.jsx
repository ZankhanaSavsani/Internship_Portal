import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Alert, AlertDescription } from "../../ui/alert";
import { Label } from "../../ui/label";
import { AlertCircle } from 'lucide-react';

const EditAdmin = () => {
  const [admin, setAdmin] = useState({
    username: '',
    adminName: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin details when component mounts
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await fetch(`/api/admin/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          setAdmin({
            username: data.data.username,
            adminName: data.data.adminName,
            email: data.data.email
          });
        } else {
          setServerError(data.message || 'Failed to fetch admin details');
        }
      } catch (error) {
        setServerError('Network error. Please try again.');
      }
    };

    fetchAdminDetails();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!admin.username) {
      newErrors.username = 'Username is required';
    } else if (admin.username.length < 3 || admin.username.length > 20) {
      newErrors.username = 'Username must be between 3 and 20 characters';
    }

    // Admin name validation
    if (!admin.adminName) {
      newErrors.adminName = 'Admin name is required';
    } else if (admin.adminName.length < 3) {
      newErrors.adminName = 'Admin name must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!admin.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(admin.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: admin.username,
          adminName: admin.adminName,
          email: admin.email
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to admin list or show success message
        navigate('/admin-list');
      } else {
        setServerError(data.message || 'Failed to update admin');
      }
    } catch (error) {
      setServerError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Admin</CardTitle>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={admin.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  name="adminName"
                  value={admin.adminName}
                  onChange={handleInputChange}
                  className={errors.adminName ? 'border-red-500' : ''}
                />
                {errors.adminName && (
                  <p className="text-red-500 text-sm mt-1">{errors.adminName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={admin.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Admin'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAdmin;