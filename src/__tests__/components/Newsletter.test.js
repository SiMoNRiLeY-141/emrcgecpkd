import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Newsletter from "../../components/Newsletter";

describe("Newsletter component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the subscription form with heading and input", () => {
    render(<Newsletter />);
    expect(screen.getByText("NEWS_LETTER_SUBSCRIPTION")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ENTER_EMAIL_ID...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i }),
    ).toBeInTheDocument();
  });

  it("shows a validation message when submitting with an empty email", async () => {
    render(<Newsletter />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    });
    expect(
      screen.getByText("ERROR: INVALID_EMAIL_FORMAT."),
    ).toBeInTheDocument();
  });

  it("shows the success message returned by the API on successful submission", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ message: "Thank you for subscribing!" }),
    });

    render(<Newsletter />);
    await userEvent.type(
      screen.getByPlaceholderText("ENTER_EMAIL_ID..."),
      "test@example.com",
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("SUCCESS: SUBSCRIBED_TO_NODE."),
      ).toBeInTheDocument();
    });
  });

  it("clears the email input after a successful submission", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ message: "Thank you for subscribing!" }),
    });

    render(<Newsletter />);
    const input = screen.getByPlaceholderText("ENTER_EMAIL_ID...");
    await userEvent.type(input, "test@example.com");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("shows an API error message when the server returns an error response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: "Subscription failed. Please try again later.",
      }),
    });

    render(<Newsletter />);
    await userEvent.type(
      screen.getByPlaceholderText("ENTER_EMAIL_ID..."),
      "test@example.com",
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Subscription failed. Please try again later."),
      ).toBeInTheDocument();
    });
  });

  it("shows a fallback error message when fetch throws a network error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    render(<Newsletter />);
    await userEvent.type(
      screen.getByPlaceholderText("ENTER_EMAIL_ID..."),
      "test@example.com",
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("ERROR: NODE_CONNECTION_REJECTED."),
      ).toBeInTheDocument();
    });
  });

  it('shows "already subscribed" message when the API returns that response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ message: "You are already subscribed!" }),
    });

    render(<Newsletter />);
    await userEvent.type(
      screen.getByPlaceholderText("ENTER_EMAIL_ID..."),
      "existing@example.com",
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("SUCCESS: SUBSCRIBED_TO_NODE."),
      ).toBeInTheDocument();
    });
  });

  it("clears the status message after 5 seconds", async () => {
    jest.useFakeTimers();
    // userEvent needs to advance fake timers internally
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime.bind(jest),
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ message: "Thank you for subscribing!" }),
    });

    render(<Newsletter />);
    await user.type(
      screen.getByPlaceholderText("ENTER_EMAIL_ID..."),
      "test@example.com",
    );
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      expect(
        screen.getByText("SUCCESS: SUBSCRIBED_TO_NODE."),
      ).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(
      screen.queryByText("SUCCESS: SUBSCRIBED_TO_NODE."),
    ).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
