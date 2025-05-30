const db = require("..");
const httpError = require("http-errors");

const orderProductsTable = db.orderProducts;

// Créer une entrée dans orders_products
const createOrderProducts = async (newOrderProduct) => {
  try {
    // Adapter les noms de champs si nécessaire
    const orderData = {
      order_id: newOrderProduct.orderId,
      product_id: newOrderProduct.productId,
      quantity: newOrderProduct.quantity,
      price: newOrderProduct.price
    };

    // Vérifier si le produit existe déjà dans la commande
    const existingEntry = await orderProductsTable.findOne({
      where: {
        order_id: orderData.order_id,
        product_id: orderData.product_id,
      },
    });

    if (existingEntry) {
      throw httpError.Conflict("This product is already in the order");
    }

    // Créer l'entrée dans la base de données
    const createdProduct = await orderProductsTable.create(orderData);
    return createdProduct;
  } catch (error) {
    console.error('Erreur dans createOrderProducts:', error);
    throw error;
  }
};

// Récupérer tous les order_products (avec pagination)
const getAllOrderProducts = async (skip = 0, limit = 10) => {
  const listPromise = orderProductsTable.findAll({
    offset: skip,
    limit: limit,
  });

  const countPromise = orderProductsTable.count();

  const [products, count] = await Promise.all([listPromise, countPromise]);
  return { count, products };
};

// Récupérer un order_product spécifique
const getOrderProductsById = async (id) => {
  const entry = await orderProductsTable.findOne({
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

  await orderProductsTable.update(newData, {
    where: { id: newData.id },
  });

  return newData;
};

// Supprimer une entrée order_product
const deleteOrderProductsById = async (id) => {
  const existing = await orderProductsTable.findOne({ where: { id } });
  if (!existing) {
    throw httpError.NotFound("Order product entry does not exist");
  }

  await orderProductsTable.destroy({ where: { id } });
};

module.exports = {
  createOrderProducts,
  getAllOrderProducts,
  getOrderProductsById,
  updateOrderProducts,
  deleteOrderProductsById,
};
