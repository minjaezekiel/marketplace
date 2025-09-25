// backend/core/product/create-product.use-case.js
class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productData, tenantId) {
    return await this.productRepository.create({
      ...productData,
      tenantId
    });
  }
}

module.exports = CreateProductUseCase;