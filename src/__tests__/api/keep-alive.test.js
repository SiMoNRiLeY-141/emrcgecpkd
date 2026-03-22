// Mock the @supabase/supabase-js module used directly by keep-alive
const mockSelect = jest.fn();
const mockFrom = jest.fn(() => ({ select: mockSelect }));
const mockLimit = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: mockFrom,
  })),
}));

// Import after mock setup
let handler;
beforeAll(async () => {
  handler = (await import('../../pages/api/keep-alive')).default;
});

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

describe('GET /api/keep-alive', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with success message when Supabase ping succeeds', async () => {
    const mockData = [{ id: 1, title: 'Test News' }];
    mockSelect.mockReturnValue({
      limit: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: 'Supabase pinged successfully',
      data: mockData,
    });
  });

  it('returns 500 when Supabase returns an error', async () => {
    const mockError = new Error('Connection timeout');
    mockSelect.mockReturnValue({
      limit: jest.fn().mockResolvedValue({ data: null, error: mockError }),
    });

    const req = {};
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error pinging Supabase');
  });
});
