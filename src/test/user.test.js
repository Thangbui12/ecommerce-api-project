// process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";

import User from "../models/user.model";
import app from "../app";

const should = chai.should();

chai.use(chaiHttp);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmQxNWEyMDZlZDUyMzFkNGIzYWIyNyIsInVzZXJuYW1lIjoidXNlcnRlc3QxIiwiZW1haWwiOiJ1c2VydGVyc3QxQGdtYWlsLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzNDYyNTUwNSwiZXhwIjoxNjM3MjE3NTA1fQ.UJILbS0iwBnmFdFen5WWb_FBU_JiJ32wrKoCAB2Av-k";

describe("Users", () => {
  beforeEach((done) => {
    // User.remove({}, (err) => {
    //   done();
    // });
    done();
  });

  // Test get all users
  describe("/GET users", () => {
    it("it should GET ALL users", (done) => {
      chai
        .request(app)
        .get("/api/users")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.an("array");
          done();
        });
    });
  });

  //Test Login
  describe("/POST login", () => {
    it("it should POST login user", (done) => {
      let user = {
        username: "username1",
        password: "password123",
      };

      chai
        .request(app)
        .post("/api/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Login success!");
          res.body.should.have.property("data");
          done();
        });
    });
  });

  // Test Post one users
  describe("/POST register", () => {
    it("it should not POST a user without email field", (done) => {
      let user = {
        username: "usertest12",
        password: "password123",
      };

      chai
        .request(app)
        .post("/api/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.data.should.be.a("object");
          res.body.should.have.property("message").eql("Email is required");
          done();
        });
    });

    it("it should POST a user", (done) => {
      let user = {
        username: "usertest12",
        password: "password123",
        email: "thangbui12@gmail.com",
      };

      chai
        .request(app)
        .post("/api/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Created User success!");
          res.body.data.should.have.property("_id");
          res.body.data.should.have.property("username").eql(user.username);
          res.body.data.should.have.property("email").eql(user.email);
          done();
        });
    });
  });

  // Test get user by Id
  describe("/GET/:slug user", () => {
    it("it should GET a user by slug", (done) => {
      let slug = "usertest12";

      chai
        .request(app)
        .get("/api/users/" + slug)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("object");
          res.body.should.have.property("data");
          res.body.data.should.have.property("_id");
          res.body.data.should.have.property("email");
          res.body.data.should.have.property("username");
          res.body.data.should.have.property("isAdmin");
          res.body.data.should.have.property("isActive");
          res.body.data.should.have.property("isVerify");
          done();
        });
    });
  });

  // Test delete User
  describe("/DELETE/:slug", () => {
    it("it should DELETE a user by slug", (done) => {
      let slug = "usertest12";

      chai
        .request(app)
        .delete("/api/users/" + slug)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          // console.log(res);
          // res.body.data.should.be.a("object");
          res.body.should.have.property("message").eql("Deleted user success!");
          done();
        });
    });
  });
});
