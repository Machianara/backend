import fetch from "node-fetch";


const ML_API_URL = process.env.ML_API_URL || "http://localhost:5001/predict";

// ... (Bagian atas kode tetap sama) ...

/**
 * @route POST /api/manual-input
 * @description Manual input mesin (Product ID) atau data sensor lengkap.
 * @access Public
 */
export const manualInputMachine = async (req, res) => {
    // Ambil semua data dari body
    const inputData = req.body;
    const { machine_name } = inputData; // Hanya untuk validasi awal

    if (!machine_name && !inputData.rotational_speed) {
        // Validasi: harus ada machine_name ATAU data sensor
        return res
            .status(400)
            .json({
                error: "Input validation failed",
                message: "machine_name (Product ID) or sensor data is required.",
            });
    }

    const processedInput = {};

    for (const key in inputData) {
        const value = inputData[key];
        
        if (typeof value === 'string' && !['product_type', 'machine_name'].includes(key)) {
            const numValue = Number(value);
            // Hanya konversi jika hasilnya angka valid
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
            `[Backend] Requesting prediction for ID: ${machine_name || 'Manual'} at ${ML_API_URL}`
        );

        mlResponse = await fetch(ML_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(processedInput),
            timeout: 15000,
        });
        

        mlData = await mlResponse.json();

        // 2. Penanganan Error dari ML API
        if (!mlResponse.ok) {
        }
        res.json({
            status: "success",
            product_id: mlData.machine_name || processedInput.machine_name,
            report_data: {
                mesin: mlData.detail_mesin || processedInput,
                
                prediksi: {
                    status_label: mlData.status_label, 
                    current_risk: mlData.current_risk, 
                    ai_confidence: mlData.calculated_metrics?.ai_confidence || '0.0%',
                    pesan_fisik: mlData.phys_message || "Data metrik tidak tersedia.",
                },
                
                analisis: {
                    ai_analysis: mlData.ai_analysis || "Mesin beroperasi normal atau AI Analysis tidak tersedia.",
                    radar_chart: mlData.radar_chart_base64 || null, 

                    calculated_metrics: {
                        power: mlData.calculated_metrics?.power,
                        strain: mlData.calculated_metrics?.strain,
                        temp_diff: mlData.calculated_metrics?.temp_diff,
                        time_to_critical: mlData.time_to_critical_alert
                    }
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