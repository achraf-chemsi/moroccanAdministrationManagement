import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'antd/dist/reset.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Contracts from './pages/Contracts';
import AddContract from './pages/AddContract';
import ContractDetails from './pages/ContractDetails';
import Departments from './pages/Departments';
import DepartmentDetails from './pages/DepartmentDetails';
import PrivateRoute from './components/PrivateRoute';
import HRManagement from './pages/HRManagement';
import ContractList from './components/ContractList';
import ContractDetail from './components/ContractDetail';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="contracts" element={<PrivateRoute><Contracts /></PrivateRoute>} />
            <Route path="contracts/add" element={<PrivateRoute><AddContract /></PrivateRoute>} />
            <Route path="contracts/:id" element={<PrivateRoute><ContractDetails /></PrivateRoute>} />
            <Route path="departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
            <Route path="departments/:id" element={<PrivateRoute><DepartmentDetails /></PrivateRoute>} />
            <Route
              path="hr"
              element={
                <PrivateRoute roles={['admin', 'hr']}>
                  <HRManagement />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 