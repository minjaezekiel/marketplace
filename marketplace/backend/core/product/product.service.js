// backend/core/product/product.service.js
const ProductRepository = require('./product.repository');
const Product = require('./product');
const { v4: uuidv4 } = require('uuid');

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async create(productData, tenantId) {
    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = this.generateSKU(productData.name);
    }

    // Create product
    const product = await this.productRepository.create({
      ...productData,
      tenantId
    });
    
    return product;
  }

  async findById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async findByTenant(tenantId, options = {}) {
    return await this.productRepository.findByTenant(tenantId, options);
  }

  generateSKU(name) {
    const prefix = name.substring(0, 3).toUpperCase();
    const suffix = uuidv4().substring(0, 8).toUpperCase();
    return `${prefix}-${suffix}`;
  }
}

module.exports = ProductService;