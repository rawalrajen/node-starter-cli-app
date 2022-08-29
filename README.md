# Node starter cli app 
This app basically imports the csv file from remote or local into the mongodb. Then we can fetch the portfolio value based on token and date for different cryptos. 

Major components used to build this app are as follows: 

- mongodb: to import the csv file and import into the mongo db

- fast-csv: is used to extract the data from csv file 

- commander: to create basic cli app

- axios: as http client 

## To import the data from csv file 

```sh
yarn app:import
```

## To get the portfolio value

```sh
yarn app:portfolio --token=BTC --date=2019-10-25
```