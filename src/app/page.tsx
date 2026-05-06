'use client'
import { useState } from 'react';
import { formFiller } from './scrape';

export default function JobSearchPage() {
  const [credentials, setCredentials] = useState('');

  async function handleClick() {
    const result = await formFiller();
    setCredentials(result.credentials);
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '30px' }}>Kyochon Form Filler</h1>
      <button onClick={handleClick} style={{ padding: '12px 60px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Fill Form!
      </button>
      <h3>Currently requires manual Captcha solving on email input, oxylabs credentials are abstracted in .env files as workaround (Oxylabs credentials required)</h3>
      <h3>{credentials}</h3>
    </div>
  );
}