import handler from '../../pages/api/committee';

// Mock the supabase module
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
    end() {
      return this;
    },
  };
  return res;
}

describe('GET /api/committee', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with committee data on success', async () => {
    const mockData = [
      { id: 1, name: 'Alice', position: 'Chairperson', photo_url: 'https://example.com/alice.jpg' },
      { id: 2, name: 'Bob', position: 'Secretary', photo_url: 'https://example.com/bob.jpg' },
    ];
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      }),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns 500 when Supabase returns an error', async () => {
    const mockError = new Error('Database connection failed');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      }),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Database connection failed' });
  });

  it('returns 500 when Supabase throws an unexpected error', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockRejectedValue(new Error('Unexpected failure')),
      }),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Unexpected failure' });
  });
});
