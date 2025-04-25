import React, { Component } from 'react';

interface DashboardState {
  userName: string;
  userEmail: string;
  userRole: string;
}

class Dashboard extends Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userName: '',
      userEmail: '',
      userRole: '',
    };
  }

  componentDidMount() {
    // Fetch the user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (userData) {
      this.setState({
        userName: userData.name || 'User',
        userEmail: userData.email || 'user@example.com',
        userRole: userData.role || 'user',
      });
    }
  }

  handleLogout = () => {
    // Clear user data on logout
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  render() {
    const { userName, userEmail, userRole } = this.state;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Dashboard</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Welcome, {userName}!</h3>
            <p className="text-sm text-gray-600">Email: {userEmail}</p>
            <p className="text-sm text-gray-600">Role: {userRole}</p>
          </div>

          <button
            onClick={this.handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
}

export default Dashboard;
