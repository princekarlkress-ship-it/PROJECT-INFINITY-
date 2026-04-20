export function scoreTone(score: number): string {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 55) return 'text-amber-600';
  return 'text-red-600';
}

export function scoreBar(score: number): string {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 55) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getScoreRiskLevel(score: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (score >= 85) return 'low';
  if (score >= 70) return 'moderate';
  if (score >= 55) return 'high';
  return 'critical';
}