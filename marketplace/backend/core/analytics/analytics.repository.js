// ../analytics/analytics.repository.js
class AnalyticsRepository {
  async getSalesData(tenantId, startDate, endDate) {
    throw new Error('Method not implemented');
  }

  async getTopProducts(tenantId, limit = 10) {
    throw new Error('Method not implemented');
  }

  async getCustomerMetrics(tenantId, startDate, endDate) {
    throw new Error('Method not implemented');
  }
}

module.exports = AnalyticsRepository;