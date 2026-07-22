"use client";
import { adminFetch } from "@/lib/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  PlusCircle,
  BookOpen,
  Clock,
  Tag,
  AlignLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Category = "პროგრამირება" | "დიზაინი" | "მარკეტინგი" | "IT სპეციალისტი";

interface EditCourseComponentProps {
  course: {
    id: string;
    title: string;
    description: string;
    image: string;
    price: string;
    duration: string;
    category: string;
  };
}

const EditCourseComponent = ({ course }: EditCourseComponentProps) => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: course.title || "",
    description: course.description || "",
    price: course.price || "",
    duration: course.duration || "",
    category: (course.category || "პროგრამირება") as Category,
  });

  const [preview, setPreview] = useState<string | null>(course.image || null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, category: e.target.value as Category }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("entity", "courses");
      formData.append("action", "update");
      formData.append("id", course.id);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("duration", form.duration);
      formData.append("category", form.category);
      formData.append("existingImage", course.image || "");

      if (file) {
        formData.append("file", file);
      }

      const result = await adminFetch("/api/admin/mutations", {
        method: "POST",
        body: formData,
      });

      if (!result.ok || (typeof result.body === "object" && result.body && "success" in result.body && result.body.success === false)) {
        const message = typeof result.body === "object" && result.body && "message" in result.body
          ? String(result.body.message)
          : "მოხდა შეცდომა კურსის განახლებისას";
        throw new Error(message);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/features/courses");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "მოხდა შეცდომა კურსის განახლებისას";
      setError(message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };



  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-[#020617] py-10 sm:py-16 lg:py-20 px-3 sm:px-6 flex justify-center items-center font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl bg-[#1e293b]/40 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-2xl"
      >
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            კურსის <span className="text-cyan-500">რედაქტირება</span>
          </h2>
          <p className="text-gray-400">განაახლეთ ინფორმაცია სასწავლო პროგრამის შესახებ</p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                კურსი წარმატებით განახლდა!
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="group relative">
            <label className="block text-sm font-medium text-gray-400 mb-3 ml-1">კურსის გარეკანი</label>
            <div className="relative h-48 rounded-2xl border-2 border-dashed border-white/10 group-hover:border-cyan-500/50 transition-colors flex flex-col items-center justify-center bg-white/5 cursor-pointer overflow-hidden">
              {preview ? (
                <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400 group-hover:text-white transition-colors">ატვირთეთ ფოტო (JPG, PNG)</span>
                </>
              )}
              <input onChange={handleImageChange} type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/jpeg,image/png,image/webp,image/gif" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <BookOpen className="w-4 h-4 mr-2 text-cyan-500" /> დასახელება
              </label>
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                type="text"
                placeholder="მაგ: React Advanced"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <Clock className="w-4 h-4 mr-2 text-cyan-500" /> ხანგრძლივობა
              </label>
              <input
                name="duration"
                required
                value={form.duration}
                onChange={handleChange}
                type="text"
                placeholder="მაგ: 9 თვე"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <Tag className="w-4 h-4 mr-2 text-cyan-500" /> ღირებულება
              </label>
              <input
                name="price"
                required
                value={form.price}
                onChange={handleChange}
                type="text"
                placeholder="მაგ: 2700 ₾"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <PlusCircle className="w-4 h-4 mr-2 text-cyan-500" /> კატეგორია
              </label>
              <select
                value={form.category}
                onChange={handleCategoryChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white/70 outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option className="text-black" value="პროგრამირება">პროგრამირება</option>
                <option className="text-black" value="დიზაინი">დიზაინი</option>
                <option className="text-black" value="მარკეტინგი">მარკეტინგი</option>
                <option className="text-black" value="IT სპეციალისტი">IT სპეციალისტი</option>
              </select>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
              <AlignLeft className="w-4 h-4 mr-2 text-cyan-500" /> აღწერა
            </label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="მოკლედ აღწერეთ სასწავლო კურსი..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row gap-4">
            <motion.button
              type="button"
              onClick={() => router.back()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-1/3 py-4 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/5 transition-all duration-300"
            >
              გაუქმება
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 25px rgba(6,182,212,0.4)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`flex-1 py-4 text-white font-black rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${loading ? "bg-cyan-600 cursor-not-allowed opacity-70" : "bg-cyan-500 hover:bg-cyan-400 cursor-pointer"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  იგზავნება...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  კურსის განახლება
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditCourseComponent;
