import client from './client';
import { parseApiError } from '../utils/errorHandler';

export const docsApi = {
  /**
   * 9.1 Check Server Health
   * GET /api/docs/health
   */
  async getHealth() {
    try {
      const response = await client.get('/docs/health');
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response
      };
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * 9.2 OpenAPI 3.0 specification
   * GET /api/docs/openapi.json
   */
  async getOpenApiSpec() {
    try {
      const response = await client.get('/docs/openapi.json');
      return response;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * 9.3 Postman Collection v2.1
   * GET /api/docs/postman.json
   */
  async getPostmanCollection() {
    try {
      const response = await client.get('/docs/postman.json');
      return response;
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * 9.4 System Metrics
   * GET /api/docs/metrics
   */
  async getMetrics() {
    try {
      const response = await client.get('/docs/metrics');
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response
      };
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * 9.5 Reset database to default seed state
   * POST /api/docs/reset-db
   */
  async resetDatabase() {
    try {
      const response = await client.post('/docs/reset-db');
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'پایگاه داده به حالت اولیه بازنشانی شد'
      };
    } catch (err) {
      throw parseApiError(err);
    }
  },

  /**
   * 9.6 Lab: Hash password
   * POST /api/docs/lab/hash-password
   * Body: { password }
   */
  async hashPassword(password) {
    try {
      const response = await client.post('/docs/lab/hash-password', { password });
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data || response
      };
    } catch (err) {
      throw parseApiError(err);
    }
  }
};

export default docsApi;
