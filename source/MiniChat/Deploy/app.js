/*global process, require, console, arguments*/

(function () {
    "use strict";
    var readline = require('readline'),
        path = require('path'),
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
    (function () {

        function findBlock(text, startTag, stopTag) {
            var lines = text.split("\n"), i, ii, start, line, result = [];

            start = false;

            for (i = 0, ii = lines.length; i < ii; i += 1) {
                line = lines[i].trim();

                if (line === startTag) {
                    start = true;
                    continue;
                }

                if (!start) {
                    continue;
                }


                if (line === stopTag) {
                    break;
                }

                result.push(line);
 
            }

            return result;
        }

        var filename = "C:/Users/acacanovic/Documents/STORE/GIT_ROOT/mini-chat/source/MiniChat/MiniChat/client.html",
        //process.argv[0];
            readAllText = function (filename, callback) {
                fs.readFile(filename, 'utf8', function (err, data) {
                    if (err) {
                        wl(err);
                        return;
                    }

                    callback(filename, data);
                });
            };

        readAllText(filename, function (filename, e) {

            var files = findBlock(e, "<!-- BEGIN dev scripts -->", "<!-- END dev scripts -->"),
                root = path.dirname(filename);

            files.forEach(function(e) { 
                var r = new RegExp(/\"[A-Za-z\W]+\"/),
                    qFile = r.exec(e),
                    file = qFile[0].substring(1, qFile[0].length - 1),
                    fullFile = root + '/' + file;

                log(fullFile);
            });

        });

    }());

    rl.question("", function () { rl.close(); });
}());