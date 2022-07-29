/*

This script gets meteo data from the following URLs:

  https://www.meteo.be/services/web2016/climat/obs_graph/getGraph.php?code=6455&param=temp&lang=en
  https://www.meteo.be/services/web2016/climat/obs_graph/getGraph.php?code=6455&param=precip&lang=en
  https://www.meteo.be/services/web2016/climat/obs_graph/getGraph.php?code=6455&param=humidity&lang=en
  https://www.meteo.be/services/web2016/climat/obs_graph/getGraph.php?code=6455&param=wind&lang=en
  https://www.meteo.be/services/web2016/climat/obs_graph/getGraph.php?code=6455&param=pressure&lang=en
  https://www.meteo.be/services/web2016/climat/obs_graph/getGraph.php?code=6455&param=radiation&lang=en

It saves the data to a CSV file.

Run the following command in your terminal to run this script once:
  node index.js

het gaat om de data die achter "var obs =" staat.
Bij wind is ook de data achter "var directionsTxt" relevant.
De x-as is tijd in ms dus er hoeft geen timestamp bij.

dit is de frontend: https://www.meteo.be/nl/weer/waarnemingen/belgie

*/

const config = {
  temp: {line: 1},
  precip: {line: 1},
  humidity: {line: 1},
  wind_strenght: {line: 13},
  wind_direction: {line: 16, textToRemove: `var directionsTxt = `},
  pressure: {line: 1},
  radiation: {line: 1}
}

// Function that returns the URL for a data type (i.e. 'temp' or 'wind')
const getUrl = (key) => `https://www.meteo.be/services/web2016/climat/obs_graph/getGraph.php?code=6455&param=${key}&lang=en`

// Function that fetches a data URL
const getFile = async (key) => {
  const url = getUrl(key);
  const res = await fetch(url);
  const text = await res.text();
  return text;
}

// Function that gets a specific line from a multiline string, and returns it
const getLine = (file, line, textToRemove) => {
  // Split the file into lines
  const lines = file.split("\n");
  // Get only second line
  const theLine = lines[line];
  // Remove `var obs = ` and `;`
  const arrayAsText = theLine.replace(textToRemove, '').replace(';', '');
  // Parse string to JavaScript variable
  const response = JSON.parse(arrayAsText);
  // If it was an object: convert to array
  if(typeof response === 'object') {
    var arrayFromObject = [];
    for (let key in response) {
      arrayFromObject.push([key, response[key]]);
    }
    return arrayFromObject;
  }
  return response;
}

const getData = (fileContents, key) => {
  return getLine(
    fileContents,                             // File contents
    config[key].line,                         // Line to return
    config[key].textToRemove || `var obs = `  // Text to remove from line
  )
}

// Function that writes to a CSV file
const saveToCsv = (fileName, data) => {
  const fs = require("fs");
  // Get file contents of existing CSV file
  let fileContents;
  if (fs.existsSync(`data/${fileName}`)) {
    fileContents = fs.readFileSync(`data/${fileName}`, 'utf8');
  }
  // Create stream for writing to existing CSV file
  const stream = fs.createWriteStream(`data/${fileName}`, {flags: 'a'});// a = append
  for (let x of data) {
    const timestamp = x[0];
    // Only write to file if timestamp does not exist in this file yet
    // to prevent duplicates
    if(fileContents && fileContents.indexOf(timestamp) > -1) continue;
    // Write to CSV
    stream.write(x.join(",") + "\r\n");
  }
  stream.end();
}

const run = async () => {
  for(key in config) {
    const name = key.split('_')[0];
    const file = await getFile(name);
    const data = getData(file, key);
    saveToCsv(`${key}.csv`, data);
  };
}

run();
