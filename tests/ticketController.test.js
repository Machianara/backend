import "./setup.env.js";
import { jest } from "@jest/globals";
import { createTicket, getTickets, getTicketById, updateTicket, deleteTicket } from "../src/controllers/ticketController.js";

jest.mock("../src/models/ticket.js", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

import Ticket from "../src/models/ticket.js";

describe("ticketController", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  };

  beforeEach(() => jest.clearAllMocks());

  test("createTicket returns 201", async () => {
    const req = { body: { machine_name: "M1", date: "2025-12-01", issue: "Noise" } };
    const res = mockRes();
    const created = { id: 1 };
    Ticket.create.mockResolvedValue(created);
    await createTicket(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Ticket created", ticket: created });
  });

  test("getTickets returns list", async () => {
    const req = {};
    const res = mockRes();
    const list = [{ id: 1 }];
    Ticket.findAll.mockResolvedValue(list);
    await getTickets(req, res);
    expect(res.json).toHaveBeenCalledWith(list);
  });

  test("getTicketById returns 404 when missing", async () => {
    const req = { params: { id: 99 } };
    const res = mockRes();
    Ticket.findByPk.mockResolvedValue(null);
    await getTicketById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateTicket updates and returns ticket", async () => {
    const ticket = { update: jest.fn(), id: 1 };
    Ticket.findByPk.mockResolvedValue(ticket);
    const req = { params: { id: 1 }, body: { status: "resolved" } };
    const res = mockRes();
    await updateTicket(req, res);
    expect(ticket.update).toHaveBeenCalledWith({ status: "resolved" });
    expect(res.json).toHaveBeenCalledWith({ message: "Ticket updated", ticket });
  });

  test("deleteTicket deletes ticket", async () => {
    const ticket = { destroy: jest.fn() };
    Ticket.findByPk.mockResolvedValue(ticket);
    const req = { params: { id: 1 } };
    const res = mockRes();
    await deleteTicket(req, res);
    expect(ticket.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Ticket deleted" });
  });
});
