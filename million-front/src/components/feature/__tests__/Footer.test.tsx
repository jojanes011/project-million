import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('renders the logo and company description', () => {
    render(<Footer />);
    expect(screen.getByAltText('Million Logo')).toBeInTheDocument();
    expect(
      screen.getByText(/real estate for living and investments/i)
    ).toBeInTheDocument();
  });

  it('renders the navigation links sections', () => {
    render(<Footer />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders specific navigation links', () => {
    render(<Footer />);
    // Check a few links from different sections
    expect(screen.getByText('Our Agents')).toBeInTheDocument();
    expect(screen.getByText('Houses')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders the social media icons', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
  });

  it('renders the copyright information', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Million. All rights reserved.`)).toBeInTheDocument();
  });
});
