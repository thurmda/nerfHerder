var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mongo = require('mongodb');

function NerfHerder(conn, options){
    EventEmitter.call(this);
    this.connectionString =  conn;
    this.options = options || {
        interval : 1 * 1000,
        rules: [function(){
                   if(this.secs_running > 2){
                    console.log(JSON.stringify(this));
                   }
                   return true;
                }]
 
    };
    this.startPolling();
}

util.inherits(NerfHerder, EventEmitter);
NerfHerder.prototype.pollServer = function(){
    var that = this;
    this.emit('polling');

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
            if (!rule.call(op)){
                killOp(op.opid);
            }
        }
    }
    function killOp(id){
        that.emit('cull', id);
        ///TODO kill this op...
        //
        //I want to do the equivalent of
        //  db.killOp(1223);
        //
        //via the driver. How is this done?
        //that.db.collection("$cmd.sys.killOp").insert({op:id});
        //doesn't work with version 1.3.9 of the driver node v0.10.10
        //RE : https://wiki.10gen.com/pages/viewpage.action?pageId=19562864
        //.$cmd.sys.killop.findOne({op:op});
        //
        //dev2:PRIMARY> db.killOp
         //function (op) {
             //if (!op) {
                 //throw "no opNum to kill specified";
             //}
             //return this.$cmd.sys.killop.findOne({op:op});
         //}
        //
        //
        //
        //
        that.db.collection('$cmd.sys.killop').findOne({op:id}, function(){
            that.emit('burried', id);
        
        });
    }
}
NerfHerder.prototype.startPolling = function(){
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
    this.emit('destroy');
}
module.exports = NerfHerder;
