const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const Developer = require("../src/models/developer");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Authentication Middleware", () => {
  describe("developerAuth", () => {
    it("should load documents for authenticated user", async () => {
      const developer = new Developer({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456789",
        userType: "developer",
      });
      await developer.save();

      const token = developer.generateAuthToken();
      const res = await chai
        .request(app)
        .get("/loadHome")
        .set("Cookie", `access_token=${token}`)
        .send();

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });

    it("should return 401 error for unauthorized access", async () => {
      const res = await chai.request(app).get("/developer/loadHome").send();

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").eq("please authenticate");
    });
  });
});
