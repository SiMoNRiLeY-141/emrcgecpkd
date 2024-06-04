import fetch from 'node-fetch';

const API_KEY = 'd6c7e9a21f2c436795027ef98a9b4ed9';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY_LOCATION = 'https://emrcgecpkd.vercel.app/d6c7e9a21f2c436795027ef98a9b4ed9.txt';

export const submitUrlsToIndexNow = async (urls) => {
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
      console.error(`Failed to submit URLs: ${urls}`, await response.text());
    }
  } catch (error) {
    console.error('Error submitting URLs to IndexNow:', error);
  }
};
