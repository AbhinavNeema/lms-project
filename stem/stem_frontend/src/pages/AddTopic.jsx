import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../apis/quizApi";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Brain,
  HelpCircle,
  FolderPlus,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Loader from "../components/Loader";

const MAIN_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5173";

const TeacherTopics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState("math");
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subject: "math",
    difficulty: "easy",
    category: "",
    description: "",
  });

  const fetchTopics = async (subject) => {
    setLoading(true);
    try {
      const res = await getTopics(subject);
      setTopics(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(activeSubject);
  }, [activeSubject]);

  const handleSubjectChange = (subject) => {
    setActiveSubject(subject);
    setForm((prev) => ({ ...prev, subject }));
  };

  const handleOpenCreate = () => {
    setForm({
      title: "",
      subject: activeSubject,
      difficulty: "easy",
      category: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (topic) => {
    setForm({
      title: topic.title,
      subject: topic.subject,
      difficulty: topic.difficulty,
      category: topic.category,
      description: topic.description || "",
    });
    setEditingId(topic._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.category.trim()) return toast.error("Category is required");
    if (!form.description.trim()) return toast.error("Description is required");

    try {
      if (editingId) {
        await updateTopic(editingId, form);
        toast.success("Topic updated successfully!");
      } else {
        await createTopic(form);
        toast.success("Topic created successfully!");
      }

      setShowForm(false);
      setForm({
        title: "",
        subject: activeSubject,
        difficulty: "easy",
        category: "",
        description: "",
      });
      setEditingId(null);
      fetchTopics(activeSubject);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong saving the topic.");
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will delete all its quiz questions too.`)) {
      try {
        await deleteTopic(id);
        toast.success("Topic deleted successfully!");
        fetchTopics(activeSubject);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete topic.");
      }
    }
  };

  const subjectsList = [
    { id: "math", label: "Mathematics", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { id: "science", label: "Science", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    { id: "computer", label: "Computer Science", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans relative pb-16">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <div className="bg-[#0B1120]/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = MAIN_URL)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 text-sm font-bold cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Main App</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 text-sm font-bold cursor-pointer"
            >
              STEM Dashboard
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Educator Panel
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-3 tracking-tight">
              Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">STEM Topics</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Create and edit topics for students. Manage their quizzes, questions, and explanations.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-350 hover:to-amber-450 text-[#0B1120] rounded-xl font-bold transition-all shadow-[0_10px_20px_rgba(250,204,21,0.2)] hover:shadow-[0_15px_30px_rgba(250,204,21,0.3)] hover:-translate-y-0.5 cursor-pointer"
          >
            <FolderPlus className="w-5 h-5" />
            <span>Create Topic</span>
          </button>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex border-b border-white/5 gap-2 mb-8 overflow-x-auto pb-1">
          {subjectsList.map((subject) => {
            const isActive = activeSubject === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => handleSubjectChange(subject.id)}
                className={`px-6 py-3 font-bold text-sm transition-all border-b-2 rounded-t-xl cursor-pointer ${
                  isActive
                    ? "border-yellow-400 text-yellow-400 bg-white/5"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {subject.label}
              </button>
            );
          })}
        </div>

        {/* Topics Content */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader />
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-[#151B2B]/40 border border-white/5 rounded-3xl p-12 text-center max-w-xl mx-auto mt-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No topics found</h3>
            <p className="text-slate-400 mb-6">
              Create a new topic to start building quizzes for this subject.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
            >
              Add Your First Topic
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const difficultyColors = {
                easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
              };

              return (
                <motion.div
                  key={topic._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#151B2B]/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/10 p-6 flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                        {topic.category}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          difficultyColors[topic.difficulty] || "text-slate-400 bg-slate-500/10"
                        }`}
                      >
                        {topic.difficulty}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                      {topic.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Edit Topic"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(topic._id, topic.title)}
                        className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-all cursor-pointer border border-red-500/10"
                        title="Delete Topic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/add-quiz/${topic.subject}/${topic._id}`)}
                      className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:text-yellow-300 group/btn transition-colors cursor-pointer bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/20 px-3.5 py-2 rounded-xl"
                    >
                      <span>Manage Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>{editingId ? "Edit Topic" : "Create New Topic"}</span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 font-medium">
                Provide details for this lesson topic. Subject is locked to current view.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Linear Equations"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#151B2B] border border-white/10 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Algebra"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide a detailed description of what is covered in this topic. Students will see this as context."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-[#151B2B] border border-white/10 focus:border-yellow-400/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none transition-all resize-none placeholder:text-slate-500"
                  />
                </div>

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
                    {editingId ? "Save Changes" : "Create Topic"}
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

export default TeacherTopics;

