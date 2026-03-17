import { useState } from 'react';
import { LibraryBig, Globe, EyeOff, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import StatCard from '../../components/common/StatCard';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useQuestionBank, useQuestionBankStats, usePublishBankQuestion, useUnpublishBankQuestion } from '../../controllers/questionsController';

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
};

export default function QuestionBank() {
  const [filter, setFilter] = useState('all');

  const { data, isLoading, isError } = useQuestionBank(filter !== 'all' ? { status: filter } : undefined);
  const { data: statsData } = useQuestionBankStats();
  const publishMutation = usePublishBankQuestion();
  const unpublishMutation = useUnpublishBankQuestion();

  const questions = data?.data ?? [];
  const stats = statsData?.data ?? {};

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Question Bank
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Publish or unpublish questions for assessments</p>
      </div>

      {/* Stats */}
      {statsData && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="TOTAL" value={stats.total ?? '—'} icon={LibraryBig} accentColor="indigo" />
          <StatCard label="PUBLISHED" value={stats.published ?? '—'} icon={Globe} accentColor="emerald" />
          <StatCard label="UNPUBLISHED" value={stats.unpublished ?? '—'} icon={EyeOff} accentColor="amber" />
          <StatCard label="BY DIFFICULTY" value={`${stats.hard ?? 0} Hard`} icon={BarChart2} accentColor="red" />
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Questions</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${questions.length} question${questions.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {isError ? (
          <div className="px-5 py-10 text-center text-sm text-red-500">Failed to load question bank.</div>
        ) : isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Loading...</div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
            <LibraryBig size={32} strokeWidth={1.5} />
            <p className="text-sm">No questions found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {['#', 'QUESTION', 'TYPE', 'DIFFICULTY', 'MARKS', 'STATUS', 'ACTION'].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, idx) => {
                const qId = q.id || q._id;
                const isPublished = q.status === 'published' || q.isPublished;
                const isPending = publishMutation.isPending || unpublishMutation.isPending;

                return (
                  <TableRow key={qId}>
                    <TableCell className="text-gray-400 text-xs w-10">{idx + 1}</TableCell>
                    <TableCell className="max-w-[260px]">
                      <span className="text-sm text-gray-800 line-clamp-2">{q.text || q.question}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">{q.type || 'MCQ'}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[q.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                        {q.difficulty || '—'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">{q.marks ?? '—'}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isPublished ? 'Published' : 'Unpublished'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isPublished ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2"
                          onClick={() => unpublishMutation.mutate(qId)}
                          disabled={isPending}
                        >
                          <EyeOff size={12} /> Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
                          onClick={() => publishMutation.mutate(qId)}
                          disabled={isPending}
                        >
                          <Globe size={12} /> Publish
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
