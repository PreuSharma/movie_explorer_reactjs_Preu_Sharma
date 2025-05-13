import React, { Component } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FeaturedBanner from "../components/FeaturedBanner";
import MovieListingPage from "../components/MovieListing";
import Subscription from "../components/Subscription";

interface DashboardState {
  userName: string;
  userEmail: string;
  userRole: string;
  search: string;
  genre: string;
}

class Dashboard extends Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userName: "",
      userEmail: "",
      userRole: "guest",
      search: "",
      genre: "",
    };
  }

  setSearch = (search: string) => {
    this.setState({ search });
  };

  setGenre = (genre: string) => {
    this.setState({ genre });
  };

  render() {
    const { search, genre } = this.state;

    return (
      <div className="bg-black">
        {/* Header Animation: Parallax scroll effect */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Header search={search} setSearch={this.setSearch} />
        </motion.div>

        {/* Featured Banner with Zoom-In */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <FeaturedBanner />
        </motion.div>

        {/* Movie Listings with Bounce Effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.5,
          }}
        >
          <MovieListingPage
            search={search}
            genre={genre}
            setGenre={this.setGenre}
          />
        </motion.div>

        {/* Pricing Page with Fluid Left-to-Right Slide */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
        >
          <Subscription />
        </motion.div>

        {/* Footer with Scale-Up Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        >
          <Footer />
        </motion.div>
      </div>
    );
  }
}

export default Dashboard;
