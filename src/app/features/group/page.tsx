import React from "react";
import GroupComponent from "./components/GroupComponent";
import { listGroups } from "@/lib/repositories/content";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

const GroupPage = async () => {
  const [rawGroups, admin] = await Promise.all([listGroups(30), requireAdmin()]);
  const groups = rawGroups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description || "",
    image: group.image,
    memberType: group.member_type,
    sortOrder: group.sort_order,
  }));

  return (
    <main className="min-h-screen bg-[#020617] pt-16 sm:pt-20 lg:pt-24 pb-12">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase block">
              აკადემიის ადმინისტრაცია
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
              ჩვენი <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                გუნდი
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              გაეცანით იმ ადამიანებს, რომლებიც ქმნიან Cyber Academy-ის მომავალს და
              ზრუნავენ თქვენს განათლებაზე.
            </p>
          </div>

          <div>
            <Link href="/" passHref>
              <span className="flex min-h-11 w-full sm:w-auto items-center justify-center px-6 sm:px-8 cursor-pointer py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all backdrop-blur-md shadow-lg">
                მთავარი გვერდი
              </span>
            </Link>
          </div>
        </div>

        <GroupComponent groups={groups} isAdmin={Boolean(admin)} />
      </div>
    </main>
  );
};

export default GroupPage;
