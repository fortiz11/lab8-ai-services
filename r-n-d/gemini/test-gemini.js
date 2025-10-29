// r-n-d/gemini/test-gemini.js
(async () => {
  const apiKey = localStorage.getItem('geminiKey') ;
  if (!apiKey) { console.error(' No Gemini API key.'); return; }

  const MODEL = 'gemini-2.5-pro-preview-03-25';  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: 'Hello! this a test' }] }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}`);
    console.error('Body:', raw);
    return;
  }

  let data;
  try { data = JSON.parse(raw); } catch (e) {
    console.error(' JSON parse error', e, 'Raw:', raw);
    return;
  }

  if (data.error) {
    console.error(' Gemini API Error:', data.error);
    return;
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '(no text)';
  console.log('✅ Gemini response:', text);
})();
