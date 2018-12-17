var express = require('express');
var app = express();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("app", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

var data = {
  heartrate:0,
  peak:0,
  time:0,
  latitude:0,
  longitude:0,
  username:""
}
function createdata(hr,pk,lat,lon,user){
  data.heartrate=hr;
  data.peak=pk;
  data.time=Date.now();
  data.latitude=lat;
  data.longitude=lon;
  data.username=user;
}
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'API-REST',
  streams: [
    {
      level: 'info',
      path: './apirest-error.log'
    }
  ]
});


//read and query
app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'applicaton/json')
  var output={
               "status": "OK",
               "ejemplo": { "ruta": "/data",
                            "valor": { "PositionS stored ": size }
                          }
              }
  log.info(output);
  res.send(output);
});

//read and query
app.get('/data', function (req, res) {
  res.setHeader('Content-Type', 'applicaton/json')

  MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var mysort = { time: 1 };
    dbo.collection("app").find().sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      log.info(JSON.stringify(result));
      res.send(JSON.stringify(result));
      db.close();
    });
  });

});

//create
app.post('/data/:hr/:pk/:lat/:lng/:user', function(req,res){
  res.setHeader('Content-Type', 'applicaton/json')

  createdata(req.params.hr,req.params.pk,req.params.lat,req.params.lng,req.params.user);

  log.info("Created new position: "+JSON.stringify(data));
  MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");


    dbo.collection("app").insertOne(data, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });

  res.send("Created new position: "+JSON.stringify(data));

});
//edit
app.put('/data/:hr/:pk/:lat/:lng/:user',function(req, res){

  res.setHeader('Content-Type', 'applicaton/json');
  createdata(req.params.hr,req.params.pk,req.params.lat,req.params.lng,req.params.user);
  MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { latitude: req.params.lat, longitude: req.params.lng, username: req.params.user };
    var newvalues = { $set: data };
    dbo.collection("app").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
  log.info("Modified value: "+JSON.stringify(data));
  res.send("Modified value: "+JSON.stringify(data));

});
//delete
app.delete('/data/:lat/:lng/:user',function(req,res){

  res.setHeader('Content-Type', 'applicaton/json')

  MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { latitude: req.params.lat, longitude: req.params.lng, username: req.params.user };
    dbo.collection("app").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      log.info("Value deleted: "+JSON.stringify(obj));
      res.send("Value deleted: "+JSON.stringify(obj));
      db.close();
    });

  });

});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
