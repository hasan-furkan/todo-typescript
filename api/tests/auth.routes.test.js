const request = require("supertest");
const app = require("../server");
const { User } = require("../models");
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
    // ornek veriler
    const mockUser = { email: "tests@example.com", id: 1 };
    const mockToken = "sampleAccessToken";
    const mockRefreshToken = "sampleRefreshToken";

    // mocklanan fonksiyonlari tanimla
    User.findOne.mockResolvedValue(mockUser);
    redisClient.set.mockResolvedValue(true);

    tokenGeneratorMiddleware.mockReturnValue(mockToken);
    refreshTokenGeneratorMiddleware.mockReturnValue(mockRefreshToken);

    // istek gonder
    const res = await request(app).post("/api/v1.0/auth/login").send({
      email: mockUser.email,
    });

    // giden istegin testlerini kontrol et
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

    // mocklamis oldugun fonksiyonlari kontrol et
    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });

    // redisClient'i kontrol et
    expect(redisClient.set).toHaveBeenCalledWith(
      `refreshToken:${mockUser.id}`,
      mockRefreshToken,
      "EX",
      86400
    );

    // tokenleri kontrol et
    expect(tokenGeneratorMiddleware).toHaveBeenCalledWith(mockUser);
    expect(refreshTokenGeneratorMiddleware).toHaveBeenCalledWith(mockUser);
  });
});
