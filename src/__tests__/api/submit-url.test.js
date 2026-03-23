// Mock node-fetch used by submit-url
jest.mock('node-fetch', () => jest.fn());

import handler from '../../pages/api/submit-url';
import mockFetch from 'node-fetch';

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

describe('POST /api/submit-url', () => {
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

  it('returns 400 when urls is missing from the body', async () => {
    const req = { method: 'POST', body: {} };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid URL list' });
  });

  it('returns 400 when urls is not an array', async () => {
    const req = { method: 'POST', body: { urls: 'https://example.com' } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid URL list' });
  });

  it('returns 200 and submits URLs successfully when IndexNow responds with ok', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    const urls = ['https://emrcgecpkd.vercel.app/', 'https://emrcgecpkd.vercel.app/about'];
    const req = { method: 'POST', body: { urls } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'URLs submitted successfully' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.indexnow.org/indexnow');
    expect(options.method).toBe('POST');
    const payload = JSON.parse(options.body);
    expect(payload.urlList).toEqual(urls);
    expect(payload.host).toBe('emrcgecpkd.vercel.app');
  });

  it('returns 200 even when IndexNow responds with a non-ok status', async () => {
    mockFetch.mockResolvedValue({ ok: false, text: jest.fn().mockResolvedValue('Bad Request') });

    const req = { method: 'POST', body: { urls: ['https://emrcgecpkd.vercel.app/'] } };
    const res = createMockRes();
    await handler(req, res);

    // The handler still returns 200 regardless of the IndexNow response
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'URLs submitted successfully' });
  });

  it('returns 200 even when fetch throws an error', async () => {
    mockFetch.mockRejectedValue(new Error('Network unreachable'));

    const req = { method: 'POST', body: { urls: ['https://emrcgecpkd.vercel.app/'] } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'URLs submitted successfully' });
  });
});
