#!/usr/bin/env node

var fs = require('fs');
var hdeps = require('../index.js');
var argv = require('optimist')
    .boolean(['modules','verbose'])
    .alias({ m: 'modules', v: 'verbose', s: 'socialism', b: 'budget' })
    .default({ socialism: 1.5 })
    .argv
;

if (argv.h || argv.help) {
    return fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout)
    ;
}

var table = require('text-table');
var root = argv.d || argv._[0] || process.cwd();

process.stdout.on('error', function () {}); // EPIPE

hdeps(root, function (err, hackers) {
    if (err) return console.error(err);
    
    if (argv.modules) {
        showModules(hackers)
    }
    else if (argv.budget) {
        showSpend(argv.budget, hackers);
    }
    else showPercents(hackers)
});

function showModules (hackers) {
    var modules = [];
    var total = 0;
    
    hackers.forEach(function (hacker) {
        Object.keys(hacker.packages).forEach(function (key) {
            var score = hacker.packages[key];
            modules.push({
                name: key,
                score: score,
                hacker: hacker
            });
            total += score;
        });
    });
    
    console.log(table(
        modules.sort(sorter).map(mapper),
        { align: [ 'l', '.', 'l' ] }
    ));
    function sorter (a, b) { return a.score < b.score ? 1 : -1 }
    function mapper (m) {
        var score = String(Math.floor(100 * m.score / total * 10) / 10);
        if (!/\.\d$/.test(score)) score += '.0';
        
        return [
            m.name,
            score + ' %',
            String(m.hacker.name)
            + (m.hacker.github ? ' (' + m.hacker.github + ')' : '')
        ];
    }
}

function showPercents (hackers) {
    hackers.forEach(function (hacker) {
        var percent = String(Math.floor(hacker.score * 100 * 10) / 10);
        if (!/\.\d$/.test(percent)) percent += '.0';
        percent = Array(6 - percent.length).join(' ') + percent;
        
        console.log(percent + '%    ' + hacker.name
            + (hacker.github ? ' (' + hacker.github + ')' : '')
        );
        if (argv.verbose) {
            var packages = [];
            var keys = Object.keys(hacker.packages);
            for (var i = 0; i < keys.length; i += 4) {
                packages.push(keys.slice(i, i + 4));
            }
            console.log('\n' + table(packages)
                .split('\n')
                .map(function (line) {
                    return '    ' + line;
                })
                .join('\n')
                + '\n'
            );
        }
    });
}

function showSpend (budget, hackers) {
    var lpad = Math.floor(Math.log(budget) / Math.log(10));
    var scores = {};
    var total = 0;
    var soc = argv.socialism || 0.01;
    
    hackers.forEach(function (hacker) {
        scores[hacker.name] = Math.pow(hacker.score, 1 / soc);
        total += scores[hacker.name];
    });
    
    hackers.forEach(function (hacker) {
        var x = scores[hacker.name] / total * 100 * budget;
        var amount = zpad(Math.floor(x) / 100, 2);
        
        console.log(
            Array(lpad - amount.length + 5).join(' ')
            + amount + '    ' + hacker.name
            + (hacker.github ? ' (' + hacker.github + ')' : '')
        );
    });
}

function zpad (x, n) {
    var s = String(x);
    var r = s.split('.')[1] || '';
    if (!r) s += '.';
    for (var i = r.length; i < n; i++) s += '0';
    return s;
}
