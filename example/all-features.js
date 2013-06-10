module.exports = {
"interval" : 2 * 1000,
"rules" : [
            function(){/* 'Print op and let it live.' */ console.log(JSON.stringify(this)); return true;},
            function(){ 
                if(
                    this.ns === "MY_DB.MY_COLLECTION" &&
                    this.secs_running > 60 //Our LB has already timed out this request making this op an orpah
                   ){
                    return false;
                }else{
                    return true;
                }
            },
          ],
"events" : {
            "start" : function(config){console.log('############ Nerf Herder on duty %s ##########', new Date());},
            "poll" : function(){console.log('****************** polling  %s ******************', new Date());},
            "kill" : function(id){console.error('Nerf Herder is killing mongo process %d', id);},
            "killed" : function(id){console.error('Nerf Herder killed mongo process %d', id);},
            "stop" : function(config){console.log('Nerf Herder polling stopped');}
          }
}
