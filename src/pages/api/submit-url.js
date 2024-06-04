import { submitUrlsToIndexNow } from '../../lib/indexnow';

export default async function handler(req, res) {
  // Ensure the request is a POST request
  if (req.method === 'POST') {
    const { urls } = req.body;

    // Validate the URLs array
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Invalid URL list' });
    }

    // Submit URLs to IndexNow
    await submitUrlsToIndexNow(urls);

    // Respond with success message
    res.status(200).json({ message: 'URLs submitted successfully' });
  } else {
    // Respond with 405 Method Not Allowed if not a POST request
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
