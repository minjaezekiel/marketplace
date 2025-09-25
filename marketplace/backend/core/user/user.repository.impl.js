// backend/core/user/user.repository.impl.js
const UserRepository = require('../../../domain/repositories/user.repository');
const UserModel = require('../models/user.model');
const User = require('../../../domain/entities/user');

class UserRepositoryImpl extends UserRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.userModel = UserModel(sequelize);
  }

  async create(userData) {
    const user = await this.userModel.create(userData);
    return this.toDomain(user);
  }

  async findById(id) {
    const user = await this.userModel.findByPk(id);
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email) {
    const user = await this.userModel.findOne({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async update(id, userData) {
    const [updated] = await this.userModel.update(userData, {
      where: { id }
    });
    if (updated) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id) {
    const deleted = await this.userModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  toDomain(userModel) {
    return new User({
      id: userModel.id,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      email: userModel.email,
      password: userModel.password,
      phone: userModel.phone,
      role: userModel.role,
      isActive: userModel.isActive,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    });
  }
}

module.exports = UserRepositoryImpl;