import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Edit2,
  HelpCircle,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useQuestions,
  useDeleteQuestion,
} from "../../controllers/questionsController";
import RoleGuard from "../../components/common/RoleGuard";
import { ROLES } from "../../constants/roles";

const DIFFICULTY_COLORS = {
  easy: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  hard: "bg-red-50 text-red-700",
};

export default function Questions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuestions(
    search ? { q: search } : undefined,
  );
  const deleteMutation = useDeleteQuestion();

  // Axios interceptor unwraps res.data — handle array or wrapped shapes
  const questions = Array.isArray(data)
    ? data
    : (data?.data ?? data?.questions ?? []);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="page-enter space-y-5">
      {/* Confirm delete dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-[10px] bg-red-50 flex items-center justify-center">
                <AlertCircle size={18} className="text-red-600" />
              </div>
              <div>
                <DialogTitle>Delete Question</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <p className="text-sm text-gray-600 px-6 pb-2">
            Are you sure you want to delete this question? It will be removed
            from all paper sets.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Questions
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage assessment question bank
          </p>
        </div>
        <RoleGuard
          allowedRoles={[
            ROLES.SUPER_ADMIN,
            ROLES.COLLEGE_ADMIN,
            ROLES.COLLEGE_FACULTY,
          ]}
        >
          <Button
            size="sm"
            onClick={() => navigate("/assessments/questions/add")}
          >
            <Plus size={14} /> Add Question
          </Button>
        </RoleGuard>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100">
          <CardTitle className="text-base">All Questions</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading..."
              : `${questions.length} question${questions.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>

        {isError ? (
          <div className="px-5 py-10 text-center text-sm text-red-500">
            Failed to load questions. Please try again.
          </div>
        ) : isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
            <HelpCircle size={32} strokeWidth={1.5} />
            <p className="text-sm">
              No questions found.{" "}
              <button
                className="text-indigo-600 hover:underline"
                onClick={() => navigate("/assessments/questions/add")}
              >
                Add one
              </button>
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "#",
                  "QUESTION",
                  "TYPE",
                  "DIFFICULTY",
                  "MARKS",
                  "TAGS",
                  "ACTIONS",
                ].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, idx) => {
                const questionText =
                  q.question_text || q.text || q.question || "";
                const marks = q.final_score ?? q.base_score ?? q.marks;
                const hasImage = q.question_image || q.imageUrl;
                const category = q.sub_category || q.category;
                const tags = Array.isArray(q.tags)
                  ? q.tags
                  : category
                    ? [category]
                    : [];
                return (
                  <TableRow key={q.id}>
                    <TableCell className="text-gray-400 text-xs w-10">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="max-w-[280px]">
                      <div className="flex items-start gap-2">
                        {hasImage && (
                          <ImageIcon
                            size={13}
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                          />
                        )}
                        <span className="text-sm text-gray-800 line-clamp-2">
                          {questionText}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {q.type || "MCQ"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[q.difficulty] || "bg-gray-100 text-gray-600"}`}
                      >
                        {q.difficulty || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {marks ?? "—"}
                    </TableCell>
                    <TableCell>
                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{tags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-600"
                          onClick={() =>
                            navigate(`/assessments/questions/${q.id}`)
                          }
                          title="View / Edit"
                        >
                          <Eye size={14} />
                        </Button>
                        <RoleGuard
                          allowedRoles={[
                            ROLES.SUPER_ADMIN,
                            ROLES.COLLEGE_ADMIN,
                            ROLES.COLLEGE_FACULTY,
                          ]}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-gray-500 hover:text-amber-600"
                            onClick={() =>
                              navigate(`/assessments/questions/${q.id}/edit`)
                            }
                            title="Edit Question"
                          >
                            <Edit2 size={14} />
                          </Button>
                        </RoleGuard>
                        <RoleGuard
                          allowedRoles={[
                            ROLES.SUPER_ADMIN,
                            ROLES.COLLEGE_ADMIN,
                            ROLES.COLLEGE_FACULTY,
                          ]}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-gray-500 hover:text-red-600"
                            onClick={() => setDeleteTarget(q)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </RoleGuard>
                      </div>
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
