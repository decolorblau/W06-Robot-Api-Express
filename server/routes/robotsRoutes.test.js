require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug");
const chalk = require("chalk");
const supertest = require("supertest");
const { app, initializeServer } = require("../index");
const connectDB = require("../../database/index");
const Robot = require("../../database/models/robot");

const request = supertest(app);

let server;
let token;
beforeAll(async () => {
  await connectDB(process.env.MONGODB_ROBOTS_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  debug(chalk.greenBright("Abriendo servidor port"));
});

beforeEach(async () => {
  const { body } = await request
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

/* afterEach(async () => {
  await Robot.deleteMany({});
}); */

afterAll((done) => {
  // done es una funcion de jest que es para decir que ya esta todo hecho
  server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

describe("Given a /robots router", () => {
  describe("When a Get request to /robots/ arrives", () => {
    test.only("Then it should respond with an array of pets and a 200 status", async () => {
      debug("inside inside test");
      const { body } = await request
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
      const { body } = await request
        .get("/robots/61892170a699cfe754044fec")
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
      const { body } = await request
        .get("/robots/61892170a699cfe754044eec")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const expectedRobot = {
        _id: "61892170a699cfe754044eec",
        __v: 0,
        name: "R2-D2",
        imageUrl: "fondo-r2d2.jpg",
        features: { speed: 6, resistance: 8, yearCreation: "1968" },
      };

      expect(body).toEqual(expectedRobot);
    });
  });
  describe("When a POST request to /robots/create with a robot", () => {
    test("Then it should respond with the new robot and a status 201", async () => {
      const { body } = await request
        .post("/robots/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test-robot",
          imageUrl: "fondo-robot.jpg",
          features: { speed: 7, resistance: 9, yearCreation: "2021" },
        })
        .expect(201);

      expect(body).toHaveProperty("name", "test-robot");
      expect(body).toHaveProperty("imageUrl", "fondo-robot.jpg");
    });
  });
  describe("When a POST request to /robots/create with a empty object", () => {
    test("Then it should respond with with a 404 error", async () => {
      const { body } = await request
        .post("/robots/create")
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400);

      const expectedError = {
        error: "Ouch! This is not a robot!",
      };

      expect(body).toEqual(expectedError);
    });
  });
});
