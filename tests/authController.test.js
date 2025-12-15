import "./setup.env.js";
import { jest } from "@jest/globals";
import authController from "../src/controllers/authController.js";
import authService from "../src/services/authService.js";
import "./setup.env.js";

jest.mock("../src/services/authService.js", () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    createAccount: jest.fn(),
    updateProfile: jest.fn(),
    getAllUsers: jest.fn(),
    updateUserByAdmin: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

describe("authController", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  };

  beforeEach(() => jest.clearAllMocks());

  test("login returns formatted user and token", async () => {
    const req = { body: { phone: "081", password: "pw" } };
    const res = mockRes();
    authService.login.mockResolvedValue({
      token: "t",
      user: { id: 1, name: "N", phone: "081", role: "user", biography: "Bio" },
    });
    await authController.login(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login berhasil",
      token: "t",
      user: { id: 1, name: "N", phone: "081", role: "user", biography: "Bio" },
    });
  });

  test("createAccount returns 201 and user", async () => {
    const req = { body: { name: "A", phone: "081", password: "pw" } };
    const res = mockRes();
    authService.createAccount.mockResolvedValue({ id: 2, name: "A", phone: "081", role: "user" });
    await authController.createAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Akun berhasil dibuat",
      user: { id: 2, name: "A", phone: "081", role: "user" },
    });
  });

  test("updateProfile returns updated user", async () => {
    const req = { body: { name: "X", biography: "Y", password: "Z" }, user: { id: 1 } };
    const res = mockRes();
    authService.updateProfile.mockResolvedValue({ id: 1, name: "X", phone: "081", biography: "Y", role: "user" });
    await authController.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Profil berhasil diupdate",
      user: { id: 1, name: "X", phone: "081", biography: "Y", role: "user" },
    });
  });

  test("getAllUsers returns list", async () => {
    const req = {};
    const res = mockRes();
    authService.getAllUsers.mockResolvedValue([{ id: 1 }]);
    await authController.getAllUsers(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "Daftar user berhasil diambil", data: [{ id: 1 }] });
  });

  test("updateUserByAdmin returns updated user", async () => {
    const req = { params: { userId: 1 }, body: { name: "A", biography: "B" } };
    const res = mockRes();
    authService.updateUserByAdmin.mockResolvedValue({ id: 1, name: "A", phone: "081", biography: "B", role: "user" });
    await authController.updateUserByAdmin(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Data user berhasil diupdate",
      user: { id: 1, name: "A", phone: "081", biography: "B", role: "user" },
    });
  });

  test("deleteUser returns success message", async () => {
    const req = { params: { userId: 3 } };
    const res = mockRes();
    authService.deleteUser.mockResolvedValue();
    await authController.deleteUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "User berhasil dihapus" });
  });
});
