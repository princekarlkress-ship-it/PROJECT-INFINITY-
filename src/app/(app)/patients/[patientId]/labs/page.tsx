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
import { Input } from '@/components/ui/Input';
import { usePatientLabs } from '@/features/labs/hooks';

function StatusBadge({ status }: { status: 'normal' | 'high' | 'low' | 'critical' }) {
  const badgeVariant = status === 'high' || status === 'critical' ? 'severity' : status === 'low' ? 'report' : 'status';
  return <Badge variant={badgeVariant} label={status} />;
}

export default function PatientLabsPage({ params }: { params: { patientId: string } }) {
  const { data, isLoading, error } = usePatientLabs(params.patientId);

  return (
    <AppShell
      sidebar={<Sidebar activeItem="Patients" items={[{ label: 'Dashboard' }, { label: 'Patients' }, { label: 'Reports' }, { label: 'Trends' }, { label: 'Alerts' }, { label: 'Scores' }, { label: 'Settings' }]} />}
      header={<Topbar title="Lab Results" subtitle={`Patients / ${params.patientId}`} actions={<><Button variant="secondary">Back to Overview</Button><Button>Generate Report</Button></>} />}
    >
      <PatientTabsNav active="labs" patientId={params.patientId} />

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Input placeholder="Search parameter, category, or result" />
          <div className="flex flex-wrap gap-2 text-xs">
            <button className="rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">All Results</button>
            <button className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">Abnormal Only</button>
            <button className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">Worsening</button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="mt-6 grid gap-6"><LoadingSkeleton className="h-48" /><LoadingSkeleton className="h-48" /></div>
      ) : error ? (
        <div className="mt-6"><EmptyState title="Unable to load lab results" body="Lab results could not be retrieved for this patient." /></div>
      ) : !data || data.length === 0 ? (
        <div className="mt-6"><EmptyState title="No lab results available" body="No laboratory data was found for this patient yet." /></div>
      ) : (
        data.map((category) => (
          <Card key={category.name} className="mt-6 overflow-hidden p-0">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h3 className="text-lg font-semibold text-slate-900">{category.name}</h3></div>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-white text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Parameter</th>
                  <th className="px-5 py-3 font-medium">Result</th>
                  <th className="px-5 py-3 font-medium">Reference Range</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {category.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-4 font-medium text-slate-900">{row.parameter}</td>
                    <td className="px-5 py-4 text-slate-700">{row.result}</td>
                    <td className="px-5 py-4 text-slate-500">{row.referenceRange}</td>
                    <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-4 text-slate-700">{row.trendLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ))
      )}
    </AppShell>
  );
}