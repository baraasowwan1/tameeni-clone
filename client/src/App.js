import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    websiteUrl: '',
    title: '',
    content: ''
  });
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    images.forEach(image => formDataToSend.append('images', image));

    try {
      const response = await axios.post('http://localhost:5000/api/customers/submit', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', websiteUrl: '', title: '', content: '' });
      setImages([]);
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Submit Your Page Data
        </Typography>
        
        {status === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Data submitted successfully! Waiting for admin approval.
          </Alert>
        )}
        {status === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error submitting data. Please try again.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Website URL"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Page Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Page Content"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            margin="normal"
          />
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            style={{ margin: '16px 0' }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
