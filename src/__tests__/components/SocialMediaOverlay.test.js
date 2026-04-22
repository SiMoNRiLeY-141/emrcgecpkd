import React from 'react';
import { render, screen } from '@testing-library/react';
import SocialMediaOverlay from '../../components/SocialMediaOverlay';

describe('SocialMediaOverlay component', () => {
  it('renders the Instagram link with the correct href and aria-label', () => {
    render(<SocialMediaOverlay />);
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/emrc_gec');
    expect(instagramLink).toHaveAttribute('aria-label', 'Visit our Instagram page');
  });

  it('renders the LinkedIn link with the correct href and aria-label', () => {
    render(<SocialMediaOverlay />);
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/company/emrc-gecpkd');
    expect(linkedinLink).toHaveAttribute('aria-label', 'Visit our LinkedIn page');
  });

  it('renders the email link with the correct href and aria-label', () => {
    render(<SocialMediaOverlay />);
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:emrc@gecskp.ac.in');
    expect(emailLink).toHaveAttribute('aria-label', 'Send us an email');
  });

  it('renders external links that open in a new tab with security attributes', () => {
    render(<SocialMediaOverlay />);
    const externalLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('target') === '_blank');
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders exactly three links', () => {
    render(<SocialMediaOverlay />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });
});
