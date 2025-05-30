const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3000;

// routers path
const categoriesRouter = require("./src/routers/categories/categories.routes");
const productsRouter = require("./src/routers/products/products.routes");
const adminRouter = require("./src/routers/admin/admin.routes");
const usersRouter = require("./src/routers/users/users.routes");
const ordersRouter = require("./src/routers/orders/orders.routes");
const orderProductsRouter = require("./src/routers/orderProducts/orderProducts.routes");
const colorsRouter = require("./src/routers/colors/colors.routes");
const sizeRouter = require("./src/routers/size/size.routes");
const productImagesRouter = require("./src/routers/productImages/productImages.routes");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

// Routes
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/orderProducts",orderProductsRouter);
app.use("/api/colors",colorsRouter);
app.use("/api/size",sizeRouter);
app.use("/api/productImages", productImagesRouter);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err); // Utilise console.error pour les erreurs
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// Server launch
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
