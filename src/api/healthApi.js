import client from './client';
import { parseApiError } from '../utils/errorHandler';

export const healthApi = {
  /**
   * Check Backend Server Health
   * Endpoint: GET /api/health
   * Response: { status: "healthy", uptime: 120.45, timestamp: "..." }
   */
  async checkHealth() {
    try {
      const res = await client.get('/health');
      return {
        success: true,
        statusCode: 200,
        status: res?.status || 'healthy',
        uptime: res?.uptime ?? 0,
        timestamp: res?.timestamp || new Date().toISOString(),
        raw: res
      };
    } catch (err) {
      const parsed = parseApiError(err);
      return {
        success: false,
        statusCode: parsed.statusCode,
        status: 'unhealthy',
        message: parsed.message,
        errors: parsed.errors,
        displayText: parsed.displayText
      };
    }
  }
};

export default healthApi;
