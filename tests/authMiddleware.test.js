import "./setup.env.js";
import { jest } from "@jest/globals";
import { verifyToken, verifyAdmin, verifyUser } from "../src/middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import "./setup.env.js";

describe("authMiddleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  };

  test("verifyToken rejects when missing", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("verifyToken sets req.user on valid token", () => {
    const token = jwt.sign({ id: 1, role: "user" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(req.user).toEqual(expect.objectContaining({ id: 1, role: "user" }));
    expect(next).toHaveBeenCalled();
  });

  test("verifyAdmin allows admin", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = jest.fn();
    verifyAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("verifyUser rejects non-user", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    verifyUser(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
