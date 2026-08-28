import React, { useState, useEffect } from 'react';
import { fetchClient } from '../../api/client';

interface IntegrationConfig {
  _id: string;
  provider: string;
  isEnabled: boolean;
  environment: string;
  status: string;
  lastHealthCheckAt?: string;
  lastSuccessfulSyncAt?: string;
}

interface SyncJob {
  _id: string;
  jobType: string;
  status: string;
  recordsProcessed: number;
  errorCount: number;
  startedAt?: string;
  completedAt?: string;
}

export function IntegrationCenter() {
  const [configs, setConfigs] = useState<IntegrationConfig[]>([]);
  const [jobs, setJobs] = useState<Record<string, SyncJob[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchConfigs = async () => {
    try {
      const res = await fetchClient<IntegrationConfig[]>('/admin/integrations');
      setConfigs(res);
    } catch (err) {
      console.error('Failed to load integrations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (provider: string) => {
    try {
      const res = await fetchClient<SyncJob[]>(`/admin/integrations/${provider}/sync-history`);
      setJobs(prev => ({ ...prev, [provider]: res }));
    } catch (err) {
      console.error(`Failed to load jobs for ${provider}`, err);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const toggleIntegration = async (provider: string, isEnabled: boolean) => {
    try {
      await fetchClient(`/admin/integrations/${provider}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ isEnabled })
      });
      await fetchConfigs();
    } catch (err) {
      alert('Failed to toggle integration');
    }
  };

  const testHealth = async (provider: string) => {
    try {
      const res = await fetchClient<any>(`/admin/integrations/${provider}/health`, { method: 'POST' });
      alert(`Health check completed: ${res.isHealthy ? 'HEALTHY' : 'UNAVAILABLE'}`);
      await fetchConfigs();
    } catch (err) {
      alert('Health check failed');
    }
  };

  const triggerSync = async (provider: string) => {
    if (!confirm(`Are you sure you want to trigger a manual sync for ${provider}?`)) return;
    try {
      await fetchClient(`/admin/integrations/${provider}/sync`, { method: 'POST' });
      alert(`Sync triggered for ${provider}. It will process in the background.`);
      fetchJobs(provider);
    } catch (err) {
      alert('Failed to trigger sync');
    }
  };

  if (loading) return <div>Loading Integration Center...</div>;

  return (
    <div className="integration-center" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Integration Center</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage connections to external learning systems like iGOT and NSSTA.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {configs.map(config => (
          <div key={config._id} style={{ 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px', 
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {config.provider}
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '9999px',
                    fontWeight: 500,
                    backgroundColor: config.status === 'HEALTHY' ? 'rgba(34, 197, 94, 0.1)' : 
                                   config.status === 'DISABLED' ? 'var(--bg-secondary)' : 'rgba(239, 68, 68, 0.1)',
                    color: config.status === 'HEALTHY' ? 'rgb(34, 197, 94)' : 
                           config.status === 'DISABLED' ? 'var(--text-secondary)' : 'rgb(239, 68, 68)'
                  }}>
                    {config.status}
                  </span>
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Environment: {config.environment}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => toggleIntegration(config.provider, !config.isEnabled)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: config.isEnabled ? 'var(--bg-secondary)' : 'var(--primary-color)',
                    color: config.isEnabled ? 'var(--text-primary)' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  {config.isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Last Health Check</div>
                <div style={{ color: 'var(--text-primary)' }}>{config.lastHealthCheckAt ? new Date(config.lastHealthCheckAt).toLocaleString() : 'Never'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Last Successful Sync</div>
                <div style={{ color: 'var(--text-primary)' }}>{config.lastSuccessfulSyncAt ? new Date(config.lastSuccessfulSyncAt).toLocaleString() : 'Never'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => testHealth(config.provider)}
                disabled={!config.isEnabled}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: config.isEnabled ? 'pointer' : 'not-allowed',
                  opacity: config.isEnabled ? 1 : 0.5
                }}
              >
                Test Connection
              </button>
              <button 
                onClick={() => triggerSync(config.provider)}
                disabled={!config.isEnabled || config.status === 'UNAVAILABLE'}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: config.isEnabled && config.status !== 'UNAVAILABLE' ? 'pointer' : 'not-allowed',
                  opacity: config.isEnabled && config.status !== 'UNAVAILABLE' ? 1 : 0.5
                }}
              >
                Sync Catalog Now
              </button>
              <button 
                onClick={() => fetchJobs(config.provider)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                View Sync History
              </button>
            </div>

            {jobs[config.provider] && jobs[config.provider].length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem' }}>Recent Sync Jobs</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.5rem 0' }}>Job Type</th>
                        <th style={{ padding: '0.5rem 0' }}>Status</th>
                        <th style={{ padding: '0.5rem 0' }}>Processed</th>
                        <th style={{ padding: '0.5rem 0' }}>Errors</th>
                        <th style={{ padding: '0.5rem 0' }}>Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs[config.provider].map(job => (
                        <tr key={job._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 0' }}>{job.jobType}</td>
                          <td style={{ padding: '0.75rem 0' }}>
                            <span style={{ 
                              padding: '0.125rem 0.375rem', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem',
                              backgroundColor: job.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: job.status === 'COMPLETED' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                            }}>
                              {job.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0' }}>{job.recordsProcessed}</td>
                          <td style={{ padding: '0.75rem 0' }}>{job.errorCount}</td>
                          <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                            {job.startedAt ? new Date(job.startedAt).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}

        {configs.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', borderRadius: '8px' }}>
            No integration providers configured.
          </div>
        )}
      </div>
    </div>
  );
}
