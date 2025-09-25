// backend/core/category/category.js
class Category {
  constructor({
    id,
    name,
    description,
    tenantId,
    parentId,
    isActive = true,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.tenantId = tenantId;
    this.parentId = parentId;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isRoot() {
    return !this.parentId;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      tenantId: this.tenantId,
      parentId: this.parentId,
      isActive: this.isActive,
      isRoot: this.isRoot(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Category;