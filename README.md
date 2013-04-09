# Nerf Herder

A companion service to mongod to keep long running queries from causing chaos.

## Install

````bash
git clone git@github.com:thurmda/nerfHerder.git
npm install
npm test
````

## Usage

````bash
nerfHerder -d MONGO_CONNECTION_STRING -f PATH_TO_CONFIG
````

### config

````js
module.exports = {
"maxExecutionTime" : 5 * 1000,
"interval" : .3 * 1000,
"lifetime" : 60 * 1000,
"rules" : [
            function(){/* 'Print op and let it live.' */ console.log(JSON.stringify(this)); return true;},
            function(){/*Kill everything over 2 secs! */ return (this.secs_running < 2);}
       ]
}
````
