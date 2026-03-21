import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  useQuestion,
  useUpdateQuestion,
  useUpdateQuestionImage,
  useUpdateOptionImages,
} from '../../controllers/questionsController';

// ── Static data (same as AddQuestion) ─────────────────────────────────────────
const CATEGORIES = [
  { value: 'cognitive_ability', label: 'Cognitive Ability' },
  { value: 'behavioral_traits', label: 'Behavioral Traits' },
  { value: 'technical', label: 'Technical' },
  { value: 'verbal', label: 'Verbal' },
  { value: 'aptitude', label: 'Aptitude' },
];

const SUB_CATEGORIES = {
  cognitive_ability: [
    { value: 'logical_reasoning', label: 'Logical Reasoning' },
    { value: 'verbal_reasoning', label: 'Verbal Reasoning' },
    { value: 'numerical_reasoning', label: 'Numerical Reasoning' },
    { value: 'abstract_reasoning', label: 'Abstract Reasoning' },
  ],
  behavioral_traits: [
    { value: 'conscientiousness', label: 'Conscientiousness' },
    { value: 'openness', label: 'Openness' },
    { value: 'agreeableness', label: 'Agreeableness' },
    { value: 'emotional_stability', label: 'Emotional Stability' },
    { value: 'extraversion', label: 'Extraversion' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'teamwork', label: 'Teamwork' },
    { value: 'adaptability', label: 'Adaptability' },
  ],
  technical: [
    { value: 'programming', label: 'Programming' },
    { value: 'data_structures', label: 'Data Structures' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'databases', label: 'Databases' },
    { value: 'networking', label: 'Networking' },
    { value: 'system_design', label: 'System Design' },
    { value: 'os_concepts', label: 'OS Concepts' },
  ],
  verbal: [
    { value: 'reading_comprehension', label: 'Reading Comprehension' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'grammar', label: 'Grammar' },
  ],
  aptitude: [
    { value: 'quantitative', label: 'Quantitative' },
    { value: 'data_interpretation', label: 'Data Interpretation' },
    { value: 'logical', label: 'Logical' },
  ],
};

const PAPER_SETS = ['set1', 'set2', 'set3', 'set4', 'set5'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];
const OPTIONS = ['A', 'B', 'C', 'D'];
const OPTION_TEXT_FIELD = { A: 'option_a_text', B: 'option_b_text', C: 'option_c_text', D: 'option_d_text' };

// ── Main Component ─────────────────────────────────────────────────────────────
export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuestion(id);
  const updateMutation = useUpdateQuestion();

  const updateQuestionImageMutation = useUpdateQuestionImage();
  const updateOptionImagesMutation = useUpdateOptionImages();

  // Axios interceptor already unwraps res.data, so `data` IS the response body.
  // Backend may return { question: {...} }, { data: {...} }, or the object directly.
  const question = data?.question ?? data?.data ?? (data && typeof data === 'object' && data.id ? data : null);

  const [form, setForm] = useState(null);
  const [questionImage, setQuestionImage] = useState(null);   // new file to upload
  const [optionImages, setOptionImages] = useState({ A: null, B: null, C: null, D: null });
  const [errors, setErrors] = useState({});

  // Populate form when data arrives
  useEffect(() => {
    if (question) {
      setForm({
        question_text: question.question_text || question.text || question.question || '',
        category: question.category || '',
        sub_category: question.sub_category || '',
        paper_set: question.paper_set || '',
        semester: Array.isArray(question.semester) ? question.semester : [],
        difficulty: question.difficulty || 'medium',
        base_score: question.base_score ?? question.marks ?? '',
        job_role: question.job_role || '',
        correct_answer: question.correct_answer || '',
        option_a_text: question.option_a_text || '',
        option_b_text: question.option_b_text || '',
        option_c_text: question.option_c_text || '',
        option_d_text: question.option_d_text || '',
      });
    }
  }, [question]);

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const toggleSemester = (sem) => {
    setForm(prev => ({
      ...prev,
      semester: prev.semester.includes(sem)
        ? prev.semester.filter(s => s !== sem)
        : [...prev.semester, sem],
    }));
    if (errors.semester) setErrors(prev => ({ ...prev, semester: '' }));
  };

  const isTechnical = form?.category === 'technical';
  const hasSeniorSemester = form?.semester?.some(s => s >= 6);
  const needsJobRole = isTechnical && hasSeniorSemester;
  const subCategoryOptions = SUB_CATEGORIES[form?.category] || [];

  const validate = () => {
    if (!form) return false;
    const e = {};
    if (!form.question_text.trim()) e.question_text = 'Required';
    if (!form.category) e.category = 'Required';
    if (form.category && subCategoryOptions.length > 0 && !form.sub_category) e.sub_category = 'Required';
    if (!form.paper_set) e.paper_set = 'Required';
    if (form.semester.length === 0) e.semester = 'Select at least one semester';
    if (!form.difficulty) e.difficulty = 'Required';
    if (!form.base_score || isNaN(Number(form.base_score))) e.base_score = 'Required';
    if (needsJobRole && !form.job_role.trim()) e.job_role = 'Required for Technical (S6+)';
    if (!form.correct_answer) e.correct_answer = 'Select the correct answer';
    OPTIONS.forEach(l => {
      if (!form[OPTION_TEXT_FIELD[l]].trim()) e[OPTION_TEXT_FIELD[l]] = 'Required';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      id,
      question_text: form.question_text.trim(),
      category: form.category,
      paper_set: form.paper_set,
      semester: form.semester,
      difficulty: form.difficulty,
      base_score: Number(form.base_score),
      correct_answer: form.correct_answer,
      option_a_text: form.option_a_text.trim(),
      option_b_text: form.option_b_text.trim(),
      option_c_text: form.option_c_text.trim(),
      option_d_text: form.option_d_text.trim(),
      ...(form.sub_category && { sub_category: form.sub_category }),
      ...(needsJobRole && form.job_role && { job_role: form.job_role.trim() }),
    };

    updateMutation.mutate(payload, {
      onSuccess: async () => {
        // Upload new question image if selected
        if (questionImage) {
          const fd = new FormData();
          fd.append('file', questionImage);
          await updateQuestionImageMutation.mutateAsync({ id, formData: fd }).catch(() => {});
        }

        // Upload new option images if any selected
        const hasOptionImages = Object.values(optionImages).some(Boolean);
        if (hasOptionImages) {
          const fd = new FormData();
          Object.entries(optionImages).forEach(([letter, file]) => {
            if (file) fd.append(`option_${letter.toLowerCase()}_image`, file);
          });
          await updateOptionImagesMutation.mutateAsync({ id, formData: fd }).catch(() => {});
        }

        navigate('/assessments/questions');
      },
    });
  };

  const isSubmitting =
    updateMutation.isPending ||
    updateQuestionImageMutation.isPending ||
    updateOptionImagesMutation.isPending;

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2 text-sm">
        <Loader2 size={18} className="animate-spin" /> Loading question...
      </div>
    );
  }

  if (isError || (!isLoading && !question)) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-red-500 mb-3">Question not found or failed to load.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/assessments/questions')}>
          Back to Questions
        </Button>
      </div>
    );
  }

  if (!form) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-enter space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-1.5">
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Edit Question
          </h1>
          <p className="text-gray-500 text-sm">Update question details &amp; answers</p>
        </div>
      </div>

      {/* 2-column layout matching AddQuestion */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">

        {/* LEFT — Question Content + Answer Options */}
        <div className="space-y-4">
          {/* Question Content */}
          <Card>
            <CardHeader className="px-4 sm:px-5 py-3.5 border-b border-gray-100">
              <CardTitle className="text-sm text-gray-600 font-medium uppercase tracking-wide">Question Content</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 py-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="q-text">Question Text <span className="text-red-500">*</span></Label>
                <textarea
                  id="q-text"
                  rows={4}
                  placeholder="Enter the question..."
                  value={form.question_text}
                  onChange={e => setField('question_text', e.target.value)}
                  className={`w-full rounded-[9px] border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.question_text ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.question_text && <p className="text-xs text-red-500">{errors.question_text}</p>}
              </div>

              {/* Existing question image */}
              {question?.question_image && !questionImage && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Current image:</span>
                  <a
                    href={question.question_image}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 hover:underline truncate max-w-[200px]"
                  >
                    {question.question_image.split('/').pop()}
                  </a>
                </div>
              )}
              <ImageUpload
                label={question?.question_image ? 'Replace question image' : 'Question Image (optional)'}
                file={questionImage}
                onChange={setQuestionImage}
              />
            </CardContent>
          </Card>

          {/* Answer Options */}
          <Card>
            <CardHeader className="px-4 sm:px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 font-medium uppercase tracking-wide">Answer Options</CardTitle>
                {errors.correct_answer && <p className="text-xs text-red-500">{errors.correct_answer}</p>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Select the radio to mark the correct answer</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 py-4 space-y-3">
              {OPTIONS.map(letter => {
                const textField = OPTION_TEXT_FIELD[letter];
                const isCorrect = form.correct_answer === letter;
                const existingImg = question?.[`option_${letter.toLowerCase()}_image`];
                return (
                  <div key={letter} className={`rounded-lg border p-3 space-y-2 transition-colors ${isCorrect ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correct_answer"
                        value={letter}
                        checked={isCorrect}
                        onChange={() => setField('correct_answer', letter)}
                        className="accent-emerald-600 w-4 h-4 flex-shrink-0 cursor-pointer"
                        title="Mark as correct"
                      />
                      <span className={`text-xs font-bold w-5 ${isCorrect ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {letter}
                      </span>
                      <Input
                        placeholder={`Option ${letter}`}
                        value={form[textField]}
                        onChange={e => setField(textField, e.target.value)}
                        className={`flex-1 ${errors[textField] ? 'border-red-400' : ''}`}
                      />
                    </div>
                    {errors[textField] && (
                      <p className="text-xs text-red-500 pl-11">{errors[textField]}</p>
                    )}
                    <div className="pl-11 space-y-1">
                      {existingImg && !optionImages[letter] && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400">Current:</span>
                          <a
                            href={existingImg}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-600 hover:underline truncate max-w-[160px]"
                          >
                            {existingImg.split('/').pop()}
                          </a>
                        </div>
                      )}
                      <ImageUpload
                        label={existingImg ? `Replace Option ${letter} image` : `Option ${letter} image (optional)`}
                        file={optionImages[letter]}
                        onChange={file => setOptionImages(prev => ({ ...prev, [letter]: file }))}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — Classification (sticky on desktop) */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <Card>
            <CardHeader className="px-4 sm:px-5 py-3.5 border-b border-gray-100">
              <CardTitle className="text-sm text-gray-600 font-medium uppercase tracking-wide">Classification</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 py-4 space-y-3">
              {/* Category */}
              <div className="space-y-1.5">
                <Label>Category <span className="text-red-500">*</span></Label>
                <Select
                  value={form.category}
                  onValueChange={v => { setField('category', v); setField('sub_category', ''); }}
                >
                  <SelectTrigger className={errors.category ? 'border-red-400' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
              </div>

              {/* Sub-category */}
              {form.category && subCategoryOptions.length > 0 && (
                <div className="space-y-1.5">
                  <Label>Sub-Category <span className="text-red-500">*</span></Label>
                  <Select value={form.sub_category} onValueChange={v => setField('sub_category', v)}>
                    <SelectTrigger className={errors.sub_category ? 'border-red-400' : ''}>
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategoryOptions.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sub_category && <p className="text-xs text-red-500">{errors.sub_category}</p>}
                </div>
              )}

              {/* Paper Set + Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Paper Set <span className="text-red-500">*</span></Label>
                  <Select value={form.paper_set} onValueChange={v => setField('paper_set', v)}>
                    <SelectTrigger className={errors.paper_set ? 'border-red-400' : ''}>
                      <SelectValue placeholder="Set" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAPER_SETS.map(s => (
                        <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paper_set && <p className="text-xs text-red-500">{errors.paper_set}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Difficulty <span className="text-red-500">*</span></Label>
                  <Select value={form.difficulty} onValueChange={v => setField('difficulty', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map(d => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Base Score */}
              <div className="space-y-1.5">
                <Label htmlFor="q-score">Base Score <span className="text-red-500">*</span></Label>
                <Input
                  id="q-score"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 1"
                  value={form.base_score}
                  onChange={e => setField('base_score', e.target.value)}
                  className={errors.base_score ? 'border-red-400' : ''}
                />
                {errors.base_score && <p className="text-xs text-red-500">{errors.base_score}</p>}
              </div>

              {/* Job Role (conditional) */}
              {needsJobRole && (
                <div className="space-y-1.5">
                  <Label htmlFor="q-jobrole">
                    Job Role <span className="text-red-500">*</span>
                    <span className="ml-1 text-xs text-gray-400 font-normal">(S6+)</span>
                  </Label>
                  <Input
                    id="q-jobrole"
                    placeholder="e.g. Software Engineer"
                    value={form.job_role}
                    onChange={e => setField('job_role', e.target.value)}
                    className={errors.job_role ? 'border-red-400' : ''}
                  />
                  {errors.job_role && <p className="text-xs text-red-500">{errors.job_role}</p>}
                </div>
              )}

              {/* Semester */}
              <div className="space-y-2">
                <Label>
                  Semester <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-gray-400 font-normal">(select all that apply)</span>
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SEMESTERS.map(sem => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => toggleSemester(sem)}
                      className={`h-9 rounded-lg text-xs font-semibold border transition-colors ${
                        form.semester.includes(sem)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      S{sem}
                    </button>
                  ))}
                </div>
                {errors.semester && <p className="text-xs text-red-500">{errors.semester}</p>}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={() => navigate(-1)} className="w-full">
                  Cancel
                </Button>
                {updateMutation.isError && (
                  <p className="text-xs text-red-500 text-center">
                    {updateMutation.error?.response?.data?.message || 'Failed to save. Please try again.'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Image Upload helper (identical to AddQuestion) ─────────────────────────────
function ImageUpload({ label, file, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1.5 cursor-pointer group">
        <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">{label}</span>
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-dashed transition-colors ${
          file
            ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
            : 'border-gray-300 text-gray-400 group-hover:border-indigo-300 group-hover:text-indigo-500'
        }`}>
          <ImageIcon size={11} />
          {file ? file.name : 'Upload'}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => onChange(e.target.files?.[0] || null)}
        />
      </label>
      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-gray-300 hover:text-red-400 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
