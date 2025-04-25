import React, { Component } from 'react';
import bgImg from '../assets/bg.jpg'; 

interface SignupState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile_number: string;
  role: string;
  isAgreed: boolean;
  error: string;
}

class Signup extends Component<{}, SignupState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile_number: '',
      role: 'user',
      isAgreed: false,
      error: '',
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<SignupState, keyof SignupState>);
  };

  handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isAgreed: e.target.checked });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      fullName,
      email,
      password,
      confirmPassword,
      mobile_number,
      role,
      isAgreed,
    } = this.state;
  
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  
    if (!nameRegex.test(fullName)) {
      this.setState({ error: 'Full Name must contain only letters and be at least 2 characters.' });
      return;
    }
  
    if (!emailRegex.test(email)) {
      this.setState({ error: 'Invalid email format.' });
      return;
    }
  
    if (!mobileRegex.test(mobile_number)) {
      this.setState({ error: 'Mobile number must be exactly 10 digits.' });
      return;
    }
  
    if (!passwordRegex.test(password)) {
      this.setState({
        error:
          'Password must be at least 6 characters and include uppercase, lowercase, number, and special character.',
      });
      return;
    }
  
    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match.' });
      return;
    }
  
    if (!isAgreed) {
      this.setState({ error: 'You must agree to the Terms and Conditions.' });
      return;
    }
  
    const user = {
      name: fullName,
      email,
      password,
      mobile_number,
      role,
    };
  
    try {
      const response = await fetch('/api/v1/auth/sign_up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);  
        window.location.href = '/dashboard';  
      } else {
        const data = await response.json();
        this.setState({ error: data.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      this.setState({ error: 'Something went wrong. Please try again.' });
    }
  };
  

  render() {
    const {
      fullName, email, password, confirmPassword,
      mobile_number, role, isAgreed, error
    } = this.state;

    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <form
          onSubmit={this.handleSubmit}
          className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg w-96"
        >
          <h2 className="text-white text-2xl font-semibold text-center mb-6">Create Account</h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={this.handleInputChange}
            placeholder="Full Name"
            required
            className="w-full p-2 mb-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
            placeholder="Email"
            required
            className="w-full p-2 mb-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          {/* Mobile Number */}
          <input
            type="text"
            name="mobile_number"
            value={mobile_number}
            onChange={this.handleInputChange}
            placeholder="Mobile Number"
            required
            className="w-full p-2 mb-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleInputChange}
            placeholder="Password"
            required
            className="w-full p-2 mb-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={this.handleInputChange}
            placeholder="Confirm Password"
            required
            className="w-full p-2 mb-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          {/* Role Dropdown */}
          <select
            name="role"
            value={role}
            onChange={this.handleInputChange}
            className="w-full p-2 mb-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Terms & Conditions */}
          <label className="text-gray-300 text-sm flex items-center mb-4">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={this.handleCheckboxChange}
              className="mr-2"
            />
            I agree to the Terms and Conditions
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition duration-200"
          >
            Create Account
          </button>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-4">
            <hr className="w-1/4 border-gray-500" />
            <span className="text-gray-400 mx-2">or</span>
            <hr className="w-1/4 border-gray-500" />
          </div>

          {/* Login Redirect */}
          <p className="text-center text-gray-400 mt-4 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-red-400 hover:underline">Sign in now</a>
          </p>
        </form>
      </div>
    );
  }
}

export default Signup;
