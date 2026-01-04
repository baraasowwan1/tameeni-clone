import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Dialog, TextField, Box
} from '@mui/material';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // رابط الـ API من متغير البيئة
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.get(`${API_URL}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleApprove = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${API_URL}/api/admin/customers/${selectedCustomer._id}/approve`,
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to approve customer:', error);
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${API_URL}/api/admin/customers/${selectedCustomer._id}/reject`,
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to reject customer:', error);
    }
  };

  const getStatusChip = (status) => {
    const color = status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning';
    return <Chip label={status.toUpperCase()} color={color} />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <h1>Admin Dashboard - Customer Submissions</h1>
        
        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.websiteUrl}</TableCell>
                  <TableCell>{customer.pageData.title}</TableCell>
                  <TableCell>{getStatusChip(customer.pageData.status)}</TableCell>
                  <TableCell>{new Date(customer.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {customer.pageData.status === 'pending' && (
                      <Button 
                        size="small" 
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setAdminNotes('');
                          setOpen(true);
                        }}
                      >
                        Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Review Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ p: 4 }}>
          <h2>Review Submission</h2>
          <p><strong>Name:</strong> {selectedCustomer?.name}</p>
          <p><strong>Email:</strong> {selectedCustomer?.email}</p>
          <p><strong>Title:</strong> {selectedCustomer?.pageData.title}</p>
          <div style={{ margin: '20px 0' }}>
            <h4>Content Preview:</h4>
            <div style={{ border: '1px solid #ddd', padding: '20px', minHeight: '200px' }}>
              <h3>{selectedCustomer?.pageData.title}</h3>
              <p>{selectedCustomer?.pageData.content}</p>
              {selectedCustomer?.pageData.images?.map((img, idx) => (
                <img key={idx} src={`${API_URL}${img}`} alt="preview" style={{ maxWidth: '200px', margin: '10px' }} />
              ))}
            </div>
          </div>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Admin Notes (optional)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="success" onClick={handleApprove}>
              Approve
            </Button>
            <Button variant="contained" color="error" onClick={handleReject}>
              Reject
            </Button>
            <Button onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
