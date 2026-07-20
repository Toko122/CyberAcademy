"use client";
import { adminFetch } from "@/lib/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Tag,
  AlignLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  Type,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EditGalleryComponentProps {
  image: {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
  };
}

const EditGalleryComponent = ({ image: galleryImage }: EditGalleryComponentProps) => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: galleryImage.title || "",
    description: galleryImage.description || "",
    category: galleryImage.category || "ზოგადი",
  });

  const [preview, setPreview] = useState<string | null>(galleryImage.image || null);
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
    setForm((prev) => ({ ...prev, category: e.target.value }));
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
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("entity", "gallery");
      formData.append("action", "update");
      formData.append("id", galleryImage.id);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("existingImage", galleryImage.image || "");

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
          : "მოხდა შეცდომა ფოტოს განახლებისას";
        throw new Error(message);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/features/gallery");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "მოხდა შეცდომა ფოტოს განახლებისას";
      setError(message);
      setTimeout(() => setError(""), 3000);
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
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl bg-[#1e293b]/40 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-2xl"
      >
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            ფოტოს{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              რედაქტირება
            </span>
          </h2>
          <p className="text-gray-400">განაახლეთ ინფორმაცია გალერეის ფოტოს შესახებ</p>
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
                ფოტო წარმატებით განახლდა!
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="group relative">
            <label className="block text-sm font-medium text-gray-400 mb-3 ml-1">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-500" />
                სურათი
              </span>
            </label>
            <div className="relative h-56 rounded-2xl border-2 border-dashed border-white/10 group-hover:border-cyan-500/50 transition-colors flex flex-col items-center justify-center bg-white/5 cursor-pointer overflow-hidden">
              {preview ? (
                <>
                  <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-10 h-10 text-white" />
                    <span className="text-white ml-2 font-medium">შეცვლა</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    ატვირთეთ ფოტო (JPG, PNG)
                  </span>
                </>
              )}
              <input
                onChange={handleImageChange}
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <Type className="w-4 h-4 mr-2 text-cyan-500" /> სათაური
              </label>
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                type="text"
                placeholder="მაგ: სასწავლო გარემო"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <Tag className="w-4 h-4 mr-2 text-cyan-500" /> კატეგორია
              </label>
              <select
                value={form.category}
                onChange={handleCategoryChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white/70 outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option className="text-black" value="ზოგადი">ზოგადი</option>
                <option className="text-black" value="სასწავლო პროცესი">სასწავლო პროცესი</option>
                <option className="text-black" value="ღონისძიება">ღონისძიება</option>
                <option className="text-black" value="გუნდი">გუნდი</option>
                <option className="text-black" value="ინფრასტრუქტურა">ინფრასტრუქტურა</option>
              </select>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
              <AlignLeft className="w-4 h-4 mr-2 text-cyan-500" /> აღწერა
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="მოკლედ აღწერეთ ფოტო..."
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
              className={`flex-1 py-4 text-white font-black rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${loading
                  ? "bg-cyan-600 cursor-not-allowed opacity-70"
                  : "bg-cyan-500 hover:bg-cyan-400 cursor-pointer"
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
                  ფოტოს განახლება
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditGalleryComponent;
