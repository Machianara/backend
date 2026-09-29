import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  async login(phone, password) {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("Nomor HP tidak terdaftar");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Password salah");
    }

    const payload = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    return { token, user };
  },

  async createAccount(name, phone, password) {
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      throw new Error("Nomor HP sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: "user"
    });

    return newUser;
  },

  async updateProfile(userId, name, biography, password) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    if (name) user.name = name;
    if (biography) user.biography = biography;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    return user;
  },

  async getAllUsers() {
    const users = await User.findAll({
      attributes: ["id", "name", "phone", "biography", "role", "createdAt", "updatedAt"]
    });

    return users;
  },

  async updateUserByAdmin(userId, name, biography) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    if (name) user.name = name;
    if (biography) user.biography = biography;

    await user.save();
    return user;
  },

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    await user.destroy();
  }
};
