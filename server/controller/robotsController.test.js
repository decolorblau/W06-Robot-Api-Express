const Robot = require("../../database/models/robot");
const { getRobots, getRobotById, createRobot } = require("./robotsController");

jest.mock("../../database/models/robot");

describe("Given a getRobots function", () => {
  describe("When it receives an object res", () => {
    test("Then it should invoke the method json", async () => {
      // Arrange
      const robots = [
        {
          id: 1,
          name: "Atlas",
          imageUrl:
            "https://cdn.businessinsider.es/sites/navi.axelspringer.es/public/styles/bi_876/public/media/image/2021/08/boston-dynamics-2441569.jpg?itok=tAqvqKb-",
          features: {
            speed: 8,
            resistance: 10,
            yearCreation: 2013,
          },
        },
        {
          id: 2,
          name: "Pepper",
          imageUrl:
            "https://revistaderobots.com/wp-content/uploads/2020/02/Robot-Pepper-qu%C3%A9-es-la-historia-del-robot-pepper-y-precio.jpg",
          features: {
            speed: 7,
            resistance: 6,
            yearCreation: 2016,
          },
        },
      ];

      Robot.find = jest.fn().mockResolvedValue(robots);
      const res = {
        json: jest.fn(),
      };

      // Act
      await getRobots(null, res);

      // Assert
      expect(Robot.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(robots);
    });
  });
});

describe("Given a getRobotById function", () => {
  describe("When it receives a request with an id 2, a res object and a next function", () => {
    test("Then it should invoke Robot.findById with a 2", async () => {
      Robot.findById = jest.fn().mockRejectedValue({});
      const idRobot = 2;
      const req = {
        params: {
          idRobot,
        },
      };
      const res = {
        json: () => {},
      };
      const next = () => {};

      await getRobotById(req, res, next);

      expect(Robot.findById).toHaveBeenCalledWith(idRobot);
    });
    describe("And Robot.findById rejects", () => {
      test("Then it should invoke invoke next function with the error rejected", async () => {
        const error = {};
        Robot.findById = jest.fn().mockRejectedValue(error);
        const req = {
          params: {
            idRobot: 0,
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();

        await getRobotById(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(error.code).toBe(400);
      });
    });
    describe("And Pet.findById resolves to Pepper", () => {
      test("Then it should invoke res. json with a Pepper", async () => {
        const idRobot = 2;
        const pepper = {
          idRobot,
          name: "Pepper",
          features: {
            speed: 8,
            resistance: 5,
            yearCreation: 2016,
          },
        };
        Robot.findById = jest.fn().mockResolvedValue(pepper);
        const req = {
          params: {
            idRobot,
          },
        };
        const res = {
          json: jest.fn(),
        };

        await getRobotById(req, res);

        expect(res.json).toHaveBeenCalledWith(pepper);
      });
    });
    describe("And Pet.findById resolves to undefined", () => {
      test("Then it should invoke next function with the error", async () => {
        const idRobot = 2;
        const error = new Error("Robot not found");
        error.code = 404;

        Robot.findById = jest.fn().mockResolvedValue(undefined);
        const req = {
          params: {
            idRobot,
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();

        await getRobotById(req, res, next);

        expect(error.code).toBe(404);
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});

describe("Given a createRobot function", () => {
  describe("When it receives a request with a new robot, a res object and a next function", () => {
    test("Then it should invoke Robot.create with a new robot", async () => {
      const pepper = {
        _id: "61892170a699cfe754044ddc",
        name: "Pepper",
        imageUrl: "foto-pepper.jpg",
        features: {
          speed: 8,
          resistance: 5,
          yearCreation: 2016,
        },
      };
      console.log(pepper);
      const req = {
        body: pepper,
      };

      const robot = req.body;
      console.log(robot);

      const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      Robot.create = jest.fn().mockResolvedValue(robot);
      const res = mockResponse();

      await createRobot(req, res);

      expect(res.json).toHaveBeenCalledWith(robot);
    });
    describe("And Robot.create rejects", () => {
      test("Then it should invoke invoke next function with the error rejected", async () => {
        const error = {};
        Robot.create = jest.fn().mockRejectedValue(error);

        const req = {
          body: {
            idRobot: 0,
            name: "",
            features: {
              speed: 0,
              resistance: 0,
              yearCreation: 0,
            },
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();

        await createRobot(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(error.code).toBe(400);
      });
    });
  });
});
