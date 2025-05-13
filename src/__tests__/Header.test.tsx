import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { searchMoviesByTitle } from '../services/MovieServices';
import { logoutUser } from '../services/userServices';
import * as toast from 'react-hot-toast';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ pathname: '/dashboard' })),
}));

jest.mock('../services/MovieServices', () => ({
  searchMoviesByTitle: jest.fn(),
}));

jest.mock('../services/userServices', () => ({
  logoutUser: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock localStorage
const localStorageMock: {
  store: { [key: string]: string };
  getItem: jest.Mock<string | null, [string]>;
  setItem: jest.Mock<void, [string, string]>;
  removeItem: jest.Mock<void, [string]>;
  clear: jest.Mock<void, []>;
} = {
  store: {} as { [key: string]: string },
  getItem: jest.fn((key: string) => localStorageMock.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Header Component', () => {
  // Mock props
  const setSearch = jest.fn();
  const defaultProps = {
    search: '',
    setSearch,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  // Helper to render with Router
  const renderWithRouter = (props = defaultProps) =>
    render(
      <BrowserRouter>
        <Header {...props} />
      </BrowserRouter>
    );

  test('renders without crashing', () => {
    renderWithRouter();
    expect(screen.getByText(/Movie Explorer/)).toBeInTheDocument();
  });

  test('renders logo with red plus sign', () => {
    renderWithRouter();
    const logo = screen.getByRole('heading', { name: /Movie Explorer \+/ });
    expect(logo).toBeInTheDocument();
    expect(logo.querySelector('span')).toHaveClass('text-red-600');
  });

  test('renders navigation links for desktop', () => {
    renderWithRouter();
    const links = ['Home', 'Movies', 'My List', 'Subscription'];
    links.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  test('renders login link when not logged in', () => {
    renderWithRouter();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Welcome')).not.toBeInTheDocument();
  });

  test('renders profile dropdown when logged in', async () => {
    localStorageMock.setItem(
      'userData',
      JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'user' })
    );
    localStorageMock.setItem('token', 'fake-token');
    renderWithRouter();

    expect(screen.getByAltText('profile')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();

    fireEvent.click(screen.getByAltText('profile'));
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role: user')).toBeInTheDocument();
  });

  test('toggles mobile menu', () => {
    renderWithRouter();
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(homeLinks[0]).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
  });
  test('toggles search bar', () => {
    renderWithRouter();
    const searchIcon = screen.getByLabelText('search');
    expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();

    fireEvent.click(searchIcon);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();

    fireEvent.click(searchIcon);
    expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
  });

  test('handles search input and debounced search', async () => {
    (searchMoviesByTitle as jest.Mock).mockResolvedValue({
      movies: [
        { id: 1, title: 'Test Movie', genre: 'Action', release_year: 2020, rating: 8, poster_url: 'test.jpg' },
      ],
      pagination: { current_page: 1, total_pages: 1, total_count: 1, per_page: 10 },
    });

    renderWithRouter();
    fireEvent.click(screen.getByLabelText('search'));
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'Test' } });
    expect(setSearch).toHaveBeenCalledWith('Test');

    await waitFor(() => {
      expect(searchMoviesByTitle).toHaveBeenCalledWith('Test', 1);
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    }, { timeout: 500 });
  });


  test('handles logout success', async () => {
    localStorageMock.setItem(
      'userData',
      JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'user' })
    );
    localStorageMock.setItem('token', 'fake-token');
    (logoutUser as jest.Mock).mockResolvedValue({ message: 'Logged out' });

    renderWithRouter();
    fireEvent.click(screen.getByAltText('profile'));
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
      expect(toast.default.success).toHaveBeenCalledWith('Logout Successful: Logged out');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  test('handles logout failure', async () => {
    localStorageMock.setItem(
      'userData',
      JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'user' })
    );
    localStorageMock.setItem('token', 'fake-token');
    (logoutUser as jest.Mock).mockRejectedValue(new Error('Logout failed'));

    renderWithRouter();
    fireEvent.click(screen.getByAltText('profile'));
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith('Logout failed');
    });
  });

  test('closes search on outside click', () => {
    renderWithRouter();
    fireEvent.click(screen.getByLabelText('search'));
    expect(screen.getByTestId('search-input')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
  });

  test('renders supervisor link when user is supervisor', () => {
    localStorageMock.setItem(
      'userData',
      JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'supervisor' })
    );
    localStorageMock.setItem('token', 'fake-token');
    renderWithRouter();

    expect(screen.getByText('Add Movie')).toBeInTheDocument();
  });

  test('highlights active navigation link', () => {
    const useLocationMock = require('react-router-dom').useLocation;
    useLocationMock.mockReturnValue({ pathname: '/dashboard/movies' });
    renderWithRouter();

    expect(screen.getByText('Movies')).toHaveClass('text-red-500');
    expect(screen.getByText('Home')).not.toHaveClass('text-red-500');
  });

  test('handles search input change', () => {
    renderWithRouter();
    fireEvent.click(screen.getByLabelText('search'));
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'Inception' } });
    expect(setSearch).toHaveBeenCalledWith('Inception');
  });

 test("toggles mobile menu visibility", () => {
    renderWithRouter();
    const menuButton = screen.getByLabelText("menu");

    fireEvent.click(menuButton);
    expect(screen.getByTestId("mobile-nav")).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.queryByTestId("mobile-nav")).not.toBeInTheDocument();
  });
  
    test("does not show profile dropdown when user is not logged in", () => {
    renderWithRouter();
    expect(screen.queryByAltText("profile")).not.toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
  
});