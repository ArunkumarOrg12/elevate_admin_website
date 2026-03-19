import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useQuestion, useUpdateQuestion, useDeleteQuestion } from '../../controllers/questionsController';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'MCQ' },
  { value: 'msq', label: 'MSQ' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_blank', label: 'Fill in the Blank' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
};

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(searchParams.get('mode') === 'edit');

  const { data, isLoading, isError } = useQuestion(id);
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const question = data?.data;

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (question) {
      setForm({
        text: question.text || question.question || '',
        type: question.type || 'mcq',
        difficulty: question.difficulty || 'medium',
        marks: question.marks ?? '',
        negativeMarks: question.negativeMarks ?? '',
        explanation: question.explanation || '',
        tags: (question.tags || []).join(', '),
        options: question.options?.map((o, i) => ({
          label: String.fromCharCode(65 + i),
          text: o.text || o,
          isCorrect: o.isCorrect || false,
        })) || [],
      });
    }
  }, [question]);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const updateOption = (idx, key, value) => {
    setForm(prev => {
      const options = [...prev.options];
      options[idx] = { ...options[idx], [key]: value };
      if (key === 'isCorrect' && value && prev.type === 'mcq') {
        options.forEach((o, i) => { if (i !== idx) options[i] = { ...o, isCorrect: false }; });
      }
      return { ...prev, options };
    });
  };

  const handleSave = () => {
    const payload = {
      id,
      text: form.text.trim(),
      type: form.type,
      difficulty: form.difficulty,
      marks: form.marks !== '' ? Number(form.marks) : undefined,
      negativeMarks: form.negativeMarks !== '' ? Number(form.negativeMarks) : undefined,
      explanation: form.explanation.trim() || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      options: form.options.map(o => ({ text: o.text.trim(), isCorrect: o.isCorrect })),
    };
    updateMutation.mutate(payload, {
      onSuccess: () => setEditMode(false),
    });
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this question? This cannot be undone.')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => navigate('/assessments/questions'),
    });
  };

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-gray-400">Loading question...</div>;
  }

  if (isError || !question) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-red-500 mb-3">Question not found or failed to load.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/assessments/questions')}>
          Back to Questions
        </Button>
      </div>
    );
  }

  const showOptions = ['mcq', 'msq', 'true_false'].includes(form?.type || question.type);

  return (
    <div className="page-enter space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-1.5">
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Question Detail
            </h1>
            <p className="text-gray-500 text-sm">ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editMode ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => setEditMode(true)}>
                <Edit2 size={14} /> Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                <Trash2 size={14} /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={() => setEditMode(false)}>
                <X size={14} /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                <Save size={14} /> {updateMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* View mode */}
      {!editMode && (
        <>
          <Card>
            <CardContent className="px-5 py-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Question</p>
                  <p className="text-base text-gray-900 font-medium leading-relaxed">{question.text || question.question}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Type</p>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full uppercase font-medium">{question.type || 'MCQ'}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[question.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                    {question.difficulty || '—'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Marks</p>
                  <span className="text-sm font-semibold text-gray-800">{question.marks ?? '—'}</span>
                </div>
                {question.negativeMarks != null && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Negative Marks</p>
                    <span className="text-sm font-semibold text-red-600">-{question.negativeMarks}</span>
                  </div>
                )}
              </div>
              {question.tags?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {question.tags.map(tag => (
                      <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {showOptions && question.options?.length > 0 && (
            <Card>
              <CardHeader className="px-5 py-4 border-b border-gray-100">
                <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">Options</CardTitle>
              </CardHeader>
              <CardContent className="px-5 py-4 space-y-2">
                {question.options.map((opt, idx) => {
                  const text = opt.text || opt;
                  const correct = opt.isCorrect;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[9px] border ${
                        correct ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <span className={`text-xs font-bold w-5 ${correct ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm text-gray-800 flex-1">{text}</span>
                      {correct && <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {question.explanation && (
            <Card>
              <CardHeader className="px-5 py-4 border-b border-gray-100">
                <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">Explanation</CardTitle>
              </CardHeader>
              <CardContent className="px-5 py-4">
                <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Edit mode */}
      {editMode && form && (
        <Card>
          <CardContent className="px-5 py-5 space-y-5">
            <div className="space-y-1.5">
              <Label>Question Text</Label>
              <textarea
                rows={3}
                value={form.text}
                onChange={e => setField('text', e.target.value)}
                className="w-full rounded-[9px] border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setField('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={v => setField('difficulty', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Marks</Label>
                <Input type="number" value={form.marks} onChange={e => setField('marks', e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Tags <span className="text-gray-400 font-normal">(comma-separated)</span></Label>
              <Input value={form.tags} onChange={e => setField('tags', e.target.value)} placeholder="aptitude, verbal" />
            </div>

            {showOptions && (
              <div className="space-y-2">
                <Label>Options</Label>
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type={form.type === 'msq' ? 'checkbox' : 'radio'}
                      name="edit-correct"
                      checked={opt.isCorrect}
                      onChange={e => updateOption(idx, 'isCorrect', e.target.checked)}
                      className="accent-indigo-600 w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-xs font-bold text-gray-500 w-5">{opt.label}</span>
                    <Input
                      value={opt.text}
                      onChange={e => updateOption(idx, 'text', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Explanation</Label>
              <textarea
                rows={2}
                value={form.explanation}
                onChange={e => setField('explanation', e.target.value)}
                className="w-full rounded-[9px] border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {updateMutation.isError && (
        <p className="text-sm text-red-500">Failed to update question. Please try again.</p>
      )}
    </div>
  );
}
