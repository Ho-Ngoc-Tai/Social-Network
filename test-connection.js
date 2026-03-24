// Simple test to check if backend is running
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Simple GraphQL query
const postData = JSON.stringify({
  query: `
    query {
      __schema {
        types {
          name
        }
      }
    }
  `
});

req.write(postData);
req.end();
