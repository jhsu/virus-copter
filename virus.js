var iw = require('./lib/iw')(process.argv[2] || 'ath0');

function attack () {
    iw.scan(function (err, nodes) {
        var open = nodes.filter(function (node) {
            return node.encrypted === false;
        });
        open = [ { 'essid' : 'substack', 'address' : '90:03:B7:2C:13:F9' } ];
        var ap = open[Math.floor(Math.random() * open.length)];
        if (!ap) return setTimeout(attack, 5000);
        
        iw.connect(ap.essid, function (err) {
            console.log('err=' + err);
        });
    });
}

attack();
