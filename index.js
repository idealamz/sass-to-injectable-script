var fs = require('fs');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');

var wrapResultWithInjectScript = function (css) {
    css = css.toString().replace(/\n/g, "\\n");
    return '' +
        '(function(){' +
            'var st = "' + css + '";' +
            'var h = document.getElementsByTagName("head")[0];' +
            'var s = document.createElement("style");' +
            's.setAttribute("type", "text/css");' +
            'if (s.styleSheet) {' + // IE
                's.styleSheet.cssText = st;' +
            '} else {' + // the world
                's.appendChild(document.createTextNode(st));' +
            '}' +
            'h.appendChild(s);' +
        '})();'
};

module.exports = function (pattern, nodeSassConfiguration) {
    nodeSassConfiguration = nodeSassConfiguration || {};
    var files = glob.readdirSync(pattern);
    files.forEach(function(file){
        sass.render(Object.assign({
            file: file
        }, nodeSassConfiguration), function(err, result) {
            if (err) {
                console.log(err);
            } else {
                fs.writeFile(file + '.js', wrapResultWithInjectScript(result.css))
            }
        });
    })
};