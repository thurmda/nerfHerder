module.exports = {
"interval" : 1 * 1000,
"rules" : [
            function(){
                if( 
                        this.ns === 'publisher.posts' &&
                        this.secs_running > 2
                  ){
                    console.log(JSON.stringify(this)); 
                }
                return true;
            }
       ]
}
