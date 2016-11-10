'use strict';

const express = require('express');
const app = express();
const port = 8000;

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

app.use(express.static('public'));

app.get('/pets/:index?', function(request, response) {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      return response.sendStatus(500);
    };
    let pets = JSON.parse(data);
    if (request.params.index) {
      let index = parseInt(request.params.index);
      console.log(index);
      if (index < 0 || index > pets.length-1) {
        return response.sendStatus(404);
      } else {
        response.send(JSON.stringify(pets[index]));
      };
    } else {
      response.send(JSON.stringify(pets));
    };
  });
});

app.listen(port, function(request, response) {
  console.log(`Listening on port ${port}`);
});
