'use client'
import { formFiller } from './scrape';

export default function JobSearchPage() {

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '30px' }}>Kyochon Form Filler</h1>
      <button onClick={() => formFiller("Barista", "Malaysia", 10)} style={{ padding: '12px 60px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Fill Form!
      </button>
    </div>
  );
}