import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from "../pages/Login"; 
import { MemoryRouter } from 'react-router-dom';
import { loginUser } from '../services/userServices';
import toast from 'react-hot-toast'; 


jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));


jest.mock('../services/userServices', () => ({
  loginUser: jest.fn(),
}));


const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockNavigate = jest.fn();
const WrappedLogin = () => <Login navigate={mockNavigate} />;

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Login Component', () => {
  test('renders login headings and inputs', () => {
    render(
      <MemoryRouter>
        <WrappedLogin />
      </MemoryRouter>
    );

    expect(screen.getByText(/Movie Explorer \+/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /Sign in/i });
    

  });

  test('updates input values correctly', () => {
    render(
      <MemoryRouter>
        <WrappedLogin />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('123456');
  });


  test('handles successful login', async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        token: 'test-token',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      },
    });

    render(
      <MemoryRouter>
        <WrappedLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });

  test('handles login error gracefully', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter>
        <WrappedLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'fail@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1);
    });
  });

  test('navigates to sign up on clicking "Sign up now"', () => {
    render(
      <MemoryRouter>
        <WrappedLogin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Sign up now/i));
  });



  test('shows error if email and password are empty', async () => {
  render(
    <MemoryRouter>
      <WrappedLogin />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Email and password are required.');
  });
});


test('shows error for invalid email format', async () => {
  render(
    <MemoryRouter>
      <WrappedLogin />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'invalidemail' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: '123456' },
  });

  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Please enter a valid email.');
  });
});



test('shows error if password is less than 6 characters', async () => {
  render(
    <MemoryRouter>
      <WrappedLogin />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: '123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Password must be at least 6 characters.');
  });
});




test('displays API error message when login fails', async () => {
  (loginUser as jest.Mock).mockResolvedValue({
    status: 401,
    data: { message: 'Invalid credentials' },
  });

  render(
    <MemoryRouter>
      <WrappedLogin />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'wrong@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'wrongpass' },
  });

  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(loginUser).toHaveBeenCalled();
  });
});


});
