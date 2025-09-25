// src/application/serv/category.service.js
const CategoryRepository = require('./category.repository');
const Category = require('./category');

class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async createCategory(categoryData, tenantId) {
    return await this.categoryRepository.create({
      ...categoryData,
      tenantId
    });
  }

  async getCategoryById(categoryId) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getCategoriesByTenant(tenantId, options = {}) {
    return await this.categoryRepository.findByTenant(tenantId, options);
  }

  async updateCategory(categoryId, categoryData) {
    const category = await this.getCategoryById(categoryId);
    return await this.categoryRepository.update(categoryId, categoryData);
  }

  async deleteCategory(categoryId) {
    const category = await this.getCategoryById(categoryId);
    
    // Check if category has subcategories
    const subcategories = await this.categoryRepository.findByTenant(category.tenantId, { parentId: categoryId });
    if (subcategories.length > 0) {
      throw new Error('Cannot delete category with subcategories');
    }
    
    return await this.categoryRepository.delete(categoryId);
  }
}

module.exports = CategoryService;