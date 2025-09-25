// src/config/database.js (update this file)

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Import models
const TenantModel = require('../infrastructure/database/models/tenant.model');
const UserModel = require('../infrastructure/database/models/user.model');
const ProductModel = require('../infrastructure/database/models/product.model');
const CategoryModel = require('../infrastructure/database/models/category.model');
const OrderModel = require('../infrastructure/database/models/order.model');
const OrderItemModel = require('../infrastructure/database/models/order-item.model');
const CartModel = require('../infrastructure/database/models/cart.model');
const ChatModel = require('../infrastructure/database/models/chat.model');

// Initialize models
const Tenant = TenantModel(sequelize);
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const Category = CategoryModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Cart = CartModel(sequelize);
const Chat = ChatModel(sequelize);

// Define associations
User.hasMany(Tenant, { foreignKey: 'ownerId' });
Tenant.belongsTo(User, { foreignKey: 'ownerId' });

Tenant.hasMany(Product, { foreignKey: 'tenantId' });
Product.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Category, { foreignKey: 'tenantId' });
Category.belongsTo(Tenant, { foreignKey: 'tenantId' });

Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Tenant.hasMany(Order, { foreignKey: 'tenantId' });
Order.belongsTo(Tenant, { foreignKey: 'tenantId' });

User.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(User, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Tenant.hasMany(Cart, { foreignKey: 'tenantId' });
Cart.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Chat, { foreignKey: 'tenantId' });
Chat.belongsTo(Tenant, { foreignKey: 'tenantId' });

User.hasMany(Chat, { foreignKey: 'senderId', as: 'sentMessages' });
Chat.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Chat, { foreignKey: 'receiverId', as: 'receivedMessages' });
Chat.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

module.exports = {
  sequelize,
  Tenant,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Cart,
  Chat
};