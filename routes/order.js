const router = require("express").Router();
const Order = require("../Models/Order");
const logger = require("../utils/logger");
const ampq = require("amqplib/callback_api");
const axios = require("axios");

//Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send({
      status: "success",
      message: "Orders retrieved successfully",
      data: orders,
    });
    logger.info(
      `[${req.method}] - 200 - ${res.statusMessage} - ${req.originalUrl} - ${req.ip}`
    );
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error retrieving orders",
      data: err,
    });
    logger.error(
      `[${req.method}] - 400 - ${res.statusMessage} - ${req.originalUrl} - ${req.ip}`
    );
  }
});

//Get by id
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).send({
      status: "error",
      message: "Order not found",
    });
    logger.error(
      `[${req.method}] - 404 - ${res.statusMessage} - ${req.originalUrl} - ${req.ip}`
    );
  }

  try {
    res.status(200).send({
      status: "success",
      message: "Order retrieved successfully",
      data: order,
    });
    logger.info(
      `[${req.method}] - 200 - ${res.statusMessage} - ${req.originalUrl} - ${req.ip}`
    );
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error retrieving order",
      data: err,
    });
    logger.error(
      `[${req.method}] - 400 - ${res.statusMessage} - ${req.originalUrl} - ${req.ip}`
    );
  }
});

//POST order
router.post("/", async (req, res) => {
  const order = new Order({
    orderNumber: req.body.orderNumber,
    orderDate: req.body.orderDate,
    orderStatus: req.body.orderStatus,
    orderTotal: req.body.orderTotal,
    orderItems: req.body.orderItems,
    customer: req.body.customer,
    emailCustomer: req.body.emailCustomer,
    shippingAddress: req.body.shippingAddress,
    billingAddress: req.body.billingAddress,
    payment: req.body.payment,
  });

  try {
    const savedOrder = await order.save();
    res.status(200).send({
      status: "success",
      message: "Order created successfully",
      data: savedOrder,
    });

    //mengurangi stock product dari order yang dibuat
    const orderItems = req.body.orderItems;
    orderItems.forEach(async (item) => {
      const product = await axios.get(
        `${process.env.API_GATEWAY}/api/products/` + item._id
      );
      const productData = product.data.data;
      const productStock = productData.quantity;
      const productStockUpdate = productStock - item.quantity;
      const productUpdate = await axios.patch(
        `${process.env.API_GATEWAY}/api/products/` + item._id,
        {
          quantity: productStockUpdate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      logger.info(`Product stock updated`);
    });

    //kirim pesan ke queue
    ampq.connect("amqp://annasik.site", function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = "order";
        var msg = JSON.stringify({
          from: "nvlannasik@adaptivenetworklab.org",
          to: req.body.emailCustomer,
          subject: "Order Confirmation",
          text: "Your order has been confirmed",
        });

        channel.assertQueue(queue, {
          durable: false,
        });
        channel.sendToQueue(queue, Buffer.from(msg));
        logger.info(`Sent ${msg}`);
      });
    });
    //
    logger.info(
      `[${req.method}] - 200 - ${res.statusMessage} - ${req.originalUrl} - ${req.ip}`
    );
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error creating order",
      data: err,
    });
    logger.error(
      `[${req.method}] - 400 - ${res.statusMessage} - ${req.originalUrl} - ${req.ip}`
    );
  }
});

module.exports = router;
