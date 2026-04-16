
import { useState } from "react";

import { Dialog, DialogContent } from "../components/ui/dialog";


import {
  User, BookOpen, Calendar, Hash,
  GraduationCap, Building2, ShieldCheck, Mail,
} from "lucide-react";
import { getEIColor, getEIBgColor } from "../utils/helpers";

import StatusBadge from "./common/StatusBadge";
import TopicWeaknessPanel from "./dashboard/TopicWeaknessPanel";


function InfoRow({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-indigo-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}


const SECTIONS = [
  { key: 'aptitude_score',      label: 'Aptitude',      weight: '30%' },
  { key: 'technical_score',     label: 'Technical',     weight: '35%' },
  { key: 'behavioral_score',    label: 'Behavioral',    weight: '20%' },
  { key: 'communication_score', label: 'Communication', weight: '15%' },
];

function SectionBreakdown({ student }) {
  const hasAny = SECTIONS.some((s) => student[s.key] !== null && student[s.key] !== undefined);
  if (!hasAny) return null;

  return (
    <div className="px-8 py-4 border-b border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Section Breakdown</p>
      <div className="space-y-3">
        {SECTIONS.map((s) => {
          const score = student[s.key];
          if (score === null || score === undefined) return null;
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">
                  {s.label} <span className="text-gray-400">({s.weight})</span>
                </span>
                <span className={`text-xs font-bold ${getEIColor(score)}`}>{score}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getEIBgColor(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

  );
}

export default function StudentDetailDialog({ open, onOpenChange, student }) {

  const [topicOpen, setTopicOpen] = useState(false);


  if (!student) return null;

  const initials = student.name
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();


  const velocityDisplay = () => {
    if (student.velocity === null || student.velocity === undefined) {
      return <span className="text-xs text-gray-400">First Assessment</span>;
    }
    return (
      <span className={`text-xs font-semibold ${student.velocity >= 0 ? "text-emerald-600" : "text-red-500"}`}>
        {student.velocity >= 0 ? "+" : ""}{student.velocity} pts
      </span>
    );
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">

        {/* ── Header banner ─────────────────────────────────── */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {student.name}
              </h2>
              <p className="text-indigo-200 text-sm mt-0.5">
                {student.roll} · {student.dept} · {student.year}
              </p>
              <div className="mt-2">

                <StatusBadge riskCategory={student.riskCategory} />

              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            <StatPill
              label="EI Score"
              value={student.eiScore}
              color={getEIColor(student.eiScore)}
            />
            <StatPill
              label="Percentile"
              value={`${student.percentile}%`}
              color="text-indigo-100"
            />
            <StatPill
              label="CGPA"
              value={student.cgpa}
              color="text-indigo-100"
            />
            <StatPill
              label="Consistency"
              value={`${student.consistency}%`}
              color="text-indigo-100"
            />
          </div>
        </div>

        {/* ── EI Score bar ───────────────────────────────────── */}
        <div className="px-8 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Employability Index</span>
            <span className={`text-xs font-bold ${getEIColor(student.eiScore)}`}>
              {student.eiScore} / 100
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getEIBgColor(student.eiScore)}`}
              style={{ width: `${student.eiScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">

            <span className="text-xs text-gray-400">Growth Velocity</span>
            {velocityDisplay()}
          </div>
        </div>

        {/* ── Section Breakdown ─────────────────────────────── */}
        <SectionBreakdown student={student} />

        {/* ── Topic Analysis (collapsible) ──────────────────── */}
        {student.topic_analysis && (
          <div className="border-b border-gray-100">
            <button
              onClick={() => setTopicOpen((v) => !v)}
              className="w-full px-8 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Topic Analysis
              </span>
              <span className="text-xs text-indigo-500">{topicOpen ? "▲ Hide" : "▼ Show"}</span>
            </button>
            {topicOpen && (
              <div className="px-8 pb-4">
                <TopicWeaknessPanel
                  topicAnalysis={student.topic_analysis}
                  studentName={student.name}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Info grid ─────────────────────────────────────── */}
        <div className="px-8 py-6 grid grid-cols-2 gap-5">
          <InfoRow icon={Hash}          label="Roll Number"     value={student.roll} />
          <InfoRow icon={Building2}     label="Department"      value={student.dept} />
          <InfoRow icon={GraduationCap} label="Batch Year"      value={student.year} />
          <InfoRow icon={BookOpen}      label="Semester"        value={student.current_semester ? `Semester ${student.current_semester}` : undefined} />
          <InfoRow icon={User}          label="Gender"          value={student.gender} />
          <InfoRow icon={ShieldCheck}   label="Category"        value={student.category} />
          <InfoRow icon={Calendar}      label="Date of Birth"   value={student.date_of_birth} />
          <InfoRow icon={Mail}          label="Admission Score" value={student.admission_score ?? undefined} />

        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

}

