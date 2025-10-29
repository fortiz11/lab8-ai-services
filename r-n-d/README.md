# 🔬 Lab 8 – R & D Notes: AI Service Provider Exploration

## 🧠 Objective
Evaluate at least two AI service providers through exploratory coding to understand their API structures, authentication methods, and response behavior.

---

## Provider 1 – OpenAI

**Model tested:** `gpt-4o-mini`  
**Endpoint:** `https://api.openai.com/v1/chat/completions`  
**Authentication:** Bearer token in header (`Authorization: Bearer <apiKey>`)  
**Key storage:** Saved in `localStorage` under `"openaiKey"`

### ✅ Results
- Received successful completion with prompt `"Hello, this is a test!"`
- Demonstrated working API key, fetch request, and async/await handling.
- Verified JSON structure: `choices[0].message.content`
- Implemented error handling for 401 (bad key) and 429 (rate-limit).

### 🧩 Observations
| Aspect | Notes |
|--------|-------|
|Cost | Required addition of funds to connect 
| Ease of setup | Simple REST endpoint, well-documented |
| Response speed | Fast and reliable |
| Error clarity | Clear JSON errors |
| Privacy | Requires external API call (cloud processing) |

---

## Provider 2 – Google Gemini

**Model tested:** `gemini-2.5-pro-preview-03-25`  
**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`  
**Authentication:** API key in URL query (`?key=<geminiKey>`)  
**Key storage:** Saved in `localStorage` under `"geminiKey"`

### ✅ Results
- Successfully connected using a new Google account (key auto-generated).
- Verified API responds with valid text output:  
  `✅ Gemini response: "Hello! Test received loud and clear."`
- Compared structure with OpenAI: `data.candidates[0].content.parts[0].text`

### 🧩 Observations
| Aspect | Notes |
|--------|-------|
| Cost | free tier offered a 300 dollar credit 
| Ease of setup | Requires Google Cloud project; slightly more steps |
| Response format | More deeply nested JSON |
| Model naming | Uses “flash / pro” tiers |
| Privacy | Also a cloud-based LLM |
| Documentation | Good but less concise than OpenAI’s |

---

## 🧾 Summary of Findings

| Criterion | OpenAI | Gemini |
|------------|---------|--------|
| Setup difficulty | ⭐ Easy | ⚠️ Moderate (project key) |
| Response latency | Low | Slightly higher |
| Output clarity | Excellent | Good |
| Free tier / access | Requires trial or credits | Free tier available |
| Best suited for | Production chat integration | Educational or prototyping use |

---

## 🧩 Decision
For Lab 8 integration, I will use **OpenAI** as the primary provider because it has:
- A simpler payload structure,
- Clearer documentation,
- Consistent responses suitable for integration into the existing MVC chat app.

Gemini will remain as an alternate service for future experimentation.

---



