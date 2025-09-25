// /backend/core/tenant/get-tenant-products.use-case.js
class GetTenantProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(tenantId, options) {
    return await this.productRepository.findByTenant(tenantId, options);
  }
}

module.exports = GetTenantProductsUseCase;