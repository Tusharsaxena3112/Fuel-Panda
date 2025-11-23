import { createOrder, getOrders } from "../src/controllers/order";
import { IOrder } from "../src/models/Order";
import * as OrderService from "../src/services/order";
import mongoose from "mongoose";

describe("Order Controller", () => {
  let mockReq: any;
  let mockRes: any;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));

    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
  });

  const oid = () => new mongoose.Types.ObjectId().toString();

  it("should create a new order successfully", async () => {
    const mockOrderData = {
      sourceType: "hub",
      sourceId: oid(),
      destinationType: "terminal",
      destinationId: oid(),
      assignedDriverId: oid(),
      products: [
        { productId: oid(), quantity: 2 },
        { productId: oid(), quantity: 5 },
      ],
      status: "PENDING",
    };

    const mockCreatedOrder = { _id: oid(), ...mockOrderData };

    jest.spyOn(OrderService, "createOrder").mockResolvedValue(mockCreatedOrder as unknown as  IOrder);

    mockReq = { body: mockOrderData };

    await createOrder(mockReq as any, mockRes as any);

    expect(OrderService.createOrder).toHaveBeenCalledWith(mockOrderData);
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith(mockCreatedOrder);
  });


  it("should return 400 if required fields are missing in createOrder", async () => {
    jest
      .spyOn(OrderService, "createOrder")
      .mockRejectedValue(new Error("sourceType is required"));

    mockReq = { body: {} };

    await createOrder(mockReq as any, mockRes as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      message: "sourceType is required",
    });
  });

  it("should return all orders when no filters applied", async () => {
    const mockOrders = [
      { _id: oid(), status: "PENDING" },
      { _id: oid(), status: "IN_PROGRESS" },
    ];

    jest.spyOn(OrderService, "getOrders").mockResolvedValue(mockOrders as unknown as IOrder[]);

    mockReq = { query: {} };

    await getOrders(mockReq as any, mockRes as any);

    expect(OrderService.getOrders).toHaveBeenCalledWith({});
    expect(mockJson).toHaveBeenCalledWith(mockOrders);
  });


  it("should filter orders by driverId and status", async () => {
    const filterQuery = {
      driverId: oid(),
      status: "IN_PROGRESS",
    };

    const filteredOrders = [
      {
        _id: oid(),
        assignedDriverId: filterQuery.driverId,
        status: "IN_PROGRESS",
      },
    ];

    jest.spyOn(OrderService, "getOrders").mockResolvedValue(filteredOrders as unknown as IOrder[]);

    mockReq = { query: filterQuery };

    await getOrders(mockReq as any, mockRes as any);

    expect(OrderService.getOrders).toHaveBeenCalledWith(filterQuery);
    expect(mockJson).toHaveBeenCalledWith(filteredOrders);
  });


  it("should return 400 when getOrders throws an error", async () => {
    jest
      .spyOn(OrderService, "getOrders")
      .mockRejectedValue(new Error("Database error"));

    mockReq = { query: {} };

    await getOrders(mockReq as any, mockRes as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: "Database error" });
  });
});
