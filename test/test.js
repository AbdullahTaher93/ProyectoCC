var request = require('supertest');
app=require("../app.js");
var {data,storeData,editData,deleteData}=require("../classes.js");
assert = require('assert');
//API REST test

describe( "API REST", function() {
  it('main get, respond OK', function (done) {
  request(app)
    .get('/')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    done();
  });

  it('get to /data', function(done){
    request(app)
      .get('/data')
      .expect('Content-Type','application/json; charset=utf-8')
      .expect(200)
      done();
  });

  it('post to /data', function(done){
    request(app)
      .post('/data/78/83/37.23443/-3.74343/:Antonio')
      .expect('Content-Type','application/json; charset=utf-8')
      .expect(200)
      .expect(function(err,result){
      			assert.equal(result.body.size, 1);
      });
      done();
  });

  it('Put to /data', function(done){
    request(app)
      .put('/data/1/78/83/37.23443/-3.74343/:Antonio')
      .expect('Content-Type','application/json; charset=utf-8')
      .expect(200)
      .expect(function(err,result){
      			assert.equal(result.body.size, 1);
      });
      done();
  });

  it('Delete to /data', function(done){
    request(app)
      .delete('/data/0')
      .expect('Content-Type','application/json; charset=utf-8')
      .expect(200)
      .expect(function(err,result){
      			assert.equal(result.body.size, 0);
      });
      done();
  });
});

//object test
describe( "OBJECT TEST", function() {
  it('Add new position', function(done){
      storeData(78,83,37.23443,-3.7434,"Antonio");
      assert.equal(size,1);
      done();
  });

  it('edit data previously stored', function(done){
      var i = 0;
      assert(i<size);
      editData(i,78,83,37.23443,-3.7434,"Pedro");
      assert.equal(size,1);
      done();
  });

  it('delete data previously stored', function(done){
      var i = 0;
      assert(i<size);
      deleteData(i);
      assert.equal(size,0);
      done();
  });

});
