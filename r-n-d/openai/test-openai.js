(async () => {
  // 0) Get API key (from localStorage or prompt)
  let key = localStorage.getItem('openaiKey');
  if (!key) {
    key = (prompt('Paste your OpenAI API key (starts with sk-):') || '').trim();
    if (!key) { console.error('No API key provided.'); return; }
    localStorage.setItem('openaiKey', key);
  }

  // Build payload 
  const payload = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello! this is a test ' }],
    temperature: 0.7,
  };

  // Make request
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // 3) Read raw text (so we can show it even on errors)
  const raw = await res.text();


  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}`);
    console.error('Body:', raw);
    // Common cases:
    // 401: bad/missing key
    // 429: rate limit; wait ~1–2 minutes or switch model
    return;
  }

  // 5) Parse JSON safely
  let data;
  try { data = JSON.parse(raw); } catch (e) {
    console.error('JSON parse error:', e, 'Raw:', raw);
    return;
  }

  // 6) If API returned an error object instead of choices
  if (data.error) {
    console.error('OpenAI API Error:', data.error.message, data.error);
    return;
  }

  // 7) Extract assistant message
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    console.warn('No assistant message found. Full response:', data);
    return;
  }

  console.log('✅ OpenAI response:', text);
})();