/*global process, require, console, arguments*/

(function () {
    "use strict";
    var readline = require('readline'),
        fs = require('fs'),

        toArray = function () { return Array.prototype.slice.call(arguments[0]); },
        log =   function () {
            var arr = toArray(arguments).map(function (v) {
                    // debugger;
                    return v.toString();
                });
            console.log(arr.join(" "));
        },
        blank = function () { log(""); },
        wl = function () { log.apply(this, toArray(arguments)); blank(); },
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

    blank();

    if (process.argv.length < 3) {
        process.argv.forEach(function (e) {
            wl(e);
        });
    }

    //==========================================================================
    //=========== FILE MERGING =================================================
    //==========================================================================
    (function(){
        var filename = "C:/Users/acacanovic/Documents/STORE/GIT_ROOT/mini-chat/source/MiniChat/MiniChat/client.js";
        //process.argv[0];
        var readAllText = function (filename, callback) {            
            fs.readFile(filename, 'utf8', function(err, data) {
                if (err) throw err;
                callback(data);
            });            
        };

        readAllText(filename, function(e){ wl(e); });

    }());

    rl.question("", function () { rl.close(); });
}());