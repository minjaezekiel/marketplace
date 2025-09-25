// backend/core/cart/cart.repository.impl.js
const CartRepository = require('./cart.repository');
const CartModel = require('../models/cart.model');
const Cart = require('./cart');

class CartRepositoryImpl extends CartRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.cartModel = CartModel(sequelize);
  }

  async create(cartData) {
    const cart = await this.cartModel.create(cartData);
    return this.toDomain(cart);
  }

  async findById(id) {
    const cart = await this.cartModel.findByPk(id);
    return cart ? this.toDomain(cart) : null;
  }

  async findByUser(userId, tenantId) {
    let cart = await this.cartModel.findOne({
      where: { userId, tenantId }
    });
    
    if (!cart) {
      cart = await this.cartModel.create({ userId, tenantId, items: [] });
    }
    
    return this.toDomain(cart);
  }

  async update(id, cartData) {
    const [updated] = await this.cartModel.update(cartData, {
      where: { id }
    });
    if (updated) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id) {
    const deleted = await this.cartModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  toDomain(cartModel) {
    const items = cartModel.items ? JSON.parse(cartModel.items) : [];
    
    return new Cart({
      id: cartModel.id,
      userId: cartModel.userId,
      tenantId: cartModel.tenantId,
      items,
      createdAt: cartModel.createdAt,
      updatedAt: cartModel.updatedAt
    });
  }
}

module.exports = CartRepositoryImpl;