// backend/core/category/category.repository.impl.js
const CategoryRepository = require('./category.repository.js');
const CategoryModel = require('../models/category.model');
const Category = require('../../../domain/entities/category');

class CategoryRepositoryImpl extends CategoryRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.categoryModel = CategoryModel(sequelize);
  }

  async create(categoryData) {
    const category = await this.categoryModel.create(categoryData);
    return this.toDomain(category);
  }

  async findById(id) {
    const category = await this.categoryModel.findByPk(id);
    return category ? this.toDomain(category) : null;
  }

  async findByTenant(tenantId, options = {}) {
    const { parentId } = options;
    
    const whereClause = {
      tenantId,
      isActive: true
    };
    
    if (parentId !== undefined) {
      whereClause.parentId = parentId;
    }
    
    const categories = await this.categoryModel.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    
    return categories.map(category => this.toDomain(category));
  }

  async update(id, categoryData) {
    const [updated] = await this.categoryModel.update(categoryData, {
      where: { id }
    });
    if (updated) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id) {
    const deleted = await this.categoryModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  toDomain(categoryModel) {
    return new Category({
      id: categoryModel.id,
      name: categoryModel.name,
      description: categoryModel.description,
      tenantId: categoryModel.tenantId,
      parentId: categoryModel.parentId,
      isActive: categoryModel.isActive,
      createdAt: categoryModel.createdAt,
      updatedAt: categoryModel.updatedAt
    });
  }
}

module.exports = CategoryRepositoryImpl;