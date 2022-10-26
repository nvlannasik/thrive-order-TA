const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.DB_CONNECTION);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

/* Testing the GET /api/order endpoint. */

describe("GET /api/order", () => {
  it("should return 200 OK", () => {
    return request(app).get("/api/order").expect(200);
  });
});

/* Testing the POST /api/order endpoint. */

describe("POST /api/order", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .post("/api/order")
      .send({
        orderNumber: 1,
        orderDate: Date.now(),
        orderStatus: "Pending",
        orderTotal: 100,
        orderItems: [
          {
            _id: 1,
            product: "5f9f1b9b9b9b9b9b9b9b9b9b",
            quantity: 1,
            price: 100,
          },
        ],
        customer: "5f9f1b9b9b9b9b9b9b9b9b9b",
        emailCustomer: "imbron@gmail.com",
        shippingAddress: "5f9f1b9b9b9b9b9b9b9b9b9b",
        billingAddress: "5f9f1b9b9b9b9b9b9b9b9b9b",
        payment: "5f9f1b9b9b9b9b9b9b9b9b9b",
      });
  });
});

/* Testing the GET /api/order/:id endpoint. */

describe("GET /api/order/:id", () => {
  it("should return 200 OK", () => {
    return request(app).get("/api/order/1").expect(200);
  });
});
