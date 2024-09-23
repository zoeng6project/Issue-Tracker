const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite("Routing Test", function(){
        suite("Post", function(){
            test("post request (every field)" , function(done){
                chai
                    .request(server)
                    .post("/api/issues/projects")
                    .set("content-type", "application/json")
                    .send({
                        issue_title: "Issue1",
                        issue_text: "Functional Test",
                        created_by: "Zoe",
                        assigned_to: "John",
                        status_text: "under review",
                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.issue_title,"Issue1");
                        assert.equal(res.body.issue_text, "Functional Test");
                        assert.equal(res.body.created_by,"Zoe");
                        assert.equal(res.body.assigned_to, "John");
                        assert.equal(res.body.status_text, "under review");
                        done();
                    })
            })

            test("post request (only required field)" , function(done){
                chai
                    .request(server)
                    .post("/api/issues/projects")
                    .set("content-type", "application/json")
                    .send({
                        issue_title: "Issue1",
                        issue_text: "Functional Test",
                        created_by: "Zoe",
                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.issue_title,"Issue1");
                        assert.equal(res.body.issue_text, "Functional Test");
                        assert.equal(res.body.created_by,"Zoe");
                        assert.equal(res.body.assigned_to, "");
                        assert.equal(res.body.status_text, "");
                        done();
                    })
            })

            test("post request (missing required field)" , function(done){
                chai
                    .request(server)
                    .post("/api/issues/projects")
                    .set("content-type", "application/json")
                    .send({
                        issue_title: "Issue1",
                        issue_text: "Functional Test",
                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error,'required field(s) missing' );

                        done();
                    })
            })
            
        })

        suite("GET" , function(){
            test("get request" , function(done){
                chai
                    .request(server)
                    .get("/api/issues/apitest")
                    .end(function(err,res){
                        assert.equal(res.status, 200);

                        done();
                    })
            })

            test("get request with one filter" , function(done){
                chai
                    .request(server)
                    .get("/api/issues/apitest?open=true")
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body[0].issue_title,"Issue1Test");
                        assert.equal(res.body[0].issue_text, "this is issue 1");
                        assert.equal(res.body[0].created_by,"zoe");
                        assert.equal(res.body[0].assigned_to, "jenny");
                        assert.equal(res.body[0].status_text, "review");
                        assert.equal(res.body[0].open, true);
                        done();
                    })
            })

            test("get request with two filter" , function(done){
                chai
                    .request(server)
                    .get("/api/issues/apitest?open=true&assigned_to=jenny")
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body[0].issue_title,"Issue1Test");
                        assert.equal(res.body[0].issue_text, "this is issue 1");
                        assert.equal(res.body[0].created_by,"zoe");
                        assert.equal(res.body[0].assigned_to, "jenny");
                        assert.equal(res.body[0].status_text, "review");
                        assert.equal(res.body[0].open, true);
                        done();

                    })
            })

        })

        suite("Put" , function (){
            test("update one field", function(done){
                chai
                    .request(server)
                    .put("/api/issues/apitest")
                    .send({
                        _id:"66f0b704ac56aed1e57973ae",
                        issue_title: "Issue1Modify1",

                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, "successfully updated")
                        assert.equal(res.body._id, "66f0b704ac56aed1e57973ae")

                        done();
                    })
            })

            test("update two field", function(done){
                chai
                    .request(server)
                    .put("/api/issues/apitest")
                    .send({
                        _id:"66f0b704ac56aed1e57973ae",
                        issue_title: "Issue1Modify2",
                        issue_text: "Issue1Modify title and text",

                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, "successfully updated")
                        assert.equal(res.body._id, "66f0b704ac56aed1e57973ae")


                        done();
                    })
            })

            test("missing _id", function(done){
                chai
                    .request(server)
                    .put("/api/issues/apitest")
                    .send({
                        _id:"",
                        issue_title: "Issue1Modify2"

                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "missing _id")

                        done();
                    })
            })


            test("missing fields", function(done){
                chai
                    .request(server)
                    .put("/api/issues/apitest")
                    .send({
                        _id:"66f0b704ac56aed1e57973ae",
                        issue_title: "",
                        issue_text : "",
                        created_by: "",
                        assigned_to : "",
                        status_text: "",
                        open: ""
                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "no update field(s) sent")

                        done();
                    })
            })


            test("invalid _id", function(done){
                chai
                    .request(server)
                    .put("/api/issues/apitest")
                    .send({
                        _id:"0b704ac56aed1e579",
                        issue_title: "Issue1Modify2",
                        issue_title: "test"

                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "could not update")

                        done();
                    })
            })

        } )


        suite("Delete" , function(){
            test("delete issue" , function(done){
                chai
                    .request(server)
                    .delete("/api/issues/apitest")
                    .send({
                        _id:"66f0b5039869e1e056aca5d4"

                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, "successfully deleted")

                        done();
                    })
            })

            test("invalid _id" , function(done){
                chai
                    .request(server)
                    .delete("/api/issues/apitest")
                    .send({
                        _id:"66f0b502986a5d1_invalid"

                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "could not delete")

                        done();
                    })
            })


            test("missing _id" , function(done){
                chai
                    .request(server)
                    .delete("/api/issues/apitest")
                    .send({
                        _id:""

                    })
                    .end(function(err,res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "missing _id")

                        done();
                    })
            })
        })
    })
  
});
