import React, { useState, useEffect } from 'react';
import { fetchClient } from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Database, RefreshCw, Activity, Calendar, Play } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

interface IntegrationConfig {
  _id: string; provider: string; isEnabled: boolean; environment: string; status: string;
  lastHealthCheckAt?: string; lastSuccessfulSyncAt?: string; activeMode?: string;
}

interface SyncJob {
  _id: string; jobType: string; status: string; recordsProcessed: number; recordsCreated: number; recordsUpdated: number;
  errorCount: number; errorSummary?: string; startedAt?: string; completedAt?: string;
}

export function IntegrationCenter() {
  const [configs, setConfigs] = useState<IntegrationConfig[]>([]);
  const [jobs, setJobs] = useState<Record<string, SyncJob[]>>({});
  const [loading, setLoading] = useState(true);
  const [syncingProviders, setSyncingProviders] = useState<Record<string, boolean>>({});

  const fetchConfigs = async () => {
    try {
      const res = await fetchClient<IntegrationConfig[]>('/admin/integrations');
      setConfigs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (provider: string) => {
    try {
      const res = await fetchClient<SyncJob[]>(`/admin/integrations/${provider}/sync-history`);
      setJobs(prev => ({ ...prev, [provider]: res }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const toggleIntegration = async (provider: string, isEnabled: boolean) => {
    try {
      await fetchClient(`/admin/integrations/${provider}/toggle`, { method: 'PATCH', body: JSON.stringify({ isEnabled }) });
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
    setSyncingProviders(prev => ({ ...prev, [provider]: true }));
    try {
      await fetchClient(`/admin/integrations/${provider}/sync`, { method: 'POST' });
      alert(`Sync triggered for ${provider}. It will process in the background.`);
      fetchJobs(provider);
    } catch (err) {
      alert('Failed to trigger sync');
    } finally {
      setSyncingProviders(prev => ({ ...prev, [provider]: false }));
    }
  };

  if (loading) return <div style={{ padding: 'var(--sp-12)', textAlign: 'center' }}><Spinner /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>Integration Center</h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Manage connections to external learning systems like iGOT and NSSTA.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        {configs.map(config => (
          <Card key={config._id} variant="elevated">
            <CardHeader style={{ padding: 'var(--sp-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Database size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {config.provider}
                      <Badge variant={config.status === 'HEALTHY' ? 'success' : config.status === 'DISABLED' ? 'neutral' : 'error'}>
                        {config.status}
                      </Badge>
                    </h2>
                    <div style={{ display: 'flex', gap: 'var(--sp-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      <span>Mode: <strong style={{ color: 'var(--text-primary)' }}>{config.activeMode || 'UNKNOWN'}</strong></span>
                      <span>Toggle: <strong style={{ color: config.isEnabled ? 'var(--success-strong)' : 'var(--text-muted)' }}>{config.isEnabled ? 'ENABLED' : 'PAUSED'}</strong></span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => toggleIntegration(config.provider, !config.isEnabled)}
                    role="switch"
                    aria-checked={config.isEnabled}
                    style={{
                      width: '44px', height: '24px', borderRadius: 'var(--radius-full)', border: 'none',
                      background: config.isEnabled ? 'var(--success-500)' : 'var(--border)',
                      cursor: 'pointer', position: 'relative', transition: 'background var(--duration-fast)'
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: '2px', left: config.isEnabled ? '22px' : '2px',
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                      transition: 'left var(--duration-fast) var(--ease-spring)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
                    }} />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 var(--sp-6) var(--sp-6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Activity size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Last Health Check</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{config.lastHealthCheckAt ? new Date(config.lastHealthCheckAt).toLocaleString() : 'Never'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Calendar size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Last Successful Sync</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{config.lastSuccessfulSyncAt ? new Date(config.lastSuccessfulSyncAt).toLocaleString() : 'Never'}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                <Button 
                  variant="outline"
                  onClick={() => testHealth(config.provider)}
                  disabled={!config.isEnabled || config.activeMode === 'DISABLED'}
                  leftIcon={<Activity size={16} />}
                >
                  Test Connection
                </Button>
                <Button 
                  onClick={() => triggerSync(config.provider)}
                  disabled={!config.isEnabled || config.status === 'UNAVAILABLE' || config.activeMode === 'DISABLED' || syncingProviders[config.provider]}
                  isLoading={syncingProviders[config.provider]}
                  leftIcon={<RefreshCw size={16} />}
                >
                  Sync Catalog Now
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => fetchJobs(config.provider)}
                  leftIcon={<Play size={16} />}
                >
                  View Sync History
                </Button>
              </div>

              {jobs[config.provider] && jobs[config.provider].length > 0 && (
                <div style={{ marginTop: 'var(--sp-6)' }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-3)' }}>Recent Sync Jobs</h3>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Job Type</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Processed</TableHeader>
                          <TableHeader>Created/Updated</TableHeader>
                          <TableHeader>Errors</TableHeader>
                          <TableHeader>Started</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jobs[config.provider].map(job => (
                          <TableRow key={job._id}>
                            <TableCell style={{ fontWeight: 500 }}>{job.jobType}</TableCell>
                            <TableCell>
                              <Badge variant={job.status === 'COMPLETED' ? 'success' : job.status === 'PARTIAL_SUCCESS' ? 'warning' : 'error'}>
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{job.recordsProcessed}</TableCell>
                            <TableCell>{job.recordsCreated || 0} / {job.recordsUpdated || 0}</TableCell>
                            <TableCell>
                              <span style={{ color: job.errorCount > 0 ? 'var(--error-strong)' : 'inherit', fontWeight: job.errorCount > 0 ? 600 : 400 }}>{job.errorCount}</span>
                              {job.errorSummary && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{job.errorSummary}</div>}
                            </TableCell>
                            <TableCell style={{ color: 'var(--text-secondary)' }}>
                              {job.startedAt ? new Date(job.startedAt).toLocaleString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {configs.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: 'var(--sp-12)', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
            No integration providers configured.
          </div>
        )}
      </div>
    </div>
  );
}
