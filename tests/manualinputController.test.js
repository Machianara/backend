import "./setup.env.js";
import { jest } from "@jest/globals";
import { manualInputMachine } from "../src/controllers/manualinputController.js";

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import fetch from "node-fetch";

describe("manualinputController", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  };

  beforeEach(() => jest.clearAllMocks());

  test("validates input when missing machine_name and sensor data", async () => {
    const req = { body: {} };
    const res = mockRes();
    await manualInputMachine(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("converts numeric strings and returns success mapping", async () => {
    const mlOk = {
      ok: true,
      status: 200,
      json: async () => ({
        machine_name: "M1",
        status_label: "OK",
        current_risk: 0.1,
        phys_message: "All good",
        ai_analysis: "Analysis",
        radar_chart_base64: null,
        calculated_metrics: { power: 1.0, strain: 2.0, temp_diff: 3.0 },
        time_to_critical_alert: 999,
        detail_mesin: { rotational_speed: 100 },
      }),
    };
    fetch.mockResolvedValue(mlOk);

    const req = { body: { machine_name: "M1", rotational_speed: "100" } };
    const res = mockRes();

    await manualInputMachine(req, res);

    expect(fetch).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: "success",
      product_id: "M1",
      report_data: expect.objectContaining({
        prediksi: expect.objectContaining({ status_label: "OK", current_risk: 0.1 }),
      }),
    }));
  });

  test("handles ML service error with non-OK status", async () => {
    const mlErr = {
      ok: false,
      status: 500,
      json: async () => ({ detail: "Service down" }),
    };
    fetch.mockResolvedValue(mlErr);

    const req = { body: { machine_name: "M1" } };
    const res = mockRes();

    await manualInputMachine(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "ML Service Error" }));
  });
});
