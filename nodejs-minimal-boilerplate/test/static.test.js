import request from "supertest";
import app from "../server/app";

describe("Test the root path", () => {
  test("It should serve html content on /", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    //expect(response.header["content-type"]).toBe("text/html; charset=utf-8");
  });
  test("It should serve home.css file", async () => {
    const response = await request(app).get("/static/home.css");
    expect(response.statusCode).toBe(200);
  });
  test("It should serve login.css file", async () => {
    const response = await request(app).get("/static/login.css");
    expect(response.statusCode).toBe(200);
  });
  test("It should serve signup.css file", async () => {
    const response = await request(app).get("/static/signup.css");
    expect(response.statusCode).toBe(200);
  });
});
