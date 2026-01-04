import React, { useState } from 'react';
import {
  Paper, TextField, Button, Typography, Box, Alert, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: 'A', password: '123456' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // استخدم متغير بيئة للـ API
  const API_URL = process.env.REACT_APP_API_URL || 'https://tameeni-clone.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ربط الـ Admin بالـ Backend المنشور
      const response = await axios.post(`${API_URL}/login`, credentials);

      // تسجيل الدخول وحفظ التوكن
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('بيانات الدخول غير صحيحة'); // رسالة بالعربي
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Admin Login
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            sx={{ mb: 3 }}
          />
          
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          
          <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
            Default: admin / admin123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
