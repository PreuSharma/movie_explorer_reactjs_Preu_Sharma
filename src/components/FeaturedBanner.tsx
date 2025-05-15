import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSubscriptionStatus } from "../services/Subscription";
import { useNavigate } from "react-router-dom";

interface BannerItem {
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface FeaturedBannerProps {
  intervalTime?: number;
}

const textParentVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
      duration: 1,
    },
  },
};

const textChildVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1.05,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 8,
    },
  },
};

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  intervalTime = 6000,
}) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const apiUrl =
    "https://movie-explorer-ror-amansharma.onrender.com/api/v1/movies";

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data?.movies?.length) {
          const formatted = data.movies.map((movie: any) => ({
            title: movie.title,
            subtitle: movie.description,
            imageUrl: movie.banner_url,
          }));
          setBanners(formatted);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
    getSubscriptionStatus(localStorage.getItem("token") || "");
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [banners.length, intervalTime]);

  if (!banners.length || !banners[currentIndex]) {
    return (
      <section className="h-[650px] w-full bg-black text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading banners...</p>
      </section>
    );
  }

  const { title, subtitle, imageUrl } = banners[currentIndex];

  return (
    <section className="relative h-[500px] sm:h-[650px] w-full text-white overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={imageUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          <motion.img
            src={imageUrl}
            alt={title}
            initial={{ scale: 1.1, x: -30 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-end px-4 sm:px-6 pb-16 sm:pb-20 md:px-12 lg:px-24 max-w-6xl">
        <motion.div
          variants={textParentVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-6"
        >
          <motion.h1
            variants={textChildVariants}
            whileHover={{ scale: 1.1, rotate: 1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={textChildVariants}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-md sm:max-w-xl line-clamp-4 "
          >
            {subtitle}
          </motion.p>

          <div className="flex flex-wrap gap-3 pt-4">
            <span  onClick={() => navigate("/dashboard/movies")}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="backdrop-blur-md bg-red-600/80 hover:bg-red-700 px-4 sm:px-6 py-2 rounded-full text-base sm:text-lg font-semibold shadow-xl"
            >
              ▶ Explore Now
            </motion.button>
            </span>
            <span onClick={() => navigate("/dashboard/subscription")}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="bg-white/10 hover:bg-white/20 px-4 sm:px-6 py-2 rounded-full text-base sm:text-lg font-semibold shadow-md backdrop-blur"
            >
              Subscribe To MovieExplorer
            </motion.button>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBanner;
