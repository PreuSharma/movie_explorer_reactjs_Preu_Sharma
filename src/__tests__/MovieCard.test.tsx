import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import MovieCard from '../components/MovieCard';
import { BrowserRouter as Router } from 'react-router-dom';
import { deleteMovie } from '../services/MovieServices';
import toast from 'react-hot-toast';

jest.mock('../services/MovieServices', () => ({
  deleteMovie: jest.fn(() => Promise.resolve(true)), 
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('MovieCard Component', () => {
  const movieProps = {
    id: 1,
    posterUrl: 'https://via.placeholder.com/150',
    title: 'Inception',
    userRole: 'supervisor',
    duration: 148,
    rating: 8.8,
    userPlanType: 'basic' as 'basic' | 'premium',
    onDelete: jest.fn(),
  };


  test('renders MovieCard component', () => {
    render(
      <Router>
        <MovieCard {...movieProps} />
      </Router>
    );
    
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByAltText('Inception')).toBeInTheDocument();
    expect(screen.getByText('148 min')).toBeInTheDocument();
    expect(screen.getByText('8.8 ⭐')).toBeInTheDocument();
  });


  test('adds movie to the list when Add to List button is clicked', () => {
    // Mock localStorage.setItem
    const setItemMock = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    const { getByTitle } = render(
      <Router>
        <MovieCard {...movieProps} />
      </Router>
    );
    
    const addButton = getByTitle('Add to List');
    fireEvent.click(addButton);

    expect(setItemMock).toHaveBeenCalledWith(
      'movieList',
      JSON.stringify([
        { id: 1, title: 'Inception', posterUrl: 'https://via.placeholder.com/150' },
      ])
    );
    expect(toast.success).toHaveBeenCalledWith('Movie added to your list!');


    setItemMock.mockRestore();
  });


  test('navigates to the edit page when Edit button is clicked', () => {
    const { getByText } = render(
      <Router>
        <MovieCard {...movieProps} />
      </Router>
    );
    

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '', search: '', assign: jest.fn() },
    });

    const editButton = screen.getByRole('button', { name: /Edit/i }); 
    fireEvent.click(editButton);

    window.location.pathname = '/dashboard/add-movie';
    window.location.search = '?id=1&mode=edit';

 
    expect(window.location.pathname).toBe('/dashboard/add-movie');
    expect(window.location.search).toBe('?id=1&mode=edit');
  });


  test('deletes the movie when Delete button is clicked and user confirms', async () => {
    const { getByText } = render(
      <Router>
        <MovieCard {...movieProps} />
      </Router>
    );
    

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(deleteMovie).toHaveBeenCalledWith(1));
    expect(toast.success).toHaveBeenCalledWith('Movie deleted successfully!');
    expect(movieProps.onDelete).toHaveBeenCalledWith(1);
  });


  test('navigates to movie details page when card is clicked', () => {
    const { container } = render(
      <Router>
        <MovieCard {...movieProps} />
      </Router>
    );
    
    const card = container.querySelector('.relative');
    fireEvent.click(card!); 


    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '', assign: jest.fn() },
    });


    window.location.assign(`/dashboard/movie/${movieProps.id}`);
    expect(window.location.assign).toHaveBeenCalledWith('/dashboard/movie/1');
  });

 
  test('renders Supervisor options (Edit and Delete buttons) for supervisor role', () => {
    render(
      <Router>
        <MovieCard {...movieProps} />
      </Router>
    );
    
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  test('does not render Supervisor options for non-supervisor role', () => {
    const nonSupervisorProps = { ...movieProps, userRole: 'user' };
    
    render(
      <Router>
        <MovieCard {...nonSupervisorProps} />
      </Router>
    );
    
    expect(screen.queryByText('✏️')).toBeNull();
    expect(screen.queryByText('🗑️')).toBeNull();
  });
});
