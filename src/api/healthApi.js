import client from './client';
import { parseApiError } from '../utils/errorHandler';

export const healthApi = {
  /**
   * Check Backend Server Health
   * Endpoint: GET /api/health
   * Handles various formats:
   * - { status: "online", database: { isConnected: true }, uptime: 19 }
   * - { status: "healthy", ... }
   * - { status: "ok", ... }
   */
  async checkHealth() {
    try {
      const res = await client.get('/health');
      const statusStr = String(res?.status || '').toLowerCase();
      const isDbConnected = res?.database?.isConnected === true || res?.database?.connectionState === 'connected' || res?.isConnected === true;
      
      const isOnline = statusStr === 'online' || statusStr === 'healthy' || statusStr === 'ok' || statusStr === 'up' || isDbConnected || (res && !res.error && res.success !== false && statusStr !== 'unhealthy' && statusStr !== 'down' && statusStr !== 'error');

      return {
        success: isOnline,
        statusCode: 200,
        status: isOnline ? 'healthy' : 'unhealthy',
        rawStatus: res?.status || 'unknown',
        database: res?.database,
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

