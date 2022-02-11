const fs = require('fs');
const express = require('express');

let app = require('express')();
let http = require('http').Server(app);
let bodyParser = require('body-parser');

let port = process.env.PORT || 3000;
let io = require('socket.io')(http);

const Database = require("@replit/database");
const db = new Database();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let residents_online = 0;

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
  
  residents_online = residents_online + 1;

  socket.on('disconnect', function() {
    console.log('User disconnected.');
    
    residents_online = residents_online - 1;
  });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('', function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

app.get('/online', function (req, res) {
  res.send(String(residents_online));
});

app.get('/cgi-bin/read.pl', function(req, res) {
  fs.readFile(__dirname + '/public/webmaster/read.txt', 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    }

    else { 
      db.get(data).then(value => {
        if (value === null || value === undefined || value === "404") {
          res.send("<h1>404</h1>");
        }

        else {
          res.send(value);
        }
      });
    }
  });
});

let handle_limit = "";

setInterval(function () {
  handle_limit = "";
}, 1000);

app.post('/cgi-bin/action.pl', function (req, res) {
  const datastream = req.body.data;
  const clean_stream = datastream.replace(/(<([^>]+)>)/ig, "");

  if (clean_stream.includes("/?|")) {
    console.log("PASSED");
  }

  else {
    res.send("err");
    return false;
  }

  let temp_handle_1 = clean_stream.split("/?|");
  let temp_handle = temp_handle_1[0];

  if (handle_limit === temp_handle) {
    res.send("limit");
    return false;
  }

  else {
    console.log("PASSED");
  }

  if (datastream === null || datastream === undefined || datastream === "") {
    res.send("no_data");
  }

  else {
    default_write += clean_stream;
  }
});

let write_default = "";
let default_write = "";

setInterval(function () {
  fs.readFile(__dirname + "/public/webmaster/write.txt", "utf8", function (err, data) {
    if (err) {
      console.log(err);
    }

    else {
      if (data === default_write) {
        // Do nothing
      }

      else { 
        default_write = data;
      }

      db.set(data, write_default).then(() => {
        // Do nothing
      });
    }
  });
}, 1000);

http.listen(port, function(){
  console.log('listening on *:' + port);
});