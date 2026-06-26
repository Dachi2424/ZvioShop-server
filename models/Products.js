
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define("Products", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "პროდუქტის სახელი აუცილებელია"}
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "მიუთითეთ პროდუქტის ბრენდი"}
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {msg: "მიუთითეთ პროდუქტის ფასი"},
        max: {args: [99999999.99], msg: "ფასი არ უნდა აღემატებოდეს 99999999.99₾"},
        min: {args: [0], msg: "ფასი უნდა იყოს დადებითი რიცხვი"}
      }
    },
    amperage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: "მიუთითეთ ამპერაჟი"},
        min: {args: [0], msg: "ამპერაჟი უნდა იყოს დადებითი რიცხვი"}
      }
    },
    image: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    warranty: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: {args: [0], msg: "გარანტია უნდა იყოს დადებითი რიცხვი"} 
      }
    },
    voltage: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 12,
      allowNull: false,
      validate: {
        min: {args: [0], msg: "ძაბვა უნდა იყოს დადებითი რიცხვი"}
      }
    }
  })


  return Products
}