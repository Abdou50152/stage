const { validationResult } = require("express-validator");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrderById,
} = require("../../models/orders/orders.model");

const { getPagination } = require("../../config/query");

// Créer une commande
const httpCreateOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const order = req.body;

  try {
    const newOrder = await createOrder(order);
    return res.status(200).json(newOrder);
  } catch (err) {
    next(err);
  }
};

// Récupérer toutes les commandes
const httpGetAllOrders = async (req, res, next) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const list = await getAllOrders(skip, limit);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Récupérer une commande par ID
const httpGetOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderById = await getOrderById(id);
    return res.status(200).json(orderById);
  } catch (err) {
    next(err);
  }
};

// Mettre à jour une commande
const httpUpdateOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const updated = { ...req.body, id };
    const updatedOrder = await updateOrder(updated);
    return res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

// Supprimer une commande
const httpDeleteOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteOrderById(id);
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpCreateOrder,
  httpGetAllOrders,
  httpGetOrderById,
  httpUpdateOrder,
  httpDeleteOrderById,
};
