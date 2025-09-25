// src/infrastructure/database/repositories/product.repository.impl.js
const ProductRepository = require('./product.repository');
const ProductModel = require('../models/product.model');
const Product = require('./product');
const { Op } = require('sequelize');

class ProductRepositoryImpl extends ProductRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.productModel = ProductModel(sequelize);
  }

  async create(productData) {
    const product = await this.productModel.create(productData);
    return this.toDomain(product);
  }

  async findById(id) {
    const product = await this.productModel.findByPk(id);
    return product ? this.toDomain(product) : null;
  }

  async findByTenant(tenantId, options = {}) {
    const { page = 1, limit = 10, category, search } = options;
    const offset = (page - 1) * limit;

    const whereClause = {
      tenantId,
      isActive: true
    };

    if (category) {
      whereClause.categoryId = category;
    }

    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    const { count, rows } = await this.productModel.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    return {
      products: rows.map(product => this.toDomain(product)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  async update(id, productData) {
    const [updated] = await this.productModel.update(productData, {
      where: { id }
    });
    if (updated) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id) {
    const deleted = await this.productModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  async findByCategory(categoryId, tenantId) {
    const products = await this.productModel.findAll({
      where: {
        categoryId,
        tenantId,
        isActive: true
      }
    });
    return products.map(product => this.toDomain(product));
  }

  async findByIds(ids) {
  const products = await this.productModel.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    }
  });
  return products.map(product => this.toDomain(product));
}

async updateStock(productId, quantityChange) {
  const product = await this.productModel.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  const newStock = Math.max(0, product.stock + quantityChange);
  const inStock = newStock > 0;
  
  await this.productModel.update(
    { stock: newStock, inStock },
    { where: { id: productId } }
  );
  
  return this.findById(productId);
}

  async search(query, tenantId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.productModel.findAndCountAll({
      where: {
        tenantId,
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      },
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    return {
      products: rows.map(product => this.toDomain(product)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  toDomain(productModel) {
    const attributes = productModel.attributes ? JSON.parse(productModel.attributes) : {};
    const images = productModel.images ? JSON.parse(productModel.images) : [];
    
    return new Product({
      id: productModel.id,
      name: productModel.name,
      description: productModel.description,
      price: productModel.price,
      sku: productModel.sku,
      tenantId: productModel.tenantId,
      categoryId: productModel.categoryId,
      isActive: productModel.isActive,
      inStock: productModel.inStock,
      attributes,
      images,
      createdAt: productModel.createdAt,
      updatedAt: productModel.updatedAt
    });
  }
}

module.exports = ProductRepositoryImpl;