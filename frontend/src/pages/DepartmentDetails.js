import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [departmentHistory, setDepartmentHistory] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/departments/${id}`);
      setDepartment(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        managerId: response.data.managerId || '',
        isActive: response.data.isActive,
      });
      setLoading(false);
    } catch (err) {
      setError('Error fetching department details');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/departments/${id}`, formData);
      setEditOpen(false);
      fetchDepartment();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating department');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`);
        navigate('/departments');
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting department');
      }
    }
  };

  const handleViewHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/departments/${id}/history`);
      setDepartmentHistory(response.data);
      setHistoryOpen(true);
    } catch (err) {
      setError('Error fetching department history');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!department) return <Alert severity="error">Department not found</Alert>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Department Details
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={handleViewHistory}
              sx={{ mr: 2 }}
            >
              View History
            </Button>
            {(user.role === 'admin' || user.role === 'super_user') && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleEdit}
                  sx={{ mr: 2 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {department.name}
              </Typography>
              <Chip
                label={department.isActive ? 'Active' : 'Inactive'}
                color={department.isActive ? 'success' : 'error'}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Description
              </Typography>
              <Typography variant="body1">
                {department.description}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Manager
              </Typography>
              <Typography variant="body1">
                {department.manager
                  ? `${department.manager.firstName} ${department.manager.lastName}`
                  : 'Not assigned'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Created By
              </Typography>
              <Typography variant="body1">
                {department.createdBy.firstName} {department.createdBy.lastName}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Department Members
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Position</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {department.Users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Edit Department Dialog */}
      <Dialog open={editOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Manager</InputLabel>
              <Select
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                label="Manager"
              >
                <MenuItem value="">None</MenuItem>
                {department.Users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Department History Dialog */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Department History</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Field</TableCell>
                  <TableCell>Old Value</TableCell>
                  <TableCell>New Value</TableCell>
                  <TableCell>Changed By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>
                      {new Date(history.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{history.fieldName}</TableCell>
                    <TableCell>{history.oldValue}</TableCell>
                    <TableCell>{history.newValue}</TableCell>
                    <TableCell>
                      {history.changedBy.firstName} {history.changedBy.lastName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DepartmentDetails; 