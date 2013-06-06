module.exports = {
"interval" : .3 * 1000,
"rules" : [
            function(){/* 'Print op and let it live.' */ console.log(JSON.stringify(this)); return true;},
            //function(){[>Kill everything over 2 secs! <] return (this.secs_running < 2);}
            function(){ return !(this.op === "query" && this.ns === "publisher.posts" && this.secs_running > 1);}
       ]
}
