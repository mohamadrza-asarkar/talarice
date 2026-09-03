import client from './client';
import { parseApiError } from '../utils/errorHandler';

export const healthApi = {
  /**
   * Check Backend Server Health
   * Endpoints:
   * 1. GET /api/docs/health (As documented in System & Labs spec)
   * 2. GET /api/health (Fallback standard health endpoint)
   */
  async checkHealth() {
    try {
      let res = null;
      try {
        res = await client.get('/docs/health');
      } catch (docErr) {
        // If /docs/health returns 404 or other error, fallback to /health
        if (docErr.statusCode === 404 || !res) {
          res = await client.get('/health');
        } else {
          throw docErr;
        }
      }

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

