/*global process, require, console, arguments*/

(function () {
    "use strict";
    var readline = require('readline'),
        path = require('path'),
        fs = require('fs'),
        //q = require('q'),

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
        }),
        emptyFunction = function() { };

    blank();

    if (process.argv.length < 3) {
        process.argv.forEach(function (e) {
            wl(e);
        });
    }

    if(!Array.prototype.insert) {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
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

        

        function batch(execFunc, parameters, eachCallback, callback) {

	        var index = -1, cb, iterate, results= [];

	        cb = function () {
                var params = toArray(arguments),
                    isLastItem = index == parameters.length - 1;

                results.push(params);                

                eachCallback.apply(this, params);

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
            var lines = getLines(text), i, ii, start, line, result = [], startLine, endLine;

            start = false;

            for (i = 0, ii = lines.length; i < ii; i += 1) {
                line = lines[i].trim();

                if (line === startTag) {
                    start = true;
                    startLine = i;
                    continue;
                }

                if (!start) {
                    continue;
                }

                if (line === stopTag) {
                    endLine = i;
                    break;
                }

                result.push(line);
            }

            return {                 
                startLine: startLine,
                endLine: endLine,
                result: result
            };
        }

        function getLines(text) {
            var lines = text.split("\n");
            return lines;
        }

        function readAllText (filename, callback) {

            var readCallback =  function (err, data) {
                if(err) throw err;
                callback(filename, data);
            };
            
            fs.readFile(filename, 'utf8', readCallback);            
        }

        function batchRead(files, callback) {
            var encoding = 'utf8',
                params = [];
            
            files.forEach(function(file) {
                params.push([file, encoding]);
            });

            batch(fs.readFile, params, emptyFunction, callback);
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

            var allText = e;

            var allLines = getLines(allText);

            var blockFind = findBlock(allText, "<!-- BEGIN dev scripts -->", "<!-- END dev scripts -->");

            var filePathList = parseFileNames(filename, blockFind.result);            

            //filePathList.forEach(function(e){log(e);});

            batchRead(filePathList, function(result) {
                log(e);

                var start = blockFind.startLine;
                var sliceLength = blockFind.endLine - blockFind.startLine + 1;

                allLines.slice(start, sliceLength);

                var insertTextArr = [];
                result.forEach(function(i) {
                    insertTextArr.push(i[1]);
                });

                insertTextArr.insert(0, "<script>");
                insertTextArr.push("</script>");
                var insertText = insertTextArr.join("");

                allLines.insert(start, insertText);
                //allLines.splice(start, 0, 'andrija');
                //allLines.insert(start, 'andrija');

                fs.writeFile("C:/temp/test1222.htm", allLines.join(""), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved!");
                    }
                }); 
            });
        });        

    }());

    rl.question("", function () { rl.close(); });
}());