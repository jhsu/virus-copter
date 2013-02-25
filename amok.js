var ar = require('ar-drone');
var client = ar.createClient();

// var time = require('./decidedTime');

doSomething();

function doSomething() {
  client.takeoff();
  client
    .after(8000, function() {
      client.land();
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
