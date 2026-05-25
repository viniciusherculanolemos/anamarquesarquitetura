"use client";

import { useState } from "react";
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
import React from "react";
import { GripVertical, Trash2, Eye, EyeOff, Pencil, X, Check } from "lucide-react";
import { AVAILABLE_ICONS, getIcon } from "@/lib/icons";
import { Servico } from "@/types";

const inputClass =
  "w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors rounded";

function IconPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_ICONS.map(({ name, label, icon: Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          title={label}
          className={`p-2 rounded border transition-colors ${
            selected === name
              ? "bg-taupe-dark text-white border-taupe-dark"
              : "border-stone-200 text-stone-400 hover:border-taupe-light hover:text-taupe"
          }`}
        >
          <Icon size={18} strokeWidth={1.4} />
        </button>
      ))}
    </div>
  );
}

function SortableServicoRow({
  servico,
  onDelete,
  onToggleAtivo,
  onSave,
}: {
  servico: Servico;
  onDelete: (id: string) => void;
  onToggleAtivo: (id: string, current: boolean) => void;
  onSave: (id: string, icone: string, titulo: string, descricao: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: servico.id });

  const [editing, setEditing] = useState(false);
  const [icone, setIcone] = useState(servico.icone);
  const [titulo, setTitulo] = useState(servico.titulo);
  const [descricao, setDescricao] = useState(servico.descricao ?? "");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function handleSave() {
    onSave(servico.id, icone, titulo, descricao);
    setEditing(false);
  }

  function handleCancel() {
    setIcone(servico.icone);
    setTitulo(servico.titulo);
    setDescricao(servico.descricao ?? "");
    setEditing(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-stone-200 rounded overflow-hidden"
    >
      {editing ? (
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-2">Ícone</label>
            <IconPicker selected={icone} onSelect={setIcone} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Título *</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Descrição</label>
              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição do serviço"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={!titulo.trim()}
              className="inline-flex items-center gap-1.5 bg-dark hover:bg-taupe-dark disabled:opacity-50 text-white text-xs tracking-wider uppercase px-4 py-2 transition-colors"
            >
              <Check size={13} /> Salvar
            </button>
            <button onClick={handleCancel} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4">
          <button
            {...attributes}
            {...listeners}
            className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing shrink-0"
            aria-label="Arrastar"
          >
            <GripVertical size={18} />
          </button>

          <div className={`p-2 rounded shrink-0 ${servico.ativo ? "bg-beige text-taupe" : "bg-stone-100 text-stone-300"}`}>
            {React.createElement(getIcon(servico.icone), { size: 20, strokeWidth: 1.4 })}
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${servico.ativo ? "text-stone-800" : "text-stone-400"}`}>
              {servico.titulo}
            </p>
            {servico.descricao && (
              <p className="text-xs text-stone-400 truncate mt-0.5">{servico.descricao}</p>
            )}
          </div>

          {!servico.ativo && (
            <span className="text-[10px] bg-stone-100 text-stone-400 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Inativo
            </span>
          )}

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleAtivo(servico.id, servico.ativo)}
              title={servico.ativo ? "Desativar" : "Ativar"}
              className={`p-1.5 rounded transition-colors ${servico.ativo ? "text-green-500 hover:text-green-600" : "text-stone-300 hover:text-green-400"}`}
            >
              {servico.ativo ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded text-stone-400 hover:text-blue-500 transition-colors"
              title="Editar"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(servico.id)}
              className="p-1.5 rounded text-stone-300 hover:text-red-500 transition-colors"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  initialServicos: Servico[];
}

export default function SortableServicoList({ initialServicos }: Props) {
  const [servicos, setServicos] = useState<Servico[]>(initialServicos);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newIcone, setNewIcone] = useState("Home");
  const [newTitulo, setNewTitulo] = useState("");
  const [newDescricao, setNewDescricao] = useState("");
  const [creating, setCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = servicos.findIndex((s) => s.id === active.id);
    const newIndex = servicos.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(servicos, oldIndex, newIndex).map((s, i) => ({ ...s, ordem: i }));

    setServicos(reordered);
    setSaving(true);
    try {
      await fetch("/api/servicos/reorder", {
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
    if (!confirm("Excluir este serviço?")) return;
    await fetch(`/api/servicos/${id}`, { method: "DELETE" });
    setServicos((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleToggleAtivo(id: string, current: boolean) {
    await fetch(`/api/servicos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !current }),
    });
    setServicos((prev) => prev.map((s) => (s.id === id ? { ...s, ativo: !current } : s)));
  }

  async function handleSaveEdit(id: string, icone: string, titulo: string, descricao: string) {
    const res = await fetch(`/api/servicos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icone, titulo, descricao: descricao || null }),
    });
    if (res.ok) {
      setServicos((prev) =>
        prev.map((s) => (s.id === id ? { ...s, icone, titulo, descricao: descricao || null } : s))
      );
    }
  }

  async function handleCreate() {
    if (!newTitulo.trim()) return;
    setCreating(true);
    const res = await fetch("/api/servicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icone: newIcone, titulo: newTitulo, descricao: newDescricao || null, ativo: true }),
    });
    if (res.ok) {
      const created: Servico = await res.json();
      setServicos((prev) => [...prev, created]);
      setNewIcone("Home");
      setNewTitulo("");
      setNewDescricao("");
      setShowForm(false);
    }
    setCreating(false);
  }

  return (
    <div>
      {saving && <p className="text-xs text-taupe mb-3 text-right">Salvando ordem...</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={servicos.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {servicos.map((servico) => (
              <SortableServicoRow
                key={servico.id}
                servico={servico}
                onDelete={handleDelete}
                onToggleAtivo={handleToggleAtivo}
                onSave={handleSaveEdit}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {servicos.length === 0 && !showForm && (
        <p className="text-center text-stone-400 py-12 text-sm">Nenhum serviço cadastrado.</p>
      )}

      {showForm ? (
        <div className="mt-4 bg-white border border-taupe-light/40 rounded p-5 space-y-4">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Novo serviço</h3>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-2">Ícone</label>
            <IconPicker selected={newIcone} onSelect={setNewIcone} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Título *</label>
              <input
                value={newTitulo}
                onChange={(e) => setNewTitulo(e.target.value)}
                placeholder="Ex: Projetos Residenciais"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Descrição</label>
              <input
                value={newDescricao}
                onChange={(e) => setNewDescricao(e.target.value)}
                placeholder="Descrição exibida na página Sobre"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleCreate}
              disabled={creating || !newTitulo.trim()}
              className="inline-flex items-center gap-1.5 bg-dark hover:bg-taupe-dark disabled:opacity-50 text-white text-xs tracking-wider uppercase px-5 py-2.5 transition-colors"
            >
              {creating ? "Salvando..." : "Criar serviço"}
            </button>
            <button
              onClick={() => { setShowForm(false); setNewTitulo(""); setNewDescricao(""); setNewIcone("Home"); }}
              className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={13} /> Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full border-2 border-dashed border-stone-200 hover:border-taupe-light text-stone-400 hover:text-taupe text-xs tracking-wider uppercase py-4 transition-colors rounded"
        >
          + Adicionar serviço
        </button>
      )}
    </div>
  );
}
