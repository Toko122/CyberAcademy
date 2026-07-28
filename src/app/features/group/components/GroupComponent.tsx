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
      className={`group relative flex min-h-[420px] w-full max-w-80 touch-manipulation flex-col items-center justify-center overflow-hidden rounded-[30px] border bg-gray-900/40 px-6 py-10 text-center backdrop-blur-2xl transition-[border-color,box-shadow,opacity] ${
        isDragging
          ? "border-cyan-300/70 opacity-90 shadow-[0_28px_70px_rgba(6,182,212,0.28)]"
          : "border-white/20 shadow-2xl"
      }`}
    >
      <div className="pointer-events-none absolute left-[-20%] top-[-20%] h-full w-full animate-pulse bg-cyan-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-20%] h-full w-full animate-pulse bg-blue-600/20 blur-[100px]" />

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
  title,
  members,
  isAdmin,
  saving,
  onReorder,
}: {
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
    <section className="space-y-8" aria-labelledby={`${title.toLowerCase()}-heading`}>
      <div className="flex items-center gap-4">
        <h2 id={`${title.toLowerCase()}-heading`} className="text-2xl font-black text-white sm:text-4xl">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
        {isAdmin && saving && <span className="text-xs font-semibold text-cyan-300">Saving order…</span>}
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
            <div className="grid grid-cols-1 justify-items-center gap-8 overflow-x-clip md:grid-cols-2 lg:grid-cols-3">
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
        title="Administration"
        members={administration}
        isAdmin={isAdmin}
        saving={savingType === "administration"}
        onReorder={persistOrder}
      />
      <MemberSection
        title="Teachers"
        members={teachers}
        isAdmin={isAdmin}
        saving={savingType === "teacher"}
        onReorder={persistOrder}
      />
    </div>
  );
}
