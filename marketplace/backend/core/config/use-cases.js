// src/config/use-cases.js

const ProductRepositoryImpl = require('../product/product.repository.impl');
const TenantRepositoryImpl = require('../tenant/tenant.repository.impl');
const OrderRepositoryImpl = require('../orders/order.repository.impl');
const AnalyticsRepositoryImpl = require('../analytics/analytics.repository.impl');
const ChatRepositoryImpl = require('../chat/chat.repository.impl');
const CartRepositoryImpl = require('../cart/cart.repository.impl');
const UserRepositoryImpl = require('../user/user.repository.impl');
const CategoryRepositoryImpl = require('../infrastructure/database/repositories/category.repository.impl');

const CreateProductUseCase = require('../product/create-product.use-case');
const GetTenantProductsUseCase = require('../tenant/get-tenant-products.use-case');
const GetProfitLossAnalysisUseCase = require('../analytics/get-profit-loss-analysis.use-case');
const ProductService = require('../product/product.service');
const AnalyticsService = require('../analytics/analytics.service');
const ChatService = require('../chat/chat.service');
const OrderService = require('../orders/order.service');
const CartService = require('../cart/cart.service');
const TenantService = require('../tenant/tenant.service');
const UserService = require('../user/user.service');
const CategoryService = require('../application/services/category.service');

const sequelize = require('./database');

// Initialize repositories
const productRepository = new ProductRepositoryImpl(sequelize);
const tenantRepository = new TenantRepositoryImpl(sequelize);
const orderRepository = new OrderRepositoryImpl(sequelize);
const analyticsRepository = new AnalyticsRepositoryImpl(sequelize);
const chatRepository = new ChatRepositoryImpl(sequelize);
const cartRepository = new CartRepositoryImpl(sequelize);
const userRepository = new UserRepositoryImpl(sequelize);
const categoryRepository = new CategoryRepositoryImpl(sequelize);

// Initialize services
const productService = new ProductService(productRepository);
const analyticsService = new AnalyticsService(analyticsRepository, orderRepository, productRepository);
const chatService = new ChatService(chatRepository, tenantRepository);
const orderService = new OrderService(orderRepository, productRepository, cartRepository);
const cartService = new CartService(cartRepository, productRepository);
const tenantService = new TenantService(tenantRepository);
const userService = new UserService(userRepository);
const categoryService = new CategoryService(categoryRepository);

// Initialize use cases
const createProductUseCase = new CreateProductUseCase(productRepository);
const getTenantProductsUseCase = new GetTenantProductsUseCase(productRepository);
const getProfitLossAnalysisUseCase = new GetProfitLossAnalysisUseCase(analyticsService);

module.exports = {
  productRepository,
  tenantRepository,
  orderRepository,
  analyticsRepository,
  chatRepository,
  cartRepository,
  userRepository,
  categoryRepository,
  productService,
  analyticsService,
  chatService,
  orderService,
  cartService,
  tenantService,
  userService,
  categoryService,
  createProductUseCase,
  getTenantProductsUseCase,
  getProfitLossAnalysisUseCase
};