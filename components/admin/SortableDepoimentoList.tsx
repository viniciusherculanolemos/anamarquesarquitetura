"use client";

import { useState } from "react";
import Image from "next/image";
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
import { GripVertical, Trash2, Eye, EyeOff, Pencil, X, Check, Upload, Loader2, Clock, ExternalLink, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Depoimento } from "@/types";

const inputClass =
  "w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors rounded";

type SavePayload = { nome: string; cargo: string | null; texto: string; foto_perfil: string | null; imagens: string[]; link_projeto: string | null };

async function uploadToDepoimentos(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await supabase.storage.from("depoimentos").upload(fileName, file, { upsert: true });
  const { data } = supabase.storage.from("depoimentos").getPublicUrl(fileName);
  return data.publicUrl;
}

function DepoimentoModal({ dep, onClose }: { dep: Depoimento; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const imagens = dep.imagens ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            {dep.foto_perfil ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image src={dep.foto_perfil} alt={dep.nome} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <span className="text-base font-semibold text-stone-400">{dep.nome.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-stone-800">{dep.nome}</h3>
                {!dep.publicado && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Clock size={9} /> Pendente
                  </span>
                )}
              </div>
              {dep.cargo && <p className="text-xs text-stone-400 mt-0.5">{dep.cargo}</p>}
              {dep.link_projeto && (
                <a href={dep.link_projeto} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 inline-flex items-center gap-1 mt-0.5">
                  <ExternalLink size={10} /> ver projeto
                </a>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Texto */}
          <div className="bg-stone-50 rounded p-4">
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">&ldquo;{dep.texto}&rdquo;</p>
          </div>

          {/* Galeria */}
          {imagens.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-3">
                Fotos do Projeto ({imagens.length})
              </p>
              {/* Main image */}
              <div className="relative w-full aspect-video bg-stone-100 rounded overflow-hidden mb-2">
                <Image src={imagens[imgIndex]} alt={`foto ${imgIndex + 1}`} fill className="object-contain" />
                {imagens.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIndex((i) => (i - 1 + imagens.length) % imagens.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setImgIndex((i) => (i + 1) % imagens.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <span className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded">
                      {imgIndex + 1}/{imagens.length}
                    </span>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {imagens.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {imagens.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`relative w-14 h-14 rounded overflow-hidden border-2 transition-colors ${i === imgIndex ? "border-taupe" : "border-transparent"}`}
                    >
                      <Image src={img} alt={`thumb ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-stone-100 text-right">
          <p className="text-xs text-stone-300">{new Date(dep.created_at).toLocaleDateString("pt-BR")}</p>
        </div>
      </div>
    </div>
  );
}

function SortableRow({
  dep,
  onDelete,
  onTogglePublish,
  onSave,
}: {
  dep: Depoimento;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, current: boolean) => void;
  onSave: (id: string, payload: SavePayload) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: dep.id });

  const [viewing, setViewing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(dep.nome);
  const [cargo, setCargo] = useState(dep.cargo ?? "");
  const [texto, setTexto] = useState(dep.texto);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(dep.foto_perfil ?? null);
  const [imagens, setImagens] = useState<string[]>(dep.imagens ?? []);
  const [linkProjeto, setLinkProjeto] = useState(dep.link_projeto ?? "");
  const [uploading, setUploading] = useState(false);

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToDepoimentos(file);
    setFotoPerfil(url);
    setUploading(false);
  }

  async function handleImagensUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(uploadToDepoimentos));
    setImagens((prev) => [...prev, ...urls]);
    setUploading(false);
  }

  function handleSave() {
    onSave(dep.id, { nome, cargo: cargo || null, texto, foto_perfil: fotoPerfil, imagens, link_projeto: linkProjeto || null });
    setEditing(false);
  }

  function handleCancel() {
    setNome(dep.nome); setCargo(dep.cargo ?? ""); setTexto(dep.texto);
    setFotoPerfil(dep.foto_perfil ?? null); setImagens(dep.imagens ?? []);
    setLinkProjeto(dep.link_projeto ?? "");
    setEditing(false);
  }

  const isPending = !dep.publicado;

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-stone-200 rounded overflow-hidden">
      {editing ? (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Nome *</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Cargo / Projeto</label>
              <input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex: Cliente residencial" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Depoimento *</label>
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>

          {/* Foto de perfil */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-2">Foto de perfil</label>
            <div className="flex items-center gap-3">
              {fotoPerfil ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                  <Image src={fotoPerfil} alt="Perfil" fill className="object-cover" />
                  <button type="button" onClick={() => setFotoPerfil(null)} className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-300 text-xs">Sem foto</div>
              )}
              <label className="flex items-center gap-1.5 border border-dashed border-stone-200 hover:border-stone-400 rounded px-3 py-2 cursor-pointer transition-colors text-xs text-stone-400">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {fotoPerfil ? "Trocar" : "Enviar"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} />
              </label>
            </div>
          </div>

          {/* Link do projeto */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Link do projeto (Instagram etc.)</label>
            <input
              value={linkProjeto}
              onChange={(e) => setLinkProjeto(e.target.value)}
              type="url"
              placeholder="https://instagram.com/p/..."
              className={inputClass}
            />
          </div>

          {/* Galeria de imagens */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-2">Imagens do projeto</label>
            <div className="flex flex-wrap gap-2">
              {imagens.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-stone-200">
                  <Image src={img} alt={`img ${i}`} fill className="object-cover" />
                  <button type="button" onClick={() => setImagens((prev) => prev.filter((_, j) => j !== i))} className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded border-2 border-dashed border-stone-200 hover:border-stone-400 flex items-center justify-center cursor-pointer transition-colors text-stone-300">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagensUpload} />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleSave} disabled={!nome.trim() || !texto.trim() || uploading} className="inline-flex items-center gap-1.5 bg-dark hover:bg-taupe-dark disabled:opacity-50 text-white text-xs tracking-wider uppercase px-4 py-2 transition-colors">
              <Check size={13} /> Salvar
            </button>
            <button onClick={handleCancel} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4">
          <button {...attributes} {...listeners} className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing mt-1 shrink-0" aria-label="Arrastar">
            <GripVertical size={18} />
          </button>

          {/* Profile photo */}
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-stone-100 flex items-center justify-center">
            {dep.foto_perfil ? (
              <div className="relative w-10 h-10">
                <Image src={dep.foto_perfil} alt={dep.nome} fill className="object-cover rounded-full" />
              </div>
            ) : (
              <span className="text-sm font-medium text-stone-300">{dep.nome.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-sm font-medium ${dep.publicado ? "text-stone-800" : "text-stone-400"}`}>{dep.nome}</span>
              {dep.cargo && <span className="text-xs text-stone-400">· {dep.cargo}</span>}
              {isPending && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Clock size={10} /> Pendente
                </span>
              )}
              {dep.imagens && dep.imagens.length > 0 && (
                <span className="text-[10px] text-stone-400">{dep.imagens.length} foto{dep.imagens.length !== 1 ? "s" : ""}</span>
              )}
              {dep.link_projeto && (
                <a href={dep.link_projeto} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-600 transition-colors">
                  <ExternalLink size={10} /> ver projeto
                </a>
              )}
            </div>
            <p className={`text-sm leading-relaxed line-clamp-2 ${dep.publicado ? "text-stone-600" : "text-stone-300"}`}>&ldquo;{dep.texto}&rdquo;</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setViewing(true)} className="p-1.5 rounded text-stone-300 hover:text-taupe transition-colors" title="Ver detalhes"><Maximize2 size={16} /></button>
            <button onClick={() => onTogglePublish(dep.id, dep.publicado)} title={dep.publicado ? "Ocultar" : "Publicar"} className={`p-1.5 rounded transition-colors ${dep.publicado ? "text-green-500 hover:text-green-600" : "text-stone-300 hover:text-green-400"}`}>
              {dep.publicado ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={() => setEditing(true)} className="p-1.5 rounded text-stone-400 hover:text-blue-500 transition-colors" title="Editar"><Pencil size={16} /></button>
            <button onClick={() => onDelete(dep.id)} className="p-1.5 rounded text-stone-300 hover:text-red-500 transition-colors" title="Excluir"><Trash2 size={16} /></button>
          </div>
        </div>
      )}

      {viewing && <DepoimentoModal dep={dep} onClose={() => setViewing(false)} />}
    </div>
  );
}

interface Props {
  initialDepoimentos: Depoimento[];
}

export default function SortableDepoimentoList({ initialDepoimentos }: Props) {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(initialDepoimentos);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newCargo, setNewCargo] = useState("");
  const [newTexto, setNewTexto] = useState("");
  const [creating, setCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = depoimentos.findIndex((d) => d.id === active.id);
    const newIndex = depoimentos.findIndex((d) => d.id === over.id);
    const reordered = arrayMove(depoimentos, oldIndex, newIndex).map((d, i) => ({
      ...d,
      ordem: i,
    }));

    setDepoimentos(reordered);
    setSaving(true);
    try {
      await fetch("/api/depoimentos/reorder", {
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
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    await fetch(`/api/depoimentos/${id}`, { method: "DELETE" });
    setDepoimentos((prev) => prev.filter((d) => d.id !== id));
  }

  async function handleTogglePublish(id: string, current: boolean) {
    await fetch(`/api/depoimentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicado: !current }),
    });
    setDepoimentos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, publicado: !current } : d))
    );
  }

  async function handleSaveEdit(id: string, payload: SavePayload) {
    const res = await fetch(`/api/depoimentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setDepoimentos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...payload } : d))
      );
    }
  }

  async function handleCreate() {
    if (!newNome.trim() || !newTexto.trim()) return;
    setCreating(true);
    const res = await fetch("/api/depoimentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: newNome, cargo: newCargo || null, texto: newTexto, publicado: true }),
    });
    if (res.ok) {
      const created: Depoimento = await res.json();
      setDepoimentos((prev) => [...prev, created]);
      setNewNome("");
      setNewCargo("");
      setNewTexto("");
      setShowForm(false);
    }
    setCreating(false);
  }

  return (
    <div>
      {saving && (
        <p className="text-xs text-taupe mb-3 text-right">Salvando ordem...</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={depoimentos.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {depoimentos.map((dep) => (
              <SortableRow
                key={dep.id}
                dep={dep}
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
                onSave={handleSaveEdit}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {depoimentos.length === 0 && !showForm && (
        <p className="text-center text-stone-400 py-12 text-sm">
          Nenhum depoimento cadastrado ainda.
        </p>
      )}

      {showForm ? (
        <div className="mt-4 bg-white border border-taupe-light/40 rounded p-5 space-y-3">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Novo depoimento</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Nome *</label>
              <input
                value={newNome}
                onChange={(e) => setNewNome(e.target.value)}
                placeholder="Nome do cliente"
                className="w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors rounded"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Cargo / Projeto</label>
              <input
                value={newCargo}
                onChange={(e) => setNewCargo(e.target.value)}
                placeholder="Ex: Cliente — Apartamento Ipanema"
                className="w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Depoimento *</label>
            <textarea
              value={newTexto}
              onChange={(e) => setNewTexto(e.target.value)}
              rows={3}
              placeholder="Texto do depoimento do cliente"
              className="w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors rounded resize-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleCreate}
              disabled={creating || !newNome.trim() || !newTexto.trim()}
              className="inline-flex items-center gap-1.5 bg-dark hover:bg-taupe-dark disabled:opacity-50 text-white text-xs tracking-wider uppercase px-5 py-2.5 transition-colors"
            >
              {creating ? "Salvando..." : "Criar depoimento"}
            </button>
            <button
              onClick={() => { setShowForm(false); setNewNome(""); setNewCargo(""); setNewTexto(""); }}
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
          + Adicionar depoimento
        </button>
      )}
    </div>
  );
}
