// backend/core/orders/order.service.js
const OrderRepository = require('../orders/order.repository');
const ProductRepository = require('../product/product.repository');
const CartRepository = require('../cart/cart.repository');
const Order = require('../../domain/entities/order');
const { v4: uuidv4 } = require('uuid');

class OrderService {
  constructor(orderRepository, productRepository, cartRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.cartRepository = cartRepository;
  }

  async createOrder(userId, tenantId, shippingAddress, paymentMethod) {
    // Get user's cart
    const cart = await this.cartRepository.findByUser(userId, tenantId);
    
    if (cart.items.length === 0) {
      throw new Error('Cannot create order with empty cart');
    }
    
    // Calculate total and prepare order items
    let total = 0;
    const orderItems = [];
    
    for (const cartItem of cart.items) {
      const product = await this.productRepository.findById(cartItem.productId);
      
      if (!product) {
        throw new Error(`Product with ID ${cartItem.productId} not found`);
      }
      
      if (!product.inStock || product.stock < cartItem.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
      
      const itemTotal = product.price * cartItem.quantity;
      total += itemTotal;
      
      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        attributes: cartItem.attributes || {}
      });
    }
    
    // Generate order number
    const orderNumber = this.generateOrderNumber(tenantId);
    
    // Create order
    const order = await this.orderRepository.create({
      orderNumber,
      tenantId,
      customerId: userId,
      status: 'pending',
      total,
      items: orderItems
    });
    
    // Update product stock
    for (const item of orderItems) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
    }
    
    // Clear cart
    await this.cartRepository.delete(cart.id);
    
    return order;
  }

  async getOrderById(orderId, tenantId) {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order || order.tenantId !== tenantId) {
      throw new Error('Order not found');
    }
    
    return order;
  }

  async getOrdersByTenant(tenantId, options = {}) {
    return await this.orderRepository.findByTenant(tenantId, options);
  }

  async updateOrderStatus(orderId, status, tenantId) {
    const order = await this.getOrderById(orderId, tenantId);
    
    // Validate status transition
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };
    
    if (!validTransitions[order.status].includes(status)) {
      throw new Error(`Cannot change status from ${order.status} to ${status}`);
    }
    
    return await this.orderRepository.update(orderId, { status });
  }

  generateOrderNumber(tenantId) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${tenantId.substring(0, 4)}-${timestamp}-${random}`;
  }
}

module.exports = OrderService;