'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);

if (process.argv.length > 2) {
  var cmd = path.basename(process.argv[2]);

  switch (cmd) {
    case ('read'):
      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        };
        var pets = JSON.parse(data);

        console.log(pets);
      });
      break;

    case ('create'):
      //create actions
      break;

    case ('update'):
      //update actions
      break;

    case ('destroy'):
      //destroy actions
      break;

    default:
      //default actions
      break;
  };

} else {
  console.log('Usage: ${node} ${file} [read | create | update | destroy]');
  process.exit(1);
};
