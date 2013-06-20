module.exports = {
"interval" : .3 * 1000,
"rules" : [
            function(){if(this.ns !== "local.oplog.rs"){ console.log(JSON.stringify(this));} return true;},
            function(){ return !(this.op === "query" && this.ns === "publisher.posts" && this.secs_running > 1);}
       ]
}
