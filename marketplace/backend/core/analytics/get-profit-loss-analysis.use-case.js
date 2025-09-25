// src/application/use-cases/get-profit-loss-analysis.use-case.js
class GetProfitLossAnalysisUseCase {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  async execute(tenantId, startDate, endDate) {
    return await this.analyticsService.getProfitLossAnalysis(tenantId, startDate, endDate);
  }
}

module.exports = GetProfitLossAnalysisUseCase;