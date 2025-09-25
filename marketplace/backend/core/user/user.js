// src/domain/entities/user.js
class User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    password,
    phone,
    role = 'customer',
    isActive = true,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

module.exports = User;