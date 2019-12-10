var fs = require('fs');

function replaceWithStreams(path) {
    var REGEX = /S\(\".*?\"\)/g;
    var fileContent = fs.readFileSync(path, 'utf8');

    // replacePath is your match[1]
     fileContent = fileContent.replace(REGEX, function replacer(matchString, replacePath) {
        let replaceItem;
        eval("replaceItem=eval(matchString)");
        console.log('replaceItem', replaceItem)
        matchString = replaceItem;
        // load and return the replacement file
        return fs.readFileSync(replacePath, 'utf8');
    });

    // this will overwrite the original html file, change the path for test
    fs.writeFileSync(path, fileContent);
}

function S(e) {
    console.log(typeof e);
    // let str2 = wtf8.decode(e.toString());
    // console.log(str2)
    let str2;
    str2=e;
    for (var t = "", n = str2.charCodeAt(0), i = 1; i < str2.length; ++i)
        t += String.fromCharCode(str2.charCodeAt(i) ^ i + n & 127);
    return t
}

replaceWithStreams('./ckfinder.js');