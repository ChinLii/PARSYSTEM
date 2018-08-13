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
    it("It will render the load parsystem page on this id : 5b6a2a47b0fc2421e4d47676",function(done){
        api.get("/load/parsystem/5b6a2a47b0fc2421e4d47676")
        .expect(200)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    });

 })

