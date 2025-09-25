// backend/core/tenant/tenant.repository.impl.js
const TenantRepository = require('./tenant.repository');
const TenantModel = require('../models/tenant.model');
const Tenant = require('./tenant');

class TenantRepositoryImpl extends TenantRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.tenantModel = TenantModel(sequelize);
  }

  async create(tenantData) {
    const tenant = await this.tenantModel.create(tenantData);
    return this.toDomain(tenant);
  }

  async findById(id) {
    const tenant = await this.tenantModel.findByPk(id);
    return tenant ? this.toDomain(tenant) : null;
  }

  async findBySlug(slug) {
    const tenant = await this.tenantModel.findOne({ where: { slug } });
    return tenant ? this.toDomain(tenant) : null;
  }

  async findByOwner(ownerId) {
    const tenants = await this.tenantModel.findAll({ where: { ownerId } });
    return tenants.map(tenant => this.toDomain(tenant));
  }

  async update(id, tenantData) {
    const [updated] = await this.tenantModel.update(tenantData, {
      where: { id }
    });
    if (updated) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id) {
    const deleted = await this.tenantModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  toDomain(tenantModel) {
    const settings = tenantModel.settings ? JSON.parse(tenantModel.settings) : {};
    
    return new Tenant({
      id: tenantModel.id,
      name: tenantModel.name,
      slug: tenantModel.slug,
      description: tenantModel.description,
      logo: tenantModel.logo,
      ownerId: tenantModel.ownerId,
      settings,
      isActive: tenantModel.isActive,
      createdAt: tenantModel.createdAt,
      updatedAt: tenantModel.updatedAt
    });
  }
}

module.exports = TenantRepositoryImpl;