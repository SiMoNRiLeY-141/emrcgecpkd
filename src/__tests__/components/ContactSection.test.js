import React from 'react';
import { render, screen } from '@testing-library/react';
import ContactSection from '../../components/ContactSection';

describe('ContactSection component', () => {
  it('renders the "Contact Us" heading', () => {
    render(<ContactSection />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders the obfuscated email address', () => {
    render(<ContactSection />);
    expect(screen.getByText(/emrc\[at\]gecskp\[dot\]ac\[dot\]in/)).toBeInTheDocument();
  });

  it('renders the Instagram link with the correct href', () => {
    render(<ContactSection />);
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/emrc_gec');
  });

  it('renders the LinkedIn link with the correct href', () => {
    render(<ContactSection />);
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/company/emrc-gecpkd');
  });

  it('renders social links that open in a new tab with security attributes', () => {
    render(<ContactSection />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
