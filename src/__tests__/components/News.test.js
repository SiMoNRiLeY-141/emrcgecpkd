import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import News from '../../components/News';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

describe('News component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders "No news available." when the API returns an empty array', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await act(async () => {
      render(<News />);
    });

    expect(screen.getByText('No news available.')).toBeInTheDocument();
  });

  it('renders news items returned by the API', async () => {
    const mockNews = [
      { id: 1, title: 'Workshop on Robotics', image_url: 'https://example.com/img1.jpg', url: 'https://example.com/1' },
      { id: 2, title: 'Annual Tech Fest', image_url: 'https://example.com/img2.jpg', url: 'https://example.com/2' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockNews),
    });

    await act(async () => {
      render(<News />);
    });

    expect(screen.getByText('Workshop on Robotics')).toBeInTheDocument();
    expect(screen.getByText('Annual Tech Fest')).toBeInTheDocument();
  });

  it('renders the "Latest News" heading when news items are present', async () => {
    const mockNews = [
      { id: 1, title: 'Test Event', image_url: 'https://example.com/img.jpg', url: 'https://example.com/' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockNews),
    });

    await act(async () => {
      render(<News />);
    });

    expect(screen.getByText('Latest News')).toBeInTheDocument();
  });

  it('renders images with correct alt text', async () => {
    const mockNews = [
      { id: 1, title: 'Robotics Event', image_url: 'https://example.com/img1.jpg', url: 'https://example.com/1' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockNews),
    });

    await act(async () => {
      render(<News />);
    });

    const img = screen.getByAltText('Robotics Event');
    expect(img).toBeInTheDocument();
  });

  it('shows "No news available." when the API request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await act(async () => {
      render(<News />);
    });

    expect(screen.getByText('No news available.')).toBeInTheDocument();
  });

  it('advances to the next news item after the carousel interval', async () => {
    const mockNews = [
      { id: 1, title: 'First Item', image_url: 'https://example.com/img1.jpg', url: 'https://example.com/1' },
      { id: 2, title: 'Second Item', image_url: 'https://example.com/img2.jpg', url: 'https://example.com/2' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockNews),
    });

    await act(async () => {
      render(<News />);
    });

    // Initially, the first item should have the 'active' class
    const newsItems = document.querySelectorAll('.news-item');
    expect(newsItems[0]).toHaveClass('active');
    expect(newsItems[1]).not.toHaveClass('active');

    // Advance timer past the 7-second interval
    await act(async () => {
      jest.advanceTimersByTime(7000);
    });

    const updatedItems = document.querySelectorAll('.news-item');
    expect(updatedItems[0]).not.toHaveClass('active');
    expect(updatedItems[1]).toHaveClass('active');
  });

  it('wraps around to the first item after the last item', async () => {
    const mockNews = [
      { id: 1, title: 'First Item', image_url: 'https://example.com/img1.jpg', url: 'https://example.com/1' },
      { id: 2, title: 'Second Item', image_url: 'https://example.com/img2.jpg', url: 'https://example.com/2' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockNews),
    });

    await act(async () => {
      render(<News />);
    });

    // Advance past both items (14 seconds)
    await act(async () => {
      jest.advanceTimersByTime(14000);
    });

    const updatedItems = document.querySelectorAll('.news-item');
    expect(updatedItems[0]).toHaveClass('active');
    expect(updatedItems[1]).not.toHaveClass('active');
  });
});
