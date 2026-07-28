"use client";
import { adminFetch } from "@/lib/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  PlusCircle,
  Users,
  AlignLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";

const CreateGroupComponent = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    memberType: "administration",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("entity", "groups");
      formData.append("action", "create");
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("memberType", form.memberType);

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
          : "მოხდა შეცდომა მონაცემების დამატებისას";
        throw new Error(message);
      }

      setSuccess(true);
      setPreview(null);
      setFile(null);
      setForm({ name: "", description: "", memberType: "administration" });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "მოხდა შეცდომა მონაცემების დამატებისას";
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
            ახალი <span className="text-cyan-500">წევრის</span> დამატება
          </h2>
          <p className="text-gray-400">
            შეიყვანეთ ინფორმაცია ადმინისტრაციის ან მასწავლებლის შესახებ
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
                მონაცემები წარმატებით დაემატა!
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="group relative">
            <label className="block text-sm font-medium text-gray-400 mb-3 ml-1">
              პროფილის ფოტო
            </label>
            <div className="relative h-56 rounded-2xl border-2 border-dashed border-white/10 group-hover:border-cyan-500/50 transition-colors flex flex-col items-center justify-center bg-white/5 cursor-pointer overflow-hidden">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
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
                required
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <BookOpen className="w-4 h-4 mr-2 text-cyan-500" /> სახელი და გვარი
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="მაგ: კახი ჩაკვეტაძე"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
                <Users className="w-4 h-4 mr-2 text-cyan-500" /> Member type
              </label>
              <select
                name="memberType"
                required
                value={form.memberType}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option className="text-black" value="administration">Administration</option>
                <option className="text-black" value="teacher">Teacher</option>
              </select>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-400 ml-1">
              <AlignLeft className="w-4 h-4 mr-2 text-cyan-500" /> მოკლე ბიოგრაფია / აღწერა
            </label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="აღწერეთ წევრის გამოცდილება და როლი..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
            />
          </motion.div>

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
                  წევრის დამატება
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateGroupComponent;
