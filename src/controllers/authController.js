import authService from "../services/authService.js";

export default {
  async login(req, res) {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({ message: "Nomor HP dan password wajib diisi" });
      }

      const result = await authService.login(phone, password);

      return res.json({
        message: "Login berhasil",
        token: result.token,
        user: {
          id: result.user.id,
          name: result.user.name,
          phone: result.user.phone,
          biography: result.user.biography,
          role: result.user.role
        }
      });
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  },

  async createAccount(req, res) {
    try {
      const { name, phone, password } = req.body;

      if (!name || !phone || !password) {
        return res.status(400).json({ message: "Nama, nomor HP, dan password wajib diisi" });
      }

      const newUser = await authService.createAccount(name, phone, password);

      return res.status(201).json({
        message: "Akun berhasil dibuat",
        user: {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          role: newUser.role
        }
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, biography, password } = req.body;
      const userId = req.user.id;

      if (!name && !biography && !password) {
        return res.status(400).json({ message: "Minimal ada satu field yang harus diupdate" });
      }

      const updatedUser = await authService.updateProfile(userId, name, biography, password);

      return res.json({
        message: "Profil berhasil diupdate",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          phone: updatedUser.phone,
          biography: updatedUser.biography,
          role: updatedUser.role
        }
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await authService.getAllUsers();

      return res.json({
        message: "Daftar user berhasil diambil",
        data: users
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async updateUserByAdmin(req, res) {
    try {
      const { userId } = req.params;
      const { name, biography } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID wajib diisi" });
      }

      if (!name && !biography) {
        return res.status(400).json({ message: "Minimal ada satu field yang harus diupdate" });
      }

      const updatedUser = await authService.updateUserByAdmin(userId, name, biography);

      return res.json({
        message: "Data user berhasil diupdate",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          phone: updatedUser.phone,
          biography: updatedUser.biography,
          role: updatedUser.role
        }
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID wajib diisi" });
      }

      await authService.deleteUser(userId);

      return res.json({
        message: "User berhasil dihapus"
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};
