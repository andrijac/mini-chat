/*global process, require, console, arguments*/

(function () {
    "use strict";
    var readline = require('readline'),
        path = require('path'),
        fs = require('fs'),
        q = require('q'),

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


    //========== TEST BEING

    //var filename = "C:/Users/acacanovic/Documents/STORE/GIT_ROOT/mini-chat/source/MiniChat/MiniChat/client.html";

    //var promis = q.denodeify(fs.readFile);

    //promis(filename, 'utf8').then(function() {
    //     debugger; 
    //     toArray(arguments).forEach(log); 
    //}, log);

    //rl.question("", function () { rl.close(); });

    //return;
    //========== TEST END

     

    //==========================================================================
    //=========== FILE MERGING =================================================
    //==========================================================================
    (function () {        

        

        function batch(execFunc, parameters, callback) {

	        var index = -1, cb, iterate, results= [];

	        cb = function () {
                results.push(toArray(arguments));

                var isLastItem = index == parameters.length - 1;

                if(isLastItem) {
                    callback(results);
                } else {
                    iterate();
                }
	        };

	        iterate = function () {
                index++;
                var i = index, result,
                    params = parameters[i] || [];

                params.push(cb);
                execFunc.apply(this, params);
	        };

            iterate();
        };

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

        

        function readAllText (filename, callback) {

            var readCallback =  function (data) {
                callback(filename, data);
            };

            var promis;

            //if(q.isPromise(fs.readFile)) {
            //    promis = fs.readFile;
            //} else {
                
            //}            

            promis = q.denodeify(fs.readFile);

            promis(filename, 'utf8').then(readCallback, log);
        }

        function batchRead(files, callback) {
            var encoding = 'utf8',
                params = [];
            
            files.forEach(function(file) {
                params.push([file, encoding]);
            });

            batch(fs.readFile, params, callback);
        }

        function parseFileNames (filename, fileLines) {
            var root = path.dirname(filename);

            return fileLines.map(function (e) {
                var r = new RegExp(/\"[A-Za-z\W]+\"/),
                    qFile = r.exec(e),
                    file = qFile[0].substring(1, qFile[0].length - 1),
                    fullFile = root + '/' + file;

                return fullFile;
            });
        }

        var filename = "C:/Users/acacanovic/Documents/STORE/GIT_ROOT/mini-chat/source/MiniChat/MiniChat/client.html";                   

        

        readAllText(filename, function (filename, e) {


            var files = findBlock(e, "<!-- BEGIN dev scripts -->", "<!-- END dev scripts -->");

            var filePathList = parseFileNames(filename, files);            

            //filePathList.forEach(function(e){log(e);});

            batchRead(filePathList, function(e) {
                log(e);
            });
        });

        

    }());

    rl.question("", function () { rl.close(); });
}());