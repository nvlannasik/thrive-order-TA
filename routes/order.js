const router = require("express").Router();
const Order = require("../Models/Order");
const logger = require("../utils/logger");

//Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send({
      status: "success",
      message: "Orders retrieved successfully",
      data: orders,
    });
    logger.info("Orders retrieved successfully");
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error retrieving orders",
      data: err,
    });
    logger.error("Error retrieving orders");
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
    logger.error("Order not found");
  }

  try {
    res.status(200).send({
      status: "success",
      message: "Order retrieved successfully",
      data: order,
    });
    logger.info("Order retrieved successfully");
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error retrieving order",
      data: err,
    });
    logger.error("Error retrieving order");
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
    logger.info("Order created successfully");
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error creating order",
      data: err,
    });
    logger.error("Error creating order");
  }
});

//Update order

router.patch("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
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
        },
      }
    );
    res.status(200).send({
      status: "success",
      message: "Order updated successfully",
      data: updatedOrder,
    });
    logger.info("Order updated successfully");
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error updating order",
      data: err,
    });
    logger.error("Error updating order");
  }
});

//Update product stock

router.patch("/updateStock/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          orderItems: req.body.orderItems,
        },
      }
    );
    res.status(200).send({
      status: "success",
      message: "Order updated successfully",
      data: updatedOrder,
    });
    logger.info("Order updated successfully");
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Error updating order",
      data: err,
    });
    logger.error("Error updating order");
  }
});

module.exports = router;
