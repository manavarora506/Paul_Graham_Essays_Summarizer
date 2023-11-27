const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const text = body.text;

  // Replace 'YOUR_FLASK_SERVER_URL' with the URL of your deployed Flask server
  const response = await fetch('https://my-paul-graham-app-cebf5d007a10.herokuapp.com/summarize_essay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
