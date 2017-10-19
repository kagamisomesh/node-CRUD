var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
// for parsing application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));


var db;
var collection;
// Connect to the db
MongoClient.connect("mongodb://localhost:27017/student", function (err, database) {
  if (!err) {
    db = database;
    db.collection('studentdata', function (err, coll) {
      if (!err) {
        collection = coll;
      }
    })
    console.log("We are connected");
  }
});


app.listen(8000, function () {
  console.log('Listening on Port 8000');
});

//mongo CRUD code help
//https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html


//Executed on POST request at 'localhost:8000/student'
app.post('/student', function (req, res) {
  var data = {
    rollno: Number(req.body.rollno),
    name: req.body.name
  };
  collection.insert(data, { w: 1 }, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      console.log(result);
      res.send(result);
    }
  })
});

//Executed on GET request at 'localhost:8000/student'
app.get('/student', function (req, res) {
  var result = [];
  var stream = collection.find().stream();
  stream.on("data", function (item) {
    result.push(item);
  });
  stream.on("end", function () {
    res.send(result);
  });
});

//Executed on GET request at 'localhost:8000/student/{id}'
app.get('/student/:id', function (req, res) {
  var rollno = Number(req.params.id);
  collection.findOne({ "rollno" : { $eq: rollno } }, function (err, item) {
    if (err) {
      console.log(err);
      res.send('Not found');
    } else {
      res.send(item);
    }
  });
});

//Executed on PUT request at 'localhost:8000/student/{id}'
app.put('/student/:id', function (req, res) {
  var rollno = Number(req.params.id);
  var name = req.body.name;
  collection.update({"rollno":rollno}, {$set:{"name":name}}, {w:1}, function(err, result) {
    if (err) {
      console.log(err);
      res.send('Not found');
    } else {
      console.log("updated");
      res.send(result);
    }
  });
});

//Executed on DELETE request at 'localhost:8000/student/{id}'
app.delete('/student/:id', function(req, res){
  var rollno = Number(req.params.id);
  collection.remove({ rollno :rollno}, {w:1}, function(err, result) {
    if (err) {
      console.log(err);
      res.send('Not found');
    } else {
      console.log("Deleted");
      res.send(result);
    }
  });
});

//Executed on GET request at 'localhost:8000' or 'localhost:8000/'
app.get('/', function (req, res) {
	res.sendFile("/index.html");
});