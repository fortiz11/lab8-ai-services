//Test for OpenAI chat completions

const myApiKey= localStorage.getItem('openaiKey');
const payload ={
    model: 'gpt-4o-mini',
    messages:[{role: 'user', content:'Hello, this is a test'}],
};

fetch('https://api.openai.com/v1/chat/completions',{method:'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
})

//when fetch resolves it converts the HTTP response into Js object 
.then(res=> res.json())
//retrieves the message sent by the API
.then(data => console.log(data.choices[0].messages.content))
.catch(err => console.error('OpenAI test error', err));