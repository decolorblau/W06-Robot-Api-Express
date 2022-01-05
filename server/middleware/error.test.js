const { ValidationError } = require("express-validation");
const { notFoundErrorHandler, generalErrorHandler } = require("./error");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a notFoundErrorHandler", () => {
  describe("When it receives a null request", () => {
    test("Then it should return error code 404 and 'Endpoint not found'", () => {
      const res = mockResponse();

      notFoundErrorHandler(null, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Endpoint not found" });
    });
  });
});

describe("Given a generalErrorHandler", () => {
  describe("When it receives an error without instanceof ValidationError, with error code 401 and 'test error'", () => {
    test("Then it should return error code 400 and 'test error' message", () => {
      const res = mockResponse();
      const error = {
        code: 401,
        message: "test error",
      };

      generalErrorHandler(error, null, res);

      expect(res.status).toHaveBeenCalledWith(error.code);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  describe("When it receives an error without instanceof ValidationError, without error code and message", () => {
    test("Then it should return error code 500 and 'The world is coming to end' message", () => {
      const res = mockResponse();
      const error = {};

      generalErrorHandler(error, null, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "The world is coming to end",
      });
    });
  });
  describe("When it receives an error with instanceof ValidationError, with error code 400 and 'Bad request'", () => {
    test("Then it should return error code 400 and 'Bad request", () => {
      const error = new ValidationError("string validation", {
        statusCode: 500,
        error: new Error(),
      });

      const expectedError = { error: "Bad request" };
      const expectedStatus = 400;

      const res = mockResponse();

      generalErrorHandler(error, null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
