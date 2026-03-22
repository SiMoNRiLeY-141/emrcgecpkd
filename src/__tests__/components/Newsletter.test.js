import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Newsletter from '../../components/Newsletter';

describe('Newsletter component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the subscription form with heading and input', () => {
    render(<Newsletter />);
    expect(screen.getByText('Subscribe to our Newsletter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('shows a validation message when submitting with an empty email', async () => {
    render(<Newsletter />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    });
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('shows the success message returned by the API on successful submission', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Thank you for subscribing!' }),
    });

    render(<Newsletter />);
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });
  });

  it('clears the email input after a successful submission', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Thank you for subscribing!' }),
    });

    render(<Newsletter />);
    const input = screen.getByPlaceholderText('Enter your email');
    await userEvent.type(input, 'test@example.com');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('shows an API error message when the server returns an error response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Subscription failed. Please try again later.' }),
    });

    render(<Newsletter />);
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Subscription failed. Please try again later.')).toBeInTheDocument();
    });
  });

  it('shows a fallback error message when fetch throws a network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<Newsletter />);
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Subscription failed. Please try again later.')).toBeInTheDocument();
    });
  });

  it('shows "already subscribed" message when the API returns that response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'You are already subscribed!' }),
    });

    render(<Newsletter />);
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'existing@example.com');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('You are already subscribed!')).toBeInTheDocument();
    });
  });

  it('clears the status message after 5 seconds', async () => {
    jest.useFakeTimers();
    // userEvent needs to advance fake timers internally
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime.bind(jest) });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Thank you for subscribing!' }),
    });

    render(<Newsletter />);
    await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Thank you for subscribing!')).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
