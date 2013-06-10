module.exports = {
"interval" : 2 * 1000,
"rules" : [
            function(){/* 'Print op and let it live.' */ console.log(JSON.stringify(this)); return true;},
          ],
"events" : {
            "poll" : function(){console.log('****************** polling  %s ******************', new Date());}
           }
}
