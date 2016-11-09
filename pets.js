#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);

if (process.argv.length > 2) {
  var cmd = path.basename(process.argv[2]);

  switch (cmd) {
    case ('read'):
      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        };
        let pets = JSON.parse(data);

        if (process.argv.length > 3) {
          let index = path.basename(process.argv[3]);

          if (index < 0 || index > (pets.length - 1)) {
            console.error(`Usage: ${node} ${file} read INDEX`);
            process.exit(1);
          } else {
            console.log(pets[index]);
          }
        } else {
          console.log(pets);
        };
      });
      break;

    case ('create'):
      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        };
        let pets = JSON.parse(data);

        if (process.argv.length === 6) {
          let newAge = parseInt(path.basename(process.argv[3]));
          if (typeof newAge === 'number') {
            let newKind = path.basename(process.argv[4]);
            let newName = path.basename(process.argv[5]);
            let newPet = {
              age: newAge,
              kind: newKind,
              name: newName
            };
            pets.push(newPet);
            let petsJSON = JSON.stringify(pets);

            fs.writeFile(petsPath, petsJSON, function(writeErr) {
             if (writeErr) {
               throw writeErr;
             }

             console.log(newPet);
           });
          } else {
            console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
            process.exit(1);
          };
        } else {
          console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
          process.exit(1);
        };
      });
      break;

    case ('update'):
      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        };

        let pets = JSON.parse(data);
        if (process.argv.length === 7) {
          let index = parseInt(path.basename(process.argv[3]));

          if (index >= 0 && index <= (pets.length-1)) {
            let newAge = parseInt(path.basename(process.argv[4]));
            let newKind = path.basename(process.argv[5]);
            let newName = path.basename(process.argv[6]);
            pets[index] = {
              age: newAge,
              kind: newKind,
              name: newName
            };

            let petsJSON = JSON.stringify(pets);

            fs.writeFile(petsPath, petsJSON, function(writeErr) {
             if (writeErr) {
               throw writeErr;
             }

             console.log(pets[index]);
           });
          } else {
            console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
            process.exit(1);
          };
        } else {
          console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
          process.exit(1);
        };
      });
      break;

    case ('destroy'):
      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        };
        let pets = JSON.parse(data);

        if (process.argv.length === 4) {
          let index = parseInt(path.basename(process.argv[3]));
          if (typeof index === 'number') {

            let removedPet = pets.splice(index,1);
            let petsJSON = JSON.stringify(pets);

            fs.writeFile(petsPath, petsJSON, function(writeErr) {
             if (writeErr) {
               throw writeErr;
             }

             console.log(removedPet[0]);
           });
          } else {
            console.error(`Usage: ${node} ${file} destroy INDEX`);
            process.exit(1);
          };
        } else {
          console.error(`Usage: ${node} ${file} destroy INDEX`);
          process.exit(1);
        };
      });
      break;

    default:
      console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
      process.exit(1);
      break;
  };

} else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
};
