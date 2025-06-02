const productsModel = (sequileze, DataTypes) => {
    const Products = sequileze.define(
      "product",
          {
            id: {
              type: DataTypes.INTEGER,
              primaryKey:true,
              autoIncrement: true
             
            },
      
      stock : {
         type : DataTypes.DOUBLE,
         allowNull: true,
      },
      price : {
         type : DataTypes.DOUBLE,
         allowNull: true,
      },
      description : {
         type : DataTypes.TEXT,
         allowNull: true,
      },
      name : {
         type : DataTypes.STRING,
         allowNull: true,
      },
      slug : {
         type : DataTypes.STRING,
         allowNull: true,
      },
      imageUrl : {
         type : DataTypes.STRING,
         allowNull: true,
      },
    },
      {
        paranoid: false,
      }
    );
    return Products;
  };
  
  module.exports = productsModel;
  