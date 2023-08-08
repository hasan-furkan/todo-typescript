const app = require("../index");
const request = require("supertest");
const { Todo } = require("../models");
const { tokenValidatorMiddleware } = require("../functions/auth");

jest.mock("../models");
jest.mock("../functions/auth", () => {
  return {
    tokenValidatorMiddleware: jest.fn(),
  };
});

describe("GET /todos", () => {
  it("should handle get todos", async () => {
    const mockTodo = {
      id: 1,
      title: "test",
      completed: false,
      userId: 1,
    };
    Todo.findAll.mockResolvedValue([mockTodo]);
    tokenValidatorMiddleware.mockImplementation((req, res, next) => {
      req.userObj = { id: 1 }; // Bu id'yi mockTodo'dan alabilirsiniz
      next();
    });

    const res = await request(app).get("/api/v1.0/todos");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "todos found",
      data: [
        {
          id: mockTodo.id,
          title: mockTodo.title,
          completed: mockTodo.completed,
          userId: mockTodo.userId,
        },
      ],
    });

    expect(Todo.findAll).toHaveBeenCalledWith({
      where: { UserId: mockTodo.userId, isDeleted: false },
    });
  }, 10000);
});
