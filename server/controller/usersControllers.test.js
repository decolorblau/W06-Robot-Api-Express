require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getUser } = require("./usersController");
const User = require("../../database/models/user");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given a getUser function", () => {
  describe("When it receives wrong userName", () => {
    test("Then it should invoke the next function with an error", async () => {
      User.findOne = jest.fn().mockResolvedValue(null); // A qui li diem quin valor volem que retorni
      const req = {
        body: {
          userName: "hola",
          password: "hola",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Wrong credentials");
      expectedError.code = 401;

      await getUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives right userName and wrong password", () => {
    test("Then it should invoke the next function with a 401 error", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        userName: "hola",
        password: "hola", // com que testesjem el bcrypt. compare necessita una password encriptada
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const req = {
        body: {
          userName: "hola",
          password: "patata",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Wrong credentials 2");
      expectedError.code = 401;

      await getUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives right userName and password", () => {
    test("Then it should invoke res.json with an object with a brand new token inside", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        id: "2",
        userName: "hola",
        password: "hola", // com que testesjem el bcrypt. compare necessita una password encriptada
      });
      const expectedToken = "papaya";
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const req = {
        body: {
          id: "2",
          userName: "hola",
          password: "hola",
        },
      };
      const res = {
        json: jest.fn(),
      };

      const expectedResponse = {
        token: expectedToken,
      };

      await getUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
