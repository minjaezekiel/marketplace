// backend/core/tenant.js
class Tenant {
  constructor({
    id,
    name,
    slug,
    description,
    logo,
    ownerId,
    settings = {},
    isActive = true,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.logo = logo;
    this.ownerId = ownerId;
    this.settings = settings;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getSetting(key) {
    return this.settings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    return this;
  }
}

module.exports = Tenant;