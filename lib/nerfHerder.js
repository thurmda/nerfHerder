var mongo = require('mongodb');

function NerfHerder(conn, options){
    this.connectionString =  conn;
    this.options = options || {
        maxExecutionTime : 5 * 1000, //miliseconds
        interval : 1 * 1000,
        lifetime : 2 * 1000,
        excludeCollections : []
    };
    this.startPolling();
    var that = this;
    if(this.options.lifetime){
        setTimeout(function(){
            that.destroy();
        }, this.options.lifetime);
    }
    ///TODO connect and open a tailing cursor on the oplog
    mongo.Db.connect(conn, {safe:true}, onConnect); 
    function onConnect(err, db){
        that.db = db;
    }
}

function inspectInProg(err, result){
    console.dir(arguments);
}

NerfHerder.prototype.startPolling = function(){
    var that = this;
    this.pollingInterval = setInterval(function(){that.pollServer();}, this.options.interval);
}
NerfHerder.prototype.pollServer = function(){
    console.log('Polling server %s' , this.connectionString);
    this.db.collection("$cmd.sys.inprog").findOne(inspectInProg);
}
NerfHerder.prototype.stopPolling = function(){
    clearInterval(this.pollingInterval);
}
NerfHerder.prototype.destroy = function(){
    this.stopPolling();
    this.db.close();
}
module.exports = NerfHerder;
