const newToken = require("./newToken");

describe("Given a newToken function", () => {
  describe("When it receives an object with a correct token", () => {
    test("Then it should invoke the function next", async () => {
      const req = {
        query: {
          token: process.env.ROBOT_TOKEN,
        },
      };
      const res = {};
      const next = jest.fn();

      await newToken(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When it receives an object with an incorrect token", () => {
    test("Then it should respond with an error", async () => {
      const req = {
        query: {
          token: "incorrect token",
        },
      };
      const error = new Error(
        "You are not a VIP person. This token is incorrect."
      );
      const res = {};
      const next = jest.fn();

      await newToken(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
