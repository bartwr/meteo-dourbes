# meteo-dourbes

Get meteo data for Dourbes (Belgium) and save to CSV.

cd data/ && touch temp.csv precip.csv humidity.csv wind_strenght.csv wind_direction.csv pressure.csv radiation.csv

## How to run?

Make sure you have NodeJS version 18.6 installed.

Then, run:

    node index.js

## How to retrieve data?

This script stores data in CSV files. Go to one of the following URL's to download the data:

- $IP/data/humidity.csv
- $IP/data/precip.csv
- $IP/data/pressure.csv
- $IP/data/radiation.csv
- $IP/data/temp.csv
- $IP/data/wind_direction.csv
- $IP/data/wind_strenght.csv

## Deploy to server

    forever start server.js

Check running processes:

- `forever list`

https://blog.logrocket.com/running-node-js-scripts-continuously-forever/

## On SSL

https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca
