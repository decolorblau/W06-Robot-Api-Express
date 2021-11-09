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
beforeAll(async () => {
  await connectDB(process.env.MONGODB_ROBOTS_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  debug(chalk.greenBright("Abriendo servidor port"));
});

beforeEach(async () => {
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

afterAll(async () => {
  await mongoose.connection.close();
  await server.close(process.env.SERVER_PORT_TEST);
  debug(chalk.redBright("Cerrando servidor port"));
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
  describe("When a GET request to /robots/:idRobots with a wrong id", () => {
    test("Then it should respond with a 404 error", async () => {
      const { body } = await request(app)
        .get("/robots/2")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      const expectedError = {
        error: "Robot not found",
      };

      expect(body).toEqual(expectedError);
    });
  });
  describe("When a GET request to /robots/:idRobots with a existing id", () => {
    test("Then it should respond with a robot and 200 status", async () => {
      const { body } = await request(app)
        .get("/robots/61892170a699cfe754044eec")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const robot1 = {
        _id: "61892170a699cfe754044eec",
        __v: 0,
        name: "R2-D2",
        imageUrl: "fondo-r2d2.jpg",
        features: { speed: 6, resistance: 8, yearCreation: "1968" },
      };

      expect(body).toEqual(robot1);
    });
  });
});
