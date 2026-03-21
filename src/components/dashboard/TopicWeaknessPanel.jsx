/**
 * TopicWeaknessPanel
 * Props:
 *   topicAnalysis: {
 *     technical: { "Arrays": { score: 80, weak: false }, "Recursion": { score: 40, weak: true, recommendation: "..." } },
 *     aptitude: { ... },
 *     ...
 *   }
 *   studentName: string
 */

const SECTION_LABELS = {
  technical:     'Technical',
  aptitude:      'Aptitude',
  behavioral:    'Behavioral',
  communication: 'Communication',
};

function TopicBar({ topicName, score, weak, recommendation }) {
  const barColor = weak ? 'bg-red-400' : 'bg-green-400';
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">{topicName}</span>
          {weak ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700">
              Weak
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700">
              Strong
            </span>
          )}
        </div>
        <span className={`text-xs font-bold ${weak ? 'text-red-600' : 'text-green-600'}`}>{score}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {weak && recommendation && (
        <p className="text-[10px] text-gray-400 mt-1 italic">{recommendation}</p>
      )}
    </div>
  );
}

export default function TopicWeaknessPanel({ topicAnalysis, studentName }) {
  if (!topicAnalysis || typeof topicAnalysis !== 'object') return null;

  const sections = Object.entries(topicAnalysis);
  if (sections.length === 0) return null;

  return (
    <div className="space-y-4">
      {sections.map(([sectionKey, topics]) => {
        if (!topics || typeof topics !== 'object') return null;
        const topicEntries = Object.entries(topics);
        if (topicEntries.length === 0) return null;

        return (
          <div key={sectionKey}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {SECTION_LABELS[sectionKey] ?? sectionKey}
            </p>
            <div className="divide-y divide-gray-50">
              {topicEntries.map(([topicName, data]) => (
                <TopicBar
                  key={topicName}
                  topicName={topicName}
                  score={data?.score ?? 0}
                  weak={data?.weak ?? false}
                  recommendation={data?.recommendation}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
