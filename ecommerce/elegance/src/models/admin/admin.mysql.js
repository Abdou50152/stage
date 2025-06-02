const adminModel = (sequileze, DataTypes) => {
    const admin = sequileze.define(
      "admin",
          {
      id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true
       
      },
     full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active"
  }
    },
    // paranoid is responsible for the soft deletes of entities
      {
        paranoid: true,
      }
    );
    return admin;
  };
  
  module.exports = adminModel;
  