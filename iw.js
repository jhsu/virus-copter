var spawn = require('child_process').spawn;

exports.scan = function (iface, cb) {
    var ps = spawn('iwlist', [ iface, 'scan' ]);
    
    var line = '';
    ps.stdout.on('data', function ondata (buf) {
        for (var i = 0; i < buf.length; i++) {
            if (buf[i] === 10) {
                parseLine(line);
                line = '';
            }
            else line += String.fromCharCode(buf[i]);
        }
    });
    
    var stderr = '';
    ps.stderr.on('data', function (buf) { stderr += buf });
    
    ps.on('close', function () {
        if (code !== 0) cb('code = ' + code + '\n', stderr);
        else cb(null, ap);
    });
    
    var code;
    ps.on('exit', function (c) {
        code = c;
    });
    
    var ap = []
    var current = null;
    function parseLine (line) {
        var m;
        
        if (m = /^\s+Cell \d+ - Address: (\S+)/.exec(line)) {
            current = { address : m[1] };
            ap.push(current);
            return;
        }
        if (!current) return;
        
        if (m = /^\s+ESSID:"(.+)"/.exec(line)) {
            current.essid = m[1];
        }
    }
}
