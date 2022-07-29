const fs = require('fs');
const http = require('http');

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

var server = http.createServer((req, res) => {

  const allowedCsvPathNames = [
    '/data/temp.csv',
    '/data/precip.csv',
    '/data/humidity.csv',
    '/data/wind_strenght.csv',
    '/data/wind_direction.csv',
    '/data/pressure.csv',
    '/data/radiation.csv'
  ]

  if (allowedCsvPathNames.indexOf(req.url) > -1) {
    returnCsvFile(res, req.url);
  }

  else {
    res.end('Invalid request');
  }

});

server.listen(5000);

console.log('Node.js web server at port 5000 is running..')