module.exports = {
"interval" : 2 * 1000,
"rules" : [
            function(op){ 
                if(
                    op.ns === "twisk.t1" &&
                    op.secs_running > 2 //Our LB has already timed out this request making this op an orpah
                   ){
                    return false;
                }else{
                    return true;
                }
            },
          ],
"events" : {
            "start" : function(config){console.log('############ Nerf Herder on duty %s ##########', new Date());},
            "kill" : function(op){console.error('Nerf Herder is killing mongo process %d', op.opid, JSON.stringify(op));},
          }
}
