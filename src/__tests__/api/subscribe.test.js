import handler from "../../pages/api/subscribe";

jest.mock("../../pages/api/supabase", () => ({
  __esModule: true,
  default: { from: jest.fn() },
}));

import supabase from "../../pages/api/supabase";

function createMockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(message) {
      this.body = message;
      return this;
    },
  };
}

describe("POST /api/subscribe", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns 405 for non-POST requests", async () => {
    const res = createMockRes();
    await handler({ method: "GET" }, res);

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toEqual(["POST"]);
    expect(res.headers["Cache-Control"]).toBe("no-store");
  });

  it("rejects missing and malformed emails", async () => {
    const res = createMockRes();
    await handler({ method: "POST", body: { email: "not-an-email" } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Enter a valid email address." });
  });

  it("inserts a new email without reading subscriber data", async () => {
    const insert = jest.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert });
    const res = createMockRes();

    await handler({ method: "POST", body: { email: "new@example.com" } }, res);

    expect(supabase.from).toHaveBeenCalledWith("newsletter_subscribers");
    expect(insert).toHaveBeenCalledWith([{ email: "new@example.com" }]);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Thanks! Your subscription is confirmed.",
    });
    expect(res.headers["Cache-Control"]).toBe("no-store");
  });

  it("returns the same success response for duplicate emails", async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        error: { code: "23505", message: "duplicate key" },
      }),
    });
    const res = createMockRes();

    await handler(
      { method: "POST", body: { email: "existing@example.com" } },
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Thanks! Your subscription is confirmed.",
    });
  });

  it("returns 500 when the insert fails unexpectedly", async () => {
    supabase.from.mockReturnValue({
      insert: jest
        .fn()
        .mockResolvedValue({ error: { code: "OTHER", message: "DB error" } }),
    });
    const res = createMockRes();

    await handler({ method: "POST", body: { email: "fail@example.com" } }, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: "Subscription failed. Please try again later.",
    });
  });
});
