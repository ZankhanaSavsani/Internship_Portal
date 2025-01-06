import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/login', formData);
      
      const { message, role, token } = response.data; // Assuming the response contains the role and token
      setSuccessMessage(message || 'Login successful!');
      setError(null);

      // Save token to local storage for authentication purposes
      localStorage.setItem('authToken', token);

      // Redirect user based on their role
      if (role === 'student') {
        navigate('/student');
      } else if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'guide') {
        navigate('/guide');
      } else {
        throw new Error('Unknown role!'); // Handle any unexpected roles
      }

      // Reset form fields
      setFormData({
        username: '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background">
      <div className="shape"></div>
      <div className="shape right-shape"></div>
      <form onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <button 
          type="button" 
          onClick={() => navigate('/register')} 
          style={{
            marginTop: '15px',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '2px solid #ffffff',
            padding: '10px 0',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>
          Go to Registration
        </button>
      </form>

      <style>{`
        // Your CSS styles remain the same
      `}</style>
    </div>
  );
};

export default LoginPage;
