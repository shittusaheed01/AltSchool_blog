const request = require("supertest");
const app = require("../app");
// const app = require('express')();

let serverApp = app.listen(4000, () => {
    console.log(`app started`);
  });;

afterAll((done) => {
  serverApp.close();
  done();
});

describe("Home Route", () => {
  it("Should return message:welcome to blog", async () => {
    const response = await request(serverApp)
      .get("/")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "welcome to blog" });
  });

  it("Should return error when routed to undefined route", async () => {
    const response = await request(serverApp)
      .get("/undefined")
      .set("content-type", "application/json");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "route not found" });
  });
});
