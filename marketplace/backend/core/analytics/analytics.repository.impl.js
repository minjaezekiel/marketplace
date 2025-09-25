// ../analytics/analytics.repository.impl.js
const AnalyticsRepository = require('./analytics.repository');
const { Op, Sequelize } = require('sequelize');
const OrderModel = require('../models/order.model');
const OrderItemModel = require('../models/order-item.model');

class AnalyticsRepositoryImpl extends AnalyticsRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.orderModel = OrderModel(sequelize);
    this.orderItemModel = OrderItemModel(sequelize);
  }

  async getSalesData(tenantId, startDate, endDate) {
    const salesData = await this.orderModel.findAll({
      where: {
        tenantId,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'total']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']]
    });

    return salesData.map(item => ({
      date: item.dataValues.date,
      total: parseFloat(item.dataValues.total)
    }));
  }

  async getTopProducts(tenantId, limit = 10) {
    const topProducts = await this.orderItemModel.findAll({
      include: [{
        model: this.orderModel,
        where: { tenantId }
      }],
      attributes: [
        'productId',
        'productName',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
        [Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'totalRevenue']
      ],
      group: ['productId', 'productName'],
      order: [[Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'DESC']],
      limit: parseInt(limit)
    });

    return topProducts.map(item => ({
      productId: item.productId,
      productName: item.productName,
      totalQuantity: parseInt(item.dataValues.totalQuantity),
      totalRevenue: parseFloat(item.dataValues.totalRevenue)
    }));
  }

  async getCustomerMetrics(tenantId, startDate, endDate) {
    const customerMetrics = await this.orderModel.findAll({
      where: {
        tenantId,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      attributes: [
        'customerId',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'totalSpent']
      ],
      group: ['customerId'],
      order: [[Sequelize.fn('SUM', Sequelize.col('total')), 'DESC']]
    });

    return customerMetrics.map(item => ({
      customerId: item.customerId,
      orderCount: parseInt(item.dataValues.orderCount),
      totalSpent: parseFloat(item.dataValues.totalSpent)
    }));
  }
}

module.exports = AnalyticsRepositoryImpl;