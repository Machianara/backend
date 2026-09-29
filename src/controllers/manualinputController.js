import fetch from "node-fetch";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:5001/predict";

/**
 * @route
 * @description
 * @access
 */
export const manualInputMachine = async (req, res) => {
  const inputData = req.body;
  const { machine_name } = inputData;

  if (!machine_name && !inputData.rotational_speed) {
    return res.status(400).json({
      error: "Input validation failed",
      message: "machine_name (Product ID) or sensor data is required.",
    });
  }

  const processedInput = {};
  for (const key in inputData) {
    const value = inputData[key];

    if (
      typeof value === "string" &&
      !["product_type", "machine_name"].includes(key)
    ) {
      const numValue = Number(value);

      if (!isNaN(numValue) && numValue !== null) {
        processedInput[key] = numValue;
      } else {
        processedInput[key] = value;
      }
    } else {
      processedInput[key] = value;
    }
  }
  // --- END KONVERSI ---

  let mlResponse;
  let mlData;

  try {
    // 1. Request ke ML API dengan processedInput
    console.log(
      `[Backend] Requesting prediction for ID: ${
        machine_name || "Manual"
      } at ${ML_API_URL}`
    );

    mlResponse = await fetch(ML_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(processedInput), // Menggunakan data yang sudah dikonversi
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

    // 3. MAPPING DATA BARU DARI ML API KE OUTPUT BE API
    res.json({
      status: "success",
      product_id: mlData.machine_name || processedInput.machine_name,
      report_data: {
        mesin: mlData.detail_mesin || processedInput,

        prediksi: {
          status_label: mlData.status_label,
          current_risk: mlData.current_risk,

          ai_confidence: mlData.calculated_metrics?.ai_confidence || "0.0%",
          pesan_fisik: mlData.phys_message || "Data metrik tidak tersedia.",
        },

        analisis: {
          // Saran Gemini (AI Analysis)
          ai_analysis:
            mlData.ai_analysis ||
            "Mesin beroperasi normal atau AI Analysis tidak tersedia.",

          radar_chart: mlData.radar_chart_base64 || null,

          calculated_metrics: {
            power: mlData.calculated_metrics?.power,
            strain: mlData.calculated_metrics?.strain,
            temp_diff: mlData.calculated_metrics?.temp_diff,
            time_to_critical: mlData.time_to_critical_alert,
          },
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
