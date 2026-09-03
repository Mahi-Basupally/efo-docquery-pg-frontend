'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

export default function HealthStatus() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const health = await apiClient.healthCheck();
      if (health.status === 'healthy' && health.database === 'connected') {
        setStatus('healthy');
        setMessage('All systems operational');
      } else {
        setStatus('unhealthy');
        setMessage('Service degraded');
      }
    } catch (error) {
      setStatus('unhealthy');
      setMessage('Backend unavailable');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unhealthy':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'unhealthy':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
