# Nerf Herder

A companion service to mongod to keep long running queries from causing chaos.
Every so often `(config.interval)` nerfHerder will poll mongo to find a list of
current operations. nerfHerder will then loop through each operation and
evaluate each rule in `config.rules`. Each λ rule has the operation set as the
context `this`. The λ can due whatever logic it wants  and then return a
thruthy value. `true` means a process lives, `false` means `killOp` will be
called to kill it.

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
"interval" : .3 * 1000, //Polling interval in miliseconds
"rules" : [
            function(){/* 'Print op and let it live.' */ console.log(JSON.stringify(this)); return true;},
            function(){/*Kill everything over 2 secs! */ return (this.secs_running < 2);}
       ]
}
````
