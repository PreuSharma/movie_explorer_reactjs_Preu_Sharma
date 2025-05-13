import React, { Component } from "react";
import { withNavigation } from "../utils/withNavigation";
import { loginUser } from "../services/userServices";
import toast from "react-hot-toast";

interface LoginState {
  email: string;
  password: string;
}

interface LoginProps {
  navigate: (path: string) => void;
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value} as unknown as Pick<LoginState, keyof LoginState>);
  };


  handleSignIn = async () => {
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

        toast.success("Login successful!");
        this.props.navigate("/dashboard");
      } else {
        alert(data.message ?? "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login error. Please try again.");
    }
  };

  handleSignUp = () => {
    this.props.navigate("/signup");
  };

  render() {
    return (
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
            className="w-full p-2 mb-4 rounded bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
            placeholder="Password"
            className="w-full p-2 mb-4 rounded bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <div className="flex justify-between items-center mb-4 text-sm">
            <button
              onClick={() => alert("Forgot Password functionality not implemented yet.")}
              className="text-red-400 hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              Forgot Password?
            </button>
          </div>

          <button
            onClick={this.handleSignIn}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mb-4 transition duration-200 cursor-pointer"
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
            <button
              onClick={this.handleSignUp}
              className="text-red-400 hover:underline cursor-pointer"
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    );
  }
}

export default withNavigation(Login);
