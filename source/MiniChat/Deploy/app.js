var readline = require('readline');

var toArray = function(){return Array.prototype.slice.call(arguments[0]);}
var log =   function() {
                var arr = toArray(arguments).map(function(v) {
                   // debugger;
                    return v + ''; 
                });
                console.log(arr.join(" "));
            }
var blank = function(){log("");}
var wl = function(){log.apply(this, toArray(arguments)); blank();}

blank();

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
	process.argv.forEach(function (e) {
        //blank();
		wl(e);
	});
	//console.log('Usage: node ' + process.argv[1] + ' FILENAME');
	//process.exit(1);
}

rl.question("", function(){rl.close();});