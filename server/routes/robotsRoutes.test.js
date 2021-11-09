require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug");
const chalk = require("chalk");
const request = require("supertest");
const { app, initializeServer } = require("../index");
const connectDB = require("../../database/index");
const Robot = require("../../database/models/robot");

let server;
let token;

beforeEach(async () => {
  await connectDB(process.env.MONGODB_ROBOTS_TEST);
  server = await initializeServer(3001);

  const { body } = await request(app)
    .post("/users/login")
    .send({
      userName: "Test",
      password: "primeraPatata",
    })
    .expect(200);
  debug(chalk.blue("Abemus token!", body.token));
  token = body.token;

  await Robot.deleteMany({});
  await Robot.create({
    _id: "61892170a699cfe754044eec",
    name: "R2-D2",
    imageUrl: "fondo-r2d2.jpg",
    features: { speed: 6, resistance: 8, yearCreation: "1968" },
  });
  await Robot.create({
    _id: "61885c91ba9f983acdd7084a",
    name: "Walle-E",
    imageUrl: "Wall-E-e1482778626858.jpg",
    features: { speed: 7, resistance: 8, yearCreation: "2008" },
  });
});

afterEach(async () => {
  await mongoose.connection.close();
  await server.close();
});

describe("Given a /robots router", () => {
  describe("When a Get request to /robots/ arrives", () => {
    test("Then it should respond with an array of pets and a 200 status", async () => {
      debug("inside inside test");
      const { body } = await request(app)
        .get("/robots/")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const robot1 = {
        _id: "61892170a699cfe754044eec",
        __v: 0,
        name: "R2-D2",
        imageUrl: "fondo-r2d2.jpg",
        features: { speed: 6, resistance: 8, yearCreation: "1968" },
      };
      const robot2 = {
        _id: "61885c91ba9f983acdd7084a",
        __v: 0,
        name: "Walle-E",
        imageUrl: "Wall-E-e1482778626858.jpg",
        features: { speed: 7, resistance: 8, yearCreation: "2008" },
      };

      expect(body).toHaveLength(2);
      expect(body).toContainEqual(robot1);
      expect(body).toContainEqual(robot2);
    });
  });
});
