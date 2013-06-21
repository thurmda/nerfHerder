module.exports = {
    "interval" : 5 * 1000,
    "rules" : [
        function(){
            if(this.ns !== "local.oplog.rs" && this.secs_running > 666666){
                console.log(JSON.stringify(this));
            }
            return true;
        }
    ]
}
