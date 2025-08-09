import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Departments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentHistory, setDepartmentHistory] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/departments');
      setDepartments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching departments');
      setLoading(false);
    }
  };

  const handleOpen = (department = null) => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
        managerId: department.managerId || '',
      });
      setSelectedDepartment(department);
    } else {
      setFormData({
        name: '',
        description: '',
        managerId: '',
      });
      setSelectedDepartment(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDepartment(null);
    setFormData({
      name: '',
      description: '',
      managerId: '',
    });
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
      if (selectedDepartment) {
        await axios.put(
          `http://localhost:5000/api/departments/${selectedDepartment.id}`,
          formData
        );
      } else {
        await axios.post('http://localhost:5000/api/departments', formData);
      }
      handleClose();
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting department');
      }
    }
  };

  const handleViewHistory = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/departments/${id}/history`);
      setDepartmentHistory(response.data);
      setHistoryOpen(true);
    } catch (err) {
      setError('Error fetching department history');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Departments
          </Typography>
          {(user.role === 'admin' || user.role === 'super_user') && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Department
            </Button>
          )}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>
                    {department.manager
                      ? `${department.manager.firstName} ${department.manager.lastName}`
                      : 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={department.isActive ? 'Active' : 'Inactive'}
                      color={department.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View History">
                      <IconButton
                        size="small"
                        onClick={() => handleViewHistory(department.id)}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    {(user.role === 'admin' || user.role === 'super_user') && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(department)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(department.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Department Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDepartment ? 'Edit Department' : 'Add New Department'}
        </DialogTitle>
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
                {departments.map((dept) => (
                  dept.manager && (
                    <MenuItem key={dept.manager.id} value={dept.manager.id}>
                      {dept.manager.firstName} {dept.manager.lastName}
                    </MenuItem>
                  )
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedDepartment ? 'Update' : 'Add'}
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

export default Departments; 