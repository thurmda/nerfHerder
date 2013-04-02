var NerfHerder = require('../lib/nerfHerder');


module.exports['test A'] = function(test){
        test.expect(1);
        test.ok(true, 'this should pass');
        test.done();
    }

module.exports['Constructor'] = function(test){
        test.expect(1);
        var nf = new NerfHerder();
        console.dir(nf);
        test.ok((typeof nf ==='object') , 'this should pass');
        test.done();
    }
