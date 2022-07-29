const fs = require('fs');
const http = require('http');
const https = require('https');
const csvtojson = require('csvtojson');

const returnJsonFor = async (res, key) => {
  const json = await csvtojson({
    noheader:true,
  }).fromFile(`${__dirname}/data/${key}.csv`);
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  }); 
  res.write(JSON.stringify(json));
  res.end();
}

const returnCsvFile = (res, url) => {
  // Set response header
  res.writeHead(200, {
    'Content-Type': 'text/csv',
    'Content-disposition': `attachment; filename="${url.split('/')[2]}"`
  }); 

  // Get file contents
  const filePath = `${__dirname}/${url}`; 
  let csvData = '';
  if (fs.existsSync(filePath)) {
    csvData = fs.readFileSync(filePath, 'utf8');
  }
  
  // Set response content    
  res.write(csvData);
  res.end();
}

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/meteo-dourbes.bartroorda.nl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/meteo-dourbes.bartroorda.nl/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/meteo-dourbes.bartroorda.nl/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const app = async (req, res) => {

  const allowedCsvPathNames = [
    '/data/temp.csv',
    '/data/precip.csv',
    '/data/humidity.csv',
    '/data/wind_strenght.csv',
    '/data/wind_direction.csv',
    '/data/pressure.csv',
    '/data/radiation.csv'
  ];

  if (req.url === '/api/temp') {
    const json = await returnJsonFor(res, 'temp');
  }
  else if (req.url === '/api/precip') {
    const json = await returnJsonFor(res, 'precip');
  }

  else if (allowedCsvPathNames.indexOf(req.url) > -1) {
    returnCsvFile(res, req.url);
  }

  else if (req.url === '/.well-known/acme-challenge/XdF0Ji6qk4V8HVCrpDNgXCF3UeG0AEVbOJQzXP0toZM') {
    res.write('XdF0Ji6qk4V8HVCrpDNgXCF3UeG0AEVbOJQzXP0toZM.MH7QTtVkzm74wa8HpAinK1M8zrrtWdUSrqDIxNSmANQ');
    res.end();
  }

  else {
    res.end('Invalid request');
  }

};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// server.listen(5000);

httpServer.listen(80, () => {
  console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

console.log('Node.js web server at port 5000 is running..')