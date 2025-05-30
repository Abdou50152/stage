const db = require("..");
const httpError = require("http-errors");

const orderProducts = db.orderProducts;

// Créer une entrée dans orders_products
const createOrderProducts = async (neworderProducts) => {
  const existingEntry = await orderProducts.findOne({
    where: {
      order_id: neworderProducts.order_id,
      product_id: neworderProducts.products_id,
    },
  });

  if (existingEntry) {
    throw httpError.Conflict("This product is already in the order");
  }

  const orderProducts = await orderProducts.create(neworderProducts);
  return orderProducts;
};

// Récupérer tous les order_products (avec pagination)
const getAllOrderProducts = async (skip = 0, limit = 10) => {
  const listPromise = orderProducts.findAll({
    offset: skip,
    limit: limit,
  });

  const countPromise = orderProducts.count();

  const [orderProducts, count] = await Promise.all([listPromise, countPromise]);
  return { count, orderProducts };
};

// Récupérer un order_product spécifique
const getOrderProductsById = async (id) => {
  const entry = await orderProducts.findOne({
    where: { id },
  });

  if (!entry) {
    throw httpError.NotFound("Order product entry not found");
  }

  return entry;
};

// Mettre à jour une entrée order_product
const updateOrderProducts = async (newData) => {
  const existing = await getOrderProductsById(newData.id);
  if (!existing) {
    throw httpError.NotFound("Order product entry does not exist");
  }

  await OrderProducts.update(newData, {
    where: { id: newData.id },
  });

  return newData;
};

// Supprimer une entrée order_product
const deleteOrderProductsById = async (id) => {
  const existing = await orderProducts.findOne({ where: { id } });
  if (!existing) {
    throw httpError.NotFound("Order product entry does not exist");
  }

  await orderProducts.destroy({ where: { id } });
};

module.exports = {
  createOrderProducts,
  getAllOrderProducts,
  getOrderProductsById,
  updateOrderProducts,
  deleteOrderProductsById,
};
