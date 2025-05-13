import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for extended matchers
import Footer from '../components/Footer';
import { BrowserRouter } from 'react-router-dom';

// Utility to render component with routing context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Footer Component', () => {
  test('renders branding text', () => {
    renderWithRouter(<Footer />);
    const brandingElements = screen.getAllByText(/MovieExplore\+/);
    expect(brandingElements[0]).toBeInTheDocument(); // Assert the first occurrence
    expect(
      screen.getByText(/The ultimate destination for movie lovers/i)
    ).toBeInTheDocument();
  });

  test('renders all quick links', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    const movieLinks = screen.getAllByText(/Movies/i);
    expect(movieLinks[0]).toBeInTheDocument(); // Assert the first occurrence
    expect(screen.getByText(/Subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/My List/i)).toBeInTheDocument();
  });

  test('renders support links', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(/FAQ/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });

  // test('renders social icons', () => {
  //   renderWithRouter(<Footer />);
  //   const icons = screen.getAllByRole('img', { hidden: true }); 
  //   expect(icons.length).toBeGreaterThanOrEqual(4);
  // });

  test('renders newsletter input and button', () => {
    renderWithRouter(<Footer />);
    const input = screen.getByPlaceholderText(/Enter your email/i);
    const button = screen.getByRole('button', { name: /Subscribe/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect((input as HTMLInputElement).value).toBe('test@example.com');
  });

  test('footer bottom text exists', () => {
    renderWithRouter(<Footer />);
    expect(
      screen.getByText(/© 2024 MovieExplore\+. All rights reserved./i)
    ).toBeInTheDocument();
  });
});
