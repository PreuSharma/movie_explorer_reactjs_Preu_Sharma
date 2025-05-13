import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute'; 
import MovieDetailsPage from '../pages/MovieDetailsPage';
import MyList from '../pages/MyList';
import AddMovie from '../pages/AddMovie';
import AllMovies from '../pages/AllMovies';
import Success from '../pages/Success';
import PricingPage from '../pages/PricingPage';

const RoutingModule: React.FC = () => {
  return (
    <Routes>
      {/* Default route -> dashboard */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Public routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/movies" element={<AllMovies />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/movie/:movieId" element={<MovieDetailsPage />} />
        <Route path="/dashboard/subscription" element={<PricingPage />} />
        <Route path="/dashboard/my-list" element={<MyList />} />
        <Route path="/dashboard/add-movie" element={<AddMovie />} />
        <Route path="/success" element={<Success />} />
      </Route>
    </Routes>
  );
};

export default RoutingModule;
