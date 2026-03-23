import handler from '../../pages/api/subscribe';

jest.mock('../../pages/api/supabase', () => ({
  __esModule: true,
  default: {
    from: jest.fn(),
  },
}));

import supabase from '../../pages/api/supabase';

function createMockRes() {
  const res = {
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
    end(msg) {
      this.body = msg;
      return this;
    },
  };
  return res;
}

describe('POST /api/subscribe', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.headers['Allow']).toEqual(['POST']);
  });

  it('returns 400 when email is missing', async () => {
    const req = { method: 'POST', body: {} };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Email address is required.' });
  });

  it('returns 200 with already-subscribed message when email exists', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 42 },
            error: null,
          }),
        }),
      }),
    });

    const req = { method: 'POST', body: { email: 'existing@example.com' } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'You are already subscribed!' });
  });

  it('returns 200 with thank-you message for a new subscription', async () => {
    supabase.from
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'Row not found' },
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

    const req = { method: 'POST', body: { email: 'new@example.com' } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Thank you for subscribing!' });
  });

  it('returns 500 when the SELECT query fails with a non-PGRST116 error', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { code: 'OTHER_ERROR', message: 'Unexpected DB error' },
          }),
        }),
      }),
    });

    const req = { method: 'POST', body: { email: 'test@example.com' } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Subscription failed. Please try again later.' });
  });

  it('returns 500 when the INSERT query fails', async () => {
    supabase.from
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'Row not found' },
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: new Error('Insert failed') }),
      });

    const req = { method: 'POST', body: { email: 'fail@example.com' } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Subscription failed. Please try again later.' });
  });
});
