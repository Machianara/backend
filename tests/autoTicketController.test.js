import { createAutoTicket } from "../src/controllers/autoTicketController.js";

jest.mock("../src/models/ticket.js", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

import Ticket from "../src/models/ticket.js";

describe("autoTicketController", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  };

  beforeEach(() => jest.clearAllMocks());

  test("creates auto ticket with priority fallback", async () => {
    const req = { body: { machine_name: "MX", issue: "Vibration", priority: "invalid" } };
    const res = mockRes();
    const created = { id: 10, machine_name: "MX", status: "open", priority: "medium" };
    Ticket.create.mockResolvedValue(created);
    await createAutoTicket(req, res);
    expect(Ticket.create).toHaveBeenCalledWith(expect.objectContaining({ auto_generated: true, priority: "medium" }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, ticket_id: 10, machine_name: "MX", status: "open", priority: "medium" });
  });

  test("returns 400 on missing required fields", async () => {
    const req = { body: { issue: "x" } };
    const res = mockRes();
    await createAutoTicket(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
