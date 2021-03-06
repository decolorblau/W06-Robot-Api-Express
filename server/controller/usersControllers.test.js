require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getUser, createUser } = require("./usersController");
const User = require("../../database/models/user");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

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
        password: "hola",
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
      const res = mockResponse();

      const expectedResponse = {
        token: expectedToken,
      };

      await getUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
  describe("When it receives the req object and the promise rejects", () => {
    test("Then it should invoke the next function with a error", async () => {
      const req = {
        body: {
          id: "2",
          userName: "hola",
          password: "hola",
        },
      };
      const next = jest.fn();
      const error = new Error("Error logging in the user");
      error.code = 401;
      User.findOne = jest.fn().mockRejectedValue(error);

      await getUser(req, null, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createUser function", () => {
  describe("When it receives right username and password and this userName not exist", () => {
    test("Then it should invoke the method json and status", async () => {
      const req = {
        body: {
          name: "test",
          userName: "test",
          password: "test",
        },
      };

      const res = mockResponse();
      const next = jest.fn();

      const expectedStatus = 201;
      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(req.body);
      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });
  describe("When it receives right userName but the userName has already exist", () => {
    test("Then it should invoke the next function with 'This email is already registered' and 401 error", async () => {
      const req = {
        body: {
          name: "test",
          userName: "test",
          password: "test",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("This email is already registered");
      expectedError.code = 401;
      User.findOne = jest.fn().mockResolvedValue("test");

      await createUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it receives the req object and the promise rejects", () => {
    test("Then it should invoke the next function with a error", async () => {
      const req = {
        body: {
          name: "test",
          userName: "test",
          password: "test",
        },
      };
      const next = jest.fn();
      const error = new Error("Error creating the user");
      error.code = 401;
      User.findOne = jest.fn().mockRejectedValue(error);

      await createUser(req, null, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
