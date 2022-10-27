const mongoose = require("mongoose");
autoIncrement = require("mongoose-auto-increment");
require("dotenv");
let connection = mongoose.createConnection(process.env.DB_CONNECTION);
autoIncrement.initialize(connection);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: Number,
    orderDate: String,
    orderStatus: String,
    orderTotal: Number,
    orderItems: [
      {
        _id: {
          type: mongoose.Schema.Types.Number,
          ref: "Product",
        },
        product: String,
        quantity: {
          type: mongoose.Schema.Types.Number,
          ref: "Product",
        },
        price: {
          type: mongoose.Schema.Types.Number,
          ref: "Product",
        },
      },
    ],
    customer: String,
    emailCustomer: String,
    shippingAddress: String,
    payment: String,
  },
  { versionKey: false }
);

orderSchema.plugin(autoIncrement.plugin, "Order");
module.exports = mongoose.model("Order", orderSchema);
