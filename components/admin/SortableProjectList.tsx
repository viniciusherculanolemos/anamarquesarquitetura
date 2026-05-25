"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Projeto } from "@/types";

function SortableRow({
  projeto,
  onDelete,
  onTogglePublish,
  onToggleDestaque,
}: {
  projeto: Projeto;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, current: boolean) => void;
  onToggleDestaque: (id: string, current: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: projeto.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-white border border-stone-200 p-3 rounded"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing"
        aria-label="Arrastar"
      >
        <GripVertical size={18} />
      </button>

      <div className="relative w-14 h-10 shrink-0 overflow-hidden rounded">
        <Image
          src={projeto.imagem_capa ?? "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&q=60"}
          alt={projeto.titulo}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 truncate">{projeto.titulo}</p>
        <p className="text-xs text-stone-400 truncate">{projeto.categoria} · {projeto.ano}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onToggleDestaque(projeto.id, projeto.destaque)}
          title={projeto.destaque ? "Remover destaque" : "Destacar"}
          className={`p-1.5 rounded transition-colors ${projeto.destaque ? "text-amber-500 hover:text-amber-600" : "text-stone-300 hover:text-amber-400"}`}
        >
          <Star size={16} fill={projeto.destaque ? "currentColor" : "none"} />
        </button>

        <button
          onClick={() => onTogglePublish(projeto.id, projeto.publicado)}
          title={projeto.publicado ? "Despublicar" : "Publicar"}
          className={`p-1.5 rounded transition-colors ${projeto.publicado ? "text-green-500 hover:text-green-600" : "text-stone-300 hover:text-green-400"}`}
        >
          {projeto.publicado ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>

        <Link
          href={`/admin/projetos/${projeto.id}`}
          className="p-1.5 rounded text-stone-400 hover:text-blue-500 transition-colors"
          title="Editar"
        >
          <Pencil size={16} />
        </Link>

        <button
          onClick={() => onDelete(projeto.id)}
          className="p-1.5 rounded text-stone-300 hover:text-red-500 transition-colors"
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

interface Props {
  initialProjects: Projeto[];
}

export default function SortableProjectList({ initialProjects }: Props) {
  const [projetos, setProjetos] = useState<Projeto[]>(initialProjects);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projetos.findIndex((p) => p.id === active.id);
    const newIndex = projetos.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projetos, oldIndex, newIndex).map((p, i) => ({
      ...p,
      ordem: i,
    }));

    setProjetos(reordered);
    setSaving(true);

    try {
      await fetch("/api/projetos/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reordered.map(({ id, ordem }) => ({ id, ordem })) }),
      });
    } catch (err) {
      console.error("Erro ao salvar ordem:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    await fetch(`/api/projetos/${id}`, { method: "DELETE" });
    setProjetos((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleTogglePublish(id: string, current: boolean) {
    await fetch(`/api/projetos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicado: !current }),
    });
    setProjetos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, publicado: !current } : p))
    );
  }

  async function handleToggleDestaque(id: string, current: boolean) {
    await fetch(`/api/projetos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destaque: !current }),
    });
    setProjetos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, destaque: !current } : p))
    );
  }

  return (
    <div>
      {saving && (
        <p className="text-xs text-taupe mb-3 text-right">Salvando ordem...</p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projetos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {projetos.map((projeto) => (
              <SortableRow
                key={projeto.id}
                projeto={projeto}
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
                onToggleDestaque={handleToggleDestaque}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {projetos.length === 0 && (
        <p className="text-center text-stone-400 py-16 text-sm">
          Nenhum projeto cadastrado ainda.
        </p>
      )}
    </div>
  );
}
