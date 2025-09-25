// src/domain/value-objects/product-attributes.js
class ProductAttributes {
  constructor(attributes = {}) {
    this.attributes = attributes;
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
    return this;
  }

  getAttribute(key) {
    return this.attributes[key];
  }

  toJSON() {
    return this.attributes;
  }
}

module.exports = ProductAttributes;