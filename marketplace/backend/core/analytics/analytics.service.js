// backend/core/analytics/analytics.service.js
const AnalyticsRepository = require('./analytics.repository');
const OrderRepository = require('../orders/order.repository');
const ProductRepository = require('../product/product.repository');

class AnalyticsService {
  constructor(analyticsRepository, orderRepository, productRepository) {
    this.analyticsRepository = analyticsRepository;
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async getProfitLossAnalysis(tenantId, startDate, endDate) {
    // Get all orders within the date range
    const orders = await this.orderRepository.findByTenantAndDateRange(
      tenantId, 
      startDate, 
      endDate
    );
    
    // Calculate metrics
    let revenue = 0;
    let costs = 0;
    let orderCount = orders.length;
    let itemsSold = 0;
    
    // Get all product IDs from orders to fetch cost data
    const productIds = new Set();
    orders.forEach(order => {
      order.items.forEach(item => {
        productIds.add(item.productId);
      });
    });
    
    // Fetch product cost data
    const products = await this.productRepository.findByIds(Array.from(productIds));
    const productCostMap = {};
    products.forEach(product => {
      productCostMap[product.id] = product.cost || 0;
    });
    
    // Calculate revenue and costs
    orders.forEach(order => {
      revenue += parseFloat(order.total);
      
      order.items.forEach(item => {
        itemsSold += item.quantity;
        // Use product cost if available, otherwise estimate 60% of price
        const cost = productCostMap[item.productId] || (item.price * 0.6);
        costs += cost * item.quantity;
      });
    });
    
    const profitLoss = revenue - costs;
    
    return {
      revenue,
      costs,
      profitLoss,
      orderCount,
      itemsSold,
      averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
      profitMargin: revenue > 0 ? (profitLoss / revenue) * 100 : 0
    };
  }

  async getSalesData(tenantId, startDate, endDate) {
    return await this.analyticsRepository.getSalesData(tenantId, startDate, endDate);
  }

  async getTopProducts(tenantId, limit = 10) {
    return await this.analyticsRepository.getTopProducts(tenantId, limit);
  }

  async getCustomerMetrics(tenantId, startDate, endDate) {
    return await this.analyticsRepository.getCustomerMetrics(tenantId, startDate, endDate);
  }

  async getInventoryReport(tenantId) {
    const products = await this.productRepository.findByTenant(tenantId);
    
    let totalInventoryValue = 0;
    let lowStockProducts = [];
    let outOfStockProducts = [];
    
    products.products.forEach(product => {
      const inventoryValue = product.price * product.stock;
      totalInventoryValue += inventoryValue;
      
      if (product.stock === 0) {
        outOfStockProducts.push(product);
      } else if (product.stock < 10) {
        lowStockProducts.push(product);
      }
    });
    
    return {
      totalProducts: products.total,
      totalInventoryValue,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      lowStockItems: lowStockProducts,
      outOfStockItems: outOfStockProducts
    };
  }

  async getSalesByCategory(tenantId, startDate, endDate) {
    // This would require a category repository and more complex queries
    // For now, we'll return a placeholder implementation
    return [
      { category: 'Electronics', sales: 12500 },
      { category: 'Clothing', sales: 8700 },
      { category: 'Home & Kitchen', sales: 5400 }
    ];
  }
}

module.exports = AnalyticsService;