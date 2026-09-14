// -------------------------------------------------------------
// System & Labs API (/api/docs)
// Section 9 of backend API Documentation
// -------------------------------------------------------------
import { client } from './client';
import { unwrapDoc } from './auth.api';

export const docsApi = {
  /**
   * Health status of backend
   */
  async getHealth() {
    try {
      const res = await client.get('/docs/health');
      return unwrapDoc(res?.data || res);
    } catch (err) {
      return { status: 'down', error: err.message };
    }
  },

  /**
   * System metrics & load times
   */
  async getMetrics() {
    try {
      const res = await client.get('/docs/metrics');
      return unwrapDoc(res?.data || res);
    } catch {
      return null;
    }
  },

  /**
   * OpenAPI json documentation
   */
  async getOpenApi() {
    try {
      return await client.get('/docs/openapi.json');
    } catch {
      return null;
    }
  }
};

export default docsApi;
