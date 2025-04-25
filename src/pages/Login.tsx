import React, { Component } from 'react';
import bgImg from '../assets/bg.jpg';
import { withNavigation } from '../utils/withNavigation';

interface LoginState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginProps {
  navigate: (path: string) => void;
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: name === "rememberMe" ? e.target.checked : value } as unknown as Pick<LoginState, keyof LoginState>);
  };

  handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rememberMe: e.target.checked });
  };

  handleSignIn = async () => {
    const { email, password, rememberMe } = this.state;

    const payload = {
      user: {
        email,
        password,
      },
    };

    try {
      const response = await fetch('/api/v1/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store user info directly from data (not data.user)
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify({
          name: data.name || 'User',
          email: data.email || 'user@example.com',
          role: data.role || 'user',
        }));

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        this.props.navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };


  handleSignUp = () => {
    this.props.navigate('/signup');
  };

  render() {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-md w-96">
          <h2 className="text-white text-2xl font-semibold text-center mb-4">Sign In</h2>

          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
            placeholder="Email"
            className="w-full p-2 mb-4 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
            placeholder="Password"
            className="w-full p-2 mb-4 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <div className="flex justify-between items-center mb-4">
            <label className="text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={this.state.rememberMe}
                onChange={this.handleCheckboxChange}
                className="mr-1"
              />
              Remember me
            </label>
            <a href="#" className="text-red-400 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button with click handler */}
          <button
            onClick={this.handleSignIn}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mb-4 transition duration-200"
          >
            Sign In
          </button>

          <div className="flex items-center justify-center my-4">
            <hr className="w-1/4 border-gray-500" />
            <span className="text-gray-400 mx-2">or</span>
            <hr className="w-1/4 border-gray-500" />
          </div>


          <p className="text-center text-gray-400 mt-4 text-sm">
            New to Moview+?{" "}
            <button onClick={this.handleSignUp} className="text-red-400 hover:underline">
              Sign up now
            </button>
          </p>
        </div>
      </div>
    );
  }
}

export default withNavigation(Login);
