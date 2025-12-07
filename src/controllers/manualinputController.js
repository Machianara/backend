// manualinputController.js

import fetch from "node-fetch";

// URL ML API. Ganti 'localhost:5001' dengan alamat IP atau domain ML Service saat deployment.
const ML_API_URL = "http://localhost:5001/predict";

/**
 * Manual input mesin → generate structured JSON report
 * req.body: { machine_name: string }
 */
export const manualInputMachine = async (req, res) => {
  const { machine_name } = req.body;

  if (!machine_name) {
    return res
      .status(400)
      .json({ error: "machine_name (Product ID) is required" });
  }

  try {
    // 1. Request ke ML API
    const mlResponse = await fetch(ML_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machine_name }),
    });

    const mlData = await mlResponse.json();

    // 2. Penanganan Error dari ML API
    if (!mlResponse.ok) {
      // Menangkap error 404 (Not Found) atau 500 (Internal Error) dari FastAPI
      const statusCode = mlResponse.status;
      return res.status(statusCode).json({
        error: mlData.detail || "Gagal memproses prediksi dari layanan ML.",
        message: `ML Service returned status ${statusCode}`,
      });
    }

    // 3. Mengembalikan JSON Terstruktur
    // Data yang dikembalikan langsung disajikan ke Frontend, siap untuk ditampilkan.
    res.json({
      status: "success",
      product_id: mlData.machine_name,
      // Destructure data ML untuk kemudahan penggunaan di Frontend
      report_data: {
        mesin: mlData.detail_mesin,
        prediksi: {
          status: mlData.status,
          status_asli: mlData.status_asli,
        },
        analisis: {
          faktor_penyebab: mlData.faktor_penyebab,
          visualisasi_shap: mlData.visualisasi_shap, // Base64 atau URL
        },
      },
    });
  } catch (err) {
    console.error("Manual Input Machine Error:", err);
    // Asumsi: Jika terjadi error di sini, biasanya karena gagal koneksi ke ML API
    res.status(503).json({
      error: "Failed to connect to ML service",
      message:
        "Layanan prediksi mesin sedang tidak tersedia. Mohon cek ML API.",
    });
  }
};
