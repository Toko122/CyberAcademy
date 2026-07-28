"use client";

import { adminFetch } from "@/lib/adminApi";
import type { MemberType } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  description: string;
  image: string;
  memberType: MemberType;
  sortOrder: number;
}

function GroupCard({
  member,
  isAdmin,
  canMoveUp,
  canMoveDown,
  onMove,
}: {
  member: TeamMember;
  isAdmin: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (id: string, direction: -1 | 1) => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const handleDelete = async () => {
    if (!confirm("ნამდვილად გსურთ წევრის წაშლა?")) return;
    setIsDeleting(true);
    const result = await adminFetch("/api/admin/mutations", {
      method: "POST",
      body: JSON.stringify({ entity: "groups", action: "delete", id: member.id }),
    });
    if (!result.ok) {
      alert("წევრის წაშლა ვერ მოხერხდა");
      setIsDeleting(false);
      return;
    }
    router.refresh();
  };

  const move = async (direction: -1 | 1) => {
    setIsMoving(true);
    try {
      await onMove(member.id, direction);
    } finally {
      setIsMoving(false);
    }
  };

  if (isDeleting) return null;

  return (
    <motion.article
      layout
      className="group relative flex min-h-[420px] w-full max-w-80 flex-col items-center justify-center overflow-hidden rounded-[30px] border border-white/20 bg-gray-900/40 px-6 py-10 text-center shadow-2xl backdrop-blur-2xl"
    >
      <div className="absolute left-[-20%] top-[-20%] h-full w-full animate-pulse bg-cyan-600/20 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-20%] h-full w-full animate-pulse bg-blue-600/20 blur-[100px]" />

      <div className="relative z-10 h-40 w-40 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-1 shadow-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-gray-900">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="160px"
            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        </div>
      </div>

      <div className="relative z-10 mt-6 space-y-2">
        <h3 className="text-3xl font-black tracking-tight text-white">{member.name}</h3>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
          {member.memberType === "teacher" ? "Teacher" : "Administration"}
        </p>
        {member.description && (
          <p className="pt-4 text-sm italic text-gray-400">&quot;{member.description}&quot;</p>
        )}
      </div>

      {isAdmin && (
        <div className="relative z-20 mt-7 grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!canMoveUp || isMoving}
            onClick={() => void move(-1)}
            aria-label={`Move ${member.name} up`}
            className="min-h-11 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 transition hover:bg-cyan-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowUp className="mx-auto h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={!canMoveDown || isMoving}
            onClick={() => void move(1)}
            aria-label={`Move ${member.name} down`}
            className="min-h-11 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 transition hover:bg-cyan-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowDown className="mx-auto h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/features/group/edit/${member.id}`)}
            className="min-h-11 rounded-xl border border-blue-500/30 bg-blue-500/20 px-3 text-xs font-bold text-blue-300 transition hover:bg-blue-500 hover:text-white"
          >
            რედაქტირება
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            className="min-h-11 rounded-xl border border-red-500/30 bg-red-500/20 px-3 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            წაშლა
          </button>
        </div>
      )}
    </motion.article>
  );
}

function MemberSection({
  title,
  members,
  isAdmin,
  onMove,
}: {
  title: string;
  members: TeamMember[];
  isAdmin: boolean;
  onMove: (type: MemberType, id: string, direction: -1 | 1) => Promise<void>;
}) {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-black text-white sm:text-4xl">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
      </div>
      {members.length ? (
        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <GroupCard
              key={member.id}
              member={member}
              isAdmin={isAdmin}
              canMoveUp={index > 0}
              canMoveDown={index < members.length - 1}
              onMove={(id, direction) => onMove(member.memberType, id, direction)}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          No members have been added to this section yet.
        </p>
      )}
    </section>
  );
}

export default function GroupComponent({
  groups,
  isAdmin = false,
}: {
  groups: TeamMember[];
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [members, setMembers] = useState(groups);

  const moveMember = async (type: MemberType, id: string, direction: -1 | 1) => {
    const group = members.filter((member) => member.memberType === type);
    const index = group.findIndex((member) => member.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= group.length) return;
    const reordered = [...group];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setMembers((current) => [
      ...current.filter((member) => member.memberType !== type),
      ...reordered.map((member, sortOrder) => ({ ...member, sortOrder })),
    ]);
    const result = await adminFetch("/api/admin/mutations", {
      method: "POST",
      body: JSON.stringify({
        entity: "groups",
        action: "reorder",
        memberType: type,
        orderedIds: reordered.map((member) => member.id),
      }),
    });
    if (!result.ok) {
      setMembers(groups);
      alert("Order could not be saved.");
      return;
    }
    router.refresh();
  };

  const administration = members
    .filter((member) => member.memberType === "administration")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const teachers = members
    .filter((member) => member.memberType === "teacher")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-7xl space-y-20">
      <MemberSection title="Administration" members={administration} isAdmin={isAdmin} onMove={moveMember} />
      <MemberSection title="Teachers" members={teachers} isAdmin={isAdmin} onMove={moveMember} />
    </div>
  );
}
