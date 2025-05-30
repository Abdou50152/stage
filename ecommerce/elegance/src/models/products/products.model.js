const db = require("..");
const httpError = require("http-errors");

const Products = db.products;
const Colors = db.colors;
const Sizes = db.size;

  //Create Products
  const createProducts = async (newProducts) => {
   const existProducts = await Products.findOne({
      where: {
        name : newProducts.name,
      },
    });
    if (existProducts) {
      throw httpError.Conflict("Product Already exist");
    } else {
      const products = await Products.create(newProducts);
      return products;
    }
  };
  
  //Get All Products
  const getAllProducts = async (skip, limit) => {
    const productsPromise = Products.findAll({
      offset: skip,
      limit: limit,
      include: [
        { model: db.categories },
        { model: Colors },
        { model: Sizes }
      ]
    });
    const countPromise = Products.count();
    const [products, count] = await Promise.all([productsPromise, countPromise]);
    return { count, products };
  };

  
  //Get Products by ID
  const getProductsById = async (id) => {
    const products = await Products.findOne({
      where: {
        id,
      },
      include: [
        { model: db.categories },
        { model: Colors },
        { model: Sizes }
      ]
    });
    if (!products) {
      throw httpError.NotFound("Product Not found");
    } else {
      return products;
    }
  };
  
  //Update Products
  const updateProducts = async (newProduct) => {
    const product = await getProductsById(newProduct.id);
    if (product) {
      if (product != newProduct)
        await Products.update(newProduct, {
          where: { id: newProduct.id },
        });
      return newProduct;
    } else {
      throw httpError.NotFound("Product does not exist");
    }
  };
  
  //Delete Products by id
  const deleteProductsById = async (id) => {
    const productsExist = await Products.findOne({ where: { id } });
    if (!productsExist) {
      throw httpError.NotFound("Product does not exist");
    } else {
      // Delete all associated product images first
      try {
        const { deleteAllProductImages } = require('../productImages/productImages.model');
        await deleteAllProductImages(id);
      } catch (error) {
        console.error('Error deleting product images:', error);
        // Continue with product deletion even if image deletion fails
      }
      
      await Products.destroy({ where: { id } });
    }
  };
  
  // Get product colors
  const getProductColors = async (productId) => {
    const product = await getProductsById(productId);
    const colors = await product.getColors();
    return colors;
  };

  // Add color to product
  const addColorToProduct = async (productId, colorId) => {
    const product = await getProductsById(productId);
    const color = await Colors.findByPk(colorId);
    
    if (!color) {
      throw httpError.NotFound("Color not found");
    }
    
    await product.addColor(color);
    return { message: "Color added to product successfully" };
  };

  // Remove color from product
  const removeColorFromProduct = async (productId, colorId) => {
    const product = await getProductsById(productId);
    const color = await Colors.findByPk(colorId);
    
    if (!color) {
      throw httpError.NotFound("Color not found");
    }
    
    await product.removeColor(color);
    return { message: "Color removed from product successfully" };
  };

  // Get product sizes
  const getProductSizes = async (productId) => {
    const product = await getProductsById(productId);
    const sizes = await product.getSizes();
    return sizes;
  };

  // Add size to product
  const addSizeToProduct = async (productId, sizeId) => {
    const product = await getProductsById(productId);
    const size = await Sizes.findByPk(sizeId);
    
    if (!size) {
      throw httpError.NotFound("Size not found");
    }
    
    await product.addSize(size);
    return { message: "Size added to product successfully" };
  };

  // Remove size from product
  const removeSizeFromProduct = async (productId, sizeId) => {
    const product = await getProductsById(productId);
    const size = await Sizes.findByPk(sizeId);
    
    if (!size) {
      throw httpError.NotFound("Size not found");
    }
    
    await product.removeSize(size);
    return { message: "Size removed from product successfully" };
  };

  // Update product image
  const updateProductImage = async (productId, imageUrl) => {
    const product = await getProductsById(productId);
    await product.update({ imageUrl });
    return { message: "Image updated successfully", imageUrl };
  };

  module.exports = {
    createProducts,
    getAllProducts,
    getProductsById,
    updateProducts,
    deleteProductsById,
    getProductColors,
    addColorToProduct,
    removeColorFromProduct,
    getProductSizes,
    addSizeToProduct,
    removeSizeFromProduct,
    updateProductImage
  };
  