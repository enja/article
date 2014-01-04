var findit = require('findit');
var path = require('path');
var fs = require('fs');

module.exports = function (root, cb) {
    var res = {};
    
    walkDeps(root, function (err, hackers) {
        if (err) return cb(err)
        res.hackers = hackers;
        done();
    });
    
    function done () {
        var total = 0;
        var hackers = Object.keys(res.hackers).map(function (key) {
            var h = res.hackers[key];
            h.score = Object.keys(h.packages).reduce(function (acc, x) {
                return acc + h.packages[x];
            }, 0);
            total += h.score;
            return h;
        });
        hackers.forEach(function (h) {
            h.score = h.score / total;
        });
        hackers.sort(function (a, b) {
            return a.score < b.score ? 1 : -1;
        });
        cb(null, hackers)
    }
};

function walkDeps (root, cb) {
    var hackers = {};
    var finder = findit(root, { followSymlinks: true });
    var pending = 0, done = false;
    
    finder.on('directory', function (dir, stats, stop) {
        if (path.basename(dir) === '.git') stop();
    });
    
    finder.on('file', function (file, stats) {
        if (path.basename(file) !== 'package.json') return;
        var parts = path.relative(root, file).split('/');
        var distance = -1;
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === 'node_modules') distance ++;
        }
        distance = Math.max(0, distance);
        
        pending ++;
        fs.readFile(file, function (err, src) {
            pending --;
            if (err) next();
            
            try { var pkg = JSON.parse(src) }
            catch (err) { next() }
            
            if (!pkg || !pkg.name || pkg.private) return next();
            
            var author = authorOf(pkg);
            var h = hackers[author];
            if (!h) {
                h = hackers[author] = {
                    packages: {},
                    github: githubOf(pkg)
                };
            }
            if (!h.name) {
                if (pkg.author && pkg.author.name) {
                    h.name = pkg.author.name;
                }
                else h.name = author;
                
                if (pkg.author && pkg.author.email) {
                    h.email = pkg.author.email;
                }
            }
            if (!h.github) h.github = githubOf(pkg);
            
            if (!h.packages[pkg.name]) h.packages[pkg.name] = 0;
            h.packages[pkg.name] += distance ? 1 / (2 * distance) : 1;
            next();
            
            function next () {
                if (done && pending == 0) cb(null, hackers);
            }
        });
    });
    finder.on('end', function () {
        done = true;
        if (pending === 0) cb(null, hackers);
    });
}

function authorOf (pkg) {
    var author;
    if (typeof pkg.author === 'object') {
        author = pkg.author.name || pkg.author.email;
    }
    else if (typeof pkg.author === 'string') {
        author = pkg.author.replace(/\s*<.*/, '');
    }
    if (!author && pkg.author) {
        author = JSON.stringify(pkg.author);
    }
    if (!author && pkg.repository && pkg.repository.url) {
        var m = /\bgithub.com\/([^\/]+)/.exec(pkg.repository.url);
        author = m && m[1];
    }
    if (!author && pkg.bugs && pkg.bugs.url) {
        var m = /\bgithub.com\/([^\/]+)/.exec(pkg.bugs.url);
        author = m && m[1];
    }
    if (author) author = author.replace(/^['"]|['"]$/g, '');
    return author;
}

function githubOf (pkg) {
    if (pkg.repository && pkg.repository.url) {
        var m = /\bgithub.com\/([^\/]+)/.exec(pkg.repository.url);
        if (m) return m[1];
    }
    if (pkg.bugs && pkg.bugs.url) {
        var m = /\bgithub.com\/([^\/]+)/.exec(pkg.bugs.url);
        if (m) return m[1];
    }
    var m = /\bgithub.com\/([^\/]+)/.exec(JSON.stringify(pkg));
    if (m) return m[1];
}
