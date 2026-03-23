import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Committee from '../../components/Committee';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

describe('Committee component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders committee members returned by the API', async () => {
    const mockMembers = [
      { id: 1, name: 'Alice', position: 'Chairperson', photo_url: 'https://example.com/alice.jpg' },
      { id: 2, name: 'Bob', position: 'Secretary', photo_url: 'https://example.com/bob.jpg' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockMembers),
    });

    await act(async () => {
      render(<Committee />);
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Chairperson')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Secretary')).toBeInTheDocument();
  });

  it('renders the "Executive Committee" heading', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await act(async () => {
      render(<Committee />);
    });

    expect(screen.getByText('Executive Committee')).toBeInTheDocument();
  });

  it('renders member photos with correct alt text', async () => {
    const mockMembers = [
      { id: 1, name: 'Alice', position: 'Chairperson', photo_url: 'https://example.com/alice.jpg' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockMembers),
    });

    await act(async () => {
      render(<Committee />);
    });

    const img = screen.getByAltText('Alice');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/alice.jpg');
  });

  it('renders an empty member list gracefully when the API fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await act(async () => {
      render(<Committee />);
    });

    // Heading should still be there
    expect(screen.getByText('Executive Committee')).toBeInTheDocument();
    // No member cards should be rendered
    expect(document.querySelectorAll('.member-card').length).toBe(0);
  });

  it('renders an empty list when fetch throws a network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await act(async () => {
      render(<Committee />);
    });

    expect(screen.getByText('Executive Committee')).toBeInTheDocument();
    expect(document.querySelectorAll('.member-card').length).toBe(0);
  });
});
