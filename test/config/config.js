module.exports = {
"maxExecutionTime" : 5000, 
"interval" : 4 * 1000,
"lifetime" : 20 * 1000,
"rules" : [
            function(){console.log('Print op and let it live.'); console.dir(this); return true;},
            function(){console.log('Kill everything!!!');return false;}
       ]
}
