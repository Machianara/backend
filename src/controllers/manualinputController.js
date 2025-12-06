import fetch from "node-fetch";

/**
 * Manual input mesin → generate report
 * req.body: { machine_name: string }
 */
export const manualInputMachine = async (req, res) => {
  try {
    const { machine_name } = req.body;

    if (!machine_name) {
      return res.status(400).json({ error: "machine_name is required" });
    }

    // Request ke ML API
    const mlResponse = await fetch("http://localhost:5001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machine_name }),
    });

    const mlData = await mlResponse.json();

    // Bangun report string
    let report = "";

    if (mlData.status === "RUSAK") {
      report = `
═════════════════════════════════════════════════════════════════
 LAPORAN LENGKAP MESIN: ${mlData.machine_name}
═════════════════════════════════════════════════════════════════
 Tipe Mesin      : ${mlData.type}
 Suhu Proses     : ${mlData.temperature} K
 RPM             : ${mlData.rpm} rpm
 Torsi           : ${mlData.torque} Nm
 Tool Wear       : ${mlData.tool_wear} min
-----------------------------------------------------------------
[A] FAKTA DATASET
   🔴 STATUS ASLI : ${mlData.status}
    Penyebab Tercatat:
      👉 ${mlData.cause}
-----------------------------------------------------------------
📋 FAKTOR PENYEBAB UTAMA:
   👉 Mechanical Power W: ${mlData.factors.mechanical_power}
      -> 🟡 Beban Tinggi: Pertimbangkan menurunkan RPM atau Torsi.
   👉 temperature_difference: ${mlData.factors.temperature_difference}
   👉 Rotational speed rpm: ${mlData.factors.rpm}
      -> 📈 RPM TINGGI: Menambah panas dan getaran.
-----------------------------------------------------------------
 ANALISIS DETAIL SEBAB-AKIBAT (SHAP):
 ${mlData.analysis || "Tidak ada analisis tambahan."}
`;
    } else if (mlData.status === "NORMAL") {
      report = `
Masukkan Product ID: ${mlData.machine_name}

═════════════════════════════════════════════════════════════════
 LAPORAN LENGKAP MESIN: ${mlData.machine_name}
═════════════════════════════════════════════════════════════════
 Tipe Mesin      : ${mlData.type}
 Suhu Proses     : ${mlData.temperature} K
 RPM             : ${mlData.rpm} rpm
 Torsi           : ${mlData.torque} Nm
 Tool Wear       : ${mlData.tool_wear} min
-----------------------------------------------------------------
MENURUT DATASET
   🟢 STATUS ASLI : ${mlData.status}
       Mesin tercatat beroperasi normal.
-----------------------------------------------------------------
   ✅ Mesin ini aman. Silakan cek grafik untuk detail kestabilan.
 VISUALISASI KONTRIBUSI FITUR (SHAP):
 ${mlData.analysis || "Tidak ada analisis tambahan."}
`;
    } else {
      report = `Status mesin tidak dikenali.`;
    }

    // Kembalikan JSON
    res.json({
      machine_name: mlData.machine_name,
      status: mlData.status,
      report,
    });
  } catch (err) {
    console.error("Manual Input Machine Error:", err);
    res.status(500).json({ error: "Failed to generate machine report" });
  }
};
