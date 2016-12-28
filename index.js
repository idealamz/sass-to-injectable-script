var fs = require('fs');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');
var CleanCSS = require('clean-css');

var wrapResultWithInjectScript = function (css) {
    var minified = new CleanCSS().minify(css).styles;
    return '' +
        '(function(){' +
            'var h = document.getElementsByTagName("head")[0];' +
            'var s = document.createElement("style");' +
            's.setAttribute("type", "text/css");' +
            'if (s.styleSheet) {' + // IE
                's.styleSheet.cssText = "' + minified + '";' +
            '} else {' + // the world
                's.appendChild(document.createTextNode("'+ minified +'"));' +
            '}' +
            'h.appendChild(s);' +
        '})();'
};

module.exports = function (pattern) {
    var files = glob.readdirSync(pattern);
    files.forEach(function(file){
        sass.render({
            file: file
        }, function(err, result) {
            fs.writeFile(file + '.js', wrapResultWithInjectScript(result.css))
        });
    })
};