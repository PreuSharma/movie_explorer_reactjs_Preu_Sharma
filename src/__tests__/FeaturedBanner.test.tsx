import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FeaturedBanner from '../components/FeaturedBanner';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../services/Subscription', () => ({
  getSubscriptionStatus: jest.fn(),
}));

const mockMovies = [
  {
    title: 'Inception',
    subtitle: 'A thief who steals corporate secrets through dream-sharing technology.',
    imageUrl: 'https://example.com/inception.jpg',
  },
  {
    title: 'Interstellar',
    subtitle: 'A team of explorers travel through a wormhole in space.',
    imageUrl: 'https://example.com/interstellar.jpg',
  },
];

beforeEach(() => {
  // Reset fetch mock for each test
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ movies: mockMovies }),
    })
  ) as jest.Mock;
});

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <FeaturedBanner intervalTime={2000} />
    </BrowserRouter>
  );
};



describe('FeaturedBanner Component', () => {
  test('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/Loading banners.../i)).toBeInTheDocument();
  });


  test('renders Explore Now and Subscribe buttons', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Explore Now/i)).toBeInTheDocument();
      expect(screen.getByText(/Subscribe To MovieExplorer/i)).toBeInTheDocument();
    });
  });

  test('navigates to dashboard/movies when Explore Now button is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Explore Now/i)).toBeInTheDocument();
    });

    const navigateSpy = jest.spyOn(window, 'location', 'get');
    navigateSpy.mockReturnValue({ pathname: '/dashboard/movies' } as any);

    const exploreButton = screen.getByText(/Explore Now/i);
    userEvent.click(exploreButton);
  });

  test('cycles to next banner after interval', async () => {
    jest.useFakeTimers();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    });

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
