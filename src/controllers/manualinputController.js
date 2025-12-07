import fetch from "node-fetch";

// Key: ML_API_URL, Value: http://ml-service:5001/predict
const ML_API_URL = process.env.ML_API_URL || "http://localhost:5001/predict";

/**
 * @route POST /api/manual-input
 * @description Manual input mesin (Product ID) dan generate structured JSON report dari ML Service.
 * @access Public
 */
export const manualInputMachine = async (req, res) => {
  const { machine_name } = req.body;

  if (!machine_name) {
    return res
      .status(400)
      .json({
        error: "Input validation failed",
        message: "machine_name (Product ID) is required.",
      });
  }

  let mlResponse;
  let mlData;

  try {
    // 1. Request ke ML API
    console.log(
      `[Backend] Requesting prediction for ID: ${machine_name} at ${ML_API_URL}`
    );

    mlResponse = await fetch(ML_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machine_name }),
      timeout: 15000,
    });

    mlData = await mlResponse.json();

    // 2. Penanganan Error dari ML API
    if (!mlResponse.ok) {
      const statusCode = mlResponse.status;

      const detailMessage =
        mlData.detail || "Gagal memproses prediksi dari layanan ML.";

      console.error(
        `[ML Service Error] Status ${statusCode}: ${detailMessage}`
      );

      return res.status(statusCode).json({
        error: "ML Service Error",
        message: detailMessage,
        status_code_from_ml: statusCode,
      });
    }

    // 3. Mengembalikan JSON Terstruktur
    res.json({
      status: "success",
      product_id: mlData.machine_name,
      report_data: {
        mesin: mlData.detail_mesin,
        prediksi: {
          status: mlData.status,
          status_asli: mlData.status_asli,
        },
        analisis: {
          faktor_penyebab: mlData.faktor_penyebab,
          visualisasi_shap: mlData.visualisasi_shap,
        },
      },
    });
  } catch (err) {
    console.error("Manual Input Machine Connection Error:", err.message);

    res.status(503).json({
      error: "Failed to connect to ML service",
      message:
        "Layanan prediksi mesin sedang tidak tersedia. Mohon cek ML API.",
      detail: err.message,
    });
  }
};

