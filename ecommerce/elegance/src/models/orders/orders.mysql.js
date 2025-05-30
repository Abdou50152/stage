const orderModel = (sequelize, DataTypes) => {
  const order = sequelize.define(
    "orders",
    {
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "new",
          "confirmed",
          "pending",
          "shipped",
          "refunded"
        ),
        defaultValue: "new",
      },
    },
    {
      paranoid: true,
    }
  );

  return order;
};

module.exports = orderModel;
