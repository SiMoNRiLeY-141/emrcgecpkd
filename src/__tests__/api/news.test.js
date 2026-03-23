import handler from '../../pages/api/news';

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
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

describe('GET /api/news', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with news data on success', async () => {
    const mockData = [
      { id: 1, title: 'Workshop on Robotics', image_url: 'https://example.com/img1.jpg', url: 'https://example.com/1' },
      { id: 2, title: 'Annual Tech Fest', image_url: 'https://example.com/img2.jpg', url: 'https://example.com/2' },
    ];
    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns 500 when Supabase returns an error', async () => {
    const mockError = new Error('Query failed');
    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Query failed' });
  });

  it('returns 500 when Supabase throws unexpectedly', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('Network error')),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Network error' });
  });
});
