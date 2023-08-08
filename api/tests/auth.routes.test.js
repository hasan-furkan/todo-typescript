const request = require("supertest");
const app = require("../index");
const { User } = require("../models"); // Destructuring kullanarak User modelini alın
const redisClient = require("../redisClient");
const {
  tokenGeneratorMiddleware,
  refreshTokenGeneratorMiddleware,
  tokenValidatorMiddleware,
} = require("../functions/auth");

jest.mock("../models");
jest.mock("../redisClient");
jest.mock("../functions/auth", () => {
  return {
    tokenGeneratorMiddleware: jest.fn(),
    refreshTokenGeneratorMiddleware: jest.fn(),
    tokenValidatorMiddleware: jest.fn(),
  };
});

describe("POST /login", () => {
  it("should handle user login", async () => {
    // Örnek request verileri
    const mockUser = { email: "test@example.com", id: 1 };
    const mockToken = "sampleAccessToken";
    const mockRefreshToken = "sampleRefreshToken";

    // Mock fonksiyonları tanımlayın
    User.findOne.mockResolvedValue(mockUser);
    redisClient.set.mockResolvedValue(true);

    tokenGeneratorMiddleware.mockReturnValue(mockToken); // Burada mocklayın
    refreshTokenGeneratorMiddleware.mockReturnValue(mockRefreshToken); // Burada mocklayın

    // Request'i gönderin
    const res = await request(app).post("/api/v1.0/auth/login").send({
      email: mockUser.email,
    });
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "success",
      data: {
        email: mockUser.email,
        accessToken: mockToken,
        refreshToken: mockRefreshToken,
      },
    });

    // Mock fonksiyonların beklenildiği gibi çağrıldığından emin olun
    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(redisClient.set).toHaveBeenCalledWith(
      `refreshToken:${mockUser.id}`,
      mockRefreshToken,
      "EX",
      86400
    );
    expect(tokenGeneratorMiddleware).toHaveBeenCalledWith(mockUser);
    expect(refreshTokenGeneratorMiddleware).toHaveBeenCalledWith(mockUser);
  });
});
