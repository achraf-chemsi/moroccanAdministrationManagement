import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  in_progress: 'primary',
  provisionally_received: 'warning',
  definitively_received: 'info',
  completed: 'success',
  cancelled: 'error'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Dashboard mounted, user:', user);
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      console.log('Fetching dashboard data...');
      setLoading(true);
      setError(null);

      // Test API connection first
      try {
        const healthCheck = await axios.get('http://localhost:5000/api/health');
        console.log('Health check response:', healthCheck.data);
      } catch (error) {
        console.error('Health check failed:', error);
        throw new Error('Backend server is not responding. Please check if the server is running.');
      }

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      // Fetch contracts and events
      const [contractsRes, eventsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/contracts', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/calendar-events', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('Contracts response:', contractsRes.data);
      console.log('Events response:', eventsRes.data);

      if (!contractsRes.data || !Array.isArray(contractsRes.data)) {
        console.error('Invalid contracts data:', contractsRes.data);
        throw new Error('Invalid contracts data received from server');
      }

      if (!eventsRes.data || !Array.isArray(eventsRes.data)) {
        console.error('Invalid events data:', eventsRes.data);
        throw new Error('Invalid events data received from server');
      }

      setContracts(contractsRes.data);
      setEvents(eventsRes.data);
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError(error.message || 'Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  console.log('Dashboard render - loading:', loading, 'error:', error, 'contracts:', contracts.length, 'events:', events.length);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Dashboard
          </Typography>
          <Typography>{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchData}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.firstName || 'User'}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Contracts Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Contracts</Typography>
              <Button variant="outlined" onClick={() => navigate('/contracts')}>
                View All
              </Button>
            </Box>
            <List>
              {contracts && contracts.length > 0 ? (
                contracts.slice(0, 5).map((contract) => (
                  <React.Fragment key={contract.id}>
                    <ListItem>
                      <ListItemText
                        primary={contract.title || 'Untitled Contract'}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {contract.type || 'No Type'}
                            </Typography>
                            {' — '}
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: contract.currency || 'USD'
                            }).format(contract.value || 0)}
                          </>
                        }
                      />
                      <Chip
                        label={contract.status || 'Unknown'}
                        color={statusColors[contract.status] || 'default'}
                        size="small"
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No contracts found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Calendar Events Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Upcoming Events</Typography>
              <Button variant="outlined" onClick={() => navigate('/calendar')}>
                View Calendar
              </Button>
            </Box>
            <List>
              {events && events.length > 0 ? (
                events
                  .filter(event => new Date(event.startDate) > new Date())
                  .slice(0, 5)
                  .map((event) => (
                    <React.Fragment key={event.id}>
                      <ListItem>
                        <ListItemText
                          primary={event.title || 'Untitled Event'}
                          secondary={
                            <>
                              {new Date(event.startDate).toLocaleString()} — {event.type || 'No Type'}
                            </>
                          }
                        />
                        <Chip
                          label={event.status || 'Unknown'}
                          color={event.status === 'completed' ? 'success' : 'primary'}
                          size="small"
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
              ) : (
                <ListItem>
                  <ListItemText primary="No upcoming events found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/contracts/add')}
                >
                  New Contract
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/calendar')}
                >
                  New Event
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 