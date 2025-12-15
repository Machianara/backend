import "./setup.env.js";
import { jest } from "@jest/globals";
import authService from "../src/services/authService.js";

// Mock dependencies
jest.mock("../src/models/user.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
  },
}));

import User from "../src/models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("login success returns token and user", async () => {
    const user = { id: 1, phone: "081234", name: "A", role: "user", password: "hashed" };
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token123");

    const res = await authService.login("081234", "pass");
    expect(User.findOne).toHaveBeenCalledWith({ where: { phone: "081234" } });
    expect(bcrypt.compare).toHaveBeenCalledWith("pass", "hashed");
    expect(jwt.sign).toHaveBeenCalled();
    expect(res).toEqual({ token: "token123", user });
  });

  test("login fails for unknown phone", async () => {
    User.findOne.mockResolvedValue(null);
    await expect(authService.login("000", "x")).rejects.toThrow("Nomor HP tidak terdaftar");
  });

  test("login fails for wrong password", async () => {
    User.findOne.mockResolvedValue({ password: "hashed" });
    bcrypt.compare.mockResolvedValue(false);
    await expect(authService.login("081234", "wrong")).rejects.toThrow("Password salah");
  });

  test("createAccount creates new user", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPw");
    const created = { id: 2, name: "B", phone: "08123", role: "user" };
    User.create.mockResolvedValue(created);

    const res = await authService.createAccount("B", "08123", "pw");
    expect(User.findOne).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith("pw", 10);
    expect(User.create).toHaveBeenCalledWith({ name: "B", phone: "08123", password: "hashedPw", role: "user" });
    expect(res).toBe(created);
  });

  test("createAccount rejects if phone exists", async () => {
    User.findOne.mockResolvedValue({ id: 1 });
    await expect(authService.createAccount("B", "08123", "pw")).rejects.toThrow("Nomor HP sudah terdaftar");
  });

  test("updateProfile updates fields and saves", async () => {
    const user = { id: 1, name: "Old", biography: null, password: "x", save: jest.fn() };
    User.findByPk.mockResolvedValue(user);
    bcrypt.hash.mockResolvedValue("newHashed");

    const res = await authService.updateProfile(1, "New", "Bio", "newpw");
    expect(user.name).toBe("New");
    expect(user.biography).toBe("Bio");
    expect(user.password).toBe("newHashed");
    expect(user.save).toHaveBeenCalled();
    expect(res).toBe(user);
  });

  test("getAllUsers returns attributes list", async () => {
    const users = [{ id: 1 }];
    User.findAll.mockResolvedValue(users);
    const res = await authService.getAllUsers();
    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ["id", "name", "phone", "biography", "role", "createdAt", "updatedAt"],
    });
    expect(res).toBe(users);
  });

  test("updateUserByAdmin updates fields and saves", async () => {
    const user = { id: 1, name: "A", biography: "B", save: jest.fn() };
    User.findByPk.mockResolvedValue(user);
    const res = await authService.updateUserByAdmin(1, "X", "Y");
    expect(user.name).toBe("X");
    expect(user.biography).toBe("Y");
    expect(user.save).toHaveBeenCalled();
    expect(res).toBe(user);
  });

  test("deleteUser destroys user", async () => {
    const user = { id: 3, destroy: jest.fn() };
    User.findByPk.mockResolvedValue(user);
    await authService.deleteUser(3);
    expect(user.destroy).toHaveBeenCalled();
  });

  test("deleteUser throws if not found", async () => {
    User.findByPk.mockResolvedValue(null);
    await expect(authService.deleteUser(99)).rejects.toThrow("User tidak ditemukan");
  });
});
