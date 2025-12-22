const http = require('http');

const data = `{
  "date": "2025-12-24T10:00:00Z"
  "status": "SCHEDULED"
}`; // Missing comma

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/appointments',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
