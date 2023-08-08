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
      req.userObj = { id: 1 };
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

describe("POST /todos", () => {
  it("should handle create todo", async () => {
    const mockTodo = {
      id: 1,
      title: "test",
      completed: false,
      userId: 1,
    };
    Todo.create.mockResolvedValue(mockTodo);
    tokenValidatorMiddleware.mockImplementation((req, res, next) => {
      req.userObj = { id: 1 };
      next();
    });

    const res = await request(app).post("/api/v1.0/todos").send({
      title: "test",
      completed: false,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "todo added",
      data: {
        id: mockTodo.id,
        title: mockTodo.title,
        completed: mockTodo.completed,
        userId: mockTodo.userId,
      },
    });

    expect(Todo.create).toHaveBeenCalledWith({
      title: "test",
      completed: false,
      UserId: mockTodo.userId,
    });
  }, 10000);
});

describe("PUT /todos/:id", () => {
  it("should handle update todo", async () => {
    const mockTodo = {
      id: 1,
      title: "test",
      completed: false,
      userId: 1,
    };
    Todo.update.mockResolvedValue(mockTodo);
    tokenValidatorMiddleware.mockImplementation((req, res, next) => {
      req.userObj = { id: 1 };
      next();
    });

    const res = await request(app).put("/api/v1.0/todos/1").send({
      title: "test",
      completed: false,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "todo updated",
      data: {
        id: mockTodo.id,
        title: mockTodo.title,
        completed: mockTodo.completed,
        userId: mockTodo.userId,
      },
    });

    expect(Todo.update).toHaveBeenCalledWith(
      {
        title: "test",
        completed: false,
      },
      {
        where: {
          id: "1",
          UserId: mockTodo.userId,
        },
      }
    );
  }, 10000);
});

describe("DELETE /todos/:id", () => {
  it("should handle delete todo", async () => {
    const mockTodo = {
      id: 1,
      title: "test",
      completed: false,
      userId: 1,
    };
    Todo.update.mockResolvedValue(mockTodo);
    tokenValidatorMiddleware.mockImplementation((req, res, next) => {
      req.userObj = { id: 1 };
      next();
    });

    const res = await request(app).delete("/api/v1.0/todos/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "todo deleted",
      data: {
        id: mockTodo.id,
        title: mockTodo.title,
        completed: mockTodo.completed,
        userId: mockTodo.userId,
      },
    });

    expect(Todo.update).toHaveBeenCalledWith(
      {
        isDeleted: true,
      },
      {
        where: {
          id: "1",
          UserId: mockTodo.userId,
        },
      }
    );
  }, 10000);
});
