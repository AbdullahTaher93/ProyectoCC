var express = require('express');
var app = express();
var {data,storage,size,storeData,editData,deleteData}=require("./classes.js");

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
  log.info(JSON.stringify(storage));
  res.send(JSON.stringify(storage));
});

//create
app.post('/data/:hr/:pk/:lat/:lng/:user', function(req,res){
  res.setHeader('Content-Type', 'applicaton/json')
  storeData(req.params.hr,req.params.pk,req.params.lat,req.params.lng,req.params.user);
  log.info("Created new position: "+JSON.stringify(storage[size-1]));
  res.send("Created new position: "+JSON.stringify(storage[size-1]));

});
//edit
app.put('/data/:i/:hr/:pk/:lat/:lng/:user',function(req, res){

  editData(req.params.i,req.params.hr,req.params.pk,req.params.lat,req.params.lng,req.params.user);
  res.setHeader('Content-Type', 'applicaton/json');
  log.info("Modified value: "+JSON.stringify(storage[req.params.i]));
  res.send("Modified value: "+JSON.stringify(storage[req.params.i]));

});
//delete
app.delete('/data/:i',function(req,res){

  output=deleteData(req.params.i)
  res.setHeader('Content-Type', 'applicaton/json')
  log.info("Value deleted: "+JSON.stringify(output));
  res.send("Value deleted: "+JSON.stringify(output));
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
