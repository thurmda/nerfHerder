var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mongo = require('mongodb');

function NerfHerder(conn, options){
    EventEmitter.call(this);
    var defaults = {
        interval : 5 * 1000,
        rules: [function(){
                   if(this.secs_running > 2){
                    console.log(JSON.stringify(this));
                   }
                   return true;
                }]
    };
    this.options = options || defaults;
    this.connectionString =  conn || this.options.conn;
    if(this.options.events){
        var event;
        for(event in this.options.events){
            this.on(event , this.options.events[event]);
        }
    }
    this.startPolling();
}

util.inherits(NerfHerder, EventEmitter);
NerfHerder.prototype.pollServer = function(){
    var that = this;
    this.emit('poll');

    if(typeof this.pollingTimeout !== 'undefined'){
        this.pollingTimeout = setTimeout(function(){that.pollServer();}, this.options.interval);
        mongo.Db.connect(this.connectionString, {safe:true}, onConnect);
        function onConnect(err, db){
            that.db = db;
            that.db.collection("$cmd.sys.inprog").findOne(inspectInProg);
        }
    }
    function inspectInProg(err, result){
        if(result.inprog){
            result.inprog.forEach(executeRuleSet);
            that.db.close();
        }
    }
    function executeRuleSet(op, index){
        that.options.rules.forEach(runRule);
        function runRule(rule){
            if (!rule.call(op, op)){
                killOp(op);
            }
        }
    }
    function killOp(op){
        that.emit('kill', op);
        that.db.collection('$cmd.sys.killop').findOne({op:op.opid}, function(){
            ///TODO ???
            that.emit('killed', op);
        });
    }
}
NerfHerder.prototype.startPolling = function(){
    this.emit('start', this.options);
    this.pollingTimeout = 'first';
    this.pollServer();
}
NerfHerder.prototype.stopPolling = function(){
    clearTimeout(this.pollingTimeout);
    this.pollingTimeout = undefined;
    this.emit('stoppedPolling');
}
NerfHerder.prototype.destroy = function(){
    this.stopPolling();
    if(typeof this.db !== 'undefined'){
        this.db.close();
    }
    this.emit('stop');
}
module.exports = NerfHerder;
