import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useCreateQuestion } from '../../controllers/questionsController';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice (MCQ)' },
  { value: 'msq', label: 'Multiple Select (MSQ)' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_blank', label: 'Fill in the Blank' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const EMPTY_OPTION = (label) => ({ label, text: '', isCorrect: false });

const DEFAULT_OPTIONS = [
  EMPTY_OPTION('A'),
  EMPTY_OPTION('B'),
  EMPTY_OPTION('C'),
  EMPTY_OPTION('D'),
];

export default function AddQuestion() {
  const navigate = useNavigate();
  const createMutation = useCreateQuestion();

  const [form, setForm] = useState({
    text: '',
    type: 'mcq',
    difficulty: 'medium',
    marks: '',
    negativeMarks: '',
    explanation: '',
    tags: '',
    options: DEFAULT_OPTIONS,
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const updateOption = (idx, key, value) => {
    setForm(prev => {
      const options = [...prev.options];
      options[idx] = { ...options[idx], [key]: value };
      // For MCQ: single correct
      if (key === 'isCorrect' && value && prev.type === 'mcq') {
        options.forEach((o, i) => { if (i !== idx) options[i] = { ...o, isCorrect: false }; });
      }
      return { ...prev, options };
    });
    if (errors.options) setErrors(prev => ({ ...prev, options: '' }));
  };

  const addOption = () => {
    const labels = 'ABCDEFGHIJ';
    const idx = form.options.length;
    setForm(prev => ({ ...prev, options: [...prev.options, EMPTY_OPTION(labels[idx] || String(idx + 1))] }));
  };

  const removeOption = (idx) => {
    setForm(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    const e = {};
    if (!form.text.trim()) e.text = 'Question text is required';
    if (!form.type) e.type = 'Question type is required';
    if (!form.difficulty) e.difficulty = 'Difficulty is required';
    if (form.marks !== '' && isNaN(Number(form.marks))) e.marks = 'Must be a number';
    const showOptions = ['mcq', 'msq', 'true_false'].includes(form.type);
    if (showOptions) {
      const hasCorrect = form.options.some(o => o.isCorrect);
      if (!hasCorrect) e.options = 'Mark at least one correct answer';
      const hasEmpty = form.options.some(o => !o.text.trim());
      if (hasEmpty) e.options = e.options || 'All options must have text';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      text: form.text.trim(),
      type: form.type,
      difficulty: form.difficulty,
      marks: form.marks ? Number(form.marks) : undefined,
      negativeMarks: form.negativeMarks ? Number(form.negativeMarks) : undefined,
      explanation: form.explanation.trim() || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      options: form.options.map(o => ({ text: o.text.trim(), isCorrect: o.isCorrect })),
    };
    createMutation.mutate(payload, {
      onSuccess: () => navigate('/assessments/questions'),
    });
  };

  const showOptions = ['mcq', 'msq', 'true_false'].includes(form.type);

  return (
    <div className="page-enter space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-1.5">
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Add Question
          </h1>
          <p className="text-gray-500 text-sm">Create a new assessment question</p>
        </div>
      </div>

      <Card>
        <CardHeader className="px-5 py-4 border-b border-gray-100">
          <CardTitle className="text-sm text-gray-600 font-medium uppercase tracking-wide">Question Details</CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-5 space-y-5">

          {/* Question text */}
          <div className="space-y-1.5">
            <Label htmlFor="q-text">Question Text <span className="text-red-500">*</span></Label>
            <textarea
              id="q-text"
              rows={3}
              placeholder="Enter the question..."
              value={form.text}
              onChange={e => setField('text', e.target.value)}
              className={`w-full rounded-[9px] border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors
                ${errors.text ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.text && <p className="text-xs text-red-500">{errors.text}</p>}
          </div>

          {/* Type / Difficulty / Marks row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Type <span className="text-red-500">*</span></Label>
              <Select value={form.type} onValueChange={v => setField('type', v)}>
                <SelectTrigger className={errors.type ? 'border-red-400' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Difficulty <span className="text-red-500">*</span></Label>
              <Select value={form.difficulty} onValueChange={v => setField('difficulty', v)}>
                <SelectTrigger className={errors.difficulty ? 'border-red-400' : ''}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="q-marks">Marks</Label>
              <Input
                id="q-marks"
                type="number"
                min="0"
                placeholder="e.g. 1"
                value={form.marks}
                onChange={e => setField('marks', e.target.value)}
                className={errors.marks ? 'border-red-400' : ''}
              />
              {errors.marks && <p className="text-xs text-red-500">{errors.marks}</p>}
            </div>
          </div>

          {/* Negative marks + Tags row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="q-neg">Negative Marks</Label>
              <Input
                id="q-neg"
                type="number"
                min="0"
                step="0.25"
                placeholder="e.g. 0.25"
                value={form.negativeMarks}
                onChange={e => setField('negativeMarks', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-tags">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></Label>
              <Input
                id="q-tags"
                placeholder="e.g. aptitude, verbal, reasoning"
                value={form.tags}
                onChange={e => setField('tags', e.target.value)}
              />
            </div>
          </div>

          {/* Options */}
          {showOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>
                  Options <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-gray-400 font-normal">
                    {form.type === 'msq' ? '(multiple correct)' : '(single correct)'}
                  </span>
                </Label>
                {errors.options && <p className="text-xs text-red-500">{errors.options}</p>}
              </div>
              <div className="space-y-2">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type={form.type === 'msq' ? 'checkbox' : 'radio'}
                      name="correct-option"
                      checked={opt.isCorrect}
                      onChange={e => updateOption(idx, 'isCorrect', e.target.checked)}
                      className="accent-indigo-600 w-4 h-4 flex-shrink-0 cursor-pointer"
                      title="Mark as correct"
                    />
                    <span className="text-xs font-semibold text-gray-500 w-5">{opt.label}</span>
                    <Input
                      placeholder={`Option ${opt.label}`}
                      value={opt.text}
                      onChange={e => updateOption(idx, 'text', e.target.value)}
                      className="flex-1"
                    />
                    {form.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeOption(idx)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {form.options.length < 6 && (
                <Button variant="secondary" size="sm" onClick={addOption}>
                  <Plus size={13} /> Add Option
                </Button>
              )}
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-1.5">
            <Label htmlFor="q-explanation">Explanation <span className="text-gray-400 font-normal">(optional)</span></Label>
            <textarea
              id="q-explanation"
              rows={2}
              placeholder="Explain the correct answer..."
              value={form.explanation}
              onChange={e => setField('explanation', e.target.value)}
              className="w-full rounded-[9px] border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pb-6">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Saving...' : 'Save Question'}
        </Button>
      </div>

      {createMutation.isError && (
        <p className="text-sm text-red-500">Failed to save question. Please try again.</p>
      )}
    </div>
  );
}
