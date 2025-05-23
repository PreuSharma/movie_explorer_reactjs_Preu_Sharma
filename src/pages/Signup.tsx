import React, { Component } from "react";
import { signUpUser } from "../services/userServices";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { withNavigation } from "../utils/withNavigation";
import { FaSpinner } from "react-icons/fa";

interface SignupState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile_number: string;
  isAgreed: boolean;
  error: string;
  isLoading: boolean;
}

interface SignupProps {
  navigate: (path: string) => void;
}

class Signup extends Component<SignupProps, SignupState> {
  constructor(props: SignupProps) {
    super(props);
    this.state = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile_number: "",
      isAgreed: false,
      error: "",
      isLoading: false,
    };
  }

  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]:
        name === "isAgreed" ? (e.target as HTMLInputElement).checked : value,
    }));
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
      isAgreed,
    } = this.state;

    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!nameRegex.test(fullName)) {
      this.setState({
        error:
          "Full Name must contain only letters and be at least 2 characters.",
      });
      return;
    }
    if (!emailRegex.test(email)) {
      this.setState({ error: "Invalid email format." });
      return;
    }
    if (!mobileRegex.test(mobile_number)) {
      this.setState({ error: "Mobile number must be exactly 10 digits." });
      return;
    }
    if (!passwordRegex.test(password)) {
      this.setState({
        error:
          "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
      });
      return;
    }
    if (password !== confirmPassword) {
      this.setState({ error: "Passwords do not match." });
      return;
    }
    if (!isAgreed) {
      this.setState({ error: "You must agree to the Terms and Conditions." });
      return;
    }

    const user = {
      name: fullName,
      email,
      password,
      mobile_number,
    };

    try {
      this.setState({ isLoading: true });
      const data = await signUpUser(user);
      localStorage.setItem("token", data.token);
      toast.success(data.message || "Account created successfully!");
      this.props.navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Signup failed. Please try again.");
      this.setState({
        error: error.message ?? "Something went wrong. Please try again.",
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      mobile_number,
      isAgreed,
      error,
    } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${"https://images.adsttc.com/media/images/5808/23a4/e58e/ce68/aa00/0240/large_jpg/pexels-photo-27008.jpg?1476928392"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        ></div>

        <div className="z-10 w-96 max-w-md">
          <form
            onSubmit={this.handleSubmit}
            className="bg-black bg-opacity-80 p-8 rounded-lg shadow-md w-full transform transition duration-400 hover:scale-[1.02] hover:shadow-lg"
          >
            <h2 className="text-red-600 text-2xl font-semibold text-center mb-6">
              Movie Explorer +
            </h2>
            <h2 className="text-white text-2xl font-semibold text-center mb-6">
              Create Account
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={this.handleInputChange}
              placeholder="Full Name"
              required
              className="w-full p-2 mb-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              placeholder="Email"
              required
              className="w-full p-2 mb-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="text"
              name="mobile_number"
              value={mobile_number}
              onChange={this.handleInputChange}
              placeholder="Mobile Number"
              required
              className="w-full p-2 mb-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              placeholder="Password"
              required
              className="w-full p-2 mb-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleInputChange}
              placeholder="Confirm Password"
              required
              className="w-full p-2 mb-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <label className="text-gray-300 text-sm flex items-center mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={this.handleCheckboxChange}
                className="mr-2 cursor-pointer"
              />
              I agree to the Terms and Conditions
            </label>

            <button
              type="submit"
              disabled={this.state.isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {this.state.isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="flex items-center justify-center my-4">
              <hr className="w-1/4 border-gray-500" />
              <span className="text-gray-400 mx-2">or</span>
              <hr className="w-1/4 border-gray-500" />
            </div>

            <p className="text-center text-gray-400 mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-red-400 hover:underline">
                Sign in now
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default withNavigation(Signup);
