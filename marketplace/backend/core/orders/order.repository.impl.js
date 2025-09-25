// src/infrastructure/database/repositories/order.repository.impl.js
const OrderRepository = require('./order.repository');
const OrderModel = require('../models/order.model');
const Order = require('./order');
const { Op } = require('sequelize');

class OrderRepositoryImpl extends OrderRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.orderModel = OrderModel(sequelize);
  }

  async create(orderData) {
    const order = await this.orderModel.create(orderData);
    return this.toDomain(order);
  }

  async findById(id) {
    const order = await this.orderModel.findByPk(id, {
      include: ['OrderItems']
    });
    return order ? this.toDomain(order) : null;
  }

  async findByTenant(tenantId, options = {}) {
    const { page = 1, limit = 10, status } = options;
    const offset = (page - 1) * limit;

    const whereClause = {
      tenantId
    };

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await this.orderModel.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      include: ['OrderItems'],
      order: [['createdAt', 'DESC']]
    });

    return {
      orders: rows.map(order => this.toDomain(order)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  async findByTenantAndDateRange(tenantId, startDate, endDate) {
    const orders = await this.orderModel.findAll({
      where: {
        tenantId,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: ['OrderItems']
    });
    return orders.map(order => this.toDomain(order));
  }

  async update(id, orderData) {
    const [updated] = await this.orderModel.update(orderData, {
      where: { id }
    });
    if (updated) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id) {
    const deleted = await this.orderModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  toDomain(orderModel) {
    const items = orderModel.OrderItems ? orderModel.OrderItems.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      attributes: item.attributes ? JSON.parse(item.attributes) : {}
    })) : [];

    return new Order({
      id: orderModel.id,
      orderNumber: orderModel.orderNumber,
      tenantId: orderModel.tenantId,
      customerId: orderModel.customerId,
      status: orderModel.status,
      total: orderModel.total,
      items,
      createdAt: orderModel.createdAt,
      updatedAt: orderModel.updatedAt
    });
  }
}

module.exports = OrderRepositoryImpl;