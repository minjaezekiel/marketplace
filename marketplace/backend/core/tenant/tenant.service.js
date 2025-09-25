// src/application/services/tenant.service.js
const TenantRepository = require('./tenant.repository');
const Tenant = require('./tenant');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

class TenantService {
  constructor(tenantRepository) {
    this.tenantRepository = tenantRepository;
  }

  async createTenant(tenantData, ownerId) {
    // Generate slug from name
    const slug = slugify(tenantData.name, { lower: true, strict: true });
    
    // Check if slug is unique
    const existingTenant = await this.tenantRepository.findBySlug(slug);
    if (existingTenant) {
      throw new Error('A shop with this name already exists');
    }
    
    // Create tenant
    const tenant = await this.tenantRepository.create({
      ...tenantData,
      slug,
      ownerId
    });
    
    return tenant;
  }

  async getTenantById(tenantId) {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    return tenant;
  }

  async getTenantBySlug(slug) {
    const tenant = await this.tenantRepository.findBySlug(slug);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    return tenant;
  }

  async getTenantsByOwner(ownerId) {
    return await this.tenantRepository.findByOwner(ownerId);
  }

  async updateTenant(tenantId, tenantData) {
    // Check if tenant exists
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    
    // If name is being updated, generate new slug
    if (tenantData.name && tenantData.name !== tenant.name) {
      const slug = slugify(tenantData.name, { lower: true, strict: true });
      
      // Check if slug is unique
      const existingTenant = await this.tenantRepository.findBySlug(slug);
      if (existingTenant && existingTenant.id !== tenantId) {
        throw new Error('A shop with this name already exists');
      }
      
      tenantData.slug = slug;
    }
    
    return await this.tenantRepository.update(tenantId, tenantData);
  }

  async deleteTenant(tenantId) {
    // Check if tenant exists
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    
    return await this.tenantRepository.delete(tenantId);
  }

  async updateTenantSettings(tenantId, settings) {
    const tenant = await this.getTenantById(tenantId);
    
    // Merge existing settings with new settings
    const updatedSettings = { ...tenant.settings, ...settings };
    
    return await this.tenantRepository.update(tenantId, { settings: updatedSettings });
  }
}

module.exports = TenantService;