import supertest from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
import { createRandomUser } from "../helpers/user_helper";

//Configuration
dotenv.config();

//Request
const request = supertest("https://gorest.co.in/public/v2/");
const token = process.env.USER_TOKEN;

//Mocha test case
describe("/users route", () => {
  let userId = null;

  it("GET /users", async () => {
    const res = await request.get("users");
    //console.log("body", res.body);
    expect(res.status).to.equal(200);
    expect(res.body).to.not.be.empty;
  });

  it("GET /users | query parameters", async () => {
    const url = `users?access-token=${token}&gender=female&status=inactive`;
    const res = await request.get(url);
    res.body.forEach((user) => {
      expect(user.gender).to.eq("female");
      expect(user.status).to.eq("inactive");
    });
  });

  it("POST /users | Create a new user", async () => {
    const data = createRandomUser();
    const res = await request
      .post("users")
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    //console.log(res.body);
    userId = res.body.id;
    
    //console.log("userID in post", userId)
    expect(res.status).to.eq(201);
    expect(res.body.id).to.eq(userId);
    
  });
  it('GET /users/: id | User we just created', async () => {
    const res = await request.get(`users/${userId}?access-token=${token}`);
    expect(res.body.id).to.eq(userId);
   }); 

  it("PUT /users/:id | Change the user", async () => {
    const data = {
      name: "User updated"
    };
    //console.log("userID", userId)
    const res = await request
      .put(`users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    expect(res.body.name).to.equal('User updated');
    expect(res.body).to.include(data);
    //console.log(res.body.name);
  });

  it("DELETE /users/:id | User we just created", async () => {
    const res = await request
      .delete(`users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.eq(204);
  });

  it("GET /users/:id (Negative)", async () => {
    const res = await request.get(`users/${userId}`);
    expect(res.body.message).to.eq("Resource not found");
  });
  it("DELETE /users/:id (Negative)", async () => {
    const res = await request
      .delete(`users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.message).to.equal("Resource not found");
  });
});
