module.exports = {
"interval" : 5 * 1000,
"rules" : [
            function(){
                if( this.secs_running > 2){
                    console.log(JSON.stringify(this)); 
                }
                return true;
            }
       ]
}
