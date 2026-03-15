import { useState } from 'react';
import { Download, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ReferenceLine,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GROWTH_TRAJECTORY, EI_VS_CGPA, RADAR_DATA, PLACEMENT_FUNNEL, INSIGHTS, MONTHLY_OFFER_TREND } from '../data/mockData';

const TIME_TABS = ['1m', '3m', '6m', '1y'];

const RADAR_KEYS = [
  { key: 'CSE', color: '#3B82F6' },
  { key: 'ECE', color: '#8B5CF6' },
  { key: 'IT', color: '#10B981' },
  { key: 'MBA', color: '#F59E0B' },
];

function InsightIcon({ type }) {
  if (type === 'positive') return <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />;
  if (type === 'critical') return <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />;
  return <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />;
}

export default function Analytics() {
  const [timeTab, setTimeTab] = useState('6m');

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Analytics & Intelligence
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Deep-dive institutional analytics · Batch 2025</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-[9px]">
            {TIME_TABS.map(t => (
              <Button
                key={t}
                variant={timeTab === t ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeTab(t)}
                className={`px-3 py-1 h-7 ${timeTab !== t ? 'text-gray-600 hover:text-gray-800 hover:bg-transparent' : ''}`}
              >
                {t}
              </Button>
            ))}
          </div>
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      {/* Growth charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Section-wise Growth Trajectory</CardTitle>
            <CardDescription>Semester progression by competency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={GROWTH_TRAJECTORY} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="sem" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis domain={[40, 90]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="aptitude" name="Aptitude" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="verbal" name="Verbal" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="technical" name="Technical" stroke="#06B6D4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="behavioral" name="Behavioral" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">EI vs CGPA Correlation</CardTitle>
            <CardDescription>Student distribution by academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <ScatterChart margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="cgpa" name="CGPA" domain={[5, 10]} tick={{ fontSize: 11, fill: '#94A3B8' }} label={{ value: 'CGPA', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#94A3B8' }} />
                <YAxis dataKey="ei" name="EI Score" domain={[20, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                <ReferenceLine y={70} stroke="#10B981" strokeDasharray="5 5" label={{ value: 'Ready', position: 'right', fontSize: 10, fill: '#10B981' }} />
                <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Risk', position: 'right', fontSize: 10, fill: '#EF4444' }} />
                <Scatter data={EI_VS_CGPA} fill="#4F46E5" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Radar + Funnel + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Radar Competency Comparison</CardTitle>
            <CardDescription>Multi-dept benchmark (6 axes)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#F1F5F9" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                {RADAR_KEYS.map(r => (
                  <Radar key={r.key} name={r.key} dataKey={r.key} stroke={r.color} fill={r.color} fillOpacity={0.1} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Placement Funnel</CardTitle>
            <CardDescription>Student pipeline to placement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PLACEMENT_FUNNEL.map((item, i) => {
                const pct = Math.round((item.value / PLACEMENT_FUNNEL[0].value) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-semibold" style={{ color: item.color }}>{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="h-full rounded-lg transition-all duration-700 flex items-center pl-2"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}>
                        <span className="text-white text-xs font-medium">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {INSIGHTS.map((ins, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-xl bg-gray-50">
                <InsightIcon type={ins.type} />
                <p className="text-sm text-gray-700 leading-snug">{ins.text}</p>
              </div>
            ))}
            <Card className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 mb-3">Monthly Offer Trend</h4>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={MONTHLY_OFFER_TREND} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }} />
                  <Bar dataKey="offers" fill="#4F46E5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
