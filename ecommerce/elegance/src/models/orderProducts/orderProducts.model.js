const db = require("..");
const httpError = require("http-errors");

const orderProductsTable = db.orderProducts;

// Créer une entrée dans orders_products
const createOrderProducts = async (newOrderProduct) => {
  try {
    // Validate required fields
    const { orderId, productId, quantity, price, sizeId, colorId } = newOrderProduct;
    if (orderId === undefined || productId === undefined || quantity === undefined || price === undefined || sizeId === undefined || colorId === undefined) {
      throw httpError.BadRequest(
        'Missing required fields. Ensure orderId, productId, quantity, price, sizeId, and colorId are provided.'
      );
    }

    const orderData = {
      orderId: newOrderProduct.orderId,
      productId: newOrderProduct.productId,
      quantity: newOrderProduct.quantity,
      price: newOrderProduct.price,
      sizeId: newOrderProduct.sizeId,
      colorId: newOrderProduct.colorId
    };

    // Vérifier si le produit (avec la même taille et couleur) existe déjà dans la commande
    const existingEntry = await orderProductsTable.findOne({
      where: {
        orderId: orderData.orderId,     // Corrected field name
        productId: orderData.productId, // Corrected field name
        sizeId: orderData.sizeId,       // Added for more specific check
        colorId: orderData.colorId      // Added for more specific check
      },
    });

    if (existingEntry) {
      // If the exact product variant is already in the order, throw a conflict error.
      // Alternatively, you might want to update the quantity of the existing entry.
      throw httpError.Conflict(
        "This product with the specified size and color is already in the order"
      );
    }

    // Créer l'entrée dans la base de données
    const createdProduct = await orderProductsTable.create(orderData);
    return createdProduct;
  } catch (error) {
    console.error('Erreur dans createOrderProducts:', error);
    // If the error is already an HttpError (like the Conflict above), re-throw it.
    if (error instanceof httpError.HttpError) {
        throw error;
    }
    // For other types of errors, throw a generic internal server error.
    throw httpError.InternalServerError("Failed to create order product entry. Please check server logs.");
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
