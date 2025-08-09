import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ContractHistory from './ContractHistory';

const statusColors = {
  in_progress: 'primary',
  provisionally_received: 'warning',
  definitively_received: 'info',
  completed: 'success',
  cancelled: 'error'
};

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [contractHistory, setContractHistory] = useState([]);

  useEffect(() => {
    fetchContractDetails();
  }, [id]);

  const fetchContractDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/contracts/${id}`);
      setContract(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching contract details');
      setLoading(false);
    }
  };

  const fetchContractHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/contracts/${id}/history`);
      setContractHistory(response.data);
      setHistoryOpen(true);
    } catch (error) {
      console.error('Error fetching contract history:', error);
    }
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(`http://localhost:5000/api/contracts/${id}/status`, {
        status: newStatus,
        comment: statusComment
      });
      setStatusDialogOpen(false);
      fetchContractDetails();
    } catch (error) {
      console.error('Error updating contract status:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!contract) {
    return (
      <Container>
        <Typography>Contract not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Contract Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="info"
            onClick={fetchContractHistory}
            sx={{ mr: 2 }}
          >
            View History
          </Button>
          <Button variant="outlined" onClick={() => navigate('/contracts')}>
            Back to Contracts
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {contract.projectTitle}
              </Typography>
              <Chip
                label={contract.status.replace('_', ' ')}
                color={statusColors[contract.status]}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Contract Number
            </Typography>
            <Typography variant="body1">
              {contract.contractNumber}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Contract Amount
            </Typography>
            <Typography variant="body1">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'MAD'
              }).format(contract.contractAmount)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Partner Entity
            </Typography>
            <Typography variant="body1">
              {contract.partnerEntity}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Owner Entity
            </Typography>
            <Typography variant="body1">
              {contract.ownerEntity}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Execution Deadline
            </Typography>
            <Typography variant="body1">
              {new Date(contract.executionDeadline).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Service Order Date
            </Typography>
            <Typography variant="body1">
              {new Date(contract.serviceOrderDate).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Description
            </Typography>
            <Typography variant="body1">
              {contract.description}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Created By
            </Typography>
            <Typography variant="body1">
              {contract.contractCreator ? `${contract.contractCreator.firstName} ${contract.contractCreator.lastName}` : 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Last Updated By
            </Typography>
            <Typography variant="body1">
              {contract.contractUpdater ? `${contract.contractUpdater.firstName} ${contract.contractUpdater.lastName}` : 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setStatusDialogOpen(true)}
          >
            Update Status
          </Button>
        </Box>
      </Paper>

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Contract Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="provisionally_received">Provisionally Received</MenuItem>
            <MenuItem value="definitively_received">Definitively Received</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Comment"
            multiline
            rows={4}
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ContractHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={contractHistory}
      />
    </Container>
  );
};

export default ContractDetails; 