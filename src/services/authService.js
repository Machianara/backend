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
      name: user.name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    return { token, user };
  }
};
