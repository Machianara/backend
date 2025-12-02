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
          biography: result.user.biography
        }
      });
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  }
};
