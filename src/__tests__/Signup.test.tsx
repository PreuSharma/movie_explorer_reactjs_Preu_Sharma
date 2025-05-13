import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from '../pages/Signup';
import { signUpUser } from '../services/userServices';
import { withNavigation } from '../utils/withNavigation';
import { BrowserRouter } from 'react-router-dom';
import toast from 'react-hot-toast';


const mockNavigate = jest.fn();


jest.mock('../services/userServices');
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));


jest.mock('../utils/withNavigation', () => ({
  withNavigation: (Component: any) => (props: any) => <Component {...props} navigate={mockNavigate} />,
}));

const WrappedSignup = withNavigation(Signup);

describe('Signup Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <WrappedSignup />
      </BrowserRouter>
    );
  });

  test('renders all input fields', () => {
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
  });

  test('shows error for mismatched passwords', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mobile Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'Abcd@123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'Abcd@124' } });
    fireEvent.click(screen.getByText(/I agree to the Terms and Conditions/i));

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('submits form with correct data and navigates', async () => {
    (signUpUser as jest.Mock).mockResolvedValue({ token: 'fake-token' });

    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mobile Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'Abcd@123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'Abcd@123' } });
    fireEvent.click(screen.getByText(/I agree to the Terms and Conditions/i));

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(signUpUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Abcd@123',
        mobile_number: '1234567890',
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
    });
  });

  test('shows error toast on signup failure', async () => {
    (signUpUser as jest.Mock).mockRejectedValue({ message: 'Email already exists' });

    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mobile Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'Abcd@123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'Abcd@123' } });
    fireEvent.click(screen.getByText(/I agree to the Terms and Conditions/i));

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed. Please try again.');
    });
  });
  
});
