/**
 * Admin Service - API calls for admin operations
 * All requests include Authorization header with Firebase UID
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get all products
 */
export const getProducts = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Add a new product
 */
export const addProduct = async (token, productData) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle duplicate product error
      if (response.status === 409) {
        throw new Error(`Product already exists: ${data.message}`);
      }
      throw new Error(data.message || 'Failed to add product');
    }
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (token, productId, productData) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (token, productId) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Get all orders with customer details
 */
export const getAllOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (token, orderId, status) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update order status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Get order statistics
 */
export const getOrderStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch statistics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
