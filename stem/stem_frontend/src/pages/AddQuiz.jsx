import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  createBulkProblems,
  getTopics,
} from "../apis/quizApi";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  FileText,
  Upload,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Loader from "../components/Loader";

const TeacherProblems = ({ subject: propSubject, topicId: propTopicId }) => {
  const navigate = useNavigate();
  const { subject: urlSubject, topicId: urlTopicId } = useParams();
  
  const subject = propSubject || urlSubject;
  const topicId = propTopicId || urlTopicId;

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicDetails, setTopicDetails] = useState(null);
  
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [importMode, setImportMode] = useState("single"); // "single" or "bulk"
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    question: "",
    answer: "",
    difficulty: "easy",
    explanation: "",
  });

  const [bulkText, setBulkText] = useState("");

  const fetchTopicDetails = async () => {
    try {
      const res = await getTopics(subject);
      const matched = res.data?.find((t) => t._id === topicId);
      if (matched) {
        setTopicDetails(matched);
        setForm((prev) => ({ ...prev, difficulty: matched.difficulty }));
      }
    } catch (err) {
      console.error("Failed to fetch topic details", err);
    }
  };

  const fetchProblems = async () => {
    if (!subject || !topicId) return;
    setLoading(true);
    try {
      const res = await getProblems(subject, topicId);
      setProblems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quiz problems.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject && topicId) {
      fetchTopicDetails();
      fetchProblems();
    }
  }, [subject, topicId]);

  const handleOpenCreate = () => {
    setForm({
      question: "",
      answer: "",
      difficulty: topicDetails?.difficulty || "easy",
      explanation: "",
    });
    setEditingId(null);
    setImportMode("single");
    setShowForm(true);
  };

  const handleEdit = (p, e) => {
    e.stopPropagation(); // prevent expanding the item card
    setForm({
      question: p.question,
      answer: p.answer,
      difficulty: p.difficulty || "easy",
      explanation: p.explanation || "",
    });
    setEditingId(p._id);
    setImportMode("single");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (importMode === "single") {
      if (!form.question.trim()) return toast.error("Question text is required");
      if (!form.answer.trim()) return toast.error("Answer is required");
      if (!form.explanation.trim()) return toast.error("Explanation is required");

      try {
        if (editingId) {
          await updateProblem(editingId, form);
          toast.success("Problem updated successfully!");
        } else {
          await createProblem({
            ...form,
            subject,
            topic_id: topicId,
          });
          toast.success("Problem added successfully!");
        }

        setShowForm(false);
        setForm({
          question: "",
          answer: "",
          difficulty: topicDetails?.difficulty || "easy",
          explanation: "",
        });
        setEditingId(null);
        fetchProblems();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save the problem.");
      }
    } else {
      // Bulk Upload Mode
      if (!bulkText.trim()) return toast.error("Please paste your JSON questions array");
      
      try {
        const parsed = JSON.parse(bulkText);
        if (!Array.isArray(parsed)) {
          return toast.error("JSON must be a list (Array) of questions");
        }

        // Validate each item
        for (let i = 0; i < parsed.length; i++) {
          const p = parsed[i];
          if (!p.question || !p.answer || !p.explanation) {
            return toast.error(`Question at index ${i} is missing required fields (question, answer, explanation)`);
          }
        }

        await createBulkProblems({
          topic_id: topicId,
          problems: parsed,
        });

        toast.success(`Successfully uploaded ${parsed.length} questions!`);
        setShowForm(false);
        setBulkText("");
        fetchProblems();
      } catch (err) {
        console.error(err);
        toast.error("Invalid JSON format. Please check the structure.");
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteProblem(id);
        toast.success("Question deleted successfully!");
        fetchProblems();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete the question.");
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!subject || !topicId) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center p-6">
        <div className="bg-[#151B2B] border border-white/10 p-8 rounded-3xl text-center max-w-md shadow-2xl">
          <Info className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Topic Selected</h2>
          <p className="text-slate-400 mb-6">
            Please choose a topic from the Topics Manager to edit its quiz questions.
          </p>
          <button
            onClick={() => navigate("/add-topic")}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0B1120] rounded-xl font-bold transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            Go to Topics Manager
          </button>
        </div>
      </div>
    );
  }

  const jsonTemplate = `[
  {
    "question": "What is the square root of 64?",
    "answer": "8",
    "difficulty": "easy",
    "explanation": "8 multiplied by 8 equals 64."
  },
  {
    "question": "Solve: 2x + 5 = 15",
    "answer": "5",
    "difficulty": "medium",
    "explanation": "Subtract 5: 2x = 10, then divide by 2: x = 5."
  }
]`;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans relative pb-16">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <div className="bg-[#0B1120]/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/add-topic")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 text-sm font-bold cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Topics</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Quiz Manager
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Context Banner */}
        {topicDetails && (
          <div className="bg-[#151B2B]/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 blur-2xl rounded-full pointer-events-none" />
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-2.5 py-1 rounded-md border border-yellow-400/20">
              {topicDetails.subject} / {topicDetails.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-4 mb-2 leading-tight">
              {topicDetails.title}
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {topicDetails.description}
            </p>
          </div>
        )}

        {/* Problems List Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              <span>Questions ({problems.length})</span>
            </h2>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-350 hover:to-amber-450 text-[#0B1120] rounded-xl text-sm font-bold transition-all shadow-[0_5px_15px_rgba(250,204,21,0.2)] hover:shadow-[0_10px_20px_rgba(250,204,21,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader />
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-[#151B2B]/40 border border-white/5 rounded-3xl p-12 text-center mt-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No questions created</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              This topic doesn't have any quiz questions yet. Create one or bulk import from JSON.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
            >
              Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {problems.map((p, idx) => {
              const isExpanded = expandedId === p._id;
              const difficultyColors = {
                easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
              };

              return (
                <div
                  key={p._id}
                  onClick={() => toggleExpand(p._id)}
                  className="bg-[#151B2B]/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer overflow-hidden"
                >
                  {/* Item Header */}
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xs font-bold text-slate-500 mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <p className="text-white font-semibold leading-relaxed">
                          {p.question}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              difficultyColors[p.difficulty || "easy"]
                            }`}
                          >
                            {p.difficulty || "easy"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleEdit(p, e)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Edit Question"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(p._id, e)}
                        className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-slate-400 p-1.5">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/20 p-5 space-y-4"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Correct Answer
                          </h4>
                          <p className="text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-2.5 text-sm inline-block">
                            {p.answer}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Explanation
                          </h4>
                          <p className="text-slate-300 text-sm leading-relaxed font-medium">
                            {p.explanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT QUESTION OVERLAY */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-white/10 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>{editingId ? "Edit Question" : "Add New Question"}</span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 font-medium">
                Add questions to build your quiz topics.
              </p>

              {/* Mode Toggle (only for new questions) */}
              {!editingId && (
                <div className="flex bg-[#151B2B] rounded-xl p-1 mb-6 border border-white/5">
                  <button
                    type="button"
                    onClick={() => setImportMode("single")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      importMode === "single"
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0B1120]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Single Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode("bulk")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      importMode === "bulk"
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0B1120]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Bulk Import (JSON)
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {importMode === "single" ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Question Text
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. What is 15% of 200?"
                        value={form.question}
                        onChange={(e) => setForm({ ...form, question: e.target.value })}
                        className="w-full bg-[#151B2B] border border-white/10 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none transition-all resize-none placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 30"
                          value={form.answer}
                          onChange={(e) => setForm({ ...form, answer: e.target.value })}
                          className="w-full bg-[#151B2B] border border-white/10 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none transition-all placeholder:text-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Difficulty Level
                        </label>
                        <select
                          value={form.difficulty}
                          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                          className="w-full bg-[#151B2B] border border-white/10 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Explanation
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Provide the step-by-step solution so students can learn from mistakes."
                        value={form.explanation}
                        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                        className="w-full bg-[#151B2B] border border-white/10 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none transition-all resize-none placeholder:text-slate-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                          JSON Questions List
                        </label>
                      </div>
                      <textarea
                        rows={8}
                        placeholder={`Paste JSON array of questions here...`}
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        className="w-full bg-[#151B2B] border border-white/10 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none transition-all resize-y placeholder:text-slate-600"
                      />
                    </div>

                    {/* Collapsible Template Details */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                        <Info className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Expected JSON Structure</span>
                      </h4>
                      <pre className="text-[10px] text-slate-400 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto">
                        {jsonTemplate}
                      </pre>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-3 border border-white/10 hover:bg-white/5 text-slate-300 rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-350 hover:to-amber-450 text-[#0B1120] font-bold rounded-xl text-sm transition-all shadow-[0_5px_15px_rgba(250,204,21,0.2)] cursor-pointer"
                  >
                    {editingId ? "Save Changes" : importMode === "single" ? "Add Question" : "Import Questions"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherProblems;

