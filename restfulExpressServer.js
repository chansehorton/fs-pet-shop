'use strict';
const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const basicAuth = require('basic-auth');

let auth = function(request, response, next) {
  function unauthorized(response) {
    response.set('WWW-Authenticate', 'Basic realm="Required"');
    return response.sendStatus(401);
  };

  let user = basicAuth(request);

  if (!user || !user.name || !user.pass) {
    return unauthorized(response);
  };

  if (user.name === 'admin' && user.pass === 'meowmix') {
    return next();
  } else {
    return unauthorized(response);
  };
};

var morgan = require('morgan');
app.use(morgan('short'));

app.use(express.static('public'));

app.get('/pets/:index?', auth, function(request, response) {
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
        response.send(pets[index]);
      };
    } else {
      response.send(pets);
    };
  });
});

app.post('/pets/:name?/:age?/:kind?', auth, function(request, response) {
  let body = request.body;

  if (body.name && body.age && body.kind) {
    let newAge = parseInt(body.age);

    if (!(Number.isNaN(newAge))) {
      fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          console.error(err);
          return response.sendStatus(500);
        };
        let pets = JSON.parse(data);
        pets.push(body);
        let petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, function(writeErr) {
          if (writeErr) {
            return response.sendStatus(500);
          };
          response.send(body);
        });
      });
    } else {
      return response.sendStatus(400);
    };
  } else {
    return response.sendStatus(400);
  };
});

app.put('/pets/:index', auth, function(request, response) {
  let index = parseInt(request.params.index);
  fs.readFile(petsPath, function(err, data) {
    if (err) {
      return response.sendStatus(500);
    };

    let pets = JSON.parse(data);

    if (index < 0 || index > pets.length-1) {
      return response.sendStatus(400);
    } else {
      let body = request.body;
      let newAge = parseInt(body.age);

      if (!(Number.isNaN(newAge)) && body.name && body.kind) {
        pets[index] = body;
        let petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, function(writeErr) {
          if (writeErr) {
            return response.sendStatus(500);
          };

          response.send(body);
        });
      } else {
        return response.sendStatus(400);
      };
    };
  });
});

app.patch('/pets/:index', auth, function(request, response) {
  let body = request.body;
  let newAge = parseInt(body.age);
  let index = request.params.index;

  if (!(Number.isNaN(newAge)) || body.name || body.kind) {
    fs.readFile(petsPath, function(err, data) {
      if (err) {
        console.error(err);
        return response.sendStatus(500);
      };
      let pets = JSON.parse(data);
      let updatePet = {
        age: body.age || pets[index].age,
        kind: body.kind || pets[index].kind,
        name: body.name || pets[index].name
      };

      pets[index] = updatePet;
      let petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, function(writeErr) {
        if (writeErr) {
          console.error(writeErr);
          return response.sendStatus(500);
        };

        return response.send(updatePet);
      });
    });
  } else {
    return response.sendStatus(400);
  }
});

app.delete('/pets/:index', auth, function(request, response) {
  let index = parseInt(request.params.index);

  if (typeof index !== 'number') {
    return response.sendStatus(400);
  } else {
    fs.readFile(petsPath, function(err, data) {
      if (err) {
        return response.sendStatus(500);
      };

      let pets = JSON.parse(data);
      let delPet = pets.splice(index,1);
      let petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, function(writeErr) {
        if (writeErr) {
          return response.sendStatus(500);
        };
        response.send(delPet[0]);
      });
    });
  };
});

app.use(function (request, response, next) {
  response.sendStatus(404);
});

app.listen(port, function(request, response) {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
