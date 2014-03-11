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
        }),
        emptyFunction = function() { },
		argIndex = 0,
		filename,
		outputFileName;

    blank();

	function getActualFilePath(filePath) {		

		var relative;

		// check absolute path
		if(fs.existsSync(filePath)) {
			return filePath;
		}

		// check relative path
		relative = [__dirname, filePath].join("/");

		if(fs.existsSync(relative)) {
			return relative;
		}		

		throw new Error("File " + filePath + " not found");
	}

    if (process.argv.length < 4) {	
			
		wl("Usage: node app.js [input html file path] [output html file path]");
		process.exit(0);

    } else {

		filename = getActualFilePath(process.argv[2]);
		outputFileName = [__dirname, process.argv[3]].join("/");

	}

    if(!Array.prototype.insert) {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
    }     

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

        //var filename = "C:/Users/acacanovic/Documents/STORE/GIT_ROOT/mini-chat/source/MiniChat/MiniChat/client.html";

        readAllText(filename, function (filename, allText) {

            var allLines = getLines(allText),
				blockFind = findBlock(allText, "<!-- BEGIN dev scripts -->", "<!-- END dev scripts -->"),
				filePathList = parseFileNames(filename, blockFind.result);            

            batchRead(filePathList, function(result) {                

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

                fs.writeFile(outputFileName, allLines.join(""), function(err) {
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