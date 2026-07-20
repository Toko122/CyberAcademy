"use client";
import { adminFetch } from "@/lib/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  PlusCircle,
  Tag,
  AlignLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";

const CreatePartnerComponent = () => {
  const [form, setForm] = useState({
    name: "",
    color: "bg-cyan-500/10",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
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
      formData.append("entity", "partners");
      formData.append("action", "create");
      formData.append("name", form.name);
      formData.append("color", form.color);

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
          : "მოხდა შეცდომა პარტნიორის დამატებისას";
        throw new Error(message);
      }

      setSuccess(true);
      setPreview(null);
      setFile(null);
      setForm({ name: "", color: "bg-cyan-500/10" });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "მოხდა შეცდომა პარტნიორის დამატებისას";
      setError(message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
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
            ახალი <span className="text-cyan-500">პარტნიორის</span> დამატება
          </h2>
          <p className="text-gray-400">
            ატვირთეთ პარტნიორი ორგანიზაციის ლოგო და მონაცემები
          </p>
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
                პარტნიორი წარმატებით დაემატა!
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="group relative">
            <label className="block text-sm font-medium text-gray-400 mb-3 ml-1">
              ლოგო
            </label>
            <div className={`relative h-56 rounded-2xl border-2 border-dashed border-white/10 group-hover:border-cyan-500/50 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden ${form.color}`}>
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={240}
                  height={240}
                  unoptimized
                  className="w-2/3 h-2/3 object-contain drop-shadow-xl z-10"
                />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    ატვირთეთ ფოტო (PNG რეკომენდირებულია)
                  </span>
                </>
              )}
              <input
                onChange={handleImageChange}
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <AlignLeft className="w-4 h-4 mr-2 text-cyan-500" /> ორგანიზაციის დასახელება
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="მაგ: TBC Bank"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <Tag className="w-4 h-4 mr-2 text-cyan-500" /> ფერი / Background Color
              </label>
              <select
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="bg-cyan-500/10">Cyan</option>
                <option value="bg-blue-500/10">Blue</option>
                <option value="bg-indigo-500/10">Indigo</option>
                <option value="bg-purple-500/10">Purple</option>
                <option value="bg-emerald-500/10">Emerald</option>
                <option value="bg-amber-500/10">Amber</option>
                <option value="bg-rose-500/10">Rose</option>
                <option value="bg-white/5">White / Gray</option>
              </select>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={
                !loading
                  ? { scale: 1.02, boxShadow: "0 0 25px rgba(6,182,212,0.4)" }
                  : {}
              }
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full py-4 text-white font-black rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${loading
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
                  პარტნიორის დამატება
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePartnerComponent;
