import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Typography,
  CircularProgress, Alert, Box
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, customer: null, action: '' });
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/admin/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    try {
      await axios.put(`/api/admin/customers/${dialog.customer._id}/${action}`, {
        adminNotes
      });
      setDialog({ open: false, customer: null, action: '' });
      setAdminNotes('');
      fetchCustomers();
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const getStatusChip = (status) => {
    const colors = { approved: 'success', rejected: 'error', pending: 'warning' };
    return <Chip label={status.toUpperCase()} color={colors[status]} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Customer Submissions ({customers.length})</Typography>
        <Button variant="outlined" onClick={logout}>Logout</Button>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id} hover>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  {new Date(customer.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusChip(customer.pageData.status)}</TableCell>
                <TableCell>
                  {customer.pageData.status === 'pending' ? (
                    <>
                      <Button
                        size="small"
                        onClick={() => setDialog({
                          open: true,
                          customer,
                          action: 'approve'
                        })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setDialog({
                          open: true,
                          customer,
                          action: 'reject'
                        })}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Chip label="Done" color="default" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Dialog */}
      <Dialog open={dialog.open} maxWidth="md" fullWidth>
        <DialogTitle>Review: {dialog.customer?.name}</DialogTitle>
        <DialogContent sx={{ maxHeight: 500, overflow: 'auto' }}>
          <Typography><strong>Email:</strong> {dialog.customer?.email}</Typography>
          <Typography><strong>Title:</strong> {dialog.customer?.pageData.title}</Typography>
          <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, minHeight: 200 }}>
            <Typography variant="h6">{dialog.customer?.pageData.title}</Typography>
            <Typography>{dialog.customer?.pageData.content}</Typography>
            {dialog.customer?.pageData.images?.map((img, i) => (
              <img key={i} src={`http://localhost:5000${img}`} 
                   alt="preview" 
                   style={{ maxWidth: 200, maxHeight: 150, margin: '10px 10px 0 0' }} />
            ))}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Admin Notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, customer: null, action: '' })}>
            Cancel
          </Button>
          <Button variant="contained" color={dialog.action} onClick={() => handleAction(dialog.action)}>
            {dialog.action === 'approve' ? '✅ Approve' : '❌ Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Dashboard;
