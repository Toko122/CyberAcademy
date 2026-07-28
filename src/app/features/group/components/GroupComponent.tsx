"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { adminFetch } from "@/lib/adminApi";
import type { MemberType } from "@/lib/types";
import { GripVertical } from "lucide-react";
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
  saving,
}: {
  member: TeamMember;
  isAdmin: boolean;
  saving: boolean;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id, disabled: !isAdmin || saving });

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

  if (isDeleting) return null;

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 30 : undefined,
      }}
      className={`group relative flex min-h-[430px] w-full max-w-[22rem] touch-manipulation flex-col items-center overflow-hidden rounded-[2rem] border bg-gradient-to-b from-slate-900/80 to-slate-950/70 px-6 py-9 text-center backdrop-blur-2xl transition-[border-color,box-shadow,transform,opacity] duration-300 sm:px-8 ${
        isDragging
          ? "border-cyan-300/70 opacity-90 shadow-[0_28px_70px_rgba(6,182,212,0.28)]"
          : "border-white/10 shadow-[0_24px_70px_rgba(2,6,23,0.5)] hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_28px_80px_rgba(6,182,212,0.14)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="pointer-events-none absolute left-[-20%] top-[-20%] h-full w-full bg-cyan-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-20%] h-full w-full bg-blue-600/15 blur-[100px]" />

      {isAdmin && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={saving}
          aria-label={`Drag to reorder ${member.name}`}
          className="absolute right-4 top-4 z-30 flex min-h-11 min-w-11 touch-none cursor-grab items-center justify-center rounded-xl border border-cyan-400/30 bg-slate-950/75 text-cyan-300 shadow-lg backdrop-blur transition hover:border-cyan-300 hover:bg-cyan-500 hover:text-slate-950 active:cursor-grabbing disabled:cursor-wait disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <GripVertical className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      <div className="relative z-10 h-36 w-36 shrink-0 rounded-full bg-gradient-to-tr from-cyan-400 via-cyan-500 to-blue-500 p-1 shadow-[0_16px_45px_rgba(6,182,212,0.25)] sm:h-40 sm:w-40">
        <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-slate-950">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="160px"
            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        </div>
      </div>

      <div className="relative z-10 mt-6 flex w-full min-w-0 flex-col items-center">
        <h3 className="max-w-full text-balance text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
          {member.name}
        </h3>
        <p className="mt-2.5 max-w-full text-center text-sm font-black leading-relaxed tracking-tight text-cyan-300 sm:text-base">
          {member.memberType === "teacher" ? "მასწავლებელი" : "ადმინისტრაცია"}
        </p>
        {member.description && (
          <p className="mt-4 line-clamp-3 max-w-full text-sm font-medium leading-relaxed text-slate-400">
            &quot;{member.description}&quot;
          </p>
        )}
      </div>

      {isAdmin && (
        <div className="relative z-20 mt-auto grid w-full grid-cols-2 gap-2 pt-7">
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
    </article>
  );
}

function MemberSection({
  id,
  title,
  members,
  isAdmin,
  saving,
  onReorder,
}: {
  id: string;
  title: string;
  members: TeamMember[];
  isAdmin: boolean;
  saving: boolean;
  onReorder: (type: MemberType, ordered: TeamMember[]) => Promise<void>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || saving) return;
    const oldIndex = members.findIndex((member) => member.id === active.id);
    const newIndex = members.findIndex((member) => member.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    void onReorder(members[0].memberType, arrayMove(members, oldIndex, newIndex));
  };

  return (
    <section className="space-y-9 sm:space-y-10" aria-labelledby={`${id}-heading`}>
      <div className="flex flex-col items-center">
        <h2
          id={`${id}-heading`}
          className="text-center text-4xl font-black leading-[1.1] tracking-tight text-white md:text-6xl"
        >
          {title}
        </h2>
        <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent sm:w-28" />
        {isAdmin && saving && <span className="mt-3 text-xs font-semibold text-cyan-300">Saving order…</span>}
      </div>

      {members.length ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          accessibility={{
            screenReaderInstructions: {
              draggable:
                "Press space to pick up a team member. Use arrow keys to move it within this section, then press space to drop or Escape to cancel.",
            },
          }}
        >
          <SortableContext items={members.map((member) => member.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 justify-items-center gap-8 overflow-x-clip md:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <GroupCard key={member.id} member={member} isAdmin={isAdmin} saving={saving} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
  const [savingType, setSavingType] = useState<MemberType | null>(null);

  const persistOrder = async (type: MemberType, reordered: TeamMember[]) => {
    if (!isAdmin || savingType) return;
    const previous = members;
    const normalized = reordered.map((member, sortOrder) => ({ ...member, sortOrder }));
    setMembers((current) => [
      ...current.filter((member) => member.memberType !== type),
      ...normalized,
    ]);
    setSavingType(type);

    const result = await adminFetch("/api/admin/mutations", {
      method: "POST",
      body: JSON.stringify({
        entity: "groups",
        action: "reorder",
        memberType: type,
        orderedIds: normalized.map((member) => member.id),
      }),
    });

    setSavingType(null);
    if (!result.ok) {
      setMembers(previous);
      alert("Order could not be saved. The previous order has been restored.");
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
      <MemberSection
        id="administration"
        title="ადმინისტრაცია"
        members={administration}
        isAdmin={isAdmin}
        saving={savingType === "administration"}
        onReorder={persistOrder}
      />
      <MemberSection
        id="teachers"
        title="მასწავლებლები"
        members={teachers}
        isAdmin={isAdmin}
        saving={savingType === "teacher"}
        onReorder={persistOrder}
      />
    </div>
  );
}
