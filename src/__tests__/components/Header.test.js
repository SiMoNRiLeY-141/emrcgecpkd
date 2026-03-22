import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

// Mock next/head
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

describe('Header component', () => {
  it('renders the club name heading', () => {
    render(<Header />);
    expect(
      screen.getByText(/Electrical Maintenance and Research Club \(EMRC\)/i)
    ).toBeInTheDocument();
  });

  it('renders the college name', () => {
    render(<Header />);
    expect(
      screen.getByText(/Govt\. Engineering College, Sreekrishnapuram/i)
    ).toBeInTheDocument();
  });

  it('renders both logos with appropriate alt text', () => {
    render(<Header />);
    const logo1 = screen.getByAltText('Logo 1');
    const logo2 = screen.getByAltText('Logo 2');
    expect(logo1).toBeInTheDocument();
    expect(logo2).toBeInTheDocument();
  });

  it('renders EMRC logo with the correct Supabase URL', () => {
    render(<Header />);
    const logo1 = screen.getByAltText('Logo 1');
    expect(logo1.src).toContain('jfgkhseftiwquikjuhcv.supabase.co');
    expect(logo1.src).toContain('emrc.webp');
  });

  it('renders GEC logo with the correct Supabase URL', () => {
    render(<Header />);
    const logo2 = screen.getByAltText('Logo 2');
    expect(logo2.src).toContain('jfgkhseftiwquikjuhcv.supabase.co');
    expect(logo2.src).toContain('gec.webp');
  });
});
