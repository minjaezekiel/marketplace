// src/application/services/cart.service.js
const CartRepository = require('./cart.repository');
const ProductRepository = require('../product/product.repository');
const Cart = require('../../domain/entities/cart');

class CartService {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async getCart(userId, tenantId) {
    return await this.cartRepository.findByUser(userId, tenantId);
  }

  async addItem(userId, tenantId, productId, quantity = 1, attributes = {}) {
    // Get user's cart
    let cart = await this.cartRepository.findByUser(userId, tenantId);
    
    // Verify product exists
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (!product.inStock) {
      throw new Error('Product is out of stock');
    }
    
    // Check if product is already in cart with same attributes
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId === productId && 
      JSON.stringify(item.attributes) === JSON.stringify(attributes)
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        attributes
      });
    }
    
    // Update cart
    cart = await this.cartRepository.update(cart.id, { items: cart.items });
    
    return cart;
  }

  async updateItemQuantity(userId, tenantId, productId, quantity, attributes = {}) {
    // Get user's cart
    let cart = await this.cartRepository.findByUser(userId, tenantId);
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => 
      item.productId === productId && 
      JSON.stringify(item.attributes) === JSON.stringify(attributes)
    );
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    // Update quantity or remove if zero
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Update cart
    cart = await this.cartRepository.update(cart.id, { items: cart.items });
    
    return cart;
  }

  async removeItem(userId, tenantId, productId, attributes = {}) {
    // Get user's cart
    let cart = await this.cartRepository.findByUser(userId, tenantId);
    
    // Remove item
    cart.items = cart.items.filter(item => 
      !(item.productId === productId && 
      JSON.stringify(item.attributes) === JSON.stringify(attributes))
    );
    
    // Update cart
    cart = await this.cartRepository.update(cart.id, { items: cart.items });
    
    return cart;
  }

  async clearCart(userId, tenantId) {
    const cart = await this.cartRepository.findByUser(userId, tenantId);
    return await this.cartRepository.update(cart.id, { items: [] });
  }

  async getCartTotal(userId, tenantId) {
    const cart = await this.getCart(userId, tenantId);
    return cart.getTotalAmount();
  }
}

module.exports = CartService;