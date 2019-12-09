var fs = require('fs');

function replaceWithStreams(path) {
    var REGEX = /S\(\".*?\"\)/g;
    var fileContent = fs.readFileSync(path, 'utf8');

    // replacePath is your match[1]
    fileContent = fileContent.replace(REGEX, function replacer(matchString, replacePath) {
        console.log("Match string ",matchString);
        console.log(replacePath);
        let replaceItem = matchString.match(/(?<=(['"])\b)(?:(?!\1|\\).|\\.)*(?=\1)/);
        //let replaceItem = getString(match.replace('")', '').replace('S("', ''));
        console.log('replaceItem', replaceItem)
        // load and return the replacement file
        return fs.readFileSync(replacePath, 'utf8');
    });

    // this will overwrite the original html file, change the path for test
    //fs.writeFileSync(path, fileContent);
    
}

function getString(e) {
    for (var t = "", n = e.charCodeAt(0), i = 1; i < e.length; ++i)
        t += String.fromCharCode(e.charCodeAt(i) ^ i + n & 127);
    return t
}

replaceWithStreams('./ckfinder.js');