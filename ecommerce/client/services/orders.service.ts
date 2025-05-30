import { Order, OrderProduct } from '../types/order';

const API_URL = 'http://localhost:3001';

export const OrdersService = {
  // Créer une nouvelle commande
  createOrder: async (orderData: Omit<Order, 'id'>): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      // Fallback : sauvegarder dans le localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = { ...orderData, id: Date.now() };
      existingOrders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      return newOrder;
    }
  },

  // Ajouter des produits à une commande
  addProductsToOrder: async (orderId: number, products: Array<{ product_id: number; quantity: number; price: number; color?: string; size?: string; }>): Promise<void> => {
    try {
      for (const product of products) {
        const orderProduct = {
          orderId,
          productId: product.product_id,
          quantity: product.quantity,
          price: product.price,
          // Ajouter des valeurs par défaut pour les champs obligatoires
          colorId: 1, // Valeur par défaut pour colorId
          sizeId: 1   // Valeur par défaut pour sizeId
        };

        const response = await fetch(`${API_URL}/orderProducts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderProduct)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout des produits à la commande:', error);
      // En cas d'erreur, on stocke quand même les produits dans le localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderIndex = existingOrders.findIndex((o: Order) => o.id === orderId);
      if (orderIndex !== -1) {
        existingOrders[orderIndex].products = products;
        localStorage.setItem('orders', JSON.stringify(existingOrders));
      }
    }
  }
};
