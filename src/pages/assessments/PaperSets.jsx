import { useState } from 'react';
import { Layers, ChevronDown, ChevronRight, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { usePaperSets, useRemoveQuestionFromPaperSet } from '../../controllers/questionsController';

function PaperSetRow({ setName, questions }) {
  const [expanded, setExpanded] = useState(false);
  const removeMutation = useRemoveQuestionFromPaperSet();

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(prev => !prev)}
      >
        <TableCell className="w-8">
          {expanded
            ? <ChevronDown size={15} className="text-gray-400" />
            : <ChevronRight size={15} className="text-gray-400" />}
        </TableCell>
        <TableCell className="font-medium text-gray-900 text-sm">{setName}</TableCell>
        <TableCell className="text-sm text-gray-600">—</TableCell>
        <TableCell>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
            {questions.length} questions
          </span>
        </TableCell>
        <TableCell>
          <Badge variant="completed">active</Badge>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell colSpan={5} className="p-0 bg-gray-50/60">
            <div className="px-8 py-3">
              {questions.length === 0 ? (
                <div className="flex items-center gap-2 py-3 text-gray-400">
                  <HelpCircle size={14} />
                  <span className="text-xs">No questions in this paper set.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id || q._id}
                      className="flex items-center gap-3 bg-white rounded-[8px] px-3 py-2 border border-gray-100"
                    >
                      <span className="text-xs font-semibold text-gray-400 w-5">{idx + 1}</span>
                      <span className="text-sm text-gray-800 flex-1 line-clamp-1">
                        {q.question_text || q.text || q.question}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${
                        q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700'
                        : q.difficulty === 'hard' ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                      }`}>{q.difficulty || 'medium'}</span>
                      <span className="text-xs text-gray-400 hidden sm:inline">{q.category?.replace(/_/g, ' ') || ''}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMutation.mutate({ setId: setName, qId: q.id || q._id });
                        }}
                        title="Remove from set"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function PaperSets() {
  const { data, isLoading, isError } = usePaperSets();
  const sets = data?.paperSets ?? data?.data ?? [];
  const questionsByPaperSet = data?.questionsByPaperSet ?? {};

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Paper Sets
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">View and manage paper set question mappings</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100">
          <CardTitle className="text-base">All Paper Sets</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${sets.length} set${sets.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>

        {isError ? (
          <div className="px-5 py-10 text-center text-sm text-red-500">Failed to load paper sets.</div>
        ) : isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Loading...</div>
        ) : sets.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
            <Layers size={32} strokeWidth={1.5} />
            <p className="text-sm">No paper sets found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                {['PAPER SET', 'DESCRIPTION', 'QUESTIONS', 'STATUS'].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sets.map(setName => (
                <PaperSetRow
                  key={setName}
                  setName={setName}
                  questions={questionsByPaperSet[setName] ?? []}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
