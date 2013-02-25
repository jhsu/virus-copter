var ar = require('ar-drone');
var client = ar.createClient();

// var time = require('./decidedTime');

doSomething();

function doSomething() {
  client
    .after(1000, function() {
      client.animateLeds('blinkRed', 5, 2);
    });
}

function amok() {
  // now = new Date();
  // while(now < time.decidedTime) {
  //   blink();
  //   now = Date();
  // }
  doSomething();
}  
