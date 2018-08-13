process.env.NODE_ENV = 'test';

var History = require('../app/models/history')
let mongoose = require("mongoose");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let apiRouter = require('../app/routers/htmlRouter');
let server = require('../index');
var supertest = require('supertest');
var api = supertest('http://localhost:3000');

global.expect = chai.expect;
global.should = chai.should();

chai.use(chaiHttp);

 /*
  * Test the API request
  */
 describe('/POST API METHOD', ()=> {
    it("It will create a new history",function(done){
        api.post("/api/save")
        .send({  
            "activitiesList":  "Standing,Standing,Standing,Standing",
            "timestamp":"1200000000200,1200000000200,1200000000200,1200000000200",
            "xAxis": "0.08283484688138983,0.08283484688138983,0.08283484688138983,0.08283484688138983",
            "yAxis":"1.7820365526511324,1.7820365526511324,1.7820365526511324,1.7820365526511324,1.7820365526511324",
            "zAxis":"-0.6047672794785012,-0.6047672794785012,-0.6047672794785012,-0.6047672794785012,-0.6047672794785012",
            "_id":"5b71f2cd31e6cf257450450d",
            "name":"AutoTest",
         })
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })
    it("It will change the name of the history by ID ",function(done){
        api.post('/api/updateName')
        .send({
            "id" : "5b71f2cd31e6cf257450450d",
            "name" : "AutoTestChanged",
        })
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })
})

/*
  * Test the HTML PAGES
  */
 describe('/TEST HTML PAGES', ()=> {
    it("It will render the home page",function(done){
        api.get("/")
        .expect(200)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    });
    it("It will render the contact page",function(done){
       api.get("/contact")
       .expect(200)
       .end(function(err,res){
           res.should.have.status(200);
           done();
       })
   });
   it("It will render the history page",function(done){
       api.get("/history")
       .expect(200)
       .end(function(err,res){
           res.should.have.status(200);
           done();
       })
   });
   it("It will render the system page",function(done){
       api.get("/system")
       .expect(200)
       .end(function(err,res){
           res.should.have.status(200);
           done();
       })
   });
   it("It will render the load parsystem page on this id : 5b71f2cd31e6cf257450450d",function(done){
       api.get("/load/parsystem/5b71f2cd31e6cf257450450d")
       .expect(200)
       .end(function(err,res){
           res.should.have.status(200);
           done();
       })
   });

})
/*
  * Test the Delete History
  */
describe('/DELETE API METHOD', ()=> {
    it("It will delete the history by ID ",function(done){
        api.post("/api/deleteHistory")
        .send({
            "id" : "5b71f2cd31e6cf257450450d"
        })
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    });
})