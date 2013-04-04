var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mongo = require('mongodb');

function NerfHerder(conn, options){
    EventEmitter.call(this);
    this.connectionString =  conn;
    this.options = options || {
        maxExecutionTime : 5 * 1000, //miliseconds
        interval : 1 * 1000,
        lifetime : 2 * 1000,
        polling: false,
        excludeCollections : []
    };
    var that = this;

    ///WANT connect and open a tailing cursor on the oplog
    mongo.Db.connect(conn, {safe:true}, onConnect); 
    function onConnect(err, db){
        that.db = db;
        that.startPolling();
        if(that.options.lifetime){
            setTimeout(function(){that.destroy();}, that.options.lifetime);
        }
   }
}

util.inherits(NerfHerder, EventEmitter);
NerfHerder.prototype.startPolling = function(){
    var that = this;
    this.polling = setTimeout(function(){that.pollServer();}, this.options.interval);
}
NerfHerder.prototype.pollServer = function(){
    var that = this;
    this.emit('polling');
    if(this.polling){
        this.polling = setTimeout(function(){that.pollServer();}, this.options.interval);
    }
    //console.log('Polling server %s' , this.connectionString);
    this.db.collection("$cmd.sys.inprog").findOne(inspectInProg);
    function inspectInProg(err, result){
        //console.dir(arguments);
        if(result.inprog){
          result.inprog.forEach(executeRuleSet);
        }
    }
    function executeRuleSet(op, index){
        that.options.rules.forEach(runRule);
        function runRule(rule){
            if (!rule.call(op)){
                killOp(op.opid);
            }
        }
    }
    function killOp(id){
        console.log('Killing op %d', id);
        ///TODO kill this op...
    }
}
NerfHerder.prototype.stopPolling = function(){
    clearTimeout(this.polling);
    this.polling = false;
    this.emit('stoppedPolling');
}
NerfHerder.prototype.destroy = function(){
    this.stopPolling();
    this.db.close();
    this.emit('destroy');
}
module.exports = NerfHerder;
