// src/domain/entities/product.js
const ProductAttributes = require('./product-attributes');

class Product {
  constructor({
    id,
    name,
    description,
    price,
    sku,
    tenantId,
    categoryId,
    isActive = true,
    inStock = true,
    attributes,
    images = [],
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.sku = sku;
    this.tenantId = tenantId;
    this.categoryId = categoryId;
    this.isActive = isActive;
    this.inStock = inStock;
    this.attributes = attributes ? new ProductAttributes(attributes) : new ProductAttributes({});
    this.images = images;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  addImage(image) {
    this.images.push(image);
    return this;
  }

  setAttribute(key, value) {
    this.attributes.setAttribute(key, value);
    return this;
  }

  getAttribute(key) {
    return this.attributes.getAttribute(key);
  }

  isAgricultural() {
    return this.attributes.getAttribute('type') === 'agricultural';
  }

  isClothing() {
    return this.attributes.getAttribute('type') === 'clothing';
  }

  getUnit() {
    return this.attributes.getAttribute('unit') || 'piece';
  }

  getSizes() {
    return this.attributes.getAttribute('sizes') || [];
  }
}

module.exports = Product;