const apiKey =localStorage.getItem('geminiKey');

const prompt= "Hey Gemini, say it back";

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,{ 
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({contents:[{parts:[{text:prompt}]}]}), 
}
)
.then(res=> res.json())
.then(data => console.log(data.candidates[0].contents.part[0].text))
.catch(err => console.error('Gemini test error:', err));

