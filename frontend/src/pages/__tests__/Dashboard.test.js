import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock data
const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'admin'
};

const mockContracts = [
  {
    id: 1,
    title: 'Test Contract 1',
    type: 'service',
    value: 1000,
    currency: 'USD',
    status: 'active'
  },
  {
    id: 2,
    title: 'Test Contract 2',
    type: 'employment',
    value: 2000,
    currency: 'USD',
    status: 'pending'
  }
];

const mockEvents = [
  {
    id: 1,
    title: 'Test Event 1',
    startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    type: 'meeting',
    status: 'scheduled'
  },
  {
    id: 2,
    title: 'Test Event 2',
    startDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    type: 'deadline',
    status: 'pending'
  }
];

// Wrapper component to provide context
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'mock-token');

    // Mock successful API responses
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5000/api/health') {
        return Promise.resolve({ data: { status: 'ok' } });
      }
      if (url === 'http://localhost:5000/api/contracts') {
        return Promise.resolve({ data: mockContracts });
      }
      if (url === 'http://localhost:5000/api/calendar-events') {
        return Promise.resolve({ data: mockEvents });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('renders loading state initially', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders welcome message with user name', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome, John!/i)).toBeInTheDocument();
    });
  });

  test('displays contracts section with data', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Recent Contracts')).toBeInTheDocument();
      expect(screen.getByText('Test Contract 1')).toBeInTheDocument();
      expect(screen.getByText('Test Contract 2')).toBeInTheDocument();
    });
  });

  test('displays events section with data', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });
  });

  test('displays quick actions section', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('New Contract')).toBeInTheDocument();
      expect(screen.getByText('New Event')).toBeInTheDocument();
    });
  });

  test('navigates to contracts page when View All is clicked', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      const viewAllButton = screen.getByText('View All');
      fireEvent.click(viewAllButton);
      expect(mockNavigate).toHaveBeenCalledWith('/contracts');
    });
  });

  test('navigates to new contract page when New Contract is clicked', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      const newContractButton = screen.getByText('New Contract');
      fireEvent.click(newContractButton);
      expect(mockNavigate).toHaveBeenCalledWith('/contracts/add');
    });
  });

  test('navigates to calendar page when New Event is clicked', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      const newEventButton = screen.getByText('New Event');
      fireEvent.click(newEventButton);
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });
  });

  test('displays error message when API fails', async () => {
    // Mock API failure
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Error Loading Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });
  });

  test('retries data fetch when retry button is clicked', async () => {
    // Mock initial API failure
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<Dashboard />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Error Loading Dashboard/i)).toBeInTheDocument();
    });

    // Mock successful retry
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5000/api/health') {
        return Promise.resolve({ data: { status: 'ok' } });
      }
      if (url === 'http://localhost:5000/api/contracts') {
        return Promise.resolve({ data: mockContracts });
      }
      if (url === 'http://localhost:5000/api/calendar-events') {
        return Promise.resolve({ data: mockEvents });
      }
      return Promise.reject(new Error('Not found'));
    });

    // Click retry button
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Contract 1')).toBeInTheDocument();
    });
  });

  test('displays correct contract status colors', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      const activeChip = screen.getByText('active');
      const pendingChip = screen.getByText('pending');
      expect(activeChip).toHaveClass('MuiChip-colorPrimary');
      expect(pendingChip).toHaveClass('MuiChip-colorDefault');
    });
  });

  test('displays correct event status colors', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      const scheduledChip = screen.getByText('scheduled');
      const pendingChip = screen.getByText('pending');
      expect(scheduledChip).toHaveClass('MuiChip-colorPrimary');
      expect(pendingChip).toHaveClass('MuiChip-colorPrimary');
    });
  });

  test('formats currency values correctly', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
      expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    });
  });

  test('formats dates correctly', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      const tomorrow = new Date(Date.now() + 86400000).toLocaleString();
      const dayAfterTomorrow = new Date(Date.now() + 172800000).toLocaleString();
      expect(screen.getByText(tomorrow)).toBeInTheDocument();
      expect(screen.getByText(dayAfterTomorrow)).toBeInTheDocument();
    });
  });
}); 