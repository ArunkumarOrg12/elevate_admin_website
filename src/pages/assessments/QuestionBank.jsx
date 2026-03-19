import { useState } from 'react';
import { LibraryBig, Globe, EyeOff, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StatCard from '../../components/common/StatCard';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useQuestionBank, usePublishBankQuestion, useUnpublishBankQuestion } from '../../controllers/questionsController';

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
};

export default function QuestionBank() {
  const [filter, setFilter] = useState('all');

  // Always fetch all, filter client-side
  const { data, isLoading, isError } = useQuestionBank();
  const publishMutation = usePublishBankQuestion();
  const unpublishMutation = useUnpublishBankQuestion();

  const allQuestions = data?.questions ?? [];

  // Client-side filter
  const questions = filter === 'published'
    ? allQuestions.filter(q => q.is_published === true)
    : filter === 'unpublished'
      ? allQuestions.filter(q => q.is_published !== true)
      : allQuestions;

  // Compute stats from fetched data
  const stats = {
    total: allQuestions.length,
    published: allQuestions.filter(q => q.is_published === true).length,
    unpublished: allQuestions.filter(q => q.is_published !== true).length,
    hard: allQuestions.filter(q => q.difficulty === 'hard').length,
  };

  const isPending = publishMutation.isPending || unpublishMutation.isPending;

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
      {!isLoading && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="TOTAL" value={stats.total} icon={LibraryBig} accentColor="indigo" />
          <StatCard label="PUBLISHED" value={stats.published} icon={Globe} accentColor="emerald" />
          <StatCard label="UNPUBLISHED" value={stats.unpublished} icon={EyeOff} accentColor="amber" />
          <StatCard label="HARD" value={stats.hard} icon={BarChart2} accentColor="red" />
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
                {['#', 'QUESTION', 'CATEGORY', 'DIFFICULTY', 'SCORE', 'PAPER SET', 'STATUS', 'ACTION'].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, idx) => {
                const qId = q.id || q._id;
                const isPublished = q.is_published === true;
                return (
                  <TableRow key={qId}>
                    <TableCell className="text-gray-400 text-xs w-10">{idx + 1}</TableCell>
                    <TableCell className="max-w-[260px]">
                      <span className="text-sm text-gray-800 line-clamp-2">{q.question_text}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize w-fit">
                          {q.category?.replace(/_/g, ' ') || '—'}
                        </span>
                        {q.sub_category && (
                          <span className="text-xs text-gray-400 capitalize">
                            {q.sub_category.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[q.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                        {q.difficulty || '—'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">{q.base_score ?? '—'}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">
                        {q.paper_set || '—'}
                      </span>
                    </TableCell>
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
