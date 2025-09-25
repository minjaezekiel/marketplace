// backend/core/product/product.repository.js
class ProductRepository {
  async create(productData) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByTenant(tenantId, options = {}) {
    throw new Error('Method not implemented');
  }

  async update(id, productData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findByCategory(categoryId, tenantId) {
    throw new Error('Method not implemented');
  }

  async search(query, tenantId, options = {}) {
    throw new Error('Method not implemented');
  }
}

module.exports = ProductRepository;