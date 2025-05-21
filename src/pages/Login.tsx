import React, { Component } from "react";
import { withNavigation } from "../utils/withNavigation";
import { loginUser } from "../services/userServices";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { SubscriptionContext } from "../context/SubscriptionContext"; 

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
}

interface LoginProps {
  navigate: (path: string) => void;
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    } as unknown as Pick<LoginState, keyof LoginState>);
  };

  handleSignIn = async (refreshStatus: () => void) => {
    const { email, password } = this.state;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const payload = {
      user: {
        email,
        password,
      },
    };

    try {
      this.setState({ isLoading: true });
      const { data, status } = await loginUser(payload);

      if (status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: data.email,
            role: data.role,
            token: data.token,
          })
        );

        refreshStatus(); 
        toast.success("Login successful!");
        this.props.navigate("/dashboard");
      } else {
        toast.error(data.error ?? "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login error. Please try again.");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSignUp = () => {
    this.props.navigate("/signup");
  };

  render() {
    return (
      <SubscriptionContext.Consumer>
        {({ refreshStatus }) => (
          <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${"https://images.adsttc.com/media/images/5808/23a4/e58e/ce68/aa00/0240/large_jpg/pexels-photo-27008.jpg?1476928392"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px)",
              }}
            ></div>

            <div className="relative z-10 w-96 max-w-md bg-black bg-opacity-80 p-6 sm:p-8 rounded-lg shadow-md transform transition duration-400 hover:scale-[1.02] hover:shadow-lg">
              <h2 className="text-red-600 text-2xl font-semibold text-center mb-4">
                Movie Explorer +
              </h2>
              <h2 className="text-white text-2xl font-semibold text-center mb-4">
                Sign In
              </h2>

              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                placeholder="Email"
                className="w-full p-2 mb-4 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                placeholder="Password"
                className="w-full p-2 mb-4 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <button
                type="submit"
                onClick={() => this.handleSignIn(refreshStatus)}
                disabled={this.state.isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {this.state.isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sign In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="flex items-center justify-center my-4">
                <hr className="w-1/4 border-gray-500" />
                <span className="text-gray-400 mx-2">or</span>
                <hr className="w-1/4 border-gray-500" />
              </div>

              <p className="text-center text-gray-400 mt-4 text-sm">
                New to Moview+?{" "}
                <button
                  onClick={this.handleSignUp}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </div>
        )}
      </SubscriptionContext.Consumer>
    );
  }
}

export default withNavigation(Login);
