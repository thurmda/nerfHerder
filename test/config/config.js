module.exports = {
"maxExecutionTime" : 5 * 1000,
"interval" : .3 * 1000,
"lifetime" : 60 * 1000,
"rules" : [
            function(){/* 'Print op and let it live.' */ console.log(JSON.stringify(this)); return true;},
            function(){/*Kill everything over 2 secs! */ return (this.secs_running < 2);}
       ]
}
