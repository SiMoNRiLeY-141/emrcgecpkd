import React from 'react';
import { render, screen, act } from '@testing-library/react';
import HomePage from '../../pages/index';

// Mock next/head so its children render inline in the component tree
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

// Mock each lazy-loaded component so Suspense resolves immediately
jest.mock('../../components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header" />,
}));

jest.mock('../../components/SocialMediaOverlay', () => ({
  __esModule: true,
  default: () => <div data-testid="social-media-overlay" />,
}));

jest.mock('../../components/Committee', () => ({
  __esModule: true,
  default: () => <div data-testid="committee" />,
}));

jest.mock('../../components/ContactSection', () => ({
  __esModule: true,
  default: () => <div data-testid="contact-section" />,
}));

jest.mock('../../components/News', () => ({
  __esModule: true,
  default: () => <div data-testid="news" />,
}));

jest.mock('../../components/Newsletter', () => ({
  __esModule: true,
  default: () => <div data-testid="newsletter" />,
}));

describe('HomePage (pages/index.js)', () => {
  it('renders the .App root container', async () => {
    const { container } = render(<HomePage />);
    await act(async () => {});
    expect(container.querySelector('.App')).toBeInTheDocument();
  });

  it('renders all six lazy-loaded sections after Suspense resolves', async () => {
    render(<HomePage />);
    await act(async () => {});

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('news')).toBeInTheDocument();
    expect(screen.getByTestId('committee')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    expect(screen.getByTestId('social-media-overlay')).toBeInTheDocument();
  });

  it('renders a main landmark for page content', async () => {
    const { container } = render(<HomePage />);
    await act(async () => {});

    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('includes a <title> tag with the correct page title', async () => {
    render(<HomePage />);
    await act(async () => {});

    const titleEl = document.querySelector('title');
    expect(titleEl).not.toBeNull();
    expect(titleEl.textContent).toBe(
      'Electrical Maintenance and Research Club, GEC Palakkad',
    );
  });

  it('includes a meta description tag', async () => {
    render(<HomePage />);
    await act(async () => {});

    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).not.toBeNull();
    expect(metaDesc.getAttribute('content')).toContain(
      'Electrical Maintenance and Research Club',
    );
  });

  it('includes an Open Graph title meta tag', async () => {
    render(<HomePage />);
    await act(async () => {});

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).not.toBeNull();
    expect(ogTitle.getAttribute('content')).toContain('EMRC');
  });

  it('includes a JSON-LD schema script for the organisation', async () => {
    const { container } = render(<HomePage />);
    await act(async () => {});

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const schema = JSON.parse(script.textContent);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('CollegeOrUniversity');
    expect(schema.name).toBe('EMRC GEC Palakkad');
    expect(schema.url).toBe('https://emrcgecpkd.vercel.app');
  });

  it('includes canonical and robots directives for crawlers', async () => {
    render(<HomePage />);
    await act(async () => {});

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical.getAttribute('href')).toBe('https://emrcgecpkd.vercel.app');

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots).not.toBeNull();
    expect(robots.getAttribute('content')).toContain('index, follow');

    const bingbot = document.querySelector('meta[name="bingbot"]');
    expect(bingbot).not.toBeNull();
    expect(bingbot.getAttribute('content')).toBe('index, follow');
  });

  it('JSON-LD schema contains committee member info', async () => {
    const { container } = render(<HomePage />);
    await act(async () => {});

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script.textContent);

    const chairperson = schema.member.find((m) => m.jobTitle === 'Chairperson');
    expect(chairperson).toBeDefined();
    expect(chairperson.name).toBe('Rithin');

    const viceChair = schema.member.find((m) => m.jobTitle === 'Vice Chairperson');
    expect(viceChair).toBeDefined();
    expect(viceChair.name).toBe('Yatheesh');
  });

  it('JSON-LD schema contains correct social media links', async () => {
    const { container } = render(<HomePage />);
    await act(async () => {});

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script.textContent);

    expect(schema.sameAs).toContain('https://www.instagram.com/emrc_gec');
    expect(schema.sameAs).toContain('https://www.linkedin.com/company/emrc-gecpkd');
  });
});
