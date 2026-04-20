'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { PatientTabsNav } from '@/components/navigation/PatientTabsNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import Badge from '@/components/ui/Badge';
import { usePatientMarkerTrends, usePatientSystemTrends } from '@/features/trends/hooks';

function TrendBadge({ state }: { state: 'improving' | 'worsening' | 'stable' }) {
  const badgeVariant = state === 'worsening' ? 'severity' : state === 'improving' ? 'trend' : 'status';
  return <Badge variant={badgeVariant} label={state} />;
}

export default function PatientTrendsPage({ params }: { params: { patientId: string } }) {
  const systemQuery = usePatientSystemTrends(params.patientId);
  const markerQuery = usePatientMarkerTrends(params.patientId);

  const isLoading = systemQuery.isLoading || markerQuery.isLoading;
  const hasError = systemQuery.error || markerQuery.error;
  const systems = systemQuery.data ?? [];
  const markers = markerQuery.data ?? [];

  return (
    <AppShell
      sidebar={<Sidebar activeItem="Trends" items={[{ label: 'Dashboard' }, { label: 'Patients' }, { label: 'Reports' }, { label: 'Trends' }, { label: 'Alerts' }, { label: 'Scores' }, { label: 'Settings' }]} />}
      header={<Topbar title="Trends" subtitle={`Patients / ${params.patientId}`} actions={<><Button variant="secondary">Back to Overview</Button><Button>Generate Report</Button></>} />}
    >
      <PatientTabsNav active="trends" patientId={params.patientId} />

      {isLoading ? (
        <div className="grid gap-6">
          <LoadingSkeleton className="h-32" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <LoadingSkeleton className="h-40" />
            <LoadingSkeleton className="h-40" />
            <LoadingSkeleton className="h-40" />
            <LoadingSkeleton className="h-40" />
          </div>
        </div>
      ) : hasError ? (
        <EmptyState title="Unable to load trends" body="Trend data could not be retrieved for this patient." />
      ) : systems.length === 0 && markers.length === 0 ? (
        <EmptyState title="No trend data available" body="Trend analysis will appear after follow-up results are recorded." />
      ) : (
        <>
          <Card>
            <h2 className="text-2xl font-semibold text-slate-900">Trend Review</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Longitudinal review shows how key systems and biomarkers are changing between encounters.
            </p>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {systems.map((item) => (
              <Card key={item.system}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-900">{item.system}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                  </div>
                  <TrendBadge state={item.state} />
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {markers.map((item) => {
              const max = Math.max(...item.values.map((v) => v.value));
              return (
                <Card key={item.marker}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-slate-900">{item.marker}</div>
                      <div className="mt-1 text-sm text-slate-500">{item.unit}</div>
                    </div>
                    <TrendBadge state={item.state} />
                  </div>
                  <div className="mt-6 flex h-32 items-end gap-4">
                    {item.values.map((point) => (
                      <div key={point.date} className="flex flex-1 flex-col items-center justify-end gap-2">
                        <div className="text-xs font-medium text-slate-500">{point.value}</div>
                        <div className="flex h-20 w-full items-end">
                          <div
                            className={`w-full rounded-t-2xl ${item.state === 'worsening' ? 'bg-red-400' : item.state === 'improving' ? 'bg-emerald-400' : 'bg-slate-400'}`}
                            style={{ height: \\`${(point.value / max) * 100}%\\` }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-500">{point.date}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-600">{item.interpretation}</p>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}