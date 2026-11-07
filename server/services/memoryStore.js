import bcrypt from 'bcryptjs';
import { seedProducts } from '../seeder/seedData.js';

class MemoryStore {
  constructor() {
    this.isReady = true;

    // Seed 4 products with unique image paths
    this.products = seedProducts.map((p, idx) => ({
      ...p,
      _id: `prod_mem_${idx + 1}`,
      createdAt: new Date(),
    }));

    // Seed admin user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);

    this.users = [
      {
        _id: 'user_admin_1',
        name: 'Sai Pootharekulu Admin',
        email: 'admin@saipootharekulu.com',
        phone: '9441321874',
        password: hashedPassword,
        role: 'admin',
        deliveryAddress: {
          street: 'Chandhana Residency, Kudlu Gate, Room No. 7',
          landmark: 'Kudlu Gate Bus Stop',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560068',
        },
        createdAt: new Date(),
      },
    ];

    this.orders = [];
    this.contacts = [];
  }

  // Users
  async findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    return this.users.find((u) => u._id === id);
  }

  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      ...userData,
      _id: `user_mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      password: hashedPassword,
      role: userData.role || 'customer',
      deliveryAddress: userData.deliveryAddress || {
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
      },
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id, updateData) {
    const user = await this.findUserById(id);
    if (!user) return null;

    if (updateData.name) user.name = updateData.name;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.deliveryAddress) {
      user.deliveryAddress = {
        ...user.deliveryAddress,
        ...updateData.deliveryAddress,
      };
    }
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }
    return user;
  }

  async getAllCustomers() {
    return this.users
      .filter((u) => u.role === 'customer')
      .map((u) => {
        const { password, ...rest } = u;
        const totalOrders = this.orders.filter(
          (o) => o.user === u._id || o.customerEmail === u.email
        ).length;
        return { ...rest, totalOrders };
      });
  }

  // Products
  async getProducts() {
    return this.products.filter((p) => p.inStock);
  }

  async getAllProducts() {
    return this.products;
  }

  async findProductById(id) {
    return this.products.find((p) => p._id === id);
  }

  async updateProduct(id, updateData) {
    const product = await this.findProductById(id);
    if (!product) return null;
    if (updateData.price !== undefined) product.price = Number(updateData.price);
    if (updateData.inStock !== undefined) product.inStock = Boolean(updateData.inStock);
    if (updateData.stockQuantity !== undefined)
      product.stockQuantity = Number(updateData.stockQuantity);
    return product;
  }

  // Orders
  async createOrder(orderData) {
    const nextNum = 1001 + this.orders.length;
    const orderId = `#SP${nextNum}`;
    const newOrder = {
      ...orderData,
      _id: `ord_mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      orderId,
      orderStatus: orderData.orderStatus || 'Order Placed',
      isPaid: Boolean(orderData.isPaid),
      createdAt: new Date(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async findOrderById(id) {
    return this.orders.find((o) => o._id === id || o.orderId === id);
  }

  async getMyOrders(userId) {
    return this.orders.filter((o) => o.user === userId);
  }

  async getAllOrders({ status, search } = {}) {
    let result = [...this.orders];
    if (status && status !== 'All') {
      result = result.filter((o) => o.orderStatus === status);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }
    return result;
  }

  async updateOrderStatus(id, status, notes) {
    const order = await this.findOrderById(id);
    if (!order) return null;
    order.orderStatus = status;
    if (notes !== undefined) order.ownerNotes = notes;
    return order;
  }

  async updateOrder(id, updateData) {
    const order = await this.findOrderById(id);
    if (!order) return null;
    Object.assign(order, updateData);
    return order;
  }

  async getAdminStats() {
    const totalOrders = this.orders.length;
    const paidOrders = this.orders.filter((o) => o.isPaid);
    const totalSales = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const pendingOrders = this.orders.filter((o) =>
      ['Order Placed', 'Payment Successful', 'Preparing'].includes(o.orderStatus)
    ).length;
    const deliveredOrders = this.orders.filter((o) => o.orderStatus === 'Delivered').length;
    const totalCustomers = this.users.filter((u) => u.role === 'customer').length;

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
    };
  }

  // Contacts
  async createContact(contactData) {
    const newContact = {
      ...contactData,
      _id: `contact_${Date.now()}`,
      createdAt: new Date(),
    };
    this.contacts.push(newContact);
    return newContact;
  }
}

export const memoryStore = new MemoryStore();
