import fetch from 'node-fetch';

const API_KEY = 'd6c7e9a21f2c436795027ef98a9b4ed9';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY_LOCATION = 'https://emrcgecpkd.vercel.app/d6c7e9a21f2c436795027ef98a9b4ed9.txt';

export default async function handler(req, res) {
  // Ensure the request is a POST request
  if (req.method === 'POST') {
    const { urls } = req.body;

    // Validate the URLs array
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Invalid URL list' });
    }

    const payload = {
        host: 'emrcgecpkd.vercel.app',
        key: API_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      };
    
      try {
        const response = await fetch(INDEXNOW_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          console.log(`URLs submitted successfully: ${urls}`);
        } else {
          console.error('Failed to submit URLs: %s', urls, await response.text());
        }
      } catch (error) {
        console.error('Error submitting URLs to IndexNow:', error);
      }

    // Respond with success message
    res.status(200).json({ message: 'URLs submitted successfully' });
  } else {
    // Respond with 405 Method Not Allowed if not a POST request
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
