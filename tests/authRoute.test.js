import "./setup.env.js";
import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import jwt from "jsonwebtoken";
import authService from "../src/services/authService.js";
import "./setup.env.js";

// Mock service used by controller
jest.mock("../src/services/authService.js", () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    createAccount: jest.fn(),
    getAllUsers: jest.fn(),
    updateUserByAdmin: jest.fn(),
    updateProfile: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

describe("/auth routes", () => {
  const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

  test("POST /auth/login returns token", async () => {
    authService.login.mockResolvedValue({ token: "abc", user: { id: 1, name: "N", phone: "081", role: "user", biography: "B" } });
    const res = await request(app).post("/auth/login").send({ phone: "081", password: "pw" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe("abc");
  });

  test("Admin protected route: GET /auth/users requires token and role admin", async () => {
    authService.getAllUsers.mockResolvedValue([{ id: 1 }]);
    const token = signToken({ id: 99, role: "admin" });
    const res = await request(app).get("/auth/users").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: 1 }]);
  });

  test("User route: PUT /auth/profile requires user role", async () => {
    authService.updateProfile.mockResolvedValue({ id: 1, name: "A", phone: "081", biography: "B", role: "user" });
    const token = signToken({ id: 1, role: "user" });
    const res = await request(app).put("/auth/profile").set("Authorization", `Bearer ${token}`).send({ name: "A" });
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("A");
  });
});
